import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';

import { Pencil, Plus, Trash } from 'react-bootstrap-icons';
import SupportIcon from 'assets/svg/support.svg';
import FacebookIcon from 'assets/svg/facebook.svg';
import TwitterIcon from 'assets/svg/twitter.svg';
import InstagramIcon from 'assets/svg/instagram.svg';
import LinkedinIcon from 'assets/svg/linkedin.svg';
import style from './style.module.scss';

const propTypes = {
  data: PropTypes.array,
  updateAccountName: PropTypes.func,
};

const accountType = ['Facebook', 'Twitter', 'Instagram', 'Linkedin', 'Gmail'];

const AccountIcon = (props) => {
  let returnIcon = (
    <div {...props} className={style.editItem}>
      <img src={SupportIcon} alt={'None'} style={{ width: '24px' }} />
    </div>
  );
  if (props.name.indexOf('linkedin') !== -1) {
    returnIcon = (
      <div {...props} className={style.editItem}>
        <img src={LinkedinIcon} alt={'Linkedin'} style={{ width: '24px' }} />
      </div>
    );
  }
  if (props.name.indexOf('twitter') !== -1) {
    returnIcon = (
      <div {...props} className={style.editItem}>
        <img src={TwitterIcon} alt={'Twitter'} style={{ width: '24px' }} />
      </div>
    );
  }
  if (props.name.indexOf('facebook') !== -1) {
    returnIcon = (
      <div {...props} className={style.editItem}>
        <img src={FacebookIcon} alt={'Facebook'} style={{ width: '24px' }} />
      </div>
    );
  }
  if (props.name.indexOf('instagram') !== -1) {
    returnIcon = (
      <div {...props} className={style.editItem}>
        <img src={InstagramIcon} alt={'Instagram'} style={{ width: '24px' }} />
      </div>
    );
  }
  return returnIcon;
};

const AddIcon = (props) => (
  <div {...props} className={style.addItem}>
    <Plus className={style.plusIcon} size={28} />
  </div>
);

const AccountSection = (props) => {
  const [data] = useState(props.data);
  const [accountState, setAccountState] = useState([false, false, false, false, false]);
  const [editState, setEditState] = useState([false, false, false, false, false]);
  const [accountName, setAccountName] = useState(['', '', '', '', '']);

  useEffect(() => {
    let accountStateList = Array(5).fill(false);
    let accountNameList = Array(5).fill('');
    let accountIdList = Array(5).fill(0);
    data.forEach((oneAccount) => {
      const accountIndex = accountType.indexOf(oneAccount.account);
      accountStateList[accountIndex] = true;
      accountNameList[accountIndex] = oneAccount.url;
      accountIdList[accountIndex] = oneAccount.id;
    });
    setAccountState(accountStateList);
    setAccountName(accountNameList);
  }, [data]);

  const handleChange = (event, currentIndex) => {
    const target = event.target;
    const value =
      target.type === 'checkbox'
        ? target.checked
        : target.name === 'referralCode'
        ? target.value.toUpperCase()
        : target.value;

    let accountNameList = [...accountName];
    accountNameList[currentIndex] = value;
    setAccountName(accountNameList);
    props.updateAccountName(accountNameList);
  };

  const handleEditState = (currentIndex, curState) => {
    let editStateList = [...editState];
    editStateList[currentIndex] = curState;
    setEditState(editStateList);
    if (curState === false && accountName[currentIndex] !== '') {
      setAccountState(accountState.map((state, index) => (index === currentIndex ? true : state)));
    }
  };

  const handleTrashClick = (currentIndex) => {
    const accountNameList = accountName.map((name, index) => (index === currentIndex ? '' : name));

    setEditState(editState.map((state, stateIndex) => (currentIndex === stateIndex ? false : state)));
    setAccountName(accountNameList);
    setAccountState(accountState.map((state, index) => (index === currentIndex ? false : state)));

    props.updateAccountName(accountNameList);
  };

  return (
    <div className={style.accountsSection}>
      <div className={style.cardTitle}>Linked Accounts</div>
      {accountName.map((name, index) => (
        <div className={style.flexItem} key={index}>
          {accountState[index] ? (
            <AccountIcon name={accountName[index]} onClick={() => handleEditState(index, true)} />
          ) : (
            <AddIcon onClick={() => handleEditState(index, true)} />
          )}
          {editState[index] ? (
            <div className={style.flexItem} style={{ height: '25px' }}>
              <Form.Control
                required={false}
                type="text"
                placeholder={'Please Add Account'}
                value={accountName[index]}
                className={style.formInput}
                onChange={(e) => handleChange(e, index)}
              />
              {accountState[index] ? (
                <div className={style.flexItem} style={{ width: '0%' }}>
                  <div>
                    <Pencil
                      className={style.trash}
                      size={20}
                      onClick={() => {
                        handleEditState(index, false);
                      }}
                    />
                  </div>
                  <div>
                    <Trash className={style.trash} size={20} onClick={() => handleTrashClick(index)} />
                  </div>
                </div>
              ) : (
                <div className={style.flexItem} style={{ width: '0%' }}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleEditState(index, false);
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
          ) : accountState[index] ? (
            <div className={style.accountLabel}>{name}</div>
          ) : (
            <div className={style.accountLabel}>Add Account</div>
          )}
        </div>
      ))}
    </div>
  );
};

AccountSection.propTypes = propTypes;

export default AccountSection;
