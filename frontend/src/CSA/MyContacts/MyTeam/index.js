import React from 'react';
import ContactsContainer from '../Container';
import TeamMemberList from './List';
import MyContactsService from 'service/CSA/MyContactsService';
import { Search as SearchIcon } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';

import style from './style.module.scss';

class MyTeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      teamMembers: [],
      filterList: [],
    };
    this.onMessage = this.props.onMessage;
  }

  componentDidMount() {
    this.fetchGetTeamMembers();
  }

  fetchGetTeamMembers = async () => {
    let teamMembers = null;
    await this.setState({ teamMembers });
    teamMembers = await MyContactsService.getTeamMembers();
    if (teamMembers == null) teamMembers = [];
    await this.setState({ teamMembers });
    this.filterTeamMembers('');
  };

  filterTeamMembers = async (searchValue) => {
    await this.setState({ searchValue });
    await this.setState({
      filterList: this.state.teamMembers.filter((member) => member.name.indexOf(this.state.searchValue) !== -1),
    });
  };

  render() {
    return (
      <ContactsContainer selectedTab={2} className={style.TeamMemberPage}>
        <div className={style.TeamMemberPage}>
          <div className={style.topBar}>
            <div className={style.searchBar}>
              <SearchIcon />
              <Form.Control
                required={false}
                type="text"
                placeholder="Search team member"
                value={this.state.searchValue}
                className={style.searchText}
                onChange={(e) => this.filterTeamMembers(e.target.value)}
              />
            </div>
          </div>
          {this.state.teamMembers == null ? (
            <div style={{ textAlign: 'center' }}>Loading...</div>
          ) : (
            <div className={style.content}>
              {this.state.filterList != null && <TeamMemberList teamMembers={this.state.filterList}></TeamMemberList>}
            </div>
          )}
        </div>
      </ContactsContainer>
    );
  }
}

export default MyTeamPage;
