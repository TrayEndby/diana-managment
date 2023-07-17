import React, { useEffect, useCallback } from 'react';
import style from './style.module.scss';
import contactService from 'service/ContactService';
import UserProfileSearchService from 'service/UserProfileSearchService';
import Spinner from 'util/Spinner';
import StudentCard, { CARD_TYPE } from 'util/Card/StudentCard';
import * as ROUTES from 'constants/routes';
import { useHistory } from 'react-router-dom';
import FormControl from 'react-bootstrap/FormControl';
import cn from 'classnames';
import Button from 'react-bootstrap/Button';

const propTypes = {};
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const MyContacts = () => {
  const [contacts, setContacts] = React.useState([]);
  const [filteredContacts, setFilteredContacts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [letterSearch, setLetterSearch] = React.useState('');
  const history = useHistory();

  const fetchFriends = useCallback(async () => {
    setIsLoading(true);
    const contactList = await contactService.listContact();
    if (contactList.length) {
      let fullInfoContact = [];
      for (let contact of contactList) {
        const { contact_id, email, tags } = contact || {};
        const limitedBasicInfo =
          (await UserProfileSearchService.fetchPublicProfile(contact_id)) || {};
        const {
          gender,
          firstName,
          lastName,
          graduation,
          schoolName,
          SchoolCity = '',
          SchoolState = '',
        } = limitedBasicInfo || {};
        const location = `${SchoolCity}${SchoolState && `, ${SchoolState}`}`;
        const content = {
          user_id: contact_id,
          firstName,
          lastName,
          email,
          tags,
          gender,
          school: schoolName,
          graduate: graduation,
          location,
        };
        fullInfoContact.push(content);
      }
      sortByName(fullInfoContact);
      setContacts(fullInfoContact);
      setFilteredContacts(fullInfoContact);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleRemove = async (uid) => {
    if (uid) {
      await contactService.deleteContact(uid);
      fetchFriends();
    }
  };

  const handleMessage = (id) => {
    history.push(`${ROUTES.CONVERSATIONS}?selectedId=${id}`);
  };

  const sortByName = (arr) =>
    arr.sort((a, b) => a.lastName?.localeCompare(b.lastName));

  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setFilteredContacts(handleSearch(value));
  };

  const handleSearch = (val, byLastName) => {
    const searchValue = val.toLowerCase();
    let filtered;
    if (!byLastName) {
      filtered = contacts?.filter(({ firstName, lastName, tags }) => {
        return (
          firstName?.toLowerCase().includes(searchValue) ||
          lastName?.toLowerCase().includes(searchValue) ||
          tags?.toLowerCase().includes(searchValue)
        );
      });
    } else {
      if (val === '') {
        return contacts;
      } else {
        filtered = contacts?.filter(({ lastName }) => {
          return lastName?.split('')[0].toLowerCase() === searchValue;
        });
      }
    }
    return filtered;
  };

  const handleSearchByLetter = (x) => {
    setLetterSearch(x);
    setFilteredContacts(handleSearch(x, true));
  };

  const setContactTag = (userId, tag) => {
    const selectedContact = contacts.find((c) => c.user_id === userId);
    selectedContact.tags = tag;
    setContacts([...contacts, selectedContact]);
  };

  const renderNoFriends = () => <h3>No contacts yet</h3>;
  return (
    <div className={style.page}>
      <Button variant="primary" onClick={() => history.goBack()}>
        Back
      </Button>
      <FormControl
        className={style.searchInput}
        placeholder="Search contact"
        autoComplete="off"
        value={search}
        onChange={handleChange}
      />
      <div className={style.wrap}>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className={style.list}>
            {Array.isArray(filteredContacts) && filteredContacts.length > 0
              ? filteredContacts.map((fr, key) => {
                  return (
                    <StudentCard
                      key={key}
                      content={fr}
                      type={CARD_TYPE.FRIEND}
                      onRemove={handleRemove}
                      onMessage={handleMessage}
                      onTagChange={setContactTag}
                    />
                  );
                })
              : renderNoFriends()}
          </div>
        )}
        <div className={style.lettersSearch}>
          <span
            onClick={() => handleSearchByLetter('')}
            className={cn(style.letter, {
              [style.active]: letterSearch === '',
            })}
          >
            All
          </span>
          {letters.split('').map((x, i) => (
            <span
              key={i}
              onClick={() => handleSearchByLetter(x)}
              className={cn(style.letter, {
                [style.active]: letterSearch === x,
              })}
            >
              {x}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

MyContacts.propTypes = propTypes;

export default MyContacts;
