import React, { useEffect, useContext } from 'react';
import cn from 'classnames';
import Form from 'react-bootstrap/Form';
import styles from './style.module.scss';
import AuthService from 'service/AuthService';
import ParentService from 'service/ParentService';
import { ChildContext } from './ChildContext';

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const ChildDropdown = ({ className }) => {
  const {
    userType,
    setUserType,
    myChild,
    setMyChild,
    myChildrenList,
    setMyChildrenList,
  } = useContext(ChildContext);
  setUserType(AuthService.getSignInType());
  useEffect(() => {
    const fetchData = async () => {
      const result = await ParentService.getChildren();
      if (result.length !== 0) {
        setMyChild(result[0]);
        setMyChildrenList(result);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    ParentService.updateAuthParam(myChild.user_id);
  }, [myChild]);

  return (
    userType === 'Parent' &&
    !isEmpty(myChild) && (
      <Form className={`${cn(styles.childDropdown)} ${className}`}>
        <Form.Control
          as="select"
          name="childController"
          value={myChild.name}
          onChange={(e) => {
            setMyChild(
              myChildrenList.find(
                (selectedChild) => selectedChild.name === e.target.value,
              ),
            );
          }}
        >
          {myChildrenList.map((child) => (
            <option key={child.user_id}>{child.name}</option>
          ))}
        </Form.Control>
      </Form>
    )
  );
};

export default ChildDropdown;
