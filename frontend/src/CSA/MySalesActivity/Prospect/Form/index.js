import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import SelectOptions from '../SelectOptions';

import Body from 'util/Body';
import DateInput from 'util/DateInput';
import StateListInput from 'util/StateListInput';
import CountryListInput, { DEFAULT_COUNTRY } from 'util/CountryListInput';
import PhoneInput from 'util/PhoneInput/old';

import prospectService from 'service/CSA/ProspectService';
import style from './style.module.scss';

const propTypes = {
  data: PropTypes.object,
  readonly: PropTypes.bool,
  onSubmit: PropTypes.func,
};

/**
 * XXX TODO: generalize country and state list
 * Q: which are required field
 */
class ProspectForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      error: null,
      data: {
        mailingCountry: DEFAULT_COUNTRY,
      },
      leadSourceList: [],
      motivationList: [],
      stageList: [],
      incomeLevelList: [],
      webinars: [],
      actions: [],
    };
  }

  async componentDidMount() {
    try {
      this.setState({
        loading: true,
      });
      const promises = [
        this.fetchStage(),
        this.fetchLeadSource(),
        this.fetchMotivation(),
        this.fetchIncomeLevel(),
      ];
      await Promise.all(promises);
      this.setState(this.deNormalizeData(this.props.data));
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  fetchStage = async () => {
    const stageList = await prospectService.listStage();
    this.setState({
      stageList,
    });
  };

  fetchLeadSource = async () => {
    const leadSourceList = await prospectService.listLeadSource();
    this.setState({
      leadSourceList,
    });
  };

  fetchMotivation = async () => {
    const motivationList = await prospectService.listMotivation();
    this.setState({
      motivationList,
    });
  };

  fetchIncomeLevel = async () => {
    const incomeLevelList = await prospectService.listIncomeLevel();
    this.setState({
      incomeLevelList,
    });
  };

  handleError = (error) => {
    console.error(error);
    this.setState({
      error: error.message,
    });
  };

  handleChange = (e) => {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    try {
      this.setState({ error: null });
      const data = this.normalizeData();
      await prospectService.update(data);
      this.props.onSubmit();
    } catch (e) {
      if (e && e.message.includes('Duplicate entry')) {
        this.handleError(new Error('Prospect with the same email already exists.'));
      } else {
        this.handleError(e);
      }
    }
  };

  normalizeData = () => {
    const { data, webinars, actions } = this.state;
    let { motivation, otherMotivation, nextSteps, webinarDate, webinarAcceptance, webinarAttendance } = data;
    if (motivation === 'Other') {
      motivation = `${motivation}:${otherMotivation}`;
    }
    const prospectActions = [...actions];
    prospectActions[0] = {
      ...actions[0],
      action: nextSteps,
    };
    let prospectWebinars = undefined;
    if (webinars.length && webinarDate != null) {
      prospectWebinars = [...webinars];
      prospectWebinars[0] = {
        ...webinars[0],
        webinar_id: 1,
        webinar_date: webinarDate + ' 11:00:00',
        acceptance: Number(webinarAcceptance),
        attendance: Number(webinarAttendance),
      };
    }
    const normalizedData = {
      ...data,
      motivation,
      prospectActions,
      prospectWebinars,
    };
    delete normalizedData.otherMotivation;
    delete normalizedData.nextSteps;
    delete normalizedData.webinarDate;
    delete normalizedData.webinarAcceptance;
    delete normalizedData.webinarAttendance;
    return normalizedData;
  };

  deNormalizeData = (data) => {
    if (!data) {
      return {
        data: {
          mailingCountry: DEFAULT_COUNTRY,
          starting_date: moment().format('YYYY-MM-DD'),
        },
      };
    }
    let { prospectActions, prospectWebinars, motivation } = data;
    let otherMotivation = null;
    if (motivation && motivation.startsWith('Other')) {
      [motivation, otherMotivation] = motivation.split(':');
    }
    const webinar = prospectWebinars ? prospectWebinars[0] || {} : {};
    const { webinar_date, acceptance, attendance } = webinar;
    return {
      data: {
        ...data,
        motivation,
        otherMotivation,
        nextSteps: prospectActions ? prospectActions[0].action : '',
        webinarDate: webinar_date ? webinar_date.split(' ')[0] : '',
        webinarAcceptance: acceptance ? '1' : '0',
        webinarAttendance: attendance ? '1' : '0',
      },
      webinars: prospectWebinars || [],
      actions: prospectActions || [],
    };
  };

  render() {
    const { readonly } = this.props;
    const { loading, error, data, leadSourceList, motivationList, stageList, incomeLevelList } = this.state;
    const {
      firstName,
      lastName,
      lead_source,
      email,
      phone,
      mailingAdd,
      mailingCity,
      mailingZip,
      mailingState,
      mailingCountry,
      income_level,
      num_of_children,
      starting_date,
      closing_date,
      estimated_amount,
      stage,
      motivation,
      otherMotivation,
      webinarDate, // ?
      webinarAcceptance, // ?
      webinarAttendance, // ?
      nextSteps, // ?
      additional,
    } = data;
    return (
      <Body loading={loading} error={error}>
        <Form className={style.form} onSubmit={this.handleSubmit}>
          <div className={style.top}>
            <section>
              <header>
                <h6>Basic information</h6>
              </header>
              <div>
                {/* first name, last name */}
                <Form.Row>
                  <Form.Group>
                    <Form.Label>First name*</Form.Label>
                    <Form.Control
                      required
                      disabled={readonly}
                      name="firstName"
                      value={firstName}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Last name*</Form.Label>
                    <Form.Control
                      required
                      disabled={readonly}
                      name="lastName"
                      value={lastName}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Form.Row>
                {/* email, contact number */}
                <Form.Row>
                  <Form.Group>
                    <Form.Label>Email address*</Form.Label>
                    <Form.Control
                      required
                      disabled={readonly}
                      name="email"
                      value={email}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <PhoneInput
                    label="Contact number"
                    disabled={readonly}
                    name="phone"
                    value={phone}
                    onChange={this.handleChange}
                  />
                </Form.Row>
                {/* address */}
                <Form.Group>
                  <Form.Label>Home address</Form.Label>
                  <Form.Control disabled={readonly} name="mailingAdd" value={mailingAdd} onChange={this.handleChange} />
                </Form.Group>
                {/* city zip code */}
                <Form.Row>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      disabled={readonly}
                      name="mailingCity"
                      value={mailingCity}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>ZIP code</Form.Label>
                    <Form.Control
                      disabled={readonly}
                      name="mailingZip"
                      value={mailingZip}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Form.Row>
                {/* state country */}
                <Form.Row>
                  <StateListInput
                    label="State/Province"
                    disabled={readonly}
                    name="mailingState"
                    value={mailingState}
                    onChange={this.handleChange}
                  />
                  <CountryListInput
                    disabled={readonly}
                    label="Country"
                    name="mailingCountry"
                    value={mailingCountry}
                    onChange={this.handleChange}
                  />
                </Form.Row>
                {/* income level, number of children */}
                <Form.Row>
                  <Form.Group>
                    <Form.Label>Income level</Form.Label>
                    <Form.Control
                      disabled={readonly}
                      as="select"
                      name="income_level"
                      value={income_level}
                      onChange={this.handleChange}
                    >
                      <SelectOptions list={incomeLevelList} placeholder="Choose income level" />
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Number of children</Form.Label>
                    <Form.Control
                      disabled={readonly}
                      type="number"
                      min={0}
                      step={1}
                      name="num_of_children"
                      value={num_of_children}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Form.Row>
                {/* lead source */}
                <Form.Row>
                  <Form.Group>
                    <Form.Label>Lead source</Form.Label>
                    <Form.Control
                      disabled={readonly}
                      as="select"
                      name="lead_source"
                      value={lead_source}
                      onChange={this.handleChange}
                    >
                      <SelectOptions list={leadSourceList} placeholder="Choose lead source" />
                    </Form.Control>
                  </Form.Group>
                </Form.Row>
              </div>
            </section>

            <section>
              <header>
                <h6>Prospect details</h6>
              </header>
              <div>
                {/* Start Date, closing date */}
                <Form.Row>
                  <Form.Group>
                    <Form.Label>Starting date</Form.Label>
                    <DateInput
                      required
                      disabled={readonly}
                      name="starting_date"
                      value={starting_date}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Closing date</Form.Label>
                    <DateInput
                      disabled={readonly}
                      name="closing_date"
                      value={closing_date}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Form.Row>
                {/* Estimated amount, Stage */}
                <Form.Row>
                  <Form.Group>
                    <Form.Label>Estimated amount</Form.Label>
                    <Form.Control
                      disabled={readonly}
                      type="number"
                      min={0}
                      step={1}
                      name="estimated_amount"
                      value={estimated_amount}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Stage</Form.Label>
                    <Form.Control
                      disabled={readonly}
                      as="select"
                      name="stage"
                      value={stage}
                      onChange={this.handleChange}
                    >
                      <SelectOptions list={stageList} placeholder="Choose stage" />
                    </Form.Control>
                  </Form.Group>
                </Form.Row>
                {/* Motivation */}
                <Form.Group>
                  <Form.Label>Motivation</Form.Label>
                  {motivationList.map(({ id, name }) => {
                    return (
                      <Form.Check
                        key={id}
                        className="mb-1"
                        type="radio"
                        disabled={readonly}
                        label={name}
                        value={name}
                        name="motivation"
                        checked={name === motivation}
                        onChange={this.handleChange}
                      />
                    );
                  })}
                  <Form.Control
                    disabled={motivation !== 'Other'}
                    name="otherMotivation"
                    value={otherMotivation || ''}
                    className={style.other}
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </div>
            </section>

            <section>
              <header>
                <h6>Upcoming webinar</h6>
              </header>
              <div>
                {/* Date of webinar Acceptance Attendance */}
                <Form.Row className={style.webinar}>
                  <Form.Group>
                    <Form.Label>Date of webinar</Form.Label>
                    <DateInput
                      disabled={readonly}
                      name="webinarDate"
                      value={webinarDate}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Acceptance</Form.Label>
                    <Form.Control
                      disabled={readonly}
                      as="select"
                      name="webinarAcceptance"
                      value={webinarAcceptance || '0'}
                      onChange={this.handleChange}
                    >
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Attendance</Form.Label>
                    <Form.Control
                      disabled={readonly}
                      as="select"
                      name="webinarAttendance"
                      value={webinarAttendance || '0'}
                      onChange={this.handleChange}
                    >
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </Form.Control>
                  </Form.Group>
                </Form.Row>
              </div>
            </section>

            <section>
              <header>
                <h6>Next steps</h6>
              </header>
              <div>
                <Form.Group>
                  <Form.Control
                    disabled={readonly}
                    as="textarea"
                    name="nextSteps"
                    value={nextSteps}
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </div>
            </section>

            <section>
              <header>
                <h6>Additional information</h6>
              </header>
              <div>
                <Form.Group>
                  <Form.Control
                    disabled={readonly}
                    as="textarea"
                    name="additional"
                    value={additional}
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </div>
            </section>
          </div>

          {!readonly && (
            <div className={style.bottom}>
              <Button type="submit">Save</Button>
            </div>
          )}
        </Form>
      </Body>
    );
  }
}

ProspectForm.propTypes = propTypes;

export default withRouter(ProspectForm);
