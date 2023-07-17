import React from 'react';
import { withRouter } from 'react-router-dom';

import Layout from '../Layout';
import CourseSearchResults from '../../Course/SearchResults';

import testPrepService from '../../../service/TestPrepService';

class TestSearchPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      courses: null, // use null as initial state
      view: null, // show course as list view or grid view
      error: '',
    };
  }

  componentDidMount() {
    this.search();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.search();
    }
  }

  search = async () => {
    try {
      this.setState({
        courses: [],
        isSearching: true,
        error: '',
      });

      let searchKey = this.getSearchKeyFromURL();
      let courses = [];
      if (searchKey) {
        courses = await testPrepService.search(searchKey);
      }

      this.setState({
        courses,
        isSearching: false,
        error: '',
      });
    } catch (e) {
      this.setState({
        courses: [],
        isSearching: false,
        error: e.message,
      });
    }
  };

  getSearchKeyFromURL = () => {
    let searchKey = '';
    try {
      if (this.props.location.search) {
        searchKey = new URLSearchParams(this.props.location.search).get('query');
      }
    } catch (e) {
      console.error(e);
    }
    return searchKey;
  };

  render() {
    const { error, isSearching, courses } = this.state;
    if (error) {
      return <div className="text-danger text-center">{error}</div>;
    }
    return (
      <Layout search={this.getSearchKeyFromURL()}>
        <CourseSearchResults isSearching={isSearching} courses={courses} view={'grid'} />
      </Layout>
    );
  }
}

export default withRouter(TestSearchPage);
