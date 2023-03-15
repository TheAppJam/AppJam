import React, { memo, useRef, useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import Container from "./Components/ContainerComp";
import Text from "./Components/Text";
import Button from "./Components/Button";
import TextInput from "./Components/TextInput";
import Image from "./Components/Image";
import Divider from "./Components/Divider";
import Listview from "./Components/Listview";
import Icon from "./Components/Icon";
import Row from "./Components/Row";
import Column from "./Components/Column";
import Modal from "./Components/Modal";
import { ConfigHandle } from "./ConfigHandle";
import { resolveProperties, resolveStyles } from "../_helpers/utils";

const AllComponents = {
  Container,
  Text,
  Button,
  TextInput,
  Image,
  Divider,
  Listview,
  Icon,
  Row,
  Column,
  Modal
};

export const DraggableBox = memo(function DraggableBox({
  component,
  moveCard,
  findCard,
  itemType,
  appOrderChanged,
  setHoveredComponent,
  hoveredComponent,
  setSelectedComponent,
  selectedComponent,
  removeComponent,
  parentDefinitionChanged,
  definition,
  store,
  onComponentOptionChanged,
  onEvent,
  parentAppOrderChanged,
  appDefinition,
  customResolvables,
  componentsLength
}) {
  const [mouseOver, setMouseOver] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const { id: id, name, components } = component;

  // const componentsLength = components ? components.length : 0;

  useEffect(() => {
    setMouseOver(hoveredComponent === id);
  }, [hoveredComponent]);

  useEffect(() => {
    setIsSelected(selectedComponent === id);
  }, [selectedComponent]);

  const ComponentToRender = AllComponents[name];
  const originalIndex = findCard(id).index;
  const ref = useRef(null);

  const resolvedProperties = resolveProperties(
    definition.component,
    store,
    customResolvables
  );

  const resolvedStyles = resolveStyles(
    definition.component,
    store,
    customResolvables
  )

  let exposedVariables = store?.components[definition?.component?.name] ?? {};

  const fireEvent = (eventName) => {
    const options = {
      component: definition.component,
      customVariables: { ...customResolvables }
    };
    onEvent(eventName, options);
  };

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: itemType,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, originalIndex, moveCard]
  );
  const [, drop] = useDrop(
    () => ({
      accept: itemType,
      hover({ id: draggedId }, monitor) {
        if (draggedId !== id) {
          if (!ref.current) {
            return;
          }
          const { index: overIndex } = findCard(id);
          const { index: atIndex } = findCard(draggedId);
          const hoverBoundingRect = ref.current?.getBoundingClientRect();
          // Get vertical middle
          const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          // Determine mouse position
          const clientOffset = monitor.getClientOffset();
          // Get pixels to the top
          const hoverClientY = clientOffset.y - hoverBoundingRect.top;
          // Only perform the move when the mouse has crossed half of the items height
          // When dragging downwards, only move when the cursor is below 50%
          // When dragging upwards, only move when the cursor is above 50%
          // Dragging downwards
          if (atIndex < overIndex && hoverClientY < hoverMiddleY) {
            return;
          }
          // Dragging upwards
          if (atIndex > overIndex && hoverClientY > hoverMiddleY) {
            return;
          }
          moveCard(draggedId, overIndex);
        }
      },
    }),
    [findCard, moveCard]
  );
  const getStyles = (mouseOver, isDragging, isSelected) => {
    return {
      border:
        mouseOver || (isSelected && !isDragging)
          ? "solid 1px rgb(78, 60, 240)"
          : null,
      cursor: "move",
      position: "relative"
    };
  };
  drag(drop(ref));
  return (
    <div
      ref={ref}
      className="draggable-box"
      onMouseEnter={(e) => {
        setHoveredComponent?.(id);
        e.stopPropagation();
      }}
      onMouseLeave={() => setHoveredComponent?.(null)}
      onClick={(e) => {
        setSelectedComponent?.(id);
        e.stopPropagation();
      }}
      style={getStyles(mouseOver, isDragging, isSelected)}>
      {(mouseOver || isSelected) && (
        <ConfigHandle
          definition={definition}
          setSelectedComponent={setSelectedComponent}
          removeComponent={removeComponent}
          id={id}
        />
      )}
      <ComponentToRender
        id={id}
        isDragging={isDragging}
        components={components}
        order={components}
        componentsLength={componentsLength}
        appOrderChanged={appOrderChanged}
        setHoveredComponent={setHoveredComponent}
        hoveredComponent={hoveredComponent}
        setSelectedComponent={setSelectedComponent}
        selectedComponent={selectedComponent}
        definition={definition}
        parentDefinitionChanged={parentDefinitionChanged}
        properties={resolvedProperties}
        styles={resolvedStyles}
        fireEvent={fireEvent}
        parentAppOrderChanged={parentAppOrderChanged}
        store={store}
        onComponentOptionChanged={onComponentOptionChanged}
        onEvent={onEvent}
        appDefinition={appDefinition}
        customResolvables={customResolvables}
        removeComponent={removeComponent}
        setExposedVariable={(variable, value) =>
          onComponentOptionChanged(definition.component, variable, value)
        }
        exposedVariables={exposedVariables}
      />
    </div>
  );
});
