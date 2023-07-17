import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import useIsMountedRef from '../hooks/useIsMountedRef';

const propTypes = {
  children: PropTypes.any.isRequired,
  variant: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  renderSaving: PropTypes.any,
  renderSaved: PropTypes.any,
};

const SaveButton = ({
  variant,
  size,
  style,
  type,
  className,
  disabled,
  children,
  renderSaving,
  renderSaved,
  onClick,
}) => {
  const isMounted = useIsMountedRef();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  let timer = null;

  const getText = () => {
    if (saving) {
      return renderSaving ? renderSaving : 'Saving...';
    } else if (saved) {
      return renderSaved ? renderSaved : 'Saved';
    } else {
      return children;
    }
  };

  const handleClick = async () => {
    const cb = (typeof onClick === 'function') ? onClick : () => {};
    clearTimeout(timer);
    setSaving(true);
    setSaved(false);
    const succeed = await cb();
    if (isMounted.current) {
      if (succeed === false) {
        // failed case
        setSaving(false);
        setSaved(false);
      } else {
        // succeed case
        setSaving(false);
        setSaved(true);

        timer = setTimeout(() => {
          if (isMounted.current) {
            setSaved(false);
          }
        }, 2000);
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      type={type}
      disabled={disabled || saving}
      className={className}
      style={style}
      onClick={handleClick}
    >
      {getText()}
    </Button>
  );
};

SaveButton.propTypes = propTypes;

export default React.memo(SaveButton);
