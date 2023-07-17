import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import General from './General';
import Location from './Location';
import Admissions from './Admissions';
import Academics from './Academics';
import Cost from './Cost';
import Sports from './Sports';
import GeneralSearchbar from '../../../util/GeneralSearchBar';

import collegeService from '../../../service/CollegeService';
import { withRouter } from 'react-router-dom';
import queries, { createQueryParemeter, parseSearch } from './queryConsts';
import SavedFiltersModal from './SavedFiltersModal';
import { StarFill, ArrowCounterclockwise } from 'react-bootstrap-icons';
import { STORAGE_COLLEGE_SEARCH, STORAGE_COLLEGE_SEARCH_SAVED } from '../../../constants/storageKeys';

const propTypes = {
  left: PropTypes.number.isRequired,
  sportsList: PropTypes.array.isRequired,
  onSearch: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

/**
 * XXX TODO:
 * Add a waiting state when searching and disable searching button
 * Check empty case before submit search
 */
class CollegeSearchBoard extends Component {
  constructor(props) {
    super(props);
    let search = this.props.location.search;
    if (!search) {
      search = localStorage.getItem(STORAGE_COLLEGE_SEARCH);
      if (search) {
        this.props.history.push(this.props.location.pathname + search);
      }
    }
    const valuesUrl = parseSearch(this.props.location.search);

    const testScores = {
      SATMath: valuesUrl[queries.general.satMath] || 500,
      SATReadingWriting: valuesUrl[queries.general.satReadingAndWriting] || 600,
      ACTCompose: valuesUrl[queries.general.actCompose] || 29,
      ACTMath: valuesUrl[queries.general.actMath] || 28,
      ACTEnglish: valuesUrl[queries.general.actEnglish] || 30,
    };

    const MenSports = {};
    const WomenSports = {};

    if (valuesUrl[queries.sportsTeams.menSports]) {
      for (const sportId of valuesUrl[queries.sportsTeams.menSports]) {
        MenSports[sportId] = true;
      }
    }

    if (valuesUrl[queries.sportsTeams.womenSports]) {
      for (const sportId of valuesUrl[queries.sportsTeams.womenSports]) {
        WomenSports[sportId] = true;
      }
    }

    this.state = {
      collegeTypes: [],
      campusSettings: null,
      MenSports, // for Sports section
      WomenSports, // for Sports section
      loading: false,
      isOpenedSavedSearches: false,
      data: {
        percentageAdmittedMin: valuesUrl[queries.chancing.minPercentage] || '',
        percentageAdmittedMax: valuesUrl[queries.chancing.maxPercentage] || '',
        evaluationSafety: valuesUrl[queries.chancing.safety] || false,
        evaluationTarget: valuesUrl[queries.chancing.target] || false,
        evaluationReach: valuesUrl[queries.chancing.reach] || false,
        inStateTuition: valuesUrl[queries.cost.inStateTuition] || null,
        outStateTuition: valuesUrl[queries.cost.outStateTuition] || null,
        testScores,
        major: valuesUrl[queries.academics.bestByMajor] || null,
      },
    };
  }

  componentDidMount() {
    this.fetchSettings();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search === prevProps.location.search) {
      return;
    }

    const valuesUrl = parseSearch(this.props.location.search);
    let collegeTypes = this.state.collegeTypes;
    const selectedTypes = parseSearch(this.props.location.search)[queries.general.collegeTypes];
    if (selectedTypes && collegeTypes) {
      collegeTypes = collegeTypes.map((type) => ({ ...type, selected: selectedTypes.includes(type.id) }));
    }

    let campusSettings = this.state.campusSettings;
    const selectedLocations = parseSearch(this.props.location.search)[queries.location.campus];
    if (selectedLocations && campusSettings) {
      campusSettings = campusSettings.map((type) => ({ ...type, selected: selectedLocations.includes(type.id) }));
    }

    const testScores = {
      SATMath: valuesUrl[queries.general.satMath],
      SATReadingWriting: valuesUrl[queries.general.satReadingAndWriting],
      ACTCompose: valuesUrl[queries.general.actCompose],
      ACTMath: valuesUrl[queries.general.actMath],
      ACTEnglish: valuesUrl[queries.general.actEnglish],
    };

    const MenSports = {};
    const WomenSports = {};

    if (valuesUrl[queries.sportsTeams.menSports]) {
      for (const sportId of valuesUrl[queries.sportsTeams.menSports]) {
        MenSports[sportId] = true;
      }
    }

    if (valuesUrl[queries.sportsTeams.womenSports]) {
      for (const sportId of valuesUrl[queries.sportsTeams.womenSports]) {
        WomenSports[sportId] = true;
      }
    }

    const newState = {
      collegeTypes,
      campusSettings,
      MenSports, // for Sports section
      WomenSports, // for Sports section
      data: {
        percentageAdmittedMin: valuesUrl[queries.chancing.minPercentage] || '',
        percentageAdmittedMax: valuesUrl[queries.chancing.maxPercentage] || '',
        evaluationSafety: valuesUrl[queries.chancing.safety] || false,
        evaluationTarget: valuesUrl[queries.chancing.target] || false,
        evaluationReach: valuesUrl[queries.chancing.reach] || false,
        inStateTuition: valuesUrl[queries.cost.inStateTuition] || null,
        outStateTuition: valuesUrl[queries.cost.outStateTuition] || null,
        testScores,
        major: valuesUrl[queries.academics.bestByMajor] || null,
      },
    };

    this.setState(newState);
  }

  fetchSettings = async () => {
    this.setState({ loading: true });
    let promise1 = this.fetchCampusSettings();
    let promise2 = this.fetchCollegeTypes();
    await Promise.all([promise1, promise2]);
    this.setState({ loading: false });
  };

  fetchCampusSettings = async () => {
    try {
      let campusSettingsRaw = await collegeService.listCampusSettings();
      let campusSettings = this.normalizeFetchedList(campusSettingsRaw);
      const selectedTypes = parseSearch(this.props.location.search)[queries.location.campus];
      if (selectedTypes) {
        campusSettings = campusSettings.map((type) =>
          selectedTypes.includes(type.id) ? { ...type, selected: true } : type,
        );
      }
      this.setState({
        campusSettings,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  fetchCollegeTypes = async () => {
    try {
      let collegeTypesRaw = await collegeService.listCollegeTypes();
      let collegeTypes = this.normalizeFetchedList(collegeTypesRaw);
      const selectedTypes = parseSearch(this.props.location.search)[queries.general.collegeTypes];
      if (selectedTypes) {
        collegeTypes = collegeTypes.map((type) =>
          selectedTypes.includes(type.id) ? { ...type, selected: true } : type,
        );
      }
      this.setState({
        collegeTypes,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  updateFiltrationURL = () => {
    const {
      state,
      props: { history, location },
    } = this;
    let url = location.pathname + '?';

    /**
     * General
     */
    url += createQueryParemeter(queries.general.satMath, state.data.testScores.SATMath);
    url += createQueryParemeter(queries.general.satReadingAndWriting, state.data.testScores.SATReadingWriting);
    url += createQueryParemeter(queries.general.actMath, state.data.testScores.ACTMath);
    url += createQueryParemeter(queries.general.actEnglish, state.data.testScores.ACTEnglish);
    url += createQueryParemeter(queries.general.actCompose, state.data.testScores.ACTCompose);

    const selectedTypes = state.collegeTypes.filter((type) => type.selected).map((type) => type.id);
    url += createQueryParemeter(queries.general.collegeTypes, selectedTypes);

    /**
     * Location
     */
    const selectedLocations = state.campusSettings.filter((type) => type.selected).map((type) => type.id);
    url += createQueryParemeter(queries.location.campus, selectedLocations);

    /**
     * Chancing
     */
    if (state.data.evaluationSafety) {
      url += createQueryParemeter(queries.chancing.safety, state.data.evaluationSafety);
    }

    if (state.data.evaluationTarget) {
      url += createQueryParemeter(queries.chancing.target, state.data.evaluationTarget);
    }

    if (state.data.evaluationReach) {
      url += createQueryParemeter(queries.chancing.reach, state.data.evaluationReach);
    }

    if (state.data.percentageAdmittedMin) {
      url += createQueryParemeter(queries.chancing.minPercentage, state.data.percentageAdmittedMin);
    }

    if (state.data.percentageAdmittedMax) {
      url += createQueryParemeter(queries.chancing.maxPercentage, state.data.percentageAdmittedMax);
    }

    /**
     * Academics
     */
    if (state.data.major) {
      url += createQueryParemeter(queries.academics.bestByMajor, state.data.major);
    }

    /**
     * Cost
     */
    if (state.data.inStateTuition) {
      url += createQueryParemeter(queries.cost.inStateTuition, state.data.inStateTuition);
    }

    if (state.data.outStateTuition) {
      url += createQueryParemeter(queries.cost.outStateTuition, state.data.outStateTuition);
    }

    /**
     * Sports
     */
    if (Object.keys(state.MenSports).length) {
      let sports = [];
      for (const key in state.MenSports) {
        if (state.MenSports[key]) {
          sports.push(key);
        }
      }
      url += createQueryParemeter(queries.sportsTeams.menSports, sports);
    }

    if (Object.keys(state.WomenSports).length) {
      let sports = [];
      for (const key in state.WomenSports) {
        if (state.WomenSports[key]) {
          sports.push(key);
        }
      }
      url += createQueryParemeter(queries.sportsTeams.womenSports, sports);
    }
    localStorage.setItem(STORAGE_COLLEGE_SEARCH, url.slice(location.pathname.length));
    history.push(url);
  };

  handleError = (e) => {
    this.props.onError(e);
  };

  handleChange = (event) => {
    let data = {
      ...this.state.data,
      [event.target.name]: event.target.value,
    };
    this.setState({ data }, this.updateFiltrationURL);
  };

  handleRangeChange = (info) => {
    let data = {
      ...this.state.data,
      ...info,
    };
    this.setState({ data }, this.updateFiltrationURL);
  };

  handleEvaluationChange = (event) => {
    let data = {
      ...this.state.data,
      [event.target.id]: event.target.checked,
    };
    this.setState({ data }, this.updateFiltrationURL);
  };

  handleCollegeTypeOrCampusSettingChange = (listName, id) => {
    let attributes = this.state[listName];
    // find the attribute and change state
    let attrToSelect = null;
    let numSelected = 0;
    for (let attr of attributes) {
      if (attr.id === id) {
        attrToSelect = attr;
      }
      if (attr.selected) {
        numSelected++;
      }
    }
    // if has more than 6 selected, cannot select more
    if (!attrToSelect.selected && numSelected >= 6) {
      return;
    }

    attrToSelect.selected = !attrToSelect.selected;
    this.setState(
      {
        [listName]: [...attributes],
      },
      this.updateFiltrationURL,
    );
  };

  handleTestScoreChange = (key, value) => {
    this.setState(
      {
        data: {
          ...this.state.data,
          testScores: {
            ...this.state.data.testScores,
            [key]: value,
          },
        },
      },
      this.updateFiltrationURL,
    );
  };

  handleMajorChange = (major) => {
    this.setState(
      {
        data: {
          ...this.state.data,
          major,
        },
      },
      this.updateFiltrationURL,
    );
  };

  handleSportsChange = (sportsCategory, sportId) => {
    const selected = this.state[sportsCategory][sportId] || false;
    this.setState(
      {
        [sportsCategory]: {
          ...this.state[sportsCategory],
          [sportId]: !selected,
        },
      },
      this.updateFiltrationURL,
    );
  };

  clearAllFilters = () => {
    this.setState(
      {
        collegeTypes: this.state.collegeTypes.map((i) => ({ ...i, selected: false })),
        campusSettings: this.state.campusSettings.map((i) => ({ ...i, selected: false })),
        MenSports: {}, // for Sports section
        WomenSports: {}, // for Sports section
        loading: false,
        data: {
          percentageAdmittedMin: '',
          percentageAdmittedMax: '',
          evaluationSafety: false,
          evaluationTarget: false,
          evaluationReach: false,
          inStateTuition: null,
          outStateTuition: null,
          testScores: {
            SATMath: 500,
            SATReadingWriting: 600,
            ACTCompose: 29,
            ACTMath: 28,
            ACTEnglish: 30,
          },
          major: null,
        },
      },
      this.updateFiltrationURL,
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onCloseSidebar(); // close sidebar on mobile
    let { campusSettings, collegeTypes, MenSports, WomenSports } = this.state;
    this.props.onSearch({
      campusSettings: this.normalizeSubmitList(campusSettings),
      collegeTypes: this.normalizeSubmitList(collegeTypes),
      msports: this.normalizeSportList(MenSports),
      wsports: this.normalizeSportList(WomenSports),
      ...this.state.data,
    });
  };

  normalizeFetchedList = (lists) => {
    return lists.map((list) => {
      return {
        ...list,
        selected: false,
      };
    });
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

  normalizeSportList = (sportsSelectedSet) => {
    const ids = [];
    for (let id in sportsSelectedSet) {
      if (sportsSelectedSet[id] === true) {
        ids.push(Number(id));
      }
    }
    return ids.length ? ids : undefined;
  };

  render() {
    let { loading, campusSettings, collegeTypes, MenSports, WomenSports } = this.state;
    let { left, sportsList } = this.props;
    if (loading || !campusSettings || !collegeTypes.length) {
      let style = {
        position: 'relative',
        left: left,
      };
      return <div style={style}>Loading...</div>;
    }
    let { data } = this.state;
    let { testScores, inStateTuition, outStateTuition } = data;
    return (
      <Form className="h-100 d-flex flex-column" onSubmit={this.handleSubmit}>
        <div className={style.header}>
          <Button size="sm" onClick={this.handleSubmit}>
            Find college
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
        <div style={{ overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#152332' }}>
          <GeneralSearchbar title="Search by name" alwaysActive={true} collegeSearch={true} />
          <General
            testScores={testScores}
            onTestScoreChange={(key, value) => this.handleTestScoreChange(key, value)}
            collegeTypes={collegeTypes}
            onCollegeTypeChange={(id) => this.handleCollegeTypeOrCampusSettingChange('collegeTypes', id)}
          />
          <Location
            campusSettings={campusSettings}
            onCampusSettingsChange={(id) => this.handleCollegeTypeOrCampusSettingChange('campusSettings', id)}
          />
          <Admissions
            safety={this.state.data.evaluationSafety}
            target={this.state.data.evaluationTarget}
            reach={this.state.data.evaluationReach}
            min={this.state.data.percentageAdmittedMin}
            max={this.state.data.percentageAdmittedMax}
            onEvaluationChange={this.handleEvaluationChange}
            onAdmittedPercentageChange={this.handleChange}
          />
          <Academics selectedMajor={this.state.data.major} onMajorChange={this.handleMajorChange} />
          <Cost
            inStateTuition={Number(inStateTuition || 0)}
            outStateTuition={Number(outStateTuition || 0)}
            onChange={this.handleRangeChange}
          />
          <Sports
            sportsList={sportsList}
            MenSports={MenSports}
            WomenSports={WomenSports}
            onChange={this.handleSportsChange}
          />
        </div>
        {this.state.isOpenedSavedSearches && (
          <SavedFiltersModal storageKey={STORAGE_COLLEGE_SEARCH_SAVED} onHide={() => this.setState({ isOpenedSavedSearches: false })} />
        )}
      </Form>
    );
  }
}

CollegeSearchBoard.propTypes = propTypes;

export default withRouter(CollegeSearchBoard);
