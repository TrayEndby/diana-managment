import React from 'react';
import { withRouter } from 'react-router-dom';
import TrainingContainer from '../../Container';
import WebinarDetail from 'util/Webinar/WebinarDetail';
import style from './style.module.scss';

class TrainingWebinarDetailPage extends React.Component {
  render() {
    return (
      <TrainingContainer selectedTab={2}>
        <div className={style.detailDiv}>
          <WebinarDetail detailId={this.props.match.params.id} />
        </div>
      </TrainingContainer>
    );
  }
}

export default withRouter(TrainingWebinarDetailPage);
