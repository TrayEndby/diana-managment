import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Carousels from '../Carousels';
import EditModal from './EditModal';

import FlyerCard from 'CSA/Marketing/Flyer/Card';

import { getItemsFromIds } from '../Videos/util';
import Body from 'util/Body';
import useErrorHandler from 'util/hooks/useErrorHandler';
import markerService from 'service/CSA/MarketService';

import styles from '../style.module.scss';

const propTypes = {
  editable: PropTypes.bool,
  user_id: PropTypes.string,
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

const FlyersSection = ({ editable, user_id, ids, onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();
  const [flyers, setFlyers] = useState([]);
  const [flyerToEdit, setFlyerToEdit] = useState(null);

  useEffect(() => {
    markerService
      .listFlyers(user_id)
      .then((res) => {
        setFlyers(res);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [user_id, setError]);

  const handleEdit = (index) => {
    setFlyerToEdit(index);
  };

  const items = getItemsFromIds(ids, flyers).map((flyer) => flyer ? <FlyerCard flyer={flyer} noShare /> : null);

  const handleUpdate = (id) => {
    const index = Math.min(ids.length, flyerToEdit);
    onUpdate(index, id);
    setFlyerToEdit(null);
  };

  return (
    <section className={cn(styles.lister, styles.flyers)}>
      <Body loading={loading} error={error}>
        <header>
          <h5>FLYERS</h5>
        </header>
        <Carousels editable={editable} className={cn(styles.content, styles.white)} items={items} onEdit={handleEdit} />
        {flyerToEdit != null && (
          <EditModal
            flyers={flyers}
            id={ids[flyerToEdit] || null}
            onUpdate={handleUpdate}
            onClose={() => setFlyerToEdit(null)}
          />
        )}
      </Body>
    </section>
  );
};

FlyersSection.propTypes = propTypes;

export default React.memo(FlyersSection);
