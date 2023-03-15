import { getUITemplate } from "src/helpers/appUtils.helper";

export const modalTemplate = (order, component, compDefinitions) => {
  const childComp = order.components || []
  const tt = childComp.map((item) => {
    const component = compDefinitions[item.id].component;
    return getUITemplate(item, component, compDefinitions);
  });
  const componentName = compDefinitions[order.id].component.name
  return (
    `<Modal
      animationType="slide"
      transparent={true}
      visible={store.components.${componentName}.show}
      onRequestClose={() => {
        changeStore('${componentName}', 'show', false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          ${tt.join('\n')}
        </View>
      </View>
    </Modal>`)
};
