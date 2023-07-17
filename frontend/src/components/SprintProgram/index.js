import React from 'react';
import { withRouter } from 'react-router-dom';
import MarketService from 'service/CSA/MarketService';
import Webinar from 'util/Webinar';
import { Footer } from '../Landing';

class SprintProgramPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceList: null,
    };
  }

  componentDidMount() {
    this.fetchResourceList();
  }

  fetchResourceList = async () => {
    let resourceList = await MarketService.listWebinars('sprint program');
    this.setState({ resourceList });
  };

  render() {
    const { resourceList } = this.state;
    const { authedAs } = this.props;
    return (
      <div className="landingPage">
        <div style={{ width: 'calc(100vw - 15px)', marginLeft: '15px' }}>
          {resourceList != null && <Webinar resourceList={resourceList} />}
        </div>
        {!authedAs.userType && <Footer />}
      </div>
    );
  }
}

export default withRouter(SprintProgramPage);
