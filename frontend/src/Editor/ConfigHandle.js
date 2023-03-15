import React from "react";

export const ConfigHandle = function ConfigHandle({
  id,
  removeComponent,
  setSelectedComponent,
  definition
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: "rgb(78, 60, 240)",
        border: "1px solid transparent",
        borderRadius: "4px 4px 0 0",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontSize: '9px',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        padding: '4px',
        position: 'absolute',
        top: '-22px'
      }}>
        <div>{definition?.component.name}</div>
      <img
        style={{ cursor: "pointer", marginLeft: "5px" }}
        src="/images/icons/trash-light.svg"
        width="12"
        role="button"
        height="12"
        draggable="false"
        onClick={(e) => {
          // setSelectedComponent(null);
          removeComponent(id);
          e.stopPropagation();
        }}
      />
    </div>
  );
};
