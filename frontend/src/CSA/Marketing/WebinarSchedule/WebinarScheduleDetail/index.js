import React from 'react';
import { withRouter } from 'react-router-dom';
import CSABodyContainer from '../../../Container';
import WebinarDetail from 'util/Webinar/WebinarDetail';

class WebinarDetailPage extends React.Component {
  render() {
    return (
      <CSABodyContainer title="Webinar Schedule">
        <WebinarDetail detailId={this.props.match.params.id} />
      </CSABodyContainer>
    );
  }
}

export default withRouter(WebinarDetailPage);
