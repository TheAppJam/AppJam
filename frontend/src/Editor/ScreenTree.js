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

const ScreenTree = ({
  appDefinition,
  setCurrentScreenId,
  homeScreenId,
  removeScreen,
}) => {
  return (
    <div>
      {Object.keys(appDefinition.screens).map((screen, i) => {
        return (
          <div
            className="component-leaf"
            style={{
              padding: "8px",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
            }}
            onClick={() => setCurrentScreenId(screen)}
            key={i}>
            <div>{appDefinition.screens[screen].name}</div>
            {screen != homeScreenId && (
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
                        removeScreen(screen)
                        e.stopPropagation();
                      }}
                      style={{ color: "#ea6c76" }}>
                      Delete
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScreenTree;
