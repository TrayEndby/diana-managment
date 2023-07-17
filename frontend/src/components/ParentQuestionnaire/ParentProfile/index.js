import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cn from 'classnames';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Children from './Children';
import CSA from './CSA';
import ExpertiseItems from './ExpertiseItems';
import avatarStyle from '../../Questionnaire/MyProfile/ReviewProfile/UserIcon/style.module.scss';
import UserIcon from '../../Questionnaire/MyProfile/ReviewProfile/UserIcon';
import UnsavedInfoAlert from '../../Questionnaire/MyProfile/ReviewBasic/UnsavedInfoAlert';

import PhoneInput from 'util/PhoneInput/old';
import CountryListInput, { DEFAULT_COUNTRY } from 'util/CountryListInput';
import StateListInput from 'util/StateListInput';
import CropImage from 'util/CropImage';
import { uploadCropImage } from 'util/CropImage/util';
import DotStepBar from 'util/DotStepBar';

import userProfilePicService from 'service/UserProfilePicService';
import userProfileListService from 'service/UserProfileListService';
import userProfileSearchService from 'service/UserProfileSearchService';
import parentService from 'service/ParentService';
import authService from 'service/AuthService';
import * as ROUTES from 'constants/routes';
import { PROFILE_TYPE } from 'constants/profileTypes';

import style from './style.module.scss';

const defaultBasicState = {
  firstName: '',
  lastName: '',
  hispanic: '',
  race: '',
  gender: '',
  mailingAdd: '',
  mailingCity: '',
  mailingZip: '',
  mailingState: '',
  mailingCountry: DEFAULT_COUNTRY,
};

const ParentProfile = ({ authedAs, handleUploadAvatar }) => {
  const [profileBasicInfo, setProfileBasicInfo] = useState(defaultBasicState);
  const [childList, setChildList] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [expertiseList, setExpertiseList] = useState([]);
  const [races, setRaces] = useState({
    raceList: [],
    loading: true,
    error: null,
  });
  const [genderList, setGenderList] = useState([]);
  const [image, setImage] = useState(null);
  const inputFileRef = useRef(null);
  const [saved, setSaved] = useState({ basicInfo: true });
  const [show, setShow] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const history = useHistory();
  const searchString = history.location.search;

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

  const handleError = (e) => {
    console.error(e);
    setRaces((prevState) => ({ ...prevState, error: e.message }));
  };

  const fetchRacesList = async () => {
    try {
      const raceList = await userProfileListService.listID(4);
      setRaces({
        raceList,
        loading: false,
        error: null,
      });
    } catch (e) {
      handleError(e);
    }
  };

  const fetchProfileInfo = async () => {
    try {
      const profile = await userProfileSearchService.getParentProfile();
      if (profile) {
        const {
          basic: {
            firstName,
            lastName,
            hispanic,
            race,
            gender,
            mailingAdd,
            mailingCity,
            mailingState,
            mailingCountry,
            mailingZip,
            birthday,
            phone,
            email,
            income_level,
            csa_code = null,
          },
        } = profile;
        setProfileBasicInfo({
          ...profileBasicInfo,
          firstName,
          lastName,
          hispanic,
          race,
          gender,
          mailingAdd,
          mailingCity,
          mailingState,
          mailingCountry,
          mailingZip,
          birthday: birthday?.split('T')[0],
          phone,
          email,
          income_level,
          csa_code,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchParentInfo = async () => {
    const resp = await parentService.getChildren();
    if (resp.length) {
      setChildList(resp);
    }
    const expTypeResp = await parentService.listParentExpertiseType();
    const expResp = await parentService.getExpertise();
    setSelectedExpertise(expResp);
    setExpertiseList(expTypeResp);
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    const updatedField = { [name]: value };
    setProfileBasicInfo({ ...profileBasicInfo, ...updatedField });
    setSaved({ basicInfo: false });
  };

  useEffect(() => {
    fetchProfileImage();
    fetchProfileInfo();
    fetchParentInfo();
    fetchCountryAndStateList();
    fetchRacesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveRequest = async () => {
    let res = null;
    try {
      const requiredFields = {
        email: authService.getEmail(),
        type: [PROFILE_TYPE.Parent],
      };
      userProfileSearchService.update(53, {
        ...profileBasicInfo,
        ...requiredFields,
      });
      setSaved({ basicInfo: true });
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

  const handleAddChild = async (info) => {
    const resp = await parentService.parentInsertOrUpdateChildren(info);
    if (resp) {
      fetchParentInfo();
    }
  };

  const handleDeleteChild = async (info) => {
    if (info.length) {
      const resp = await parentService.parentDeleteChildren(info);
      if (resp) {
        fetchParentInfo();
      }
    }
  };

  const handleChangeExpertise = async (id, e) => {
    const { value } = e.target;
    const dataToUpdate = [...selectedExpertise];
    if (!id) {
      dataToUpdate.push({ expertise: +value });
    } else {
      const index = dataToUpdate.findIndex((x) => x.id === id);
      dataToUpdate.splice(index, 1, { id, expertise: +value });
    }
    setSelectedExpertise(dataToUpdate);
    if (dataToUpdate.expertise !== 0) {
      const resp = await parentService.parentExpertiseUpdate(dataToUpdate);
      if (resp?.res) {
        fetchParentInfo();
      }
    }
  };

  const handleRemoveExpertise = async (id) => {
    if (id) {
      const resp = await parentService.parentExpertiseDeleteById([{ id }]);
      if (resp?.res) {
        fetchParentInfo();
      }
    }
  };

  const showAlert = () => {
    const flag = Object.values(saved).includes(false);
    if (flag) {
      return <UnsavedInfoAlert saveChanges={saveRequest} />;
    }
  };

  const handleSaveCode = (csa_code) => {
    const updatedField = { csa_code: csa_code?.code };
    setProfileBasicInfo({ ...profileBasicInfo, ...updatedField });
    setSaved({ basicInfo: false });
  };

  const {
    firstName,
    lastName,
    hispanic,
    race,
    gender,
    mailingAdd,
    mailingCity,
    mailingState,
    mailingCountry,
    mailingZip,
    email,
    phone,
    csa_code = null,
  } = profileBasicInfo;

  return (
    <div className="App-body">
      <div className={style.wrapper}>
        {showAlert()}
        <div className={style.container}>
          {searchString.indexOf('signup') > -1 && (
            <DotStepBar steps={[11, 1, 0]} />
          )}
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
                  className="ml-4 primary"
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
              <Form className={style.editProfileForm}>
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
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    disabled
                    type="email"
                    name="email"
                    value={email || ''}
                  />
                </Form.Group>
                <PhoneInput
                  label="Phone Number"
                  name="phone"
                  value={phone || ''}
                  required
                  onChange={handleChange}
                />
                <Form.Group>
                  <Form.Label>Hispanic, Latino, or Spanish*</Form.Label>
                  <Form.Control
                    as="select"
                    name="hispanic"
                    value={hispanic ? 1 : 0}
                    onChange={handleChange}
                  >
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Race*</Form.Label>
                  <Form.Control
                    as="select"
                    name="race"
                    value={race || undefined}
                    onChange={handleChange}
                  >
                    {races?.raceList.map((race) => (
                      <option key={race.id}>{race.name}</option>
                    ))}
                  </Form.Control>
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
                <Form.Group className="w-100">
                  <Form.Label>Provide expertise</Form.Label>
                  <ExpertiseItems
                    selected={selectedExpertise}
                    expertiseList={expertiseList}
                    handleChange={handleChangeExpertise}
                    onRemove={handleRemoveExpertise}
                  />
                </Form.Group>
                <Form.Group className="w-100">
                  <CSA code={csa_code} onSubmit={handleSaveCode} />
                </Form.Group>

                <h3
                  className={`font-weight-bold mb-4 mt-4 ${cn(style.subTitle)}`}
                >
                  <span className={` ${cn(style.subTitleSpan)}`}>
                    Home Address
                  </span>
                </h3>
                <Form.Group className="w-100">
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
                  label="Country*"
                  name="mailingCountry"
                  value={mailingCountry || DEFAULT_COUNTRY}
                  onChange={handleChange}
                />

                <h3
                  className={`font-weight-bold mb-4 mt-4 ${cn(style.subTitle)}`}
                >
                  <span className={` ${cn(style.subTitleSpan)}`}>
                    Child Information
                  </span>
                </h3>
                <Form.Group className="w-100">
                  <Children
                    list={childList}
                    addChild={handleAddChild}
                    deleteChild={handleDeleteChild}
                  />
                </Form.Group>
                <div className="text-center w-100">
                  {searchString.includes('signup') || !authService.isVerifiedParentOrStudent() ? (
                    <Link to={ROUTES.PAYMENT_ORDER + searchString}>
                      <Button
                        variant="primary"
                        className="font-weight-bold mt-4"
                      >
                        Proceed to payment
                      </Button>
                    </Link>
                  ) : (
                    <Link to={ROUTES.HOME}>
                      <Button
                        variant="primary"
                        className="font-weight-bold mt-4"
                      >
                        Finish
                      </Button>
                    </Link>
                  )}
                </div>
              </Form>
            </div>
          </Col>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
