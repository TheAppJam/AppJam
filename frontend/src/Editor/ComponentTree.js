import React from "react";
import { AiOutlineMore } from "react-icons/ai";
import Dropdown from "react-bootstrap/Dropdown";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    className="outline-more"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}>
    {children}
  </div>
));

const ComponentLeaf = ({
  name,
  id,
  compLevel,
  compType,
  isSelected,
  removeComponent,
}) => {
  return (
    <div
      style={{
        padding: "8px",
        fontSize: "14px",
        display: "flex",
        justifyContent: "space-between",
        marginLeft: `${compLevel}px`,
        background: isSelected ? "#d2ddec" : "",
      }}>
      <div>
        <div
          style={{
            width: "10px",
            height: "10px",
            backgroundSize: "contain",
            backgroundImage: `url(/images/icons/widgets/${compType.toLowerCase()}.svg)`,
            backgroundRepeat: "no-repeat",
            display: "inline-block",
            marginRight: "5px",
          }}></div>
        <span>{name}</span>
      </div>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle}>
          <span>
            <AiOutlineMore />
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">
            <div
              onClick={(e) => {
                removeComponent(id);
                e.stopPropagation();
              }}
              style={{ color: "#ea6c76" }}>
              Delete
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

const ComponentTree = ({
  boxes,
  appDefinition,
  setSelectedComponent,
  selectedComponent,
  removeComponent,
}) => {
  const componentListItems = (boxes, list, compLevel) => {
    {
      boxes.forEach((box) => {
        const hasChildComps = box?.components?.length > 0;
        if (!appDefinition[box.id]) return;
        list.push(
          <div
            className="component-leaf"
            key={box.id}
            onClick={() => setSelectedComponent(box.id)}>
            <ComponentLeaf
              compLevel={compLevel}
              name={appDefinition[box.id].component.name}
              compType={box.name}
              isSelected={selectedComponent === box.id}
              id={box.id}
              removeComponent={removeComponent}
            />
          </div>
        );
        if (hasChildComps) {
          const level = compLevel + 10;
          componentListItems(box.components, list, level);
        }
      });
    }
  };

  const renderComponentList = (boxes) => {
    const list = [];
    componentListItems(boxes, list, 0);
    return list;
  };
  return <>{renderComponentList(boxes)}</>;
};

export default ComponentTree;
