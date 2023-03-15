import { resolveVariable } from 'src/helpers/appUtils.helper';

export const iconTemplate = (component, compDefinitions) => {
  const icon = component.definition.properties.icon.value
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
    }
    return  `console.log()`
  })
  return (
    `<Entypo onPress={() =>{ ${eventFunctions.join('\n')}}} name={'${icon}'} size={24} color="black" />`);
};
