import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss';

import Button from 'react-bootstrap/Button';

import Residency from './Residency';
import AwardType from './AwardType';
import QualifiedInstitutions from './QualifiedInstitutions';
import QualifiedStudy from './QualifiedStudy';

import AwardAmount from './AwardAmount';
import Form from 'react-bootstrap/Form';

import { withRouter } from 'react-router-dom';
import queries, { createQueryParemeter, parseSearch } from './queryConsts';
import SavedFiltersModal from './SavedFiltersModal';
import { StarFill, ArrowCounterclockwise } from 'react-bootstrap-icons';
import { STORAGE_FIN_AID_SEARCH, STORAGE_FIN_AID_SEARCH_SAVED } from '../../../constants/storageKeys';
import FinancialAidService from '../../../service/FinancialAidService';
import generalSearchStyle from '../../../util/GeneralSearchBar/style.module.scss';

const propTypes = {
  left: PropTypes.number.isRequired,
  onSearch: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

class FinAidSearchBoard extends Component {
  constructor(props) {
    super(props);

    let search = this.props.location.search;
    if (!search) {
      search = localStorage.getItem(STORAGE_FIN_AID_SEARCH);
      if (search) {
        this.props.history.push(this.props.location.pathname + search);
      }
    }

    const valuesUrl = parseSearch(this.props.location.search);

    this.state = {
      loading: false,
      finAidConstants: {
        award_amount: 0
      },
      isOpenedSavedSearches: false,
      valuesUrl: valuesUrl,
      searchCriteria: {
        search_name: '',
        residency: valuesUrl[queries.residency] || [],
        award_type: valuesUrl[queries.award_type] || [],
        qualified_institution: valuesUrl[queries.qualified_institution] || [],
        qualified_study: valuesUrl[queries.qualified_study] || [],
        award_amount: valuesUrl[queries.award_amount] || 0,
      }
    };
  }

  componentDidMount() {
    this.fetchSettings();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.location.search === prevProps.location.search) {
      return;
    }

    let search = this.props.location.search;
    const valuesUrl = parseSearch(search);
    let finAidConstantsResponse = await FinancialAidService.GetFinAidConstants();

    let initializedFinAidConstants = {};
    for (const property in finAidConstantsResponse) {
      initializedFinAidConstants[property] = this.initList(finAidConstantsResponse[property], queries[property], valuesUrl);
    }

    const newState = {
      ...this.state,
      finAidConstants: initializedFinAidConstants,
      valuesUrl,
      searchCriteria: {
        search_name: '',
        residency: valuesUrl[queries.residency] || [],
        award_type: valuesUrl[queries.award_type] || [],
        qualified_institution: valuesUrl[queries.qualified_institution] || [],
        qualified_study: valuesUrl[queries.qualified_study] || [],
        award_amount: valuesUrl[queries.award_amount] || 0,
      }
    }
    this.setState(newState);
  }

  fetchSettings = async () => {
    this.setState({ loading: true });
    await this.fetchFinAidConstants();
    this.setState({ loading: false });
  };

  fetchFinAidConstants = async () => {
    try {
      let finAidConstantsResponse = await FinancialAidService.GetFinAidConstants();
      let initializedFinAidConstants = {};

      for (const property in finAidConstantsResponse) {
        initializedFinAidConstants[property] = this.initList(finAidConstantsResponse[property], queries[property], this.state.valuesUrl);
      }

      this.setState({
        finAidConstants: initializedFinAidConstants
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  initList = (lists, queryPart, valuesUrl) => {
    if (!Array.isArray(lists)) return lists;
    return lists.map((str, index) => {
      const findIndex = valuesUrl[queryPart]?.find(x => x === index);

      if (findIndex !== undefined) {
        return { id: index, name: str, selected: true }
      } else {
        return { id: index, name: str, selected: false }
      }
    })
  };

  updateFiltrationURL = () => {
    const {
      state,
      props: { history, location },
    } = this;
    let url = location.pathname + '?';

    url += createQueryParemeter(queries.residency, state.searchCriteria.residency);
    url += createQueryParemeter(queries.award_type, state.searchCriteria.award_type);
    url += createQueryParemeter(queries.qualified_institution, state.searchCriteria.qualified_institution);
    url += createQueryParemeter(queries.qualified_study, state.searchCriteria.qualified_study);
    url += createQueryParemeter(queries.award_amount, state.searchCriteria.award_amount);

    localStorage.setItem(STORAGE_FIN_AID_SEARCH, url.slice(location.pathname.length));
    history.push(url);
  };

  handleError = (e) => {
    this.props.onError(e);
  };

  handleRangeChange = (info) => {
    const finAidConstants = {
      ...this.state.finAidConstants,
      ...info
    }
    const searchCriteria = {
      ...this.state.searchCriteria,
      ...info
    }
    this.setState({ ...this.state, ...{ finAidConstants }, ...{ searchCriteria } }, this.updateFiltrationURL);
  };

  handleCheckboxChange = (listName, id) => {
    const { finAidConstants } = this.state;
    const selectedProperty = finAidConstants[listName];

    selectedProperty.forEach((item) => {
      if (item.id === id) {
        item.selected = !item.selected;

        let searchCriteriaToAddOrRemove;
        if (item.selected) {
          searchCriteriaToAddOrRemove = {
            ...this.state.searchCriteria,
            [listName]: [...this.state.searchCriteria[listName], id]
          };
        } else {
          const filteredSearchCriteria = this.state.searchCriteria[listName].filter(item => item !== id)
          searchCriteriaToAddOrRemove = {
            ...this.state.searchCriteria,
            [listName]: filteredSearchCriteria
          };
        }

        this.setState({ ...this.state, ...{ searchCriteria: searchCriteriaToAddOrRemove } }, this.updateFiltrationURL);
      }
    })
  };

  clearAllFilters = () => {
    const { finAidConstants } = this.state;
    let normalizedFinAidConstants = {};
    for (const property in finAidConstants) {
      if (Array.isArray(finAidConstants[property])) {
        normalizedFinAidConstants[property] = finAidConstants[property].map(x => ({ ...x, selected: false }))
      } else {
        normalizedFinAidConstants[property] = 0;
      }
    }

    this.setState(
      {
        loading: false,
        finAidConstants: {
          ...normalizedFinAidConstants,
          award_amount: 0
        },
        isOpenedSavedSearches: false,
        valuesUrl: '',
        searchCriteria: {
          search_name: '',
          residency: [],
          award_type: [],
          qualified_institution: [],
          qualified_study: [],
          award_amount: 0,
        }
      },
      this.updateFiltrationURL
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onCloseSidebar(); // close sidebar on mobile
    const { searchCriteria } = this.state;
    const notEmptySearchCriteriaProp = Object.keys(searchCriteria).filter(item => searchCriteria[item].toString().length > 0);
    let preparedSearchCriteria = {};

    notEmptySearchCriteriaProp.forEach(prop => {
      preparedSearchCriteria = { ...preparedSearchCriteria, ...{ [prop]: searchCriteria[prop] } }
    })

    this.props.onSearch({ ...preparedSearchCriteria });
  };

  normalizeSubmitList = (lists) => {
    let res = [];
    lists.forEach((list) => {
      if (list.selected) {
        res.push(list.id);
      }
    });
    return res.length ? res : undefined;
  };

  searchNameChange = (name) => {
    this.setState({ searchCriteria: { ...this.state.searchCriteria, search_name: name } })
  }

  render() {
    let { loading } = this.state;
    let { left } = this.props;
    if (loading) {
      let style = {
        position: 'relative',
        left: left,
      };
      return <div style={style}>Loading...</div>;
    }
    const { residency, award_type, qualified_institution, qualified_study } = this.state.finAidConstants;
    const { award_amount } = this.state.searchCriteria;
    return (
      <Form className="h-100 d-flex flex-column" onSubmit={this.handleSubmit}>
        <div className={style.header}>
          <Button size="sm" onClick={this.handleSubmit}>
            Search
          </Button>
          <div className={style.filterManipulation}>
            <div title="Saved searches">
              <StarFill color="#ffcc33" onClick={() => this.setState({ isOpenedSavedSearches: true })} size="24px" />
            </div>
            <div title="Clear all filters" className={style.clearAll}>
              <ArrowCounterclockwise color="#dc3545" size="24px" onClick={this.clearAllFilters} />
            </div>
          </div>
        </div>
        <div className={style.content}>
          <Form.Control
            type="text"
            placeholder={"Search"}
            aria-label={"Search"}
            value={this.state.searchCriteria.search_name}
            onChange={(e) => this.searchNameChange(e.target.value)}
            className={generalSearchStyle.generalInput}
          />

          <Residency
            values={residency || []}
            onChange={(id) => this.handleCheckboxChange('residency', id)}
          />
          <AwardType
            values={award_type || []}
            onChange={(id) => this.handleCheckboxChange('award_type', id)}
          />
          <QualifiedInstitutions
            values={qualified_institution || []}
            onChange={(id) => this.handleCheckboxChange('qualified_institution', id)}
          />
          <QualifiedStudy
            values={qualified_study || []}
            onChange={(id) => this.handleCheckboxChange('qualified_study', id)}
          />
          <AwardAmount
            awardAmount={Number(award_amount || 0)}
            onChange={this.handleRangeChange}
          />

        </div>
        {this.state.isOpenedSavedSearches && (
          <SavedFiltersModal storageKey={STORAGE_FIN_AID_SEARCH_SAVED} onHide={() => this.setState({ isOpenedSavedSearches: false })} />
        )}
      </Form>
    );
  }
}

FinAidSearchBoard.propTypes = propTypes;

export default withRouter(FinAidSearchBoard);
