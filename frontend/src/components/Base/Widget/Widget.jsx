import React from 'react';

import './Widget.scss';

const Widget = (props) => {
  return (
    <div className="widget-box" style={props.style}>
      <div className="w-header">{props.text}</div>
      <div className="w-body">{props.children}</div>
    </div>
  );
};

export default Widget;
