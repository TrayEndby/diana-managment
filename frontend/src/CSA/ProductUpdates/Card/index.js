import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import moment from 'moment';
import Picture from 'util/Picture';
import * as CSA_ROUTES from 'constants/CSA/routes';

import style from '../style.module.scss';

const propTypes = {
  item: PropTypes.object.isRequired,
};

const ProductUpdatesCard = ({ className, item }) => {
  const { id, title, picture_id, updated_ts, description, source } = item;
  const localDate = moment.utc(updated_ts).local().format('MMMM DD, YYYY');
  return (
    <div className={cn('webinar', className)}>
      <div className={style.productItem}>
        <Picture id={picture_id} className={style.productImage} />
        <div style={{ minHeight: '200px', paddingTop: '16px' }}>
          <Link className={style.productTitle} to={`${CSA_ROUTES.PRODUCT_UPDATES_DETAIL}/${id}`}>
            {title}
          </Link>
          <h6 style={{ fontWeight: 'bolder', marginTop: '24px' }}>
            {localDate} | by {source}
          </h6>
          <h6 style={{ marginTop: '24px', display: 'inline' }}>
            {description.substr(0, 50)}
            {description}
          </h6>
        </div>
      </div>
      <div className={style.splitter}></div>
    </div>
  );
};

ProductUpdatesCard.propTypes = propTypes;

export default ProductUpdatesCard;
