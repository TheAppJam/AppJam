import React from 'react'

const Divider = ({styles}) => {
  const {height, width} = styles
  return <div style={{borderTop: '2px solid rgb(231, 232, 234)', height, width}}></div>
};

export default Divider
