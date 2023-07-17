import React from 'react';
import { withRouter } from 'react-router-dom';
import CSABodyContainer from '../Container';
import ProductUpdatesCard from './Card';
import ErrorDialog from 'util/ErrorDialog';
import MarketService from 'service/CSA/MarketService';

import { Search as SearchIcon } from 'react-bootstrap-icons';
import style from './style.module.scss';

class ProductUpdatesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceList: [],
      query: '',
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchResourceList();
  }

  handleError(error) {
    this.setState({
      error: error.message,
      loading: false,
    });
  }

  fetchResourceList = async () => {
    try {
      this.setState({ loading: true });
      let resourceList = await MarketService.getProductUpdates();
      this.setState({ resourceList });
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { error, loading, resourceList } = this.state;
    return (
      <CSABodyContainer title="Product Updates">
        {error && <ErrorDialog error={error} />}
        {loading && <div className="text-center py-2">Loading...</div>}
        {!error && !loading && (
          <div className={style.productUpdatePage}>
            <div className={style.searchDiv}>
              <SearchIcon size="20px" />
              <input
                value={this.state.query}
                onChange={(e) => this.setState({ query: e.target.value })}
                placeholder="Search blog post"
                style={{ border: 'none', outline: 'none' }}
              />
            </div>
            {resourceList.map(
              (res, idx) => res.title.indexOf(this.state.query) !== -1 && <ProductUpdatesCard key={idx} item={res} />,
            )}
          </div>
        )}
      </CSABodyContainer>
    );
  }
}

export default withRouter(ProductUpdatesPage);
