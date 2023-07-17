import React from 'react';
import { withRouter } from 'react-router-dom';
import MarketService from 'service/CSA/MarketService';
import CSABodyContainer from '../../Container';
import Webinar from 'util/Webinar';

class WebinarSchedulePage extends React.Component {
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
    let resourceList = await MarketService.listWebinars('csa marketing');
    this.setState({ resourceList });
  };

  render() {
    const { resourceList } = this.state;
    return (
      <CSABodyContainer title="Webinar Schedule">
        {resourceList != null && <Webinar resourceList={resourceList} />}
      </CSABodyContainer>
    );
  }
}

export default withRouter(WebinarSchedulePage);
