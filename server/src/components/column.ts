import { getUITemplate } from "src/helpers/appUtils.helper";

export const columnTemplate = (order, component, compDefinitions) => {
  const childComp = order.components
  const tt = childComp.map((item) => {
    const component = compDefinitions[item.id].component;
    return getUITemplate(item, component, compDefinitions);
  });
  return (
    `<View
      style={{display: 'flex'}}
    >
    ${tt.join('\n')}
    </View>`)
};
