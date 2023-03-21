import { getUITemplate } from "src/helpers/appUtils.helper";

export const createComponents = (componentOrder, componentDefinitions) => {
  const components = componentOrder.map((item) => {
    if (!componentDefinitions[item.id]) return
    const component = componentDefinitions[item.id].component;
    return getUITemplate(item, component, componentDefinitions);
  });
  return components
}