import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import StarRating from '../index';

import styles from './style.module.scss';

const defaultState = {
  serviceId: 0,
  rating: 0,
  feedback: '',
};

const propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  save: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
}

const FeedbackModal = ({
  show,
  review_item,
  title,
  placeholder,
  services,
  handleClose,
  save,
}) => {
  const [data, setData] = useState(defaultState);

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSave();
  };

  const handleChange = (e, category) => {
    if (category === 'service') {
      setData({ ...data, serviceId: +e.target.value });
    }
    if (category === 'feedback') {
      setData({ ...data, feedback: e.target.value });
    }
  };

  const handleChangeRating = (newRating) => {
    setData({ ...data, rating: newRating });
  };

  const handleSave = () => {
    if (!services) {
      delete data.serviceId;
      data.review_item = review_item;
    }
    save(data);
    setData(defaultState);
    handleClose();
  };

  useEffect(() => {
    if (services) {
      setData((d) => {
        return {
          ...d,
          serviceId: services[0]?.id,
        };
      });
    }
  }, [services]);

  return (
    <Modal
      show={show}
      className={cn('App-modal')}
      size="lg"
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Write a feedback</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {services && (
            <div className={styles.row}>
              <Form.Control
                required
                as="select"
                value={data.service}
                onChange={(e) => handleChange(e, 'service')}
              >
                {services.map((service, key) => (
                  <option key={key} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Form.Control>
            </div>
          )}

          <div className={cn(styles.row, styles.rate)}>
            <h3>{title}</h3>
            <StarRating
              rating={data.rating}
              changeRating={handleChangeRating}
            />
          </div>

          <div className={styles.row}>
            <Form.Control
              as="textarea"
              required
              rows={5}
              value={data.feedback}
              onChange={(e) => handleChange(e, 'feedback')}
              placeholder={placeholder}
            ></Form.Control>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

FeedbackModal.propTypes = propTypes;

export default FeedbackModal;
