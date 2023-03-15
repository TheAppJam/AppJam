import React, {useState, useEffect} from "react";
import Container from "../Container";

const ContainerComp = ({
  isDragging,
  id,
  appDefinition,
  order = [],
  properties,
  componentsLength,
  styles,
  parentAppOrderChanged,
  appOrderChanged,
  fireEvent,
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
        backgroundColor: "#ffff",
        borderRadius: "20px",
        margin: "20px",
        boxShadow: "rgb(0 0 0 / 16%) 0px 1px 4px",
        position: 'relative',
        minHeight: '100px',
        display: "grid",
        padding: '10px',
        width,
        ...dragStyle,
      }}
      onClick={(event) => {
        fireEvent('onClick')
      }}
      >
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

export default ContainerComp;
