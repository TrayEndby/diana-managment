import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';

import * as ROUTES from '../../../constants/routes';
import { STORAGE_USERPROFILE_PROGRESS, STORAGE_USERPROFILE_FINISHED } from '../../../constants/storageKeys';
import userProfileSearchService from '../../../service/UserProfileSearchService';
import storageService from '../../../service/StorageService';

import style from './style.module.scss';
import astronaut from "../../../assets/svg/Astronaut.svg"

class StartQuestionnaire extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      progressPath: null,
    };
  }

  componentDidMount() {
    this.fetchProgressPath();
  }

  fetchProgressPath = async () => {
    try {
      let progressPath = null;
      if (userProfileSearchService.getProfile() == null) {
        // when backend has no data
        storageService.delete(STORAGE_USERPROFILE_PROGRESS);
        storageService.delete(STORAGE_USERPROFILE_FINISHED);
      } else {
        let finished = await storageService.get(STORAGE_USERPROFILE_FINISHED);
        if (finished) {
          progressPath = ROUTES.MY_PROFILE;
        } else {
          progressPath = await storageService.get(STORAGE_USERPROFILE_PROGRESS);
        }
      }
      this.setState({
        loading: false,
        progressPath,
      });
    } catch (e) {
      console.error(e);
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const { loading, progressPath } = this.state;
    return (
      <div >
        <div style={{ position: "relative" }}><img src={astronaut} alt="astronaut" className={style.astronaut} /></div>
        <Jumbotron className={style.jumbotron}>
          <h2 className="text-white text-center">Welcome to Kyros.ai!</h2>
          <h1 className="text-white text-center mb-4 mt-4 get-to-know">Let's get to know each other better</h1>
          {loading && <div className="d-flex flex-row">Loading...</div>}
          {!loading && (
            <div className="d-flex flex-row justify-content-center">
              <Link
                to={ROUTES.QUESTIONNAIRE_Q1}
                className={classnames('', "mt-4", {
                  '': !progressPath,
                  'mr-1': progressPath,
                })}
              >
                <Button variant="primary">START</Button>
              </Link>

            </div>
          )
          }
        </Jumbotron>
      </div>
    );
  }
}

export default StartQuestionnaire;
