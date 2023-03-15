import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { VirtuosoGrid } from "react-virtuoso";
import EntypoIcon from "react-native-vector-icons/dist/Entypo";
import EntypoGlyphs from "./Entypo.json";

const totalIcons = Object.keys(EntypoGlyphs);

const Icon = ({ changeComponentDefinition, value }) => {
  const popover = (
    <Popover
      id="popover-basic"
      style={{ width: "390px", maxWidth: "390px" }}>
      <Popover.Header
        style={{ background: "#ffff" }}
        as="h3">
        Select Icon
      </Popover.Header>
      <Popover.Body style={{ padding: "0 0.5rem" }}>
        <div className="row">
          {
            <VirtuosoGrid
              style={{ height: 300 }}
              totalCount={totalIcons.length}
              listClassName="icon-list-wrapper"
              itemClassName="icon-list"
              itemContent={(index) => {
                if (totalIcons[index] === undefined) return null;
                return (
                  <div
                    onClick={() => {
                      changeComponentDefinition(totalIcons[index], "icon");
                    }}
                    className="icon-element p-2">
                    <EntypoIcon
                      name={totalIcons[index]}
                      size={20}
                      color="black"
                    />
                  </div>
                );
              }}
            />
          }
        </div>
      </Popover.Body>
    </Popover>
  );
  return (
    <div>
      <div>Icons</div>
      <OverlayTrigger
        trigger="click"
        placement="left"
        overlay={popover}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid rgba(101,109,119,0.16)",
            padding: '8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
          <EntypoIcon
            name={value}
            size={15}
            color="black"
          />
          <div>{value}</div>
        </div>
      </OverlayTrigger>
    </div>
  );
};

export default Icon;
