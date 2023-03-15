import React from 'react'

const Image = ({properties, styles}) => {
  const src = properties.source
  const {height, width, borderRadius} = styles
  return (
    <div
      style={{
        margin: "20px",
      }}>
      <img style={{width, height, borderRadius}} src={src} />
    </div>
  );
}

export default Image