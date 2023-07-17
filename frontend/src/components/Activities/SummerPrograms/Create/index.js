import React from 'react';
import { Card, Button, Container, Modal, Toast } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import * as ROUTES from '../../../../constants/routes';
import ECAService from '../../../../service/ECAService';
import CountryListInput, { DEFAULT_COUNTRY } from 'util/CountryListInput';
import StateListInput from 'util/StateListInput';
import TagListInput from 'util/TagListInput';
import style from './style.module.scss';
import CameraIcon from '../../../../assets/svg/camera.svg';
import CropImage from '../../../../util/CropImage';
import { uploadCropImage } from '../../../../util/CropImage/util';

const defaultBasicState = {
  summerProgramCity: '',
  summerProgramState: '',
  summerProgramTag: [],
  summerProgramCountry: DEFAULT_COUNTRY,
};

const Create = ({ history }) => {
  const [name, setName] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [overview, setOverview] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const inputFileRef = React.useRef(null);
  const [show, setShow] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [summerProgramBasicInfo, setSummerProgramBasicInfo] = React.useState(defaultBasicState);
  const [selTags, setSelTags] = React.useState([]);

  React.useEffect(() => {
  }, []);

  const handleShowConfirmModal = () => {
    if (!name || !overview || !description) {
      alert('Fill all required fields');
      return;
    }

    setShowConfirmModal(true);
  }

  const onSkipForNow = () => {
    setShowConfirmModal(false);
    createProgram();
  }

  const onSaveToList = () => {
    setShowConfirmModal(false);
    createProgramBySaved();
  }
  
  const handleChange = (event) => {
    let { name, value } = event.target;
    if(name === 'summerProgramTag') {
      value = selTags.indexOf(value) === -1 ? [...selTags, value] : selTags;
      setSelTags(value.sort());
    }
    const updatedField = { [name]: value };
    setSummerProgramBasicInfo({ ...summerProgramBasicInfo, ...updatedField });
  };

  const setUploadImage = (pic) => {
    setShow(false);
    uploadCropImage(pic, handleImage, 500);
  };

  const handleImage = (pic) => {
    setImage(pic);
  };

  const handleSelectFile = (e) => {
    if(e.target.files[0] != null) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => { setImageSrc(reader.result); };
      setShow(true);
    }
  }

  const handleTriggerUpload = () => {
    inputFileRef.current.click();
  };

  const createProgram = () => {
    ECAService.createProgram(name, image, summerProgramCountry, summerProgramState, summerProgramCity, summerProgramTag.toString(), overview, description, url, 21, 283).then(() => {
      history.push(ROUTES.PROGRAMS_EXPLORE);
    });
  };

  const createProgramBySaved = () => {
    ECAService.createProgramBySaved(name, image, summerProgramCountry, summerProgramState, summerProgramCity, summerProgramTag.toString(), overview, description, url, 21, 283).then((data) => {
      history.push(ROUTES.PROGRAMS_EXPLORE);
    });
  };

  const {
    summerProgramCity,
    summerProgramState,
    summerProgramCountry,
    summerProgramTag,
  } = summerProgramBasicInfo;

  return (
    <Container fluid>
      <Button
        onClick={() => history.goBack()}
        className={style.exploreBtn}
      >
        Back to explore
      </Button>
      <Card className={style.mainContainer}>
        <Container fluid className={style.row}>
          <div className={style.image} onClick={handleTriggerUpload}>
            <img src={image ? URL.createObjectURL(image) : CameraIcon} alt={'camera'} style={ image ? {width: '100%'} : { width: '100px' }} />
            {!image && <p style={{fontSize: '18px'}}>Click to upload picture</p>}
            <input ref={inputFileRef} type="file" style={{ display: 'none' }} onChange={handleSelectFile} />
          </div>
          <Modal show={show} onHide={() => setShow(false)} centered>
            <CropImage imgSrc={imageSrc} setUploadImage={setUploadImage} setShow={setShow} />
          </Modal>
          <section className={style.mainInfo}>
            <section>
              <label>Summer program name*</label>
              <input
                type="text"
                placeholder="Enter summer program name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </section>
            <section className={style.categories}>
              <label>Location*</label>
              <div className={style.inputPanel}>
                <CountryListInput
                  required
                  label=""
                  name="summerProgramCountry"
                  value={summerProgramCountry || DEFAULT_COUNTRY}
                  onChange={handleChange}
                />
                <StateListInput
                  required
                  label=""
                  name="summerProgramState"
                  value={summerProgramState}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="Enter city"
                  name="summerProgramCity"
                  value={summerProgramCity}
                  onChange={handleChange}
                ></input>
              </div>
            </section>
            <section>
              <label>Add tags*</label>
              <TagListInput
                required
                label=""
                name="summerProgramTag"
                value={summerProgramTag}
                onChange={handleChange}
              />
              <div className={style.tagsPanel}>
                {selTags.map((val) => (
                  <Toast className={style.tagsItem} onClose={() => setSelTags(selTags.filter((value) => value !== val))}>
                    <Toast.Header className={style.tagsStyle}>
                      {val}
                    </Toast.Header>
                  </Toast>
                ))}
              </div>
            </section>
            <section>
              <label>Link to website</label>
              <input type="text" placeholder="Enter website URL" value={url} onChange={(e) => setUrl(e.target.value)} />
            </section>
          </section>
        </Container>
        <Card.Body className={style.details}>
          <h3>Summer program overview</h3>
          <textarea
            placeholder="Enter summer program overview."
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
          ></textarea>
        </Card.Body>
      </Card>
      <Card className={style.secondaryContainer}>
        <Card.Header className={style.header}>
          <h4>Details</h4>
        </Card.Header>
        <Card.Body className={style.details}>
          <h3>Summer program details</h3>
          <textarea
            placeholder="Enter summer program details."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </Card.Body>
      </Card>
      <section className={style.submitBlock}>
        <Button variant="secondary" onClick={() => history.goBack()}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleShowConfirmModal}>
          Submit
        </Button>
      </section>
      <Modal centered size="md" aria-labelledby="contained-modal-title-hcenter" show={showConfirmModal} onHide={handleShowConfirmModal}>
        <div className={style.modalContent}>
          <Modal.Title className={style.modalTitle} as="h5">Save this summer program to your Saved list?</Modal.Title>
          <Modal.Body className={style.modal}>
            <Button className={style.modalButton} variant="secondary" onClick={onSkipForNow}>
              Skip for now
            </Button>
            <Button
              className={style.modalButton}
              variant="primary"
              onClick={onSaveToList}
            >
              Save to list
            </Button>
          </Modal.Body>
        </div>
      </Modal>
    </Container>
  );
};

export default withRouter(React.memo(Create));
