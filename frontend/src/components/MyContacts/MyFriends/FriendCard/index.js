import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import cn from 'classnames';

import UserIcon from 'components/Navigation/UserIcon';
import useIsMountedRef from 'util/hooks/useIsMountedRef';
import fileUploadService from 'service/FileUploadService';
import { Category } from 'service/FileUploadService';
import * as ROUTES from 'constants/routes';

import style from '../style.module.scss';

const FriendCard = ({ uid, profile, onRemove, redirectOnMessage = ROUTES.CONVERSATIONS }) => {
  const isMountedRef = useIsMountedRef();
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!uid) {
      setImage(null);

    } else {
      fileUploadService
        .download(Category.Profile, uid, uid)
        .then((res) => {
          if (isMountedRef.current) {
            setImage(res);
          }
        })
        .catch((e) => {
          console.error(e);
        })
    }
  }, [uid, isMountedRef]);

  const userName = `${profile?.basic?.firstName} ${profile?.basic?.lastName}`;
  return (
    <div className={style.friendCard}>
      <header className={style.header}>
        <div className={style.avatar}>
          <UserIcon image={image} size={65} color="black" />
        </div>
        <div className={style.nameWrap}>
          <p className={style.name}>{userName}</p>
          {profile?.basic?.gender && <p className={style.gender}>{profile.basic.gender}</p>}
        </div>
      </header>
      <div className={style.content}>
        <h3 className={style.contentTitle}>High School</h3>
        {profile?.schools && (
          <div className={style.contentRow}>
            <span className={cn(style.icon, style.education)}></span>
            <p className={style.contentInfo}>{profile.schools[0].name}</p>
          </div>
        )}
        {profile?.basic?.mailingAdd && (
          <div className={style.contentRow}>
            <span className={cn(style.icon, style.location)}></span>
            <p className={style.contentInfo}>{profile.basic.mailingAdd}</p>
          </div>
        )}
        <div className={style.footer}>
          <Link to={{ pathname: redirectOnMessage, state: { targetUserId: uid } }} >
            <Button type="primary">Message</Button>
          </Link>
          <Button type="secondary" className='btn-secondary' onClick={() => onRemove(uid)}>Remove</Button>
        </div>
      </div>
    </div>
  )
}

export default FriendCard;