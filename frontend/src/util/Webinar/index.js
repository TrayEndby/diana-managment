import React from 'react';
import { withRouter } from 'react-router-dom';
import WebinarsHeaderImage from 'assets/AllWebinars-header.png';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import cn from 'classnames';

import WebinarCard from './Card';
import * as ROUTES from 'constants/routes';
import * as CSA_ROUTES from 'constants/CSA/routes';
import style from './style.module.scss';

class Webinar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filterList: [], upcomingList: [], hasUpcoming: true };
  }

  componentDidMount() {
    this.handleUpcomingSelect(0);
  }

  handleUpcomingSelect = (type) => {
    const now = new Date();
    const { resourceList } = this.props;
    let filterList = [],
      upcomingList = [];
    this.setState({ hasUpcoming: false });
    resourceList.sort(
      (a, b) => new Date(b.startDateTime) - new Date(a.startDateTime),
    );
    resourceList.forEach((res) => {
      const startDate = new Date(res.startDateTime);
      const startDateCvt = moment.utc(startDate).local().toDate();
      if (parseInt(type) === 0) filterList.push(res);
      if (parseInt(type) === 1 && startDateCvt >= now) filterList.push(res);
      if (parseInt(type) === 2 && startDateCvt < now) filterList.push(res);
      if (startDateCvt >= now) {
        this.setState({ hasUpcoming: true });
        upcomingList.push(res);
      }
    });
    this.setState({ filterList, upcomingList });
  };

  handleClick = () => {
    const { upcomingList } = this.state;
    if (!upcomingList || upcomingList.length === 0) {
      return;
    }
    const { id, tags } = upcomingList[upcomingList.length - 1];
    let toURL = '';
    if (tags === 'csa event') {
      toURL = `${ROUTES.WEBINAR_DETAIL}/${id}`;
    } else if (tags === 'csa marketing') {
      toURL = `${CSA_ROUTES.MARKET_WEBINAR_DETAIL}/${id}`;
    } else if (tags === 'csa training') {
      toURL = `${CSA_ROUTES.TRAINING_WEBINARS_DETAIL}/${id}`;
    } else if (tags === 'sprint program') {
      toURL = `${ROUTES.SPRINT_DETAIL}/${id}`;
    } else if (tags === 'monthly counselling') {
      toURL = `${ROUTES.COUNSELING_DETAIL}/${id}`;
    }
    this.props.history.push(toURL);
  };

  render() {
    const { hasUpcoming, filterList, upcomingList } = this.state;
    return (
      <div className={cn('App-body', style.webinarPage)}>
        <div>
          <div className="hearImageDiv">
            <Image src={WebinarsHeaderImage} className={style.headerImage} />
          </div>
          {hasUpcoming && (
            <div>
              <div className={style.maskRectangle}></div>
              <div className={style.headerTextDiv}>
                {upcomingList.length !== 0 && (
                  <div className={style.headerText1}>
                    {upcomingList[upcomingList.length - 1].startDate}
                  </div>
                )}
                {upcomingList.length !== 0 && (
                  <div
                    className={style.headerText2}
                    style={
                      upcomingList[upcomingList.length - 1].title.length > 50
                        ? { lineHeight: '1.1' }
                        : { lineHeight: '1.5' }
                    }
                  >
                    {upcomingList[upcomingList.length - 1].title}
                  </div>
                )}
                <div>
                  <Button
                    className={style.RSVPButton}
                    onClick={this.handleClick}
                  >
                    RSVP
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div
            className={style.contentHeader}
            style={!hasUpcoming ? { marginTop: '0px' } : {}}
          >
            <Form.Control
              required
              as="select"
              className={style.formSelect}
              onChange={(e) => this.handleUpcomingSelect(e.target.value)}
            >
              <option value="0">All</option>
              <option value="1">Upcoming</option>
              <option value="2">Past</option>
            </Form.Control>
          </div>
        </div>
        <div className={style.contentDiv}>
          <div>
            {filterList.map((res, idx) => (
              <WebinarCard key={idx} item={res} noShare />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Webinar);
