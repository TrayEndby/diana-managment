import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { Trash, PeopleFill, PersonCircle } from 'react-bootstrap-icons';

import { getCandidateGuests } from '../util';
import style from './style.module.scss';

const GuestType = PropTypes.shape({
  user_id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

const propTypes = {
  guests: PropTypes.arrayOf(GuestType).isRequired,
  availableGuests: PropTypes.arrayOf(GuestType).isRequired,
  noGuestsSelection: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

const GuestsSelection = ({ availableGuests, guests, noGuestsSelection, onChange }) => {
  const [searchKey, setSearchKey] = useState('');
  const guestsList = getCandidateGuests(availableGuests, guests, searchKey);

  const handleSelect = (guest) => {
    if (!guest) {
      // select all group
      onChange([]);
    } else {
      const index = guests.findIndex(({ user_id }) => user_id === guest.user_id);
      if (index < 0) {
        onChange([...guests, guest]);
      }
    }
  };

  const handleRemove = (user_id) => {
    const filteredGuests = guests.filter((guest) => guest.user_id !== user_id);
    onChange(filteredGuests);
  };

  return (
    <Form.Group>
      <PeopleFill />
      <div>
        {!noGuestsSelection && (
          <Dropdown>
            <Dropdown.Toggle as="div" className={style.dropdownToggle}>
              <Form.Control placeholder="Add guests" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ maxHeight: 200, overflowY: 'auto' }}>
              {/* <Dropdown.Item className={style.dropdownItem} onSelect={() => handleSelect(null)}>
              <PersonCircle className={style.userIcon} />
              <span>All group</span>
            </Dropdown.Item> */}
              {guestsList.map((guest) => (
                <Dropdown.Item
                  key={guest.user_id}
                  className={style.dropdownItem}
                  eventKey={guest.user_id}
                  onSelect={() => handleSelect(guest)}
                >
                  <PersonCircle className={style.userIcon} />
                  <span>{guest.name}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
        <div className={style.selectedGroup}>
          {guests.length > 0 &&
            guests.map(({ user_id, name }) => (
              <div key={user_id} className={style.selected}>
                <PersonCircle className={style.userIcon} />
                <div>{name}</div>
                {!noGuestsSelection && (
                  <Trash
                    className="App-clickable"
                    style={{ marginLeft: 'auto' }}
                    onClick={() => handleRemove(user_id)}
                  />
                )}
              </div>
            ))}
          {/* {guests.length === 0 && (
            <div className={style.selected}>
              <PersonCircle className={style.userIcon} />
              <div>All group</div>
            </div>
          )} */}
        </div>
      </div>
    </Form.Group>
  );
};

GuestsSelection.propTypes = propTypes;

export default GuestsSelection;
