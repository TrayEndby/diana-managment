import React from 'react';
import ContactContainer from '../Container';
import CustomerList from './List';
import MyContactsService from 'service/CSA/MyContactsService';
import { Search as SearchIcon } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import style from './style.module.scss';

class MyCustomerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      customers: [],
      studentList: [],
      parentList: [],
    };
  }

  componentDidMount() {
    this.fetchGetCustomers();
  }

  fetchGetCustomers = async () => {
    let customers = null;
    await this.setState({ customers });
    customers = await MyContactsService.getCustomers();
    if (customers == null) customers = [];
    await this.setState({ customers });
    this.filterCustomers('');
  };

  filterCustomers = (searchValue) => {
    this.setState({ searchValue });
    const parentList = [];
    const studentList = [];
    if (this.state.customers == null) return;
    this.state.customers.forEach((cus) => {
      if (cus.name.indexOf(searchValue) === -1) return;
      if (cus.is_student) {
        const schoolInfo = cus.school_info;
        let graduate = '';
        if (schoolInfo.graduation_date != null) graduate = schoolInfo.graduation_date.substr(0, 4);
        let location = `${schoolInfo.city} ${schoolInfo.state} ${schoolInfo.zip}`;
        location = location.replace('undefined', '');
        let schoolName = '';
        if (schoolInfo.name != null) schoolName = schoolInfo.name;
        studentList.push({
          user_id: cus.user_id,
          name: cus.name,
          email: cus.email,
          school: schoolName,
          location: location,
          graduate: `Graduate at ${graduate}`,
        });
      } else {
        var childrenCount = 0;
        if (cus.num_of_children != null) childrenCount = cus.num_of_children;
        parentList.push({
          user_id: cus.user_id,
          name: cus.name,
          email: cus.email,
          phone: cus.phone,
          childrenCount: childrenCount,
          childrens: cus.children,
        });
      }
    });
    this.setState({ studentList, parentList });
  };

  render() {
    return (
      <ContactContainer selectedTab={1}>
        <div className={style.CustomerPage}>
          <div className={style.topBar}>
            <div className={style.searchBar}>
              <SearchIcon />
              <Form.Control
                required={false}
                type="text"
                placeholder="Search customer"
                value={this.state.searchValue}
                className={style.searchText}
                onChange={(e) => this.filterCustomers(e.target.value)}
              />
            </div>
          </div>
          {this.state.customers == null ? (
            <div style={{ textAlign: 'center' }}>Loading...</div>
          ) : (
              <div className={style.content}>
                {this.state.studentList != null && this.state.parentList != null && (
                  <CustomerList
                    students={this.state.studentList}
                    parents={this.state.parentList}
                  ></CustomerList>
                )}
              </div>
            )}
        </div>
      </ContactContainer>
    );
  }
}

export default MyCustomerPage;
