import React from 'react';
import style from './style.module.scss';
import contactService from 'service/ContactService';
import UserProfileSearchService from 'service/UserProfileSearchService';
import Spinner from 'util/Spinner';
import StudentCard, { CARD_TYPE } from 'util/Card/StudentCard';
import * as ROUTES from 'constants/routes';
import { useHistory } from 'react-router-dom';

const MyFriends = () => {
  const [friends, setFriends] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState([]);
  const history = useHistory();

  React.useEffect(() => {
    fetchFriends();
  }, [])

  const fetchFriends = async () => {
    setIsLoading(true);
    const contactList = await contactService.listContact();
    if (contactList.length) {
      let fullInfoContact = [];
      for (let contact of contactList) {
        const { contact_id, name, email, tags } = contact || {};
        const fullInfo = await UserProfileSearchService.searchProfile(contact_id);
        const { gender } = fullInfo.profile.basic || {};
        const content = {
          user_id: contact_id,
          name,
          email,
          tags,
          gender,
          school: fullInfo.profile.schools[0]?.name,
          location: fullInfo.profile.schools[0]?.city,
          graduate: fullInfo.profile.schools[0]?.class,
        };
        fullInfoContact.push(content)
      }
      setFriends(fullInfoContact);
    }
    setIsLoading(false);
  }

  const handleRemove = async (uid) => {
    if (uid) {
      await contactService.deleteContact(uid);
      fetchFriends();
    }
  }

  const handleMessage = (id) => {
    history.push(`${ROUTES.CONVERSATIONS}?selectedId=${id}`);
  }

  const renderNoFriends = () => <h3>No friends yet</h3>
  return (
    <div className={style.wrap}>
      {isLoading ? <Spinner /> : (
        <div className={style.list}>
          {Array.isArray(friends) && friends.length > 0 ?
            friends.map((fr, key) => {
              return (
                <StudentCard
                  key={key}
                  content={fr}
                  type={CARD_TYPE.FRIEND}
                  onRemove={handleRemove}
                  onMessage={handleMessage}
                />
              )
            }) : renderNoFriends()}
        </div>
      )}

    </div>
  );
};

export default React.memo(MyFriends);
