import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import ResourceList from '../List';

import ErrorDialog from '../../../util/ErrorDialog';
import SearchBar from '../../../util/SearchBar';
import resourceService, { Resource_Type } from '../../../service/ResourceService';
import * as ROUTES from '../../../constants/routes';

import style from './style.module.scss';

const propTypes = {
  type: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onListenPodcast: PropTypes.func,
};

class Search extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      loading: false,
      resources: [],
      total_results: 0,
      error: null,
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

  handleError = (e) => {
    console.error(e);
    this.setState({
      loading: false,
      error: e.message,
    });
  };

  search = async () => {
    try {
      this.setState({
        resources: [],
        loading: true,
        error: null,
      });

      const searchKey = this.getSearchKeyFromURL();
      const [resources, total_results] = await this.fetchData(searchKey);
      this.setState({
        resources,
        total_results,
        loading: false,
        error: null,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  fetchData = async (searchKey, from) => {
    const { type } = this.props;
    return searchKey ? resourceService.search(type, searchKey, from) : resourceService.list(type);
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

  getLoadMore = (searchKey) => {
    if (!searchKey) {
      return null;
    }

    return async () => {
      try {
        const from = this.state.resources.length;
        const [resources] = await this.fetchData(searchKey, from);
        const newResources = [...this.state.resources, ...resources];
        this.setState({
          resources: newResources,
          error: null,
        });
      } catch (e) {
        this.handleError(e);
      }
    };
  };

  render() {
    const { title, type, onListenPodcast } = this.props;
    const { error, loading, resources, total_results } = this.state;
    const searchKey = this.getSearchKeyFromURL();
    const isSearching = searchKey !== '';
    return (
      <div className="d-flex flex-column overflow-auto">
        <div className={style.topBar}>
          <SearchBar
            title={title}
            search={searchKey}
            searchURL={type === Resource_Type.Podcast ? ROUTES.RESOURCES_PODCASTS : ROUTES.RESOURCES_ARTICLES}
            className={style.searchBar}
            emptyToClear
          />
        </div>
        {!loading && isSearching && (
          <div className="text-center text-white mb-2">
            {!total_results ? 'No results found' : `${total_results} results found`}
          </div>
        )}
        <div className="App-grid-list-container">
          <ErrorDialog error={error} />
          {loading && <div className="text-center">{isSearching ? 'Searching...' : 'Loading...'}</div>}
          {!loading && resources.length > 0 && (
            <ResourceList
              type={type}
              resources={resources}
              totalResults={total_results}
              loadMore={this.getLoadMore(searchKey)}
              onListenPodcast={onListenPodcast}
            />
          )}
        </div>
      </div>
    );
  }
}

Search.propTypes = propTypes;

export default withRouter(Search);
