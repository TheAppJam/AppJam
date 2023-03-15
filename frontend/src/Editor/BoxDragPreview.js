import React, { memo } from "react";

export const BoxDragPreview = memo(function BoxDragPreview({ definition }) {
  const styles = definition?.definition?.styles;

  const { width, height } = styles || {
    width: { value: 50 },
    height: { value: 20 },
  };

  return (
    <div
      className="resizer-active draggable-box"
      style={{
        height: height.value,
        width: width.value,
        border: "solid 1px rgb(70, 165, 253)",
        padding: "2px",
      }}>
      <div
        style={{
          background: "#438fd7",
          opacity: "0.7",
          height: "100%",
          width: "100%",
        }}></div>
    </div>
  );
});
