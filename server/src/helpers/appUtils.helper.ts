const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
import * as _ from 'lodash';
import {
  textTemplate,
  containerTemplate,
  functionTemplate,
  textInputTemplate,
  buttonTemplate,
  listViewTemplate,
  rowTemplate,
  columnTemplate,
  imageTemplate,
  modalTemplate,
  iconTemplate
} from 'src/components';

import { createComponents, createDefaultStore, resolveImports } from 'src/resolvers';


export const getUITemplate = (comp, component, compDefinitions) => {
  switch (comp.name) {
    case 'Text':
      return textTemplate(component);
    case 'Container':
      return containerTemplate(comp, component, compDefinitions);
    case 'TextInput':
      return textInputTemplate(component);
    case 'Button':
      return buttonTemplate(component, compDefinitions);
    case 'Listview':
      return listViewTemplate(comp, component, compDefinitions);
    case 'Row':
      return rowTemplate(comp, component, compDefinitions);
    case 'Column':
      return columnTemplate(comp, component, compDefinitions);
    case 'Image':
      return imageTemplate(component)
    case 'Modal':
     return modalTemplate(comp, component, compDefinitions)
    case 'Icon':
      return iconTemplate(component, compDefinitions)
  }
};

function getDynamicVariables(text) {
  const matchedParams = text.match(/\{\{(.*?)\}\}/g) || text.match(/\%\%(.*?)\%\%/g);
  return matchedParams;
}

export const resolveVariable = (object) => {
  object = _.clone(object);
  if (object.startsWith('{{') && object.endsWith('}}')) {
    let code = object.replace('{{', '').replace('}}', '').split('.').join('?.')

    const containsCustomVar = ['listItem', 'params'].some(r => code.split('?.').includes(r))

    if (containsCustomVar) {
      const customVar = code.split('?.')[0];
      if (customVar === 'listItem') {
        const newCode = code.split('?.').slice(1).join('?.')
        if (newCode.length > 0) {
          return {variable: `item.${newCode}`, isVariable: true}  
        }
        return {variable: `item`, isVariable: true}
      } else if (customVar === 'params') {
        const codeArr = code.split('?.')
        codeArr.splice(1, 1)
        const newCode = codeArr.join('?.')
        return {variable: `route?.${newCode}`, isVariable: true, conditionVar: `route?.${newCode}`} 
      }
    }
    
    return {variable: `store?.${code}`, isVariable: true, conditionVar: false}
  }

  const dynamicVariables = getDynamicVariables(object);
  
  if (dynamicVariables) {
    let value = ''
    if (dynamicVariables.length === 1 && dynamicVariables[0] === object) {
      object = resolveVariable(dynamicVariables[0]).variable;
    } else {
      for (const dynamicVariable of dynamicVariables) {
        value = resolveVariable(dynamicVariable).variable;
        if (typeof value !== 'function') {
          object = object.replace(dynamicVariable, `{${value}}`);
        }
      }
    }
    return { variable: object, isVariable: true, conditionVar: value}
  }

  return {variable: object}
}

const resolveQueryReferences = (query) => {
  query = _.cloneDeep(query)
  query.options.url = resolveVariable(query.options.url).variable
  console.log(query.options.url);
  if (query.options.headers) {
    const headers = query.options.headers.map((header) => {
      return header.map((item) => {
        const resolvedHeaderItem = resolveVariable(item)
        if (resolvedHeaderItem.isVariable) {
          return resolveVariable(item).variable
        }
        return resolveVariable(item).variable
      })
    })
    query.options.headers = headers
  }
  if (query.options.body) {
    const body = query.options.body.map((b) => {
      return b.map((bodyItem) => {
        const resolvedBodyItem = resolveVariable(bodyItem).variable
        return resolvedBodyItem
      })
    })
    query.options.body = body
  }
  return query
}


const queryActions = (query, i) => {
  query = _.cloneDeep(query)
  query = resolveQueryReferences(query)
  const method = query?.options?.method.toUpperCase()
  let requestOptions = { method }
  let headers = {}
  let body = {}
  if (query?.options.headers) {
    headers = Object.fromEntries(query?.options.headers)
  }
  requestOptions['headers'] = headers
  if (method !== 'GET') {
    if (query?.options.body) {
      body = Object.fromEntries(query?.options.body)
    }
    requestOptions['body'] = JSON.stringify(body)
  }
  return `
const ${query.name} = () => {
  let requestOptions = ${JSON.stringify(requestOptions)};
  if (requestOptions.method !== 'GET') {
    requestOptions = resolveRequest(requestOptions)
  }
  setStore((store) => ({
    ...store,
    queries: {
      ...store.queries,
      ['${query.name}']: {
        isLoading: true,
        data: []
      }
    }
  }))
  fetch(resolveUrl(\`${query.options.url}\`, route, store), requestOptions).then((data) => {
    data.text().then((value) => {
      const finalResult = JSON.parse(value);
      setStore((store) => ({
        ...store,
        queries: {
          ...store.queries,
          ['${query.name}']: {
            ...store.queries['${query.name}'],
            data: finalResult,
            isLoading: false
          }
        }
      }))
    })
  })
}
`;
};

const generateTemplate = (screenFunction, stackFunction ,imports) => {

  const template = `
  ${imports}

  function CustomTextInput({defaultValue, handleTextInputChange, componentName, placeholder}) {
    useEffect(() => {
    handleTextInputChange(componentName,defaultValue)
    }, [defaultValue])
    return (
      <TextInput
        style={{borderWidth: 1, padding: 10}}
        defaultValue={defaultValue}
        onChangeText={(text) =>
          handleTextInputChange(componentName, text)
        }
        placeholder={placeholder}
        placeholderTextColor="#858484"
      />
    )
  }
  
  ${screenFunction.join('\n')}

  const Stack = createNativeStackNavigator();

  function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        ${stackFunction.join('\n')}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  export default App;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffff'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });
  `;
  return template;
};

const generateAppJson = (settings) => {
  return (
    `{
      "expo": {
        "name": "${settings.name}",
        "slug": "${settings.name}",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/icon.png",
        "userInterfaceStyle": "light",
        "splash": {
          "image": "./assets/splash.png",
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        },
        "updates": {
          "fallbackToCacheTimeout": 0
        },
        "assetBundlePatterns": [
          "**/*"
        ],
        "ios": {
          "supportsTablet": true
        },
        "android": {
          "adaptiveIcon": {
            "foregroundImage": "./assets/adaptive-icon.png",
            "backgroundColor": "#FFFFFF"
          },
          "package": "${settings.androidPackage}"
        },
        "web": {
          "favicon": "./assets/favicon.png"
        },
        "extra": {
          "eas": {
            "projectId": "${settings.projectId}"
          }
        }
      }
    }
    `
  );
}

const generateScreens = (screensOption) => {
  let screenFunction = []
  let stackFunction = []
  screensOption.forEach((screens) => {
    const {defaultStore, dataQueriesFunctions, actions, resolvedComponents, screenName} = screens
    const screen = 
    `
    function ${screenName}Screen({route, navigation}) {
      const defaultStore = ${JSON.stringify(defaultStore)}
      const [store, setStore] = useState(defaultStore)
      
      ${dataQueriesFunctions}
    
      ${actions.join('\n')}
  
      const changeStore = (comp, exposedVariable, value) => {
        setStore((store) => ({
          ...store,
          'components': {
            ...store.components,
            [comp]: {
              ...store.components[comp],
              [exposedVariable]: value
            }
          }
        }))
      }
  
      const changeStoreVariable = (key, value) => {
        setStore((store) => ({
          ...store,
          'variables': {
            ...store.variables,
            [key]: value
          }
        }))
      }
  
      const resolveCode = (code, store) => {
        if (!code.startsWith("store?.")) return code
        let result = '';
        const evalFunction = Function(
          [
            'store'
          ],
          \` return \${code || ''} \`
        );
        result = evalFunction(
          store
        );
        return result;
      }

      function getDynamicVariables(text) {
        const matchedParams = text.match(/\{(.*?)\}/g) || text.match(/\%\%(.*?)\%\%/g);
        return matchedParams;
      }

      const resolveParamVar = (code, route, store) => {
        let result = "";
        code = code.replace(/[{()}]/g, '');
        const evalFunction = Function(["route", "store"], \` return \${code || ""} \`);
        result = evalFunction(route, store);
    
        return result;
    }
    
      const resolveUrl = (url, route, store) => {
        const containsVar = getDynamicVariables(url)
        if (!containsVar) return url
        for (const dynamicVariable of containsVar) {
            value = resolveParamVar(dynamicVariable, route, store);
            if (typeof value !== 'function') {
              url = url.replace(dynamicVariable, \`\${value}\`);
            }
          }
        return url
      }
  
      const resolveRequest = (request) => {
        const body = JSON.parse(request.body)
        Object.keys(body).map((item) => {
          body[item] = resolveCode(body[item], store)
        })
        request.body = JSON.stringify(body)
        return request
      };
    
      const handleTextInputChange = (textField, value) => {
        setStore((store) => ({
          ...store,
          'components': {
            ...store.components,
            [textField]: {
              ...store.components[textField],
              value: value
            }
          }
        }))
      }
    
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView style={{paddingHorizontal: 20}}>
            ${resolvedComponents.join('\n')}
          </ScrollView>
        </SafeAreaView>
      );
    }`

    const stack = `<Stack.Screen name="${screenName}" component={${screenName}Screen} />`

    screenFunction.push(screen)
    stackFunction.push(stack)
  })
  return ({
    screenFunction,
    stackFunction
  })
}

export function buildTemplate(config) {
  const dataQueries = config.data_queries;
  const settings = config.settings;
  const imports = resolveImports
  const actions = dataQueries.map((query, i) => {
    return queryActions(query, i);
  });

  const dataQueriesFunctions = functionTemplate(dataQueries);

  let screensOption = []

  const screenIds = Object.keys(config.definition.screens)

  screenIds.forEach((id, i) => {
    const screenName = config.order.screens[id].name
    const compOrder = config.order.screens[id].components;
    const compDefinitions = config.definition.screens[id].components;
    const defaultStore = createDefaultStore(compDefinitions);
    const resolvedComponents = createComponents(compOrder, compDefinitions)
    const options = {
      defaultStore,
      dataQueriesFunctions,
      actions,
      resolvedComponents,
      screenName
    }
    screensOption.push(options)
  })

  const {screenFunction, stackFunction} = generateScreens(screensOption)
  
  const template = generateTemplate(screenFunction, stackFunction, imports);

  const appJson = generateAppJson(settings)

  const currentDir = path.resolve(process.cwd());

  // fs.writeFileSync(`${currentDir}/App.js`, prettier.format(template));
  // fs.writeFileSync(`${currentDir}/app.json`, prettier.format(appJson, {parser: "json"}));
  return template;
}
