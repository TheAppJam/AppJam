import React from "react";

const Text = ({ isDragging, properties, styles }) => {
  const { height, textSize, width, fontWeight, textColor, textAlign } = styles;
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
        padding: "20px",
        fontSize: textSize,
        fontWeight,
        color: textColor,
        textAlign,
        ...dragStyle,
      }}>
      {!isDragging && properties?.text}
    </div>
  );
};

export default Text;
