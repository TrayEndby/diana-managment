import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import MarkDown from '../Markdown';
import Modal from 'react-bootstrap/Modal';
import cn from 'classnames';
import moment from 'moment';
import { STORAGE_SPRINT_REGISTRATION } from 'constants/storageKeys';
import MarketService from 'service/CSA/MarketService';
import AuthService from 'service/AuthService';

import CountryListInput, { DEFAULT_COUNTRY } from 'util/CountryListInput';
import * as ROUTES from 'constants/routes';
import * as CSA_ROUTES from 'constants/CSA/routes';
import WebinarsDetailHeaderImage from 'assets/SingleWebinar-header.png';
import { ReactComponent as CircleIcon } from 'assets/svg/Circles(Webinar).svg';

import style from './style.module.scss';

class WebinarDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailResource: {},
      calendarEvent: {},
      firstName: '',
      lastName: '',
      email: '',
      country: DEFAULT_COUNTRY,
      zipCode: '',
      phoneNumber: '',
      refCode: '',
      registerSuccess: false,
      registerDuplicate: false,
      registerError: false,
      describeValue: 1,
      otherDescribeText: '',
      isSprint: false,
      isVerifiedParentOrStudent: false,
    };

    this.refs = {
      wrapper: '',
    };
    this.sprintId = '';
    this.isSprint = false;
    this.describeTextList = ['student', 'parent', 'educator'];
  }

  componentDidMount() {
    this.fetchWebinarDetail();
    if (AuthService.isVerifiedParentOrStudent()) {
      this.isSprint = true;
      this.setState({ isVerifiedParentOrStudent: true });
    } else {
      this.isSprint = false;
      this.setState({ isVerifiedParentOrStudent: false });
    }
    this.sprintId = localStorage.getItem(STORAGE_SPRINT_REGISTRATION);
    localStorage.removeItem(STORAGE_SPRINT_REGISTRATION);
  }

  HideRegisterSuccessDialog = () => {
    this.setState({ registerSuccess: false });
  };

  HideRegisterDuplicateDialog = () => {
    this.setState({ registerDuplicate: false });
    this.setState({ registerError: false });
  };

  fetchWebinarDetail = async () => {
    const detailResource = await MarketService.getWebinarById(
      this.props.detailId,
      true,
    );
    this.setState({
      detailResource,
      calendarEvent: detailResource?.calendarEvent,
    });
    if (detailResource.tags === 'sprint program') {
      this.setState({ isSprint: true });
    } else {
      this.setState({ isSprint: false });
    }
  };

  handleSprintRegistrationStudent = () => {
    if (this.isSprint) {
      this.fetchAddInvitee();
    } else {
      localStorage.setItem(STORAGE_SPRINT_REGISTRATION, this.props.detailId);
      this.props.history.push(ROUTES.SIGN_IN);
    }
  };

  handleSprintRegistrationParent = () => {
    if (this.isSprint) {
      this.fetchAddInvitee();
    } else {
      localStorage.setItem(STORAGE_SPRINT_REGISTRATION, this.props.detailId);
      this.props.history.push(ROUTES.SIGN_IN_PARENT);
    }
  };

  fetchAddInvitee = async (e) => {
    if (e != null) e.preventDefault();
    const uId = AuthService.getUID();
    const {
      describeValue,
      otherDescribeText,
      calendarEvent,
      firstName,
      lastName,
      email,
      country,
      zipCode,
			phoneNumber,
      refCode,
      isSprint,
    } = this.state;
    let roleText;
    if (describeValue !== 4)
      roleText = this.describeTextList[describeValue - 1];
    else roleText = otherDescribeText;
    try {
      let addInfo = {
        id: calendarEvent.calendar_id,
        event: [
          {
            id: calendarEvent.id,
          },
        ],
      };
      if (isSprint) {
        const invitee = [
          {
            invitee_id: uId,
          },
        ];
        addInfo.event[0].invitee = invitee;
      } else {
        const registrant = [
          {
            email: email,
            first_name: firstName,
            last_name: lastName,
            country: country,
            zip_code: zipCode,
            phone: phoneNumber,
            csa_code: refCode,
            role: roleText,
          },
        ];
        addInfo.event[0].registrant = registrant;
      }
      const registerResult = await MarketService.addInvitee(addInfo, !isSprint);
      if (registerResult === 1) {
        this.setState({ registerSuccess: true });
        this.setState({ registerDuplicate: false });
        this.setState({ registerError: false });
      } else if (registerResult === 2) {
        this.setState({ registerDuplicate: true });
        this.setState({ registerSuccess: false });
        this.setState({ registerError: false });
      } else {
        this.setState({ registerError: true });
        this.setState({ registerSuccess: false });
        this.setState({ registerDuplicate: false });
      }
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      country,
      zipCode,
			phoneNumber,
      refCode,
      detailResource,
      registerSuccess,
      registerDuplicate,
      registerError,
      calendarEvent,
      describeValue,
      isVerifiedParentOrStudent,
      otherDescribeText,
    } = this.state;
    let {
      title,
      description,
      startDateTime,
      tags,
      duration,
      url,
      location,
      videoURL,
    } = detailResource;

    let timeZonePST = 'PST';
    let timeZoneEST = 'EST';
    const startdate = moment.utc(calendarEvent.start, 'YYYY-MM-DD hh:mm::ss');
    const enddate = moment.utc(calendarEvent.end, 'YYYY-MM-DD hh:mm::ss');
    let western_startdate = moment(startdate).tz('America/Los_Angeles');
    let western_enddate = moment(enddate).tz('America/Los_Angeles');
    if (western_startdate.isDST()) timeZonePST = 'PDT';
    let eastern_time = moment(startdate).tz('America/New_York');
    if (eastern_time.isDST()) timeZoneEST = 'EDT';
    eastern_time = eastern_time.format('h:mm A');
    const startdate_str = western_startdate.format('MMM Do');
    const startdate_str1 = western_startdate.format('MMM Do, YYYY');
    const enddate_str = western_enddate.format('MMM Do, YYYY');
    const time_str = western_startdate.format('h:mm A');
    const startDateString = `${startdate_str} - ${enddate_str} ${time_str} ${timeZonePST} | ${eastern_time} ${timeZoneEST}`;
    const startDateStringForNonSprint = `${startdate_str1} ${time_str} ${timeZonePST} | ${eastern_time} ${timeZoneEST}`;

    const now = new Date();
    const startDateCvt = moment.utc(startDateTime).toDate();

    let isUpcoming = true;
    if (startDateCvt >= now) isUpcoming = true;
    else isUpcoming = false;

    let backURL = '';
    if (tags === 'csa event') {
      backURL = ROUTES.WEBINAR;
    } else if (tags === 'csa marketing') {
      backURL = CSA_ROUTES.MARKET_WEBINAR;
    } else if (tags === 'csa training') {
      backURL = CSA_ROUTES.TRAINING_WEBINARS;
    } else if (tags === 'sprint program') {
      backURL = ROUTES.SPRINT;
    } else if (tags === 'monthly counselling') {
      backURL = ROUTES.COUNSELING;
    }

    if (videoURL != null) {
      videoURL = videoURL.split('\t');
    }

    return (
      <div className={cn('App-body', style.webinarPage)}>
        <div>
          <div>
            <Image
              src={WebinarsDetailHeaderImage}
              className={style.headerImage}
            />
          </div>
          <div className={style.headerTextDiv}>
            <div className={style.headerText1}>
              {this.props.type === 'sprint' && <span>{startDateString}</span>}
              {this.props.type !== 'sprint' && (
                <span>{startDateStringForNonSprint}</span>
              )}
              <br />
              {duration != null && this.props.type !== 'sprint' && (
                <span>Duration: {duration}</span>
              )}
              {this.props.type === 'sprint' && (
                <span>
                  Duration:{' '}
                  <p style={{ display: 'inline', fontStyle: 'italic' }}>
                    5 online workshops
                  </p>{' '}
                  every Saturday, 60 min each
                </span>
              )}
            </div>
            <div className={style.headerText2}>{calendarEvent?.name}</div>
            <a
              className={style.headerText3}
              target={'_blank'}
              href={url}
              rel="noopener noreferrer"
            >
              {location}
            </a>
          </div>
        </div>
        <div
          style={{
            width: 'calc(100vw - 8px)',
            marginLeft: '-16px',
            backgroundColor: 'white',
            marginTop: '72px',
          }}
        >
          <div style={{ marginTop: '54px', width: '94%', marginLeft: '3%' }}>
            {this.props.type !== 'sprint' && (
              <Link style={{ color: '#f78154' }} to={backURL}>
                &lt;&nbsp; All webinars
              </Link>
            )}
            {this.props.type === 'sprint' && (
              <Link style={{ color: '#f78154' }} to={backURL}>
                &lt;&nbsp; All programs
              </Link>
            )}
          </div>

          <div className={style.contentDiv}>
            <div className={style.introDiv}>
              <h5 style={{ fontWeight: 'bold' }}>{title}</h5>
              <div className="markdownDiv">
                <MarkDown source={description} />
              </div>
            </div>
            <div className={style.registerDiv}>
              {videoURL != null && (
                <div className="text-center mb-5">
                  <h5 style={{ color: '#f78154' }}>Watch the highlights</h5>
                  {videoURL.map((video, index) => (
                    <iframe
                      title="video"
                      key={index}
                      src={video}
                      allowFullScreen
                    ></iframe>
                  ))}
                </div>
              )}
              {this.props.type === 'sprint' && (
                <div
                  style={{
                    textAlign: 'center',
                    marginLeft: '30px',
                    marginRight: '30px',
                    marginTop: '5%',
                  }}
                >
                  {!isVerifiedParentOrStudent && (
                    <div
                      className="App-text-orange"
                      style={{ fontSize: '18px' }}
                    >
                      <span>This program is for Kyros</span>
                      <br />
                      <span>paying members only.</span>
                    </div>
                  )}
                  <div
                    style={{ width: '230px', marginLeft: 'calc(50% - 115px)' }}
                  >
                    <Button
                      variant="primary"
                      type="submit"
                      style={{
                        width: '230px',
                        marginTop: '32px',
                        marginBottom: '8px',
                      }}
                      onClick={() => this.handleSprintRegistrationStudent()}
                    >
                      Register Now (Student)
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      style={{
                        width: '230px',
                        marginTop: '32px',
                        marginBottom: '8px',
                      }}
                      onClick={() => this.handleSprintRegistrationParent()}
                    >
                      Register Now (Parent)
                    </Button>
                  </div>
                </div>
              )}
              {this.props.type !== 'sprint' && isUpcoming && (
                <div style={{ maxWidth: '300px', margin: 'auto' }}>
                  <h5 style={{ color: '#f78154' }}>Register Now</h5>
                  <Form
                    style={{ marginTop: '30px' }}
                    onSubmit={this.fetchAddInvitee}
                  >
                    <Form.Group>
                      <Form.Label className="text-right">First Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={firstName}
                        onChange={(e) =>
                          this.setState({ firstName: e.target.value })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="text-right">Last Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={lastName}
                        onChange={(e) =>
                          this.setState({ lastName: e.target.value })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="text-right">
                        Email Address
                      </Form.Label>
                      <Form.Control
                        required
                        type="email"
                        value={email}
                        onChange={(e) =>
                          this.setState({ email: e.target.value })
                        }
                      />
                    </Form.Group>
                    <CountryListInput
                      label="Country"
                      value={country}
                      onChange={(e) =>
                        this.setState({ country: e.target.value })
                      }
                    />
                    <Form.Group>
                      <Form.Label className="text-right">Zip Code</Form.Label>
                      <Form.Control
                        type="text"
                        value={zipCode}
                        onChange={(e) =>
                          this.setState({ zipCode: e.target.value })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="text-right">
                        Phone Number
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) =>
                          this.setState({ phoneNumber: e.target.value })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="text-right">
                        Reference Code (optional)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={refCode}
                        onChange={(e) =>
                          this.setState({ refCode: e.target.value })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        How do you best describe yourself?
                      </Form.Label>
                      <Form.Check
                        className="mx-2 my-2"
                        type="radio"
                        label="Student"
                        name="describeRadio"
                        id="dRadio1"
                        checked={describeValue === 1 ? true : false}
                        onClick={() => this.setState({ describeValue: 1 })}
                      />
                      <Form.Check
                        className="mx-2 my-2"
                        type="radio"
                        label="Parent"
                        name="describeRadio"
                        id="dRadio2"
                        checked={describeValue === 2 ? true : false}
                        onClick={() => this.setState({ describeValue: 2 })}
                      />
                      <Form.Check
                        className="mx-2 my-2"
                        type="radio"
                        label="Educator"
                        name="describeRadio"
                        id="dRadio3"
                        checked={describeValue === 3 ? true : false}
                        onClick={() => this.setState({ describeValue: 3 })}
                      />
                      <Form.Check
                        className="mx-2 my-2"
                        type="radio"
                        label="Other"
                        name="describeRadio"
                        id="dRadio4"
                        checked={describeValue === 4 ? true : false}
                        onClick={() => this.setState({ describeValue: 4 })}
                      />
                      <Form.Control
                        type="text"
                        size="sm"
                        style={{
                          marginLeft: '32px',
                          width: 'calc(100% - 32px)',
                        }}
                        value={otherDescribeText}
                        onChange={(e) =>
                          this.setState({ otherDescribeText: e.target.value })
                        }
                        disabled={describeValue === 4 ? false : true}
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      style={{ width: '100%', marginBottom: '50px' }}
                    >
                      Register
                    </Button>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </div>
        <Modal
          size="lg"
          centered
          show={registerSuccess}
          onHide={() => this.HideRegisterSuccessDialog()}
          refs={this.refs.wrapper}
        >
          <Modal.Header
            style={{ borderBottom: '0px' }}
            closeButton
          ></Modal.Header>
          <Modal.Body>
            <div className={style.circleDiv}>
              <CircleIcon
                style={{ position: 'absolute', left: '-90px', top: '-60px' }}
              />
            </div>
            <div className={style.RegisterSuccessModalDiv}>
              <h6
                style={{
                  fontStyle: 'italic',
                  color: '#53a548',
                  textAlign: 'center',
                  zIndex: 10,
                }}
              >
                RISE WITH KYROS
              </h6>
              <h3
                style={{
                  marginTop: '18px',
                  textAlign: 'center',
                  zIndex: 10,
                  fontWeight: 'bold',
                }}
              >
                THANK YOU FOR REGISTERING!
              </h3>
              <h5
                style={{
                  marginTop: '30px',
                  textAlign: 'center',
                  zIndex: 10,
                  fontSize: '16px',
                }}
              >
                You will receive a confirmation email with all the details, as
                well as reminder shortly before the webinar starts.
              </h5>
              <h6
                style={{
                  marginTop: '17px',
                  textAlign: 'center',
                  zIndex: 10,
                  color: '#53a548',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                Please make sure you check the Spam/Junk/Promotion folder and
                mark it as non-spam.
              </h6>
              {this.props.type === 'sprint' && (
                <Link className={style.WebinarButton} to={ROUTES.SPRINT}>
                  Go to all programs
                </Link>
              )}
              {this.props.type !== 'sprint' && (
                <Link className={style.WebinarButton} to={ROUTES.WEBINAR}>
                  Go to all webinars
                </Link>
              )}
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          size="lg"
          centered
          show={registerDuplicate || registerError}
          onHide={() => this.HideRegisterDuplicateDialog()}
          refs={this.refs.wrapper}
        >
          <Modal.Header
            style={{ borderBottom: '0px' }}
            closeButton
          ></Modal.Header>
          <Modal.Body>
            <div className={style.RegisterDuplicateModalDiv}>
              <div className={style.circleDiv}>
                <CircleIcon
                  style={{ position: 'absolute', left: '-105px', top: '-60px' }}
                />
              </div>
              <h4
                style={{
                  fontStyle: 'italic',
                  color: '#f78154',
                  textAlign: 'center',
                  zIndex: 10,
                }}
              >
                Kyros.ai
              </h4>
              <h3
                style={{ marginTop: '30px', textAlign: 'center', zIndex: 10 }}
              >
                {registerDuplicate && <p>ALREADY REGISTERED!!!</p>}
                {registerError && <p>REGISTRATION FAILED!!!</p>}
              </h3>
              <h6 style={{ marginTop: '30px', textAlign: 'center' }}>
                Please try registration with another email.
              </h6>
              <div
                className={style.WebinarButton}
                onClick={() => this.HideRegisterDuplicateDialog()}
              >
                OK
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default withRouter(WebinarDetailPage);
