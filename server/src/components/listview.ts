import * as _ from 'lodash';
import { getUITemplate } from "src/helpers/appUtils.helper";
import { resolveVariable } from 'src/helpers/appUtils.helper';

export const listViewTemplate = (order, component, compDefinitions) => {
  const value = component.definition.properties.data.value
  const childComp = order.components
  const tt = childComp.map((item) => {
    const component = compDefinitions[item.id].component;
    return getUITemplate(item, component, compDefinitions);
  });
  const resolvedValue = resolveVariable(value)
  return (
    `<FlatList
      data={${resolvedValue.variable}}
      renderItem={({item}) => {
        return (
          <>
          ${tt.join('\n')}
          </>
          )
      }}
    />`
    )
}