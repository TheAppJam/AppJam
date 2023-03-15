import React, { useState, useCallback, memo, useEffect } from "react";
import { DraggableBox } from "./DraggableBox";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import { v4 as uuidv4 } from "uuid";
import { componentTypes } from "../WidgetManager/components";
import { computeComponentName } from "../_helpers/utils";
import _ from "lodash";

const Container = memo(function Container({
  setHoveredComponent,
  hoveredComponent,
  setSelectedComponent,
  selectedComponent,
  order,
  parentAppOrderChanged,
  parentDefinitionChanged,
  definition,
  store,
  onComponentOptionChanged,
  onEvent,
  itemType,
  customResolvables,
  componentsLength,
  removeComponent,
  row
}) {
  const [appDefinition, setAppDefinition] = useState(definition);

  useEffect(() => {
    parentDefinitionChanged(appDefinition);
  }, [appDefinition]);

  useEffect(() => {
    setAppDefinition(definition);
  }, [definition]);

  const findCard = useCallback(
    (id) => {
      const box = order.filter((c) => c.id === id)[0];
      return {
        box,
        index: order.indexOf(box),
      };
    },
    [order]
  );

  const moveCard = useCallback(
    (id, atIndex) => {
      const { box, index } = findCard(id);
      const newBoxes = update(order, {
        $splice: [
          [index, 1],
          [atIndex, 0, box],
        ],
      });
      parentAppOrderChanged(newBoxes)
    },
    [findCard, order, parentAppOrderChanged]
  );

  const [, drop] = useDrop(() => ({
    accept: "box",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      const id = uuidv4();
      const componentMeta = componentTypes.find(
        (comp) => comp.component === item.component
      );
      const componentMetaData = _.cloneDeep(componentMeta);
      const componentData = _.cloneDeep(componentMetaData);

      const newBoxes = [...order, { name: item.component, id: id }]
      parentAppOrderChanged(newBoxes)

      setAppDefinition((appDefinition) => {
        const componentName = computeComponentName(
          componentData.component,
          appDefinition
        );
        componentData["name"] = componentName;
        return {
          ...appDefinition,
          [id]: {
            component: componentData,
          },
        };
      });
    },
  }), [order, parentAppOrderChanged]);

  const appOrderChanged = useCallback((id, components) => {
    const newBoxes = order.map((item) => {
      if (item.id === id) {
        return { ...item, components };
      } else {
        return item;
      }
    })
    parentAppOrderChanged(newBoxes)
  }, [order]);

  const renderComponent = (component) => {
    const compDefinition = appDefinition[component.id];
    if (!compDefinition) {
      return <></>;
    }
    compDefinition["id"] = component.id;
    return (
      <DraggableBox
        component={component}
        appOrderChanged={appOrderChanged}
        moveCard={moveCard}
        findCard={findCard}
        itemType={itemType || "dragbox"}
        setHoveredComponent={setHoveredComponent}
        hoveredComponent={hoveredComponent}
        selectedComponent={selectedComponent}
        setSelectedComponent={setSelectedComponent}
        removeComponent={removeComponent}
        parentDefinitionChanged={parentDefinitionChanged}
        definition={compDefinition}
        store={store}
        id={component.id}
        onComponentOptionChanged={onComponentOptionChanged}
        onEvent={onEvent}
        parentAppOrderChanged={parentAppOrderChanged}
        appDefinition={appDefinition}
        customResolvables={customResolvables}
        componentsLength={componentsLength}
      />
    );
  };
  return (
    <div
      ref={drop}
      style={{
        height: "100%",
        width: "100%",
        display: 'flex',
        flexDirection: row ? 'row' : 'column'
      }}>
      {order && order.map((i) => (
        <div
          key={i.id}
          style={{ color: "black" }}>
          {renderComponent(i)}
        </div>
      ))}
    </div>
  );
});

export default Container;
