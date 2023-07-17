import React from 'react';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import { RightCard } from '../../Layout';

import * as ROUTES from '../../../../constants/routes';
import ErrorDialog from '../../../../util/ErrorDialog';
import userProfilePicService from '../../../../service/UserProfilePicService';
import style from './style.module.scss';

import Modal from 'react-bootstrap/Modal';
import CropImage from '../../../../util/CropImage';
import { uploadCropImage } from '../../../../util/CropImage/util';

class ProfilePicForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      loadingMsg: 'Loading...',
      error: null,
      show: false,
      imageSrc: null,
    };
  }

  componentDidMount() {
    this.fetchProfilePic();
  }

  setShow = (val) => {
    this.setState({ show: val });
  }

  handleError = (e) => {
    console.error(e);
    this.setState({
      error: e.message,
      loadingMsg: null,
    });
  }

  fetchProfilePic = async () => {
    try {
      const image = await userProfilePicService.download();
      this.setState({
        image,
        loadingMsg: null,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  setUploadImage = (pic) => {
    this.setShow(false);
    uploadCropImage(pic, this.handleChange, 200);
  };

  handleSelectFile = (e) => {
    if(e.target.files[0] != null) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => { this.setState({imageSrc: reader.result}); };
      this.setShow(true);
    }
  }

  handleChange = async (pic) => {
    try {
      this.setState({
        loadingMsg: 'Uploading...',
      });
      await userProfilePicService.upload(pic);
      this.setState({
        image: URL.createObjectURL(pic),
        loadingMsg: null
      });
    } catch (e) {
      console.error(e);
      this.handleError(new Error('Upload failed, please try another image'));
    }
  };

  validate = () => {
    const { image } = this.state;
    if (image == null) {
      throw new Error('Please upload profile picture first');
    }
  };

  render() {
    const { image, loadingMsg, error, imageSrc, show } = this.state;
    return (
      <RightCard
        // title="Upload profile picture"
        next="Go to question 2"
        linkToNextPage={ROUTES.QUESTIONNAIRE_Q2}
        onRedirect={this.validate}
        save
        skip
        classes={style.card}
      >
        {loadingMsg && <div className="mx-auto">{loadingMsg}</div>}
        <ErrorDialog error={error} />
        {!loadingMsg && (
          <Form>
            <Form.Group onChange={this.handleSelectFile}>
              <Form.File id="profile-pic" />
            </Form.Group>
            <Image src={image} fluid style={{ width: '150px', maxHeight: '35vh', objectFit: 'cover' }} />
          </Form>
        )}
        <Modal show={show} onHide={() => this.setShow(false)} centered>
          <CropImage imgSrc={imageSrc} setUploadImage={this.setUploadImage} setShow={this.setShow} />
      </Modal>
      </RightCard>
    );
  }
}

export default ProfilePicForm;
