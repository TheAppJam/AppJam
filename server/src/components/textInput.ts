import { resolveVariable } from 'src/helpers/appUtils.helper';

export const textInputTemplate = (component) => {
  const value = component.definition.properties.value.value
  const placeholder = component.definition.properties.placeholder.value
  const resolvedValue = resolveVariable(value)
  return (
    `<CustomTextInput
        defaultValue={${!!resolvedValue?.isVariable ? resolvedValue?.variable :  `"${resolvedValue?.variable}"`}}
        handleTextInputChange={handleTextInputChange}
        componentName="${component.name}"
        placeholder="${placeholder}"
      />`);
};
