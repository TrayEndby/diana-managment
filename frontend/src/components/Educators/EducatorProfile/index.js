import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import cn from 'classnames';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import EducatorServices from '../EducatorServices';
import UserIcon from '../../Questionnaire/MyProfile/ReviewProfile/UserIcon';

import SaveButton from 'util/SaveButton';
import ConfirmDialog from 'util/ConfirmDialog';
import CountryListInput, { DEFAULT_COUNTRY } from 'util/CountryListInput';
import StateListInput from 'util/StateListInput';

import userProfilePicService from 'service/UserProfilePicService';
import userProfileListService from 'service/UserProfileListService';
import userProfileSearchService from 'service/UserProfileSearchService';
import authService from 'service/AuthService';
import educatorService from 'service/EducatorService';
import { PROFILE_TYPE } from 'constants/profileTypes';
import * as ROUTES from 'constants/routes';

import avatarStyle from '../../Questionnaire/MyProfile/ReviewProfile/UserIcon/style.module.scss';
import style from './style.module.scss';
import Modal from 'react-bootstrap/Modal';
import CropImage from '../../../util/CropImage';
import { uploadCropImage } from '../../../util/CropImage/util';

const defaultBasicState = {
  firstName: '',
  lastName: '',
  email: '',
  gender: '',
  mailingAdd: '',
  mailingCity: '',
  mailingZip: '',
  mailingState: '',
  mailingCountry: DEFAULT_COUNTRY,
};

const defaultEducatorState = {
  bio: '',
  description: '',
};

const EducatorProfile = ({ onFinish, authedAs, handleUploadAvatar }) => {
  const [profileBasicInfo, setProfileBasicInfo] = useState(defaultBasicState);
  const [profileEducatorInfo, setProfileEducatorInfo] = useState(
    defaultEducatorState,
  );
  const [servicesList, setServicesList] = useState([]);
  const [serviceToRemove, setServiceToRemove] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);

  const [genderList, setGenderList] = useState([]);
  const [image, setImage] = useState(null);
  const inputFileRef = useRef(null);
  const formRef = useRef(null);
  const history = useHistory();
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    setImage(authedAs?.avatar);
  }, [authedAs]);

  const setUploadImage = (pic) => {
    setShow(false);
    uploadCropImage(pic, handleUploadAvatar, 200);
  };

  const fetchProfileImage = async () => {
    try {
      const image = await userProfilePicService.download();
      setImage(image);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerUpload = () => {
    inputFileRef.current.click();
  };

  const fetchCountryAndStateList = async () => {
    const gender = await userProfileListService.listName(5);
    setGenderList(gender.nameIds);
  };

  const fetchProfileInfo = async () => {
    try {
      const profile = await userProfileSearchService.getProfileAsync();
      const educatorProfileResp = await educatorService.getEducatorProfile();
      const educatorProfile = educatorProfileResp?.educatorProfile;

      if (educatorProfile.uid) {
        setHasProfile(true);
      }
      if (profile && educatorProfile) {
        const {
          basic: {
            firstName,
            lastName,
            email,
            gender,
            mailingAdd,
            mailingCity,
            mailingState,
            mailingCountry,
            mailingZip,
            birthday,
          },
        } = profile;
        const { description, bio } = educatorProfile;
        setProfileBasicInfo({
          ...profileBasicInfo,
          firstName,
          lastName,
          email,
          gender,
          mailingAdd,
          mailingCity,
          mailingState,
          mailingCountry,
          mailingZip,
          birthday: birthday?.split('T')[0],
        });
        setProfileEducatorInfo({ ...profileEducatorInfo, description, bio });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchServices = async () => {
    try {
      const servicesResp = await educatorService.getServices();
      if (servicesResp) {
        const serviceList = servicesResp?.educatorService;
        setServicesList(serviceList);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    const updatedField = { [name]: value };
    if (name !== 'description') {
      setProfileBasicInfo({ ...profileBasicInfo, ...updatedField });
    } else {
      setProfileEducatorInfo({ ...profileEducatorInfo, ...updatedField });
    }
  };

  useEffect(() => {
    fetchProfileImage();
    fetchProfileInfo();
    fetchServices();
    fetchCountryAndStateList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddService = async (service) => {
    const insertResp = await educatorService.insertService(service);
    if (insertResp.res === 1) {
      fetchServices();
    }
  };

  const handleSetServiceToRemove = (id) => {
    setServiceToRemove(id);
  };

  const handleDeleteService = async (id) => {
    setServiceToRemove(null);
    const deleteResp = await educatorService.deleteService(id);
    if (deleteResp.res === 1) {
      fetchServices();
    }
  };

  const saveRequest = async () => {
    let res = null;
    try {
      const requiredFields = {
        email: authService.getEmail(),
        type: [PROFILE_TYPE.Educator],
      };
      await userProfileSearchService.update(53, {
        ...profileBasicInfo,
        ...requiredFields,
      });
      res = await educatorService.educatorProfileUpdate(profileEducatorInfo);
      if (!hasProfile) {
        setHasProfile(false);
      }
    } catch (e) {
      console.error(e);
    }

    return res;
  };

  const handleSelectFile = (e) => {
    if (e.target.files[0] != null) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      setShow(true);
    }
  };

  const handleSave = async () => {
    const result = await saveRequest();
    if (!hasProfile && result) {
      await onFinish();
      fetchProfileInfo();
      fetchServices();
    }
  };

  const handleFinish = async () => {
    const result = await saveRequest();
    if (result) {
      history.push(ROUTES.EDUCATOR_DETAILS);
    }
  };

  const handleSubmit = () => {
    const form = formRef.current;
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setValidated(false);
      handleSave();
    }
  };

  const {
    firstName,
    lastName,
    email,
    gender,
    mailingAdd,
    mailingCity,
    mailingState,
    mailingCountry,
    mailingZip,
  } = profileBasicInfo;
  const { description } = profileEducatorInfo;
  return (
    <div className="App-body">
      <div className={style.wrapper}>
        <div className={style.container}>
          <Col xl={2}></Col>
          <Col xl={8} className={style.rightContainer}>
            <h3 className={`font-weight-bold mb-4 mt-4 ${cn(style.subTitle)}`}>
              <span className={` ${cn(style.subTitleSpan)}`}>
                Profile Information
              </span>
            </h3>
            <div className="">
              <div className={avatarStyle.editPicture}>
                <span className={avatarStyle.dot}>
                  <UserIcon
                    image={image}
                    style={{ width: '100px', height: '100px' }}
                  />
                </span>
                <Button
                  className="ml-4 font-weight-bold "
                  variant="primary"
                  onClick={handleTriggerUpload}
                >
                  Change photo
                </Button>
                <input
                  ref={inputFileRef}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleSelectFile}
                />
              </div>
            </div>
            <Modal show={show} onHide={() => setShow(false)} centered>
              <CropImage
                imgSrc={imageSrc}
                setUploadImage={setUploadImage}
                setShow={setShow}
              />
            </Modal>

            <div className="">
              <Form
                className={style.editProfileForm}
                validated={validated}
                ref={formRef}
              >
                <Form.Group>
                  <Form.Label>First Name*</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Enter First Name"
                    value={firstName || ''}
                    required
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Last Name*</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Enter Last Name"
                    value={lastName || ''}
                    required
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email Address*</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter Email Address"
                    value={email || ''}
                    required
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Gender*</Form.Label>
                  <Form.Control
                    as="select"
                    name="gender"
                    value={gender || undefined}
                    onChange={handleChange}
                  >
                    {genderList.map((gender) => (
                      <option key={gender.id}>{gender.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className={style.thirdLeft}>
                  <Form.Label>Headline*</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="Enter short description about yourself in one sentence"
                    value={description || ''}
                    required
                    onChange={handleChange}
                  />
                </Form.Group>
                <h3
                  className={`font-weight-bold mb-4 mt-4 ${cn(style.subTitle)}`}
                >
                  <span className={` ${cn(style.subTitleSpan)}`}>
                    Home Address
                  </span>
                </h3>
                <Form.Group classname={`${cn(style.wideField)}`}>
                  <Form.Label>Address*</Form.Label>
                  <Form.Control
                    type="text"
                    name="mailingAdd"
                    placeholder="Enter your address"
                    value={mailingAdd || ''}
                    required
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>City*</Form.Label>
                  <Form.Control
                    type="text"
                    name="mailingCity"
                    placeholder="Enter city"
                    value={mailingCity || ''}
                    required
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>ZIP code*</Form.Label>
                  <Form.Control
                    type="text"
                    name="mailingZip"
                    placeholder="Enter ZIP code"
                    value={mailingZip || ''}
                    required
                    onChange={handleChange}
                  />
                </Form.Group>
                <StateListInput
                  required
                  label="State/Province*"
                  name="mailingState"
                  value={mailingState}
                  onChange={handleChange}
                />
                <CountryListInput
                  required
                  className={style.thirdLeft}
                  label="Country*"
                  name="mailingCountry"
                  value={mailingCountry || DEFAULT_COUNTRY}
                  onChange={handleChange}
                />
                <div className="text-center w-100">
                  <SaveButton
                    variant="primary"
                    onClick={handleSubmit}
                    className="font-weight-bold mt-4 mb-4"
                  >
                    Save changes
                  </SaveButton>
                </div>
              </Form>
              <h3
                className={`font-weight-bold mb-4 mt-4 ${cn(style.subTitle)}`}
              >
                <span className={` ${cn(style.subTitleSpan)}`}>Services</span>
              </h3>
              <Form.Group>
                <EducatorServices
                  disabled={!hasProfile}
                  servicesList={servicesList}
                  addService={handleAddService}
                  onRemove={handleSetServiceToRemove}
                />
              </Form.Group>
              {hasProfile && (
                <div className="text-center w-100">
                  <SaveButton
                    variant="primary"
                    onClick={handleFinish}
                    className="font-weight-bold mt-4"
                  >
                    Finish
                  </SaveButton>
                </div>
              )}
            </div>
          </Col>
          <Col xl={2}></Col>
          <ConfirmDialog
            show={serviceToRemove !== null}
            title="Remove service"
            onSubmit={() => handleDeleteService(serviceToRemove)}
            onClose={() => setServiceToRemove(null)}
          >
            Are you sure you want to remove service?
          </ConfirmDialog>
        </div>
      </div>
    </div>
  );
};

export default EducatorProfile;
