import React from 'react';
import { withRouter } from 'react-router-dom';

import SearchNavBar from './NavBar';
import CourseSearchResults from '../SearchResults';
import CoursePageLayout from '../Layout';

import courseService from '../../../service/CourseService';

class CourseSearchPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      courses: null, // use null as initial state
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
        courses = await courseService.search(searchKey);
      } else {
        courses = await courseService.recommend();
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
    const search = this.getSearchKeyFromURL();
    return (
      <CoursePageLayout search={search} className={search === '' ? 'App-grid-list-container' : null}>
        {error ? (
          <div className="text-white text-center p-4">{error}</div>
        ) : (
          <CourseSearchResults isSearching={isSearching} courses={courses} view={'grid'} />
        )}
      </CoursePageLayout>
    );
  }
}

export default withRouter(CourseSearchPage);

export { SearchNavBar };