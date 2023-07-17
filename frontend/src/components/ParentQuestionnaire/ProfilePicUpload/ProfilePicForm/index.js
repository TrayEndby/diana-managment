import React from 'react';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import { RightCard } from '../../../Questionnaire/Layout';

import * as ROUTES from '../../../../constants/routes';
import ErrorDialog from '../../../../util/ErrorDialog';
import userProfilePicService from '../../../../service/UserProfilePicService';
import style from './style.module.scss';

class ProfilePicForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      loadingMsg: 'Loading...',
      error: null,
    };
  }

  componentDidMount() {
    this.fetchProfilePic();
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

  handleChange = async (event) => {
    try {
      this.setState({
        loadingMsg: 'Uploading...',
      });
      const pic = event.target.files[0];
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
    const { image, loadingMsg, error } = this.state;
    return (
      <RightCard
        // title="Upload profile picture"
        next="Go to question 4"
        linkToNextPage={ROUTES.PARENT_QUESTIONNAIRE_Q4}
        onRedirect={this.validate}
        save
        skip
        classes={style.card}
      >
        {loadingMsg && <div className="mx-auto">{loadingMsg}</div>}
        <ErrorDialog error={error} />
        {!loadingMsg && (
          <Form>
            <Form.Group onChange={this.handleChange}>
              <Form.File id="profile-pic" />
            </Form.Group>
            <Image src={image} fluid className={style.preview} />
          </Form>
        )}
      </RightCard>
    );
  }
}

export default ProfilePicForm;
