import React, { useState, useEffect } from "react";
import Container from "../Container";
import _ from "lodash";

const Listview = ({
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

  const data = properties.data;

  return (
    <>
      {(_.isArray(data) ? data : []).map((listItem, index) => {
        return (
          <div
            key={index}
            style={{
              minHeight: "100px",
              borderRadius: "10px",
              position: "relative",
              display: "grid"
            }}>
            <Container
              {...props}
              itemType="subdragbox"
              parentAppOrderChanged={(boxes) => {
                appOrderChanged(id, boxes);
              }
              }
              order={order}
              definition={appDefinition}
              customResolvables={{ listItem }}
              componentsLength={componentsLength}
            />
          </div>
        );
      })}
    </>
  );
};

export default Listview;
