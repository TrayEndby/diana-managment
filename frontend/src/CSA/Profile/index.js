import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import BasicView from './BasicSection';
import AccountsView from './AccountSection';
import InformationView from './InformationSection';
import DetailView from './DetailSection';
import CSABodyContainer from 'CSA/Container';
import ErrorDialog from 'util/ErrorDialog';
import style from './style.module.scss';

import ProfileService from 'service/CSA/ProfileService';

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null,
      detail: null,
      upline: null,
      accountNameList: [],
      accountIdList: [],
      error: null,
    };
  }

  fetchGetProfile = async () => {
    const accountType = [
      'Facebook',
      'Twitter',
      'Instagram',
      'Linkedin',
      'Gmail',
    ];

    let profileInfo = await ProfileService.getProfile();
    profileInfo = profileInfo || {};

    let uplineInfo = await ProfileService.getUplineInfo();
    this.setState({ upline: uplineInfo });

    let accountInfo = await ProfileService.getLinkedAccount();
    accountInfo = accountInfo?.linkedAccounts || [];

    this.setState({ detail: profileInfo.basic });
    this.setState({ account: accountInfo });

    let accountNames = Array(5).fill('');
    let accountIds = Array(5).fill(0);

    accountInfo.forEach((info) => {
      const idx = accountType.indexOf(info.account);
      accountNames[idx] = info.url;
      accountIds[idx] = info.id;
    });

    this.setState({ accountNameList: accountNames });
    this.setState({ accountIdList: accountIds });
  };

  componentDidMount() {
    this.fetchGetProfile();
  }

  updateAccountName = (accountNames) => {
    this.setState({ accountNameList: accountNames });
  };

  saveAccount = async (detail) => {
    this.setState({ detail });
    const accountType = [
      'Facebook',
      'Twitter',
      'Instagram',
      'Linkedin',
      'Gmail',
    ];
    let addingInfo = [];
    let editingInfo = [];
    let deletingInfo = [];

    this.state.accountNameList.forEach((name, index) => {
      if (name === '' && this.state.accountIdList[index] !== 0) {
        // delete account
        deletingInfo.push({
          id: this.state.accountIdList[index],
        });
      }
      if (name !== '' && this.state.accountIdList[index] === 0) {
        // create account
        addingInfo.push({
          account: accountType[index],
          url: name,
        });
      }
      if (name !== '' && this.state.accountIdList[index] !== 0) {
        //update account
        editingInfo.push({
          id: this.state.accountIdList[index],
          account: accountType[index],
          url: name,
        });
      }
    });
    try {
      if (addingInfo.length !== 0) {
        await ProfileService.insertLinkedAccount(addingInfo);
      }
      if (editingInfo.length !== 0) {
        await ProfileService.updateLinkedAccount(editingInfo);
      }
      if (deletingInfo.length !== 0) {
        await ProfileService.deleteLinkedAccount(deletingInfo);
      }
      await ProfileService.update(detail);
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { unverified } = this.props;
    return (
      <CSABodyContainer title="My Profile" className={style.csaProfile}>
        {unverified && (
          <Alert variant="warning" className="my-2 mx-auto">
            Your registration as Kyros CSA is under verification, now you can
            access the profile page.
          </Alert>
        )}
        {this.state.error && <ErrorDialog error={this.state.error} />}
        <Container className={style.container} fluid="sm">
          <Row>
            <Col sm={4} style={{ alignSelf: 'center', paddingRight: '5px' }}>
              <Row sm>
                <Col>
                  {this.state.detail != null && (
                    <BasicView
                      data={this.state.detail || {}}
                      unverified={unverified}
                    />
                  )}
                </Col>
              </Row>
              <Row sm>
                <Col>
                  {this.state.upline != null && (
                    <InformationView data={this.state.upline} />
                  )}
                </Col>
              </Row>
              <Row sm>
                <Col>
                  {this.state.account != null && (
                    <AccountsView
                      data={this.state.account}
                      updateAccountName={this.updateAccountName}
                    />
                  )}
                </Col>
              </Row>
            </Col>
            <Col sm={8} className={style.detailView}>
              {this.state.detail != null && (
                <DetailView
                  basicData={this.state.detail || {}}
                  saveAccount={this.saveAccount}
                />
              )}
            </Col>
          </Row>
        </Container>
      </CSABodyContainer>
    );
  }
}

export default ProfilePage;
