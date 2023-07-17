import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import EssayList from '../List';
import ClustersList from '../Clusters';

import { normalizeWordCloud, getSearchKeyFromURL, getPublicEssayURL } from '../util';
import essayService from '../../../service/EssayService';

const propTypes = {};

class EssaySearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: true,
      view: 'grid',
      essays: null, // use null as initial state
      clusters: null,
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

  handleError(e) {
    console.error(e);
    this.setState({
      error: e.message,
    });
  }

  getSearchKey = () => {
    return getSearchKeyFromURL(this.props.location.search);
  }

  search = async () => {
    try {
      const searchKey = this.getSearchKey();
      this.setState({
        essays: [],
        isSearching: true,
        error: '',
      });
      let essays = null;
      let clusters = null;
      if (searchKey) {
        essays = await essayService.search(searchKey);
      } else {
        clusters = await essayService.getClusters();
        clusters = clusters.map((cluster) => {
          return {
            ...cluster,
            wordcloud: normalizeWordCloud(cluster.wordcloud, 50)
          }
        });
      }
      this.setState({
        essays,
        clusters,
        isSearching: false,
        view: searchKey ? 'list' : 'grid',
        selectedEssay: searchKey ? null : this.state.selectedEssay,
      });
    } catch (e) {
      console.error(e);
      this.setState({
        essays: [],
        isSearching: false,
        error: e.message,
      });
    }
  };

  handleSelectEssay = (essay) => {
    this.props.history.push(getPublicEssayURL(essay.id));
  };

  render() {
    const searchKey = this.getSearchKey();
    const { error, isSearching, view, essays, clusters } = this.state;
    return (
      <>
        {error && <div className="text-white text-center">{error}</div>}
        {!error && (
          <div className="d-flex flex-row h-100">
            <div className="col h-100 overflow-auto text-white pl-1">
              {searchKey === '' ? (
                <ClustersList loading={isSearching} clusters={clusters} />
              ) : (
                <EssaySearchResults
                  isSearching={isSearching}
                  view={view}
                  essays={essays}
                  onSelect={this.handleSelectEssay}
                />
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}

const EssaySearchResults = ({ isSearching, view, essays, onSelect }) => {
  if (isSearching) {
    return <div className="text-white text-center">Searching...</div>;
  } else if (!essays) {
    // search is not triggered yet
    return null;
  } else if (essays.length === 0) {
    return <div className="text-white text-center">No results found</div>;
  } else {
    return <EssayList essays={essays} view={view} onClick={onSelect} />;
  }
};

EssaySearchPage.propTypes = propTypes;

export default React.memo(withRouter(EssaySearchPage));
