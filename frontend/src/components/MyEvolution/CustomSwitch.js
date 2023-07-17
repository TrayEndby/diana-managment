import React from 'react';
import Button from 'react-bootstrap/Button';
import { ChevronRight, ChevronLeft } from 'react-bootstrap-icons';
import { gestureListener } from './helper';
import { WEEKS } from 'constants/myProgress';

const CustomSwitch = ({ children, currentViewPosition, setCurrentViewPosition }) => {
  const activeIndex = currentViewPosition;

  const GestureHandler = React.useCallback(
    (key) => {
      let value = null;
      if (key === 'Down') {
        value = currentViewPosition - 1;
      } else if (key === 'Up') {
        value = currentViewPosition + 1;
      }

      if (value === -1) {
        setCurrentViewPosition(WEEKS.length - 1);
        return;
      }

      setCurrentViewPosition(value % WEEKS.length);
    },
    [setCurrentViewPosition, currentViewPosition],
  );

  React.useEffect(() => {
    gestureListener.init();
    gestureListener.on(GestureHandler);
    return () => {
      gestureListener.stop();
    };
  }, [GestureHandler]);

  return (
    <article id="articlehold" className="fwdirection bespoke-parent" style={{ overflow: 'hidden', maxHeight: '100%' }}>
      <Button onClick={() => setCurrentViewPosition(currentViewPosition - 1)} className="control-arrow prev">
        <ChevronLeft color="white" size={20} />
      </Button>
      {children.map((child, index) => (
        <React.Fragment key={index}>{child({ index, activeIndex })}</React.Fragment>
      ))}
      <Button onClick={() => setCurrentViewPosition(currentViewPosition + 1)} className="control-arrow next">
        <ChevronRight color="white" size={20} />
      </Button>
    </article>
  );
};

export default React.memo(CustomSwitch);
