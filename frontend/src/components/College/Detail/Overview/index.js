import React from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import DetailLayout from '../Layout';
import AddressMap from 'util/AddressMap';

const propTypes = {
  college: PropTypes.object.isRequired,
};

const Overview = ({ college }) => {
  const { address, city, state, zip, imageLink, description, ranking, rankRangeLow, rankRangeHigh, website } = college;

  const location = `${address || ''} ${city || ''} ${state || ''} ${zip || ''}`;
  
  return (
    <DetailLayout title="Overview">
      {imageLink && (
        <div className="mx-auto">
          <img alt="college" src={imageLink}></img>
        </div>
      )}
      {description && <div className="px-2">{description}</div>}
      {(address || city || state || zip) && (
        <AddressMap location={location} className={'px-2'} />
      )}
      {website && (
        <div className="my-2 px-2">
          Website:{' '}
          <a href={`https://${website}`} target="_blank" rel="noopener noreferrer">
            {website}
          </a>
        </div>
      )}
      {(ranking || rankRangeLow || rankRangeHigh) && (
        <Row className="my-2 px-2">
          {ranking && <Col>Ranking: {ranking}</Col>}
          {rankRangeLow && <Col>Ranking Low range: {rankRangeLow}</Col>}
          {rankRangeHigh && <Col>Ranking High range: {rankRangeHigh}</Col>}
        </Row>
      )}
    </DetailLayout>
  );
};

Overview.propTypes = propTypes;

export default Overview;
