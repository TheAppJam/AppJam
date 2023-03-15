import React from "react";

const Button = ({ isDragging, properties, fireEvent, styles }) => {
  const { height, width, buttonAlign } = styles;
  const dragStyle = isDragging
    ? {
        backgroundColor: "rgb(210, 221, 236)",
        zIndex: 1,
        opacity: 0.5,
        height: "30px",
      }
    : {};
  const label = properties.text;
  return (
    <div
      style={{ display: "flex", justifyContent: buttonAlign, ...dragStyle }}>
      {!isDragging && (
        <button
          style={{
            backgroundColor: "rgb(78, 60, 240)",
            color: "rgb(255, 255, 255)",
            margin: "20px",
            width,
          }}
          onClick={(event) => {
            fireEvent("onClick");
          }}>
          {label}
        </button>
      )}
    </div>
  );
};

export default Button;
