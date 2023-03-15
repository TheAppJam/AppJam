import React, {useState, useEffect} from "react";
import Container from "../Container";

const Column = ({
  isDragging,
  id,
  appDefinition,
  order = [],
  appOrderChanged,
  properties,
  componentsLength,
  styles,
  ...props
}) => {

  const {height, width} = styles


  const dragStyle = isDragging
    ? {
        backgroundColor: "rgb(210, 221, 236)",
        zIndex: 1,
        opacity: 0.5,
      }
    : {};
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100px',
        minWidth: '100px',
        display: "grid",
        width,
        ...dragStyle,
      }}>
      <Container
        {...props}
        itemType="containerdragbox"
        parentAppOrderChanged={(boxes) => {
          appOrderChanged(id, boxes);
        }
        }
        order={order}
        definition={appDefinition}
        componentsLength={componentsLength}
      />
    </div>
  );
};

export default Column;
