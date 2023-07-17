import React from 'react';

const withForwardRef = (Component) => React.forwardRef((props, ref) => {
  return <Component innerRef={ref} {...props} />
});

export default withForwardRef;
