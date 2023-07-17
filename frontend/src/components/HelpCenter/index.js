import React from 'react';
import cn from 'classnames';

import HelpContainer from './Container';
import HelpCenterContent from './Content';

import styles from './style.module.scss';

const propTypes = {};

const HelpCenter = () => {
  return (
    <HelpContainer
      className={styles.container}
      renderHide={() => (
        <div className={cn('wrapper', styles.hideContent)}>
          <div>Help</div>
        </div>
      )}
    >
      <HelpCenterContent />
    </HelpContainer>
  );
};

HelpCenter.propTypes = propTypes;

export default HelpCenter;
