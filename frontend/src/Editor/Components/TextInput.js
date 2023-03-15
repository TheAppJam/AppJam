import React, { useEffect, useState } from "react";

const TextInput = ({ properties, setExposedVariable, styles }) => {
  const [value, setValue] = useState(properties.value || '');
  const {height, width} = styles
  useEffect(() => {
    setValue(properties.value || '');
    setExposedVariable('value', properties.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.value]);
  return (
    <div style={{ margin: "10px", height, width }}>
      <input
        onChange={(e) => {
          setValue(e.target.value);
          setExposedVariable('value', e.target.value);
        }}
        value={value}
        placeholder={properties.placeholder}
      />
    </div>
  );
};

export default TextInput;
