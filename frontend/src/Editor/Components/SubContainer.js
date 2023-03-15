import React, { useState, useEffect, useCallback, memo } from "react";
import { DraggableBox } from "../DraggableBox";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import { v4 as uuidv4 } from 'uuid';
import { componentTypes } from "../../WidgetManager/components";

const SubContainer = memo(function SubContainer({
  components = [],
  appOrderChanged,
  id,
  setHoveredComponent,
  hoveredComponent,
  setSelectedComponent,
  selectedComponent,
  definition,
  parentDefinitionChanged
}) {
  const [boxes, setBoxes] = useState(components);
  const [appDefinition, setAppDefinition] = useState(definition);

  useEffect(() => {
    appOrderChanged(id, boxes);
  }, [boxes]);

  useEffect(() => {
    parentDefinitionChanged(appDefinition)
  }, [appDefinition])

  const removeComponent = (id) => {
    const { index } = findCard(id);
    const newBoxes = [...boxes]
    const newDefinition = {...appDefinition}
    delete newDefinition[id]
    newBoxes.splice(index, 1);
    setBoxes(newBoxes)
    setAppDefinition(newDefinition)
  }

  const findCard = useCallback(
    (id) => {
      const box = boxes.filter((c) => c.id === id)[0];
      return {
        box,
        index: boxes.indexOf(box),
      };
    },
    [boxes]
  );
  const moveCard = useCallback(
    (id, atIndex) => {
      const { box, index } = findCard(id);
      if (!box) return;
      const newBoxes = update(boxes, {
        $splice: [
          [index, 1],
          [atIndex, 0, box],
        ],
      });
      setBoxes(newBoxes);
    },
    [findCard, boxes, setBoxes]
  );

  const [, drop] = useDrop(() => ({
    accept: ["box"],
    drop: (item) => {
      const id = uuidv4()
      const componentMeta = componentTypes.find((comp) => comp.component === item.component)
      setBoxes((preBox) => [
        ...preBox,
        { name: item.component, id: id },
      ]);
      setAppDefinition((appDefinition) => ({
        ...appDefinition,
        [id]: {
          component: componentMeta
        }
      }))
    },
  }));

  const renderComponent = (component) => {
    if (!component) {
      return <></>;
    }
    return (
      <DraggableBox
        component={component}
        moveCard={moveCard}
        findCard={findCard}
        itemType="subdragbox"
        setHoveredComponent={setHoveredComponent}
        hoveredComponent={hoveredComponent}
        selectedComponent={selectedComponent}
        setSelectedComponent={setSelectedComponent}
        removeComponent={removeComponent}
        definition={definition}
      />
    );
  };
  return (
    <div
      ref={drop}
      style={{
        height: "100%",
      }}>
      {boxes.map((i) => (
        <div
          key={i.id}
          style={{ color: "black" }}>
          {renderComponent(i)}
        </div>
      ))}
    </div>
  );
});

export default SubContainer;
