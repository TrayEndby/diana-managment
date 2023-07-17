import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { ChevronUp, ChevronDown } from 'react-bootstrap-icons';

const propTypes = {
  columnsToDisplay: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const ID = 'edit-college-column-modal';

const getSelectedData = (columns) => {
  let data = {};
  columns.forEach(({ key }) => {
    data[key] = true;
  });
  return data;
};

const useSelectColumn = (columns) => {
  const [data, setData] = useState(getSelectedData(columns));
  const toggleSelect = (key) => {
    let select = data[key] || false;
    setData({
      ...data,
      [key]: !select,
    });
  };
  return [data, toggleSelect];
};

const groupColumnsToDisplay = (columnsToDisplay) => {
  const noCategoryColumns = [];
  const categorys = [];
  const categoryColumnsMap = new Map();

  columnsToDisplay.forEach((column) => {
    const { category } = column;
    if (category) {
      let columns = categoryColumnsMap.get(category);
      if (columns) {
        columns.push(column);
      } else {
        // first time see the category
        categorys.push(category);
        columns = [column];
      }
      categoryColumnsMap.set(category, columns);
    } else {
      noCategoryColumns.push(column);
    }
  });
  return [noCategoryColumns, categorys, categoryColumnsMap];
};

const EditColumnModal = ({ columnsToDisplay, columns, onSubmit, onClose }) => {
  const [data, toggleSelect] = useSelectColumn(columns);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...data,
    });
  };
  return (
    <Modal show={true} onHide={onClose} size="lg" aria-labelledby={ID} centered>
      <Modal.Header closeButton>
        <Modal.Title id={ID}>Edit columns</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <SelectColumnForm columnsToDisplay={columnsToDisplay} data={data} onChange={toggleSelect} />
            </Col>
            <Col className="border-left">
              <SelectedColumns columnsToDisplay={columnsToDisplay} data={data} />
            </Col>
          </Row>
          <Button type="submit" className="float-right">
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const SelectColumnForm = ({ columnsToDisplay, data, onChange }) => {
  const [noCategoryColumns, categorys, categoryColumnsMap] = groupColumnsToDisplay(columnsToDisplay);
  return (
    <Form.Group
      style={{
        height: '250px',
        overflowY: 'auto',
      }}
    >
      {noCategoryColumns.map(({ key, text }) => (
        <Form.Check
          key={key}
          type="checkbox"
          label={text}
          checked={data[key] || false}
          onChange={() => onChange(key)}
        />
      ))}
      {categorys.map((category) => (
        <CategoryColumns
          key={category}
          category={category}
          columns={categoryColumnsMap.get(category)}
          data={data}
          onChange={onChange}
        />
      ))}
    </Form.Group>
  );
};

const CategoryColumns = ({ category, columns, data, onChange }) => {
  const [show, toggleShow] = useState(false);
  return (
    <div className="my-2">
      <div className="App-clickable d-flex flex-row align-items-center" onClick={() => toggleShow(!show)}>
        <span className="mr-1">{category}</span>
        {show ? <ChevronUp /> : <ChevronDown />}
      </div>
      {show &&
        columns.map(({ key, text }) => (
          <Form.Check
            key={key}
            type="checkbox"
            label={text}
            checked={data[key] || false}
            onChange={() => onChange(key)}
          />
        ))}
    </div>
  );
};

const SelectedColumns = ({ columnsToDisplay, data }) => {
  let columns = columnsToDisplay.filter(({ key }) => data[key]);
  return (
    <div>
      <h6>
        <b>Selected columns:</b>
      </h6>
      {columns.map(({ key, text }) => (
        <div key={key}>{text}</div>
      ))}
    </div>
  );
};

EditColumnModal.propTypes = propTypes;

export default EditColumnModal;
