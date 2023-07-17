import React from 'react';
import { withRouter } from 'react-router-dom';
import MarketService from 'service/CSA/MarketService';
import TrainingContainer from '../Container';
import Webinar from 'util/Webinar';
import style from './style.module.scss';
import ErrorDialog from 'util/ErrorDialog';

class WebinarSchedulePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceList: null,
      error: null,
      loading: true,
    };
  }

  handleError(error) {
    this.setState({
      error: error.message,
      loading: false,
    });
  }

  componentDidMount() {
    this.fetchResourceList();
  }

  fetchResourceList = async () => {
    try {
      let resourceList = await MarketService.listWebinars('csa training');
      this.setState({ resourceList });
    } catch (e) {
      this.handleError(e);
    }
  };

  render() {
    const { error, resourceList } = this.state;
    return (
      <TrainingContainer selectedTab={2}>
        {error && <ErrorDialog error={error}></ErrorDialog>}
        <div className={style.trainingWebinarPage}>
          {resourceList != null && <Webinar resourceList={resourceList} />}
        </div>
      </TrainingContainer>
    );
  }
}

export default withRouter(WebinarSchedulePage);
