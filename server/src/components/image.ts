import { resolveVariable } from 'src/helpers/appUtils.helper';

export const imageTemplate = (component) => {
  const source = component.definition.properties.source.value
  const height = component.definition.styles.height.value
  const width = component.definition.styles.width.value
  const borderRadius = component.definition.styles.borderRadius.value
  const resolvedVar = resolveVariable(source)
  return (
    `<Image
      style={{height: ${height}, width: ${width}, borderRadius: ${borderRadius}}}
      source={{uri: "${resolvedVar.variable}"}}
    />`);
};
