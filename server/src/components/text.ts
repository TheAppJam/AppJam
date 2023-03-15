import * as _ from 'lodash';
import { resolveVariable } from 'src/helpers/appUtils.helper';

export const textTemplate = (component) => {
  const text = component.definition.properties.text.value;
  const fontSize = component.definition.styles.textSize.value;
  const textAlign = component.definition.styles.textAlign.value;
  const textColor = component.definition.styles.textColor.value;
  const fontWeight = component.definition.styles.fontWeight.value;
  const resolvedVar = resolveVariable(text);
  if (resolvedVar.isVariable) {
    return `{${resolvedVar.conditionVar || resolvedVar.variable} &&
    <Text
      style={{
        margin: 20,
        fontSize: ${fontSize},
        textAlign: "${textAlign}",
        color: "${textColor}",
        fontWeight: "${fontWeight}"
      }}
    >
      ${resolvedVar.conditionVar ? resolvedVar.variable : `{${resolvedVar.variable}}`}
    </Text>}`;
  }
  return `
  <Text
    style={{
      margin: 20,
      fontSize: ${fontSize},
      textAlign: "${textAlign}",
      color: "${textColor}",
      fontWeight: "${fontWeight}"
    }}>${resolvedVar.variable}</Text>`;
};
