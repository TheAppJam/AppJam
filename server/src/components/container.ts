import { getUITemplate } from "src/helpers/appUtils.helper";
import { resolveVariable } from 'src/helpers/appUtils.helper';

export const containerTemplate = (order, component, compDefinitions) => {
  const childComp = order.components || []
  const tt = childComp.map((item) => {
    const component = compDefinitions[item.id].component;
    return getUITemplate(item, component, compDefinitions);
  });
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
  return (
    `<Pressable
      onPress={() =>{ ${eventFunctions.join('\n')}}}
    >
      <View
        style={{
          backgroundColor: '#fff',
          height: 112,
          borderRadius: 20,
          padding: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.20,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
      ${tt.join('\n')}
      </View>
    </Pressable>
    `)
};
