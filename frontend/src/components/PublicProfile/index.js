import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { ReactComponent as ClockIcon } from 'assets/svg/clock.svg';
import { ReactComponent as SchoolIcon } from 'assets/svg/school.svg';
import { ReactComponent as PinIcon } from 'assets/svg/pin.svg';

import * as ROUTES from 'constants/routes';

import Avatar from 'util/Avatar';
import ErrorDialog from 'util/ErrorDialog';
import useErrorHandler from 'util/hooks/useErrorHandler';
import userProfileSearchService from 'service/UserProfileSearchService';
import contactService from 'service/ContactService';
import { Link } from 'react-router-dom';

import style from './style.module.scss';

const PublicProfile = () => {
  const history = useHistory();
  const { id = null } = history?.location?.state || {};
  const [profile, setProfile] = useState(null);
  const [contactList, setContactList] = useState([]);
  const [error, setError] = useErrorHandler();

  const fetchContactList = useCallback(async () => {
    try {
      const res = await contactService.listContact();
      setContactList(res);
    } catch (e) {
      console.error(e); // no need to show this error
    }
  }, []);

  // fetch messages
  useEffect(() => {
    setError(null);
    if (id) {
      userProfileSearchService
        .fetchPublicProfile(id)
        .then((res) => {
          setProfile(res);
        })
        .catch(setError);
    }
  }, [id, setError]);

  // fetch contact list
  useEffect(() => {
    fetchContactList();
  }, [fetchContactList]);

  if (profile == null) {
    return (
      <div className={classNames('App-body', style.wrapper)}>
        <Container className={style.container} fluid>
          No profile to display
        </Container>
      </div>
    );
  }

  const addContact = async () => {
    try {
      setError(null);
      await contactService.addContact(id);
      fetchContactList();
    } catch (e) {
      setError(e);
    }
  };

  const isContact = contactList?.findIndex(({ contact_id }) => contact_id === id) > -1;
  const { firstName, lastName, gender, graduation = '', schoolName, SchoolCity, SchoolState = '', SchoolZip } = profile || {};
  return (
    <div className={classNames('App-body', style.wrapper)}>
      <Container className={style.container} fluid>
        {error && <ErrorDialog error={error} />}
        {!error && (
          <>
            <section className={style.infoSection}>
              <section className={style.basic}>
                <Avatar id={id} size={100} />
                <div className="ml-3">
                  <div className={style.name}>{`${firstName} ${lastName}`}</div>
                  <div>{gender}</div>
                </div>
              </section>
              <section className={style.school}>
                <header>High School</header>
                <div>
                  <SchoolIcon />
                  <span className="App-textOverflow" title={schoolName}>
                    {schoolName}
                  </span>
                </div>
                {SchoolCity && (
                  <div>
                    <PinIcon />
                    <span className={style.capText}>{`${SchoolCity} ${SchoolState} ${SchoolZip}`}</span>
                  </div>
                )}
                {graduation && (
                  <div>
                    <ClockIcon /> <span className="App-textOverflow">{`Graduate at ${graduation}`}</span>
                  </div>
                )}
              </section>
            </section>
            <section className={style.btnSection}>
              <Link to={`${ROUTES.CONVERSATIONS}?selectedId=${id}`}>
                <Button variant="primary">
                  Message
                </Button>
              </Link>
              {isContact ? (
                <Button variant="primary" disabled>
                  Added in contact
                </Button>
              ) : (
                  <Button variant="primary" onClick={addContact}>
                    Add to contact
                  </Button>
                )}
            </section>
          </>
        )}
      </Container>
    </div>
  );
};

export default PublicProfile;
