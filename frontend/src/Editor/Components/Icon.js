import React from "react";
import EntypoIcon from "react-native-vector-icons/dist/Entypo";

const Icon = ({ properties, fireEvent }) => {
  const { icon } = properties;
  return (
    <div>
      <EntypoIcon
        onClick={(event) => {
          fireEvent("onClick");
        }}
        name={icon || "air"}
        size={20}
        color="black"
      />
    </div>
  );
};

export default Icon;
