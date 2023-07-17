import React from 'react';
import PropTypes from 'prop-types';

import IntroSection from './Intro';
import VideosSection from './Videos';
import FlyersSection from './Flyers';
import WebinarsSection from './Webinars';
import BioSection from './Bio';
import ContactSection from './Contact';
import Wave from './Wave';

import Body from 'util/Body';
import personalizedWebsiteService from 'service/CSA/PersonalizedWebsiteService';
import styles from './style.module.scss';

const propTypes = {
  editable: PropTypes.bool,
  user_id: PropTypes.string,
};

class CSAWebsitePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      types: null,
      video: [],
      flyer: [],
      webinar: [],
      profile: {},
      others: { bio: {} },
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  handleError = (e) => {
    console.error(e);
    this.setState({ error: e.message });
  };

  fetchData = async () => {
    try {
      this.setState({
        loading: true,
        error: null,
      });

      if (this.state.types == null) {
        const types = await personalizedWebsiteService.listTypes();
        this.setState({ types });
      }

      const { user_id } = this.props;
      const [infos, others] = await Promise.all([
        personalizedWebsiteService.getInfos(user_id),
        personalizedWebsiteService.getOthers(user_id),
      ]);
      this.setState({
        ...infos,
        others,
      });
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleUpdateInfo = async (type, oldInfo, id) => {
    try {
      if (id == null) {
        if (oldInfo != null) {
          await personalizedWebsiteService.deleteInfoById(oldInfo.id);
        }
      } else {
        const newInfo = {
          ...oldInfo,
          object_id: id,
          type,
        };
        await personalizedWebsiteService.insertOrUpdateInfo(newInfo);
      }
      this.fetchData();
    } catch (e) {
      this.handleError(e);
    }
  };

  handleUpdateOthers = async (newInfo) => {
    try {
      const { others } = this.state;
      await personalizedWebsiteService.insertOrUpdateOther({
        id: others.id,
        bio: {
          ...others.bio,
          ...newInfo,
        },
      });
      this.fetchData();
    } catch (e) {
      this.handleError(e);
    }
  };

  render() {
    const { editable, user_id } = this.props;
    const { loading, error, video, flyer, webinar, types, others } = this.state;
    const bio = others.bio || {};
    const { introTitle, introContent, aboutTitle, aboutContent, contactPhone, contactEmail } = bio;
    return (
      <div className={styles.container}>
        <Body loading={loading} error={error}>
          <IntroSection
            editable={editable}
            title={introTitle}
            content={introContent}
            onUpdate={(title, content) => {
              this.handleUpdateOthers({ introTitle: title, introContent: content });
            }}
          />
          <VideosSection
            editable={editable}
            user_id={user_id}
            ids={video.map(({ object_id }) => object_id)}
            onUpdate={(index, id) => this.handleUpdateInfo(types.video, video[index], id)}
          />
          <Wave reverse />
          <FlyersSection
            editable={editable}
            user_id={user_id}
            ids={flyer.map(({ object_id }) => object_id)}
            onUpdate={(index, id) => this.handleUpdateInfo(types.flyer, flyer[index], id)}
          />
          <WebinarsSection
            editable={editable}
            user_id={user_id}
            ids={webinar.map(({ object_id }) => object_id)}
            onUpdate={(index, id) => this.handleUpdateInfo(types.webinar, webinar[index], id)}
          />
          <Wave />
          <BioSection
            editable={editable}
            user_id={user_id}
            title={aboutTitle}
            content={aboutContent}
            onUpdate={(title, content) => {
              this.handleUpdateOthers({ aboutTitle: title, aboutContent: content });
            }}
          />
          <Wave reverse grey />
          <ContactSection
            editable={editable}
            phone={contactPhone}
            email={contactEmail}
            onUpdate={(phone, email) => {
              this.handleUpdateOthers({ contactPhone: phone, contactEmail: email });
            }}
          />
          {/* <section className={styles.questions}>
            <header>
              <h5>FREQUENTLY ASKED QUESTIONS</h5>
            </header>
          </section> */}
        </Body>
      </div>
    );
  }
}

CSAWebsitePage.propTypes = propTypes;

export default CSAWebsitePage;
