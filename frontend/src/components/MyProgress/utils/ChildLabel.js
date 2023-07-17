import React, { useContext } from 'react';
import { ChildContext } from './ChildContext';
import cn from 'classnames';
import styles from './style.module.scss';

const ChildLabel = () => {
  const { myChild, userType } = useContext(ChildContext);
  return (
    userType === 'Parent' &&
    myChild.name !== '' && (
      <div className={`${cn(styles.childLabel)} child-label`}>
        {myChild.name}
      </div>
    )
  );
};

export default ChildLabel;
