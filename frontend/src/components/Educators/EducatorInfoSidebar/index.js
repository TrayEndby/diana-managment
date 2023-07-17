import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cn from 'classnames';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import AddContactModal from 'util/Modals/AddContactModal';

import Avatar from 'util/Avatar';
import Spinner from 'util/Spinner';
import { EditPencilGrey, SidebarCloseIcon, SidebarOpenIcon } from 'util/Icon';
import StarRating from 'util/StarRating';
import userProfileSearchService from 'service/UserProfileSearchService';
import EducatorService from 'service/EducatorService';
import authService from 'service/AuthService';

import * as ROUTES from 'constants/routes';

import style from './style.module.scss';

const EducatorInfoSidebar = ({ isEducator, educatorId, handleClose, handleOpen, isCollapsed }) => {
  const [profileBasicInfo, setProfileBasicInfo] = useState({});
  const [profileEducatorInfo, setProfileEducatorInfo] = useState({});
  const [servicesList, setServicesList] = useState([]);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isAddContactModal, setIsAddContactModal] = useState(false);
  const [avatarId, setAvatar] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (isEducator) {
      setAvatar(authService.getUID());
      fetchProfileInfo();
      fetchServices();
    } else if (educatorId) {
      try {
        EducatorService.getEducatorInfo(educatorId).then((educator) => {
          setProfileBasicInfo(educator.basic);
          setProfileEducatorInfo(educator.educatorProfile);
          setServicesList(educator.educatorService);
        });
        setAvatar(educatorId);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isEducator, educatorId]);

  const fetchProfileInfo = async () => {
    try {
      const profile = await userProfileSearchService.getProfileAsync();
      const educatorProfileResp = await EducatorService.getEducatorProfile();
      const educatorProfile = educatorProfileResp?.educatorProfile;

      if (profile && educatorProfile) {
        setProfileBasicInfo(profile.basic);
        setProfileEducatorInfo(educatorProfile);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchServices = async () => {
    try {
      const servicesResp = await EducatorService.getServices();
      if (servicesResp) {
        const serviceList = servicesResp?.educatorService;
        setServicesList(serviceList);
      }
    } catch (e) {
      console.error(e);
    }
    setIsProfileLoading(false);
  };

  const { firstName, lastName, mailingCity, mailingState, mailingCountry } = profileBasicInfo;
  const { description, rating } = profileEducatorInfo;
  return (
    <div className={style.educatorSidebar}>
      <Card className={style.card}>
        {isProfileLoading ? (
          <Spinner />
        ) : (
            <>
              <Card.Header className={style.cardHeader}>
                <div className={style.editContainer}>
                  {educatorId && (
                    <Button onClick={() => history.push(ROUTES.EDUCATORS)} className={style.button} variant="primary">
                      Find educators
                    </Button>
                  )}
                  {isEducator && (
                    <Link to={ROUTES.EDUCATOR_PROFILE} className={style.editPencil}>
                      <EditPencilGrey />
                    </Link>
                  )}
                  <div className={style.closeIcon} onClick={handleClose}>
                    <SidebarCloseIcon />
                  </div>
                </div>
                <div className={style.avatarWrap}>
                  <Avatar id={avatarId} size={85} />
                  <div className={style.statusWrap}>
                    <span className={cn(style.status, style.statusGreen)}>Online</span>
                  </div>
                </div>
                <div className={style.nameWrap}>
                  <h5 className={style.name}>
                    {firstName} {lastName}
                  </h5>
                  <p className={style.location}>{description}</p>
                  <div className={style.ratingContainer}>
                    <StarRating rating={rating} name="rating" />
                    <span className={style.rating}>{rating}</span>
                    <span className={style.ratings}>(3 ratings)</span>
                  </div>
                </div>
                <div className={style.categoryRow}>
                  <div className={style.categoryItem}>
                    <div className={style.categoryName}>Location</div>
                    <div className={style.categoryInfo}>
                      {mailingCity && `${mailingCity},`} {mailingState && `${mailingState},`}{' '}
                      {mailingCountry && `${mailingCountry}`}
                    </div>
                  </div>
                </div>
              </Card.Header>

              <Card.Body className={style.cardBody}>
                <div className={style.categoryItem}>
                  <div className={style.categoryName}>Provide services</div>
                </div>
                {servicesList != null ? (
                  <div className={style.serviceContainer}>
                    {servicesList.map((service) => (
                      <div className={style.serviceItem} key={service.id}>
                        <div className={style.serviceName}>{service.name}</div>
                        <div className={style.categoryRow}>
                          <div className={style.serviceItemSmall}>
                            <div className={style.serviceInfo}>Hourly rate</div>
                            <div className={style.serviceInfoBig}>{service.hourly_rate}/Hr</div>
                          </div>
                          <div className={style.serviceItemSmall}>
                            <div className={style.serviceInfo}>Years of experience</div>
                            <div className={style.serviceInfoBig}>{service.years_experience} years</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                    <div className={cn(style.categoryInfo, 'text-center')}>
                      No services, please add on{' '}
                      <Link to={ROUTES.EDUCATOR_PROFILE} className="App-text-clickable">
                        Profile page
                      </Link>
                    </div>
                  )}
                {!isEducator && educatorId && (
                  <Button variant="primary" className={style.button} onClick={() => setIsAddContactModal(true)}>
                    Add to Contacts
                  </Button>
                )}
                <AddContactModal
                  userId={educatorId}
                  isOpened={isAddContactModal}
                  closeModal={() => setIsAddContactModal(false)}
                />
              </Card.Body>
            </>
          )}
      </Card>
      <div className={cn(style.collapsedPanel, { [style.visible]: isCollapsed })}>
        <div className={style.openIcon} onClick={handleOpen}>
          <SidebarOpenIcon />
        </div>
        {isEducator && (
          <Link to={ROUTES.EDUCATOR_PROFILE} className={style.editPencil}>
            <EditPencilGrey />
          </Link>
        )}
      </div>
    </div>
  );
};

export default EducatorInfoSidebar;
