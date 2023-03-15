export const createDefaultStore = (appDefinition) => {
  let defaultStore = {};
  let componentState = {};
  Object.keys(appDefinition).forEach((key) => {
    const component = appDefinition[key]
    const exposedVariables = {...component.component.exposedVariables} || {}
    const properties = component.component.definition.properties
    const exposedVariablesArray = Object.keys(exposedVariables)
    if (exposedVariablesArray.length > 0) {
      exposedVariablesArray.forEach((variable) => {
        if (properties[variable]) {
          exposedVariables[variable] = properties[variable].value
        }
      })
    }
    componentState[component.component.name] = {...exposedVariables, id: key}
  })
  defaultStore = {
    'queries': {},
    'components': {
      ...componentState
    },
    'variables': {}
  }
  
  return defaultStore
}