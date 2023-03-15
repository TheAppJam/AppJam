import { resolveVariable } from 'src/helpers/appUtils.helper';

export const buttonTemplate = (component, compDefinitions) => {
  const buttonText = component.definition.properties.text.value
  const events = component.definition.events.length > 0 ? component.definition.events : ['']
  const eventFunctions = events.map((event) => {
    if (event.actionId === 'run-query') {
      return `${event.queryName}()`
    } else if (event.actionId === 'show-modal') {
      const modal = event.modal
      const modalName = compDefinitions[modal]?.component?.name
      return `changeStore('${modalName}', 'show', true)`
    } else if (event.actionId === 'close-modal') {
      const modal = event.modal
      const modalName = compDefinitions[modal]?.component?.name
      return `changeStore('${modalName}', 'show', false)`
    } else if (event.actionId === 'set-custom-variable') {
      const key = event.key;
      const value = event.value;
      const resolvedVar = resolveVariable(value)
      return `changeStoreVariable('${key}', ${resolvedVar.isVariable ? resolvedVar.variable : `'${resolvedVar.variable}'`})`
    } else if (event.actionId === 'navigate-screen') {
      const screenName = event.screenName;
      const paramKey = event.paramKey
      const paramValue = resolveVariable(event.paramValue || '')
      return `navigation.navigate('${screenName}', {
        ${paramKey}: ${paramValue.isVariable ? paramValue.variable : `'${paramValue}'`}
      })`
    }
    return  `console.log()`
  })
  return `<View>
            <TouchableOpacity
              style={{borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 30,
              elevation: 2,
              backgroundColor: "#4e3cf0",
              marginVertical: 15,
              alignSelf: 'center'}}
              onPress={() => {${eventFunctions.join('\n')}}}
            >
              <Text style={{color: "#fff"}}>${buttonText}</Text>
            </TouchableOpacity>
          </View>`
}