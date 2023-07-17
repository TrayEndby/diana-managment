import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Search as SearchIcon, CaretDownFill } from 'react-bootstrap-icons';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputRange from 'react-input-range';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import styles from '../style.module.scss';

const propTypes = {
  route: PropTypes.string,
};

const SearchBar = ({ route }) => {
  const history = useHistory();

  const selectiveness = ['Most Selective', 'Highly Selective', 'Selective'];
  const locations = ['East Coast', 'West Coast', 'Midwest', 'UK', 'Multi'];
  const subjects = ['stem', 'humanities', 'business', 'journalism', 'medicine', 'arts', 'multi'];
  const tags = ['Academics', 'Sports', 'Community Service', 'Personal Interests', 'Sprint Program']

  const [selStatus, setSelStatus] = useState([false, false, false]);
  const [locationStatus, setLocationStatus] = useState([false, false, false, false, false]);
  const [subStatus, setSubStatus] = useState([false, false, false, false, false, false, false]);
  const [tagStatus, setTagStatus] = useState([false, false, false, false, false]);
  const [searchKey, setSearchKey] = useState('');

  const [isSearchDialog, showSearchDialog] = useState(false);
  const [cost, changeCost] = useState(0);

  const handleSelective = (id, val) => {
    const newStatus = selStatus.map((x, ind) => (ind === id ? !x : x));
    setSelStatus(newStatus);
  };

  const handleLocation = (id, val) => {
    const newStatus = locationStatus.map((x, ind) => (ind === id ? !x : x));
    setLocationStatus(newStatus);
  };

  const handleSubjects = (id, val) => {
    const newStatus = subStatus.map((x, ind) => (ind === id ? !x : x));
    setSubStatus(newStatus);
  };

  const handleTags = (id, val) => {
    const newStatus = tagStatus.map((x, ind) => (ind === id ? !x : x));
    setTagStatus(newStatus);
  };

  const handleSearch = () => {
    const selArray = [];
    const locationArray = [];
    const subjectArray = [];
    const tagArray = [];
    selStatus.forEach((x, ind) => (x ? selArray.push(selectiveness[ind]) : true));
    locationStatus.forEach((x, ind) => (x ? locationArray.push(locations[ind]) : true));
    subStatus.forEach((x, ind) => (x ? subjectArray.push(subjects[ind]) : true));
    tagStatus.forEach((x, ind) => (x ? tagArray.push(tags[ind]) : true));
    const searchParam = `s=${selArray.join(',')};l=${locationArray.join(',')};q=${subjectArray.join(',')};t=${tagArray.join(',')};${searchKey}`;
    history.push({
      pathname: route,
      search: `?${searchParam}`,
    });
  };

  const handleEnterSearch = (value) => {
    if (value.keyCode === 13) {
      history.push({
        pathname: route,
        search: `?${searchKey}`,
      });
    }
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.searchBar}>
        <SearchIcon />
        <Form.Control
          required={false}
          type="text"
          placeholder="Search by name"
          value={searchKey}
          className={styles.searchText}
          onKeyUp={(e) => handleEnterSearch(e)}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <div className={styles.searchDiv} style={isSearchDialog ? { display: 'initial' } : { display: 'none' }}>
          <Row style={{ paddingLeft: '36px', paddingTop: '12px' }}>
            <Col xs={5}>
              <div>
                <p style={{ fontSize: '18px', color: '#f78154' }}>Selectiveness</p>
                <Form.Check type="checkbox" label="Most Selective" onChange={(val) => handleSelective(0, val)} />
                <Form.Check type="checkbox" label="Highly Selective" onChange={(val) => handleSelective(1, val)} />
                <Form.Check type="checkbox" label="Selective" onChange={(val) => handleSelective(2, val)} />
              </div>
            </Col>
            <Col xs={6}>
              <div>
                <p style={{ fontSize: '18px', color: '#f78154' }}>Location</p>
                <Row>
                  <Col>
                    <Form.Check type="checkbox" label="East Coast" onChange={(val) => handleLocation(0, val)} />
                    <Form.Check type="checkbox" label="West Coast" onChange={(val) => handleLocation(1, val)} />
                    <Form.Check type="checkbox" label="Midwest" onChange={(val) => handleLocation(2, val)} />
                  </Col>
                  <Col>
                    <Form.Check type="checkbox" label="UK" onChange={(val) => handleLocation(3, val)} />
                    <Form.Check type="checkbox" label="Multi" onChange={(val) => handleLocation(4, val)} />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <div className={styles.divider}></div>
          <div style={{ padding: '12px', paddingLeft: '36px', paddingRight: '36px' }}>
            <p style={{ fontSize: '18px', color: '#f78154', display: 'inline' }}>Cost: </p>
            <p style={{ display: 'inline' }}>&lt;= ${cost.toLocaleString()}</p>
            <InputRange
              minValue={0}
              maxValue={10000}
              value={cost}
              onChange={(value) => changeCost(value)}
              style={{ margin: '16px' }}
            />
          </div>
          <div className={styles.divider}></div>
          <div style={{ padding: '12px', paddingLeft: '36px', paddingRight: '36px' }}>
            <p style={{ fontSize: '18px', color: '#f78154' }}>Subject</p>
            <Row>
              <Col style={{ maxWidth: '24%' }}>
                <Form.Check type="checkbox" label="STEM" onChange={(val) => handleSubjects(0, val)} />
                <Form.Check type="checkbox" label="Medicine" onChange={(val) => handleSubjects(4, val)} />
              </Col>
              <Col style={{ maxWidth: '50%' }}>
                <Row>
                  <Col>
                    <Form.Check type="checkbox" label="Humanities" onChange={(val) => handleSubjects(1, val)} />
                  </Col>
                  <Col>
                    <Form.Check type="checkbox" label="Business" onChange={(val) => handleSubjects(2, val)} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      label="Arts, Design and Performance"
                      onChange={(val) => handleSubjects(5, val)}
                    />
                  </Col>
                </Row>
              </Col>
              <Col style={{ maxWidth: '26%' }}>
                <Form.Check type="checkbox" label="Journalism" onChange={(val) => handleSubjects(3, val)} />
                <Form.Check type="checkbox" label="Multi-Subject" onChange={(val) => handleSubjects(6, val)} />
              </Col>
            </Row>
          </div>
          <div className={styles.divider}></div>
          <div style={{ padding: '12px', paddingLeft: '36px', paddingRight: '36px' }}>
            <p style={{ fontSize: '18px', color: '#f78154' }}>Tag</p>
            <Row>
              <Col style={{ maxWidth: '35%' }}>
                <Form.Check type="checkbox" label="Academics" onChange={(val) => handleTags(0, val)} />
                <Form.Check type="checkbox" label="Personal Interests" onChange={(val) => handleTags(3, val)} />
              </Col>
              <Col style={{ maxWidth: '30%' }}>
                <Form.Check type="checkbox" label="Sports" onChange={(val) => handleTags(1, val)} />
                <Form.Check type="checkbox" label="Sprint Program" onChange={(val) => handleTags(4, val)} />
              </Col>
              <Col style={{ maxWidth: '35%' }}>
                <Form.Check
                  type="checkbox"
                  label="Community Service"
                  onChange={(val) => handleTags(2, val)}
                />
              </Col>
            </Row>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Button variant="primary" style={{ width: '150px', marginRight: '24px' }} onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.expandDiv} onClick={() => showSearchDialog(!isSearchDialog)}>
        <CaretDownFill className={styles.downCaret} />
      </div>
    </div>
  );
};

SearchBar.propTypes = propTypes;

export default SearchBar;
