import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Carousels from '../Carousels';
import EditModal from './EditModal';

import WebinarCard from 'util/Webinar/Card';

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

const WebinarsSection = ({ editable, user_id, ids, onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();
  const [webinars, setWebinars] = useState([]);
  const [webinarToEdit, setWebinarToEdit] = useState(null);

  useEffect(() => {
    markerService
      .listWebinars(undefined, user_id)
      .then((res) => {
        setWebinars(res);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [user_id, setError]);

  const handleEdit = (index) => {
    setWebinarToEdit(index);
  };

  const items = getItemsFromIds(ids, webinars).map((webinar) => webinar ? <WebinarCard item={webinar} noShare size="sm" /> : null);

  const handleUpdate = (id) => {
    const index = Math.min(ids.length, webinarToEdit);
    onUpdate(index, id);
    setWebinarToEdit(null);
  };

  return (
    <section className={cn(styles.lister, styles.webinars)}>
      <Body loading={loading} error={error}>
        <header>
          <h5>UPCOMING WEBINARS</h5>
        </header>
        <Carousels editable={editable} className={cn(styles.content, styles.white)} items={items} onEdit={handleEdit} />
        {webinarToEdit != null && (
          <EditModal
            items={webinars}
            id={ids[webinarToEdit] || null}
            onUpdate={handleUpdate}
            onClose={() => setWebinarToEdit(null)}
          />
        )}
      </Body>
    </section>
  );
};

WebinarsSection.propTypes = propTypes;

export default React.memo(WebinarsSection);
