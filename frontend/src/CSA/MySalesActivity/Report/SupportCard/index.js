import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

import Body from 'util/Body';
import SaveButton from 'util/SaveButton';
import useErrorHandler from 'util/hooks/useErrorHandler';
import customerService from 'service/CSA/CustomerService';
import styles from './style.module.scss';

const propTypes = {
  customer_id: PropTypes.string.isRequired,
};

const SupportCard = ({ customer_id }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useErrorHandler();
  const { support, feedback } = data;

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customerService.insertOrUpdateFeedbackAndSupportInfo({
        ...data,
        customer_id,
      });
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    customerService
      .getFeedbackAndSupportInfoByProfileId(customer_id)
      .then((res) => {
        setData(res);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [customer_id, setError]);

  return (
    <Form className={styles.form} onSubmit={handleSubmit}>
      <Body loading={loading} error={error}>
        <Form.Group>
          <header>
            <h6>Support issues</h6>
          </header>
          <Form.Control name="support" as="textarea" value={support || ''} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <header>
            <h6>Feedback</h6>
          </header>
          <Form.Control name="feedback" as="textarea" value={feedback || ''} onChange={handleChange} />
        </Form.Group>
        <SaveButton type="submit">Save</SaveButton>
      </Body>
    </Form>
  );
};

SupportCard.propTypes = propTypes;

export default SupportCard;
