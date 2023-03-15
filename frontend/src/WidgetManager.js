import React, { useEffect, memo } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

const WidgetComponent = memo(function WidgetComponent({item, i, definition}) {
    const [{ isDragging }, drag, preview] = useDrag(() => ({
      type: "box",
      item: { component: item, definition },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
    useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
    });
    return (
      <div
        key={i}
        ref={drag}
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          marginBottom: "5px",
          border: "1px solid #d2ddec",
          boxSizing: "border-box",
          borderRadius: "4px",
          flexDirection: "column",
          justifyContent: "center",
          height: "76px",
          width: "76px",
          margin: "5px",
          cursor: "move",
        }}>
        <center>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundSize: "contain",
              backgroundImage: `url(/images/icons/widgets/${item.toLowerCase()}.svg)`,
              backgroundRepeat: "no-repeat",
            }}></div>
        </center>
        <div style={{ fontSize: "10px", marginTop: "10px", color: "#3e525b" }}>
          {item}
        </div>
      </div>
    );
})

const WidgetManager = ({ componentTypes }) => {
  function widgets() {
    const wids = componentTypes.map((item, i) => {
      return <WidgetComponent key={i} item={item.name} definition={item} i={i} />;
    });
    return <div style={{ display: "flex", flexWrap: "wrap" }}>{wids}</div>;
  }

  return (
    <div  style={{ marginRight: "10px", marginLeft: "10px" }}>{widgets()}</div>
  );
};

export default WidgetManager;
