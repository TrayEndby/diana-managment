import React from 'react';
import { withRouter } from 'react-router-dom';
import WebinarDetail from 'util/Webinar/WebinarDetail';

class MonthlyCounselingDetailPage extends React.Component {
  render() {
    return <WebinarDetail detailId={this.props.match.params.id} />;
  }
}

export default withRouter(MonthlyCounselingDetailPage);
