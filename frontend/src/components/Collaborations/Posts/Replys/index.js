import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { utcToLocal } from '../../../../util/helpers';
import ProfileLink from '../../../../util/ProfileLink';

import style from './style.module.scss';

const propTypes = {
  replys: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
};

const Replys = ({ replys, onAdd }) => {
  const [input, setInput] = useState('');
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formRef.current.checkValidity()) {
      onAdd(input);
      setInput('');
    }
  };

  return (
    <div className={style.container}>
      {replys &&
        replys.map(({ id, creator_id, creator_name, text, updated_ts }) => (
          <Card key={id} className="rounded-0 mt-2">
            <Card.Header className="p-2">
              Reply by <ProfileLink id={creator_id} name={creator_name} /> on {utcToLocal(updated_ts)}
            </Card.Header>
            <Card.Text className="p-2">{text}</Card.Text>
          </Card>
        ))}
      <Form ref={formRef} className="mt-2" onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            required
            as="textarea"
            placeholder="Reply to post"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Form.Group>
        <div className="d-flex flex-row">
          <Button type="submit" className="ml-auto">
            Reply
          </Button>
        </div>
      </Form>
    </div>
  );
};

Replys.propTypes = propTypes;

export default React.memo(Replys);
