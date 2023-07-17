import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import wave from 'assets/svg/wave-blue.svg';
import CountryListInput, { DEFAULT_COUNTRY } from 'util/CountryListInput';
import StateListInput from 'util/StateListInput';
import PhoneInput from 'util/PhoneInput';
import ErrorDialog from 'util/ErrorDialog';
import DateInput from 'util/DateInput';
import SSNInput from 'util/SSNInput';

import SelfDescribe from './SelfDescribe';

import authService from 'service/AuthService';
import profileService from 'service/CSA/ProfileService';

import * as ROUTES from 'constants/routes';
import * as CSA_ROUTES from 'constants/CSA/routes';

import style from './style.module.scss';

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      error: null,
      websiteAliasState: {},
      referralState: {},
      data: {
        firstName: '',
        lastName: '',
        email: '',
        SecondaryEmail: '',
        phone: '',
        mailingZip: '',
        mailingAdd: '',
        mailingCity: '',
        mailingState: '',
        mailingCountry: DEFAULT_COUNTRY,
        ssn: '',
        birthday: '',
        selfDescribe: '',
        personalWebsiteName: '',
        referralCode: '',
        terms: false,
      },
    };
  }

  componentDidMount() {
    this.fetchUserInfo();
  }

  fetchUserInfo() {
    const [firstName, lastName] = authService.getFirstAndLastName();
    const email = authService.getEmail();
    const phone = authService.getPhoneNumber();
    this.setState({
      data: {
        ...this.state.data,
        firstName,
        lastName,
        email,
        phone,
        personalWebsiteName: `${firstName}${lastName}`
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]/g, ''),
      },
    });
  }

  handleChange = (event) => {
    const target = event.target;
    const value =
      target.type === 'checkbox'
        ? target.checked
        : target.name === 'referralCode'
        ? target.value.toUpperCase()
        : target.value;
    const name = target.name;
    this.setState({
      data: {
        ...this.state.data,
        [name]: value,
      },
    });
  };

  handleSelfDescribeChange = (value) => {
    this.setState({
      data: {
        ...this.state.data,
        selfDescribe: value,
      },
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      this.setState({
        error: null,
        submitting: true,
      });
      const verifyWebsiteAlias = await this.verifyWebsiteAlias();
      const verifyReferralCode = await this.verifyReferralCode();
      if (verifyWebsiteAlias && verifyReferralCode) {
        await profileService.update({
          ...this.state.data,
          ssn: this.state.data.ssn.replace(/-/g, ''),
          terms: undefined,
        });
        await this.props.onSubmit();
        this.props.history.push(CSA_ROUTES.CONFIRMATION_PAGE);
      }
    } catch (e) {
      console.error(e);
      this.setState({
        error: e.message,
      });
    } finally {
      this.setState({
        submitting: false,
      });
    }
  };

  verifyWebsiteAlias = async () => {
    try {
      const alias = this.state.data.personalWebsiteName;
      if (/[^a-zA-Z0-9]/.test(alias)) {
        this.setState({
          websiteAliasState: {
            valid: false,
            message: 'This website alias can only include letters and numbers',
          },
        });
        return false;
      }
      const exist = await profileService.verifyWebsiteAlias(alias);
      if (!exist) {
        this.setState({
          websiteAliasState: {
            valid: true,
            message: `This website alias is available`,
          },
        });
        return true;
      } else {
        this.setState({
          websiteAliasState: {
            valid: false,
            message:
              'This website alias has already taken, please choose a different one',
          },
        });
        return false;
      }
    } catch (e) {
      console.error(e);
      this.setState({
        websiteAliasState: {
          valid: false,
          message: `Service error: ${e.message}`,
        },
      });
      return false;
    }
  };

  verifyReferralCode = async () => {
    try {
      const referralCode = this.state.data.referralCode;
      if (!referralCode) {
        return true; // skip the check
      }
      const res = await profileService.verifyReferralCode(referralCode);
      if (res) {
        this.setState({
          referralState: {
            valid: true,
            message: `Valid referral code, you are referred by ${res}`,
          },
        });
        return true;
      } else {
        this.setState({
          referralState: {
            valid: false,
            message: 'Invalid referral code',
          },
        });
        return false;
      }
    } catch (e) {
      console.error(e);
      this.setState({
        referralState: {
          valid: true,
          message: `Service error: ${e.message}`,
        },
      });
      return false;
    }
  };

  render() {
    const {
      submitting,
      error,
      data,
      websiteAliasState,
      referralState,
    } = this.state;
    const {
      firstName,
      lastName,
      email,
      SecondaryEmail,
      phone,
      mailingAdd,
      mailingCity,
      mailingZip,
      mailingState,
      mailingCountry,
      ssn,
      birthday,
      personalWebsiteName,
      referralCode,
      terms,
      selfDescribe,
    } = data;
    const countryCode = mailingCountry || DEFAULT_COUNTRY;

    return (
      <div className={style.csaForm}>
        <Container fluid className="d-flex flex-column">
          <div className={style.wave} aria-hidden="true">
            <object data={wave} type="image/svg+xml" aria-label="wave"></object>
          </div>
          <Container className={style.formContainer}>
            <Form className={style.form} onSubmit={this.handleSubmit}>
              <Form.Group className="mt-4">
                <h2 className="text-center">Personal information</h2>
                <Form.Label>First Name*</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={firstName}
                  required
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Last Name*</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={lastName || ''}
                  required
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email address*</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={email || ''}
                  readOnly
                  disabled
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Secondary email address</Form.Label>
                <Form.Control
                  type="text"
                  name="SecondaryEmail"
                  value={SecondaryEmail || ''}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <SelfDescribe
                label="How do you best describe yourself?"
                value={selfDescribe}
                onChange={this.handleSelfDescribeChange}
              />
              <h2 className="text-center">Home address</h2>
              <PhoneInput
                label="Phone*"
                required
                name="phone"
                value={phone || ''}
                onChange={this.handleChange}
              />
              <Form.Group>
                <Form.Label>Street Address*</Form.Label>
                <Form.Control
                  type="text"
                  name="mailingAdd"
                  value={mailingAdd || ''}
                  required
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>City*</Form.Label>
                <Form.Control
                  type="text"
                  name="mailingCity"
                  value={mailingCity || ''}
                  required
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>ZIP code*</Form.Label>
                <Form.Control
                  type="text"
                  name="mailingZip"
                  value={mailingZip || ''}
                  required
                  onChange={this.handleChange}
                />
              </Form.Group>
              <StateListInput
                required
                countryCode={countryCode}
                label="State/Province*"
                name="mailingState"
                value={mailingState}
                onChange={this.handleChange}
              />
              <CountryListInput
                required
                label="Country*"
                name="mailingCountry"
                value={countryCode}
                onChange={this.handleChange}
              />
              <h2 className="text-center">Tax information</h2>
              <p>
                Your Social Security Number (SSN) is required so Kyros.ai can
                report the proper tax information when you earn commissions.
                This information is encrypted utilizing the same SSL technology
                used to protect credit card information.
              </p>
              <div className="d-flex" style={{ marginTop: '50px' }}>
                <SSNInput
                  required
                  label={
                    countryCode === 'US'
                      ? 'Social Security Number*'
                      : 'National ID'
                  }
                  name="ssn"
                  value={ssn || ''}
                  isSSN={countryCode === 'US'}
                  onChange={this.handleChange}
                />
                <Form.Group style={{ marginLeft: '120px' }}>
                  <Form.Label>Birthday*</Form.Label>
                  <DateInput
                    required
                    controlId="user-profile-birthday"
                    name="birthday"
                    value={birthday || ''}
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </div>
              <h2 className="text-center">Personal website address</h2>
              <p>
                Please type a unique name for your Personal Website Address
                (PWA). Your customers will use your PWA when new events,
                webinars, renewal etc. are promoted, and this will ensure that
                you receive the associated commissions for these sales.
                Furthermore, this allows automatic association with new CSA that
                sign up using your PWA.{' '}
              </p>
              <p>
                Your website alias can be any combination of letters and numbers
                with a leading letter (e.g., your name, if it is not taken). The
                chosen alias is then added to csa/kyros.ai to generate your
                Personal Website Address, as follows: csa/kyros.ai/alias
              </p>
              <div className="d-flex align-items-center justify-content-between">
                <Form.Group style={{ width: '100%' }}>
                  <Form.Label>Unique website alias*</Form.Label>
                  <Form.Control
                    type="text"
                    name="personalWebsiteName"
                    value={personalWebsiteName || ''}
                    required
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  className={style.verify}
                  disabled={!personalWebsiteName}
                  onClick={this.verifyWebsiteAlias}
                >
                  Verify
                </Button>
              </div>
              {websiteAliasState.valid === true && (
                <div className={style.valid}>{websiteAliasState.message}</div>
              )}
              {websiteAliasState.valid === false && (
                <div className={style.invalid}>{websiteAliasState.message}</div>
              )}
              <h2 className="text-center">Referral information (optional)</h2>
              <p>
                If you have been referred by another CSA, please enter their
                code here. Otherwise, leave it empty{' '}
              </p>
              <div className="d-flex align-items-center justify-content-between">
                <Form.Group style={{ width: '100%' }}>
                  <Form.Label>Referral code</Form.Label>
                  <Form.Control
                    type="text"
                    name="referralCode"
                    value={referralCode || ''}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  className={style.verify}
                  disabled={!referralCode}
                  onClick={this.verifyReferralCode}
                >
                  Verify
                </Button>
              </div>
              {referralState != null && referralState.valid && (
                <div className={style.valid}>{referralState.message}</div>
              )}
              {referralState != null && !referralState.valid && (
                <div className={style.invalid}>{referralState.message}</div>
              )}
              <h2 className="text-center">Terms and conditions</h2>
              <Form.Group className="d-flex">
                <Form.Check
                  name="terms"
                  checked={terms || ''}
                  required
                  onChange={this.handleChange}
                />
                <Form.Label>
                  I have reviewed the{' '}
                  <Link to={CSA_ROUTES.AGREEMENT} target="_blank">
                    Kyros.ai CSA Agreement
                  </Link>{' '}
                  and by checking this box, I hereby agree to be bound by the
                  terms and conditions established by Kyros.ai Inc. with respect
                  to being an Kyros.ai CSA.
                </Form.Label>
              </Form.Group>
              <div className="text-center" style={{ marginTop: '60px' }}>
                <ErrorDialog error={error} />
                <Button disabled={submitting} variant="primary" type="submit">
                  Finish
                </Button>
              </div>
              <div className={style.empty}></div>
            </Form>
          </Container>
          <Container>
            <div className={style.wave1} aria-hidden="true">
              <object
                data={wave}
                type="image/svg+xml"
                aria-label="wave"
              ></object>
            </div>
          </Container>
        </Container>
        <div className="footer">
          <Container
            fluid
            className={classNames(
              'd-flex flex-row justify-content-end align-items-center',
              style.footer,
            )}
          >
            <div className="mr-4">
              <a
                href="mailto:info@kyros.ai"
                rel="noopener noreferrer"
                target="_blank"
              >
                <p className="text-white mt-0 mb-0">Contact Us</p>
              </a>
            </div>
            <div className="mr-4">
              <Link to={ROUTES.LEGAL_PRIVACY}>
                <p className="text-white mt-0 mb-0">Privacy Policy</p>
              </Link>
            </div>
            <div>
              <Link to={ROUTES.LEGAL_TERM}>
                <p className="text-white mr-4 mt-0 mb-0">Terms of Use</p>
              </Link>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

RegistrationForm.propTypes = propTypes;

export default withRouter(RegistrationForm);
