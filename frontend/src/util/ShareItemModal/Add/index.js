import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';

import contactService from '../../../service/ContactService';

const propTypes = {
  placeholder: PropTypes.string,
  adding: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
};

const AddUser = ({ placeholder, adding, onAdd }) => {
  const [val, setVal] = useState('');
  const [userId, setUserId] = useState(null);
  const [contactList, setContactList] = useState([]);
  const handleChange = (e) => setVal(e.target.value);
  const handleSelect = (userId, name) => {
    setVal(name);
    setUserId(userId);
  };
  const handleAdd = () => {
    onAdd(val, userId);
    setVal('');
  };

  useEffect(() => {
    contactService.listContact().then(setContactList);
  }, []);

  return (
    <div className="d-flex flex-row align-items-center">
      <Col sm="11" className="pl-0">
        <Dropdown>
          <Dropdown.Toggle as="div" id="contact-list-dropdown">
            <input
              className="w-100 px-2"
              placeholder={placeholder}
              value={val}
              onChange={handleChange}
            />
          </Dropdown.Toggle>
          <Dropdown.Menu as={CustomMenu} style={{ maxHeight: 200, overflowY: 'auto' }}>
            {!contactList.length && <Dropdown.Item>No contact</Dropdown.Item>}
            {contactList.map(({ contact_id, name }) => (
              <Dropdown.Item key={contact_id} eventKey={contact_id} onSelect={() => handleSelect(contact_id, name)}>
                {name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
      <Col sm="1">
        <Button disabled={adding || val === ""} onClick={handleAdd}>Add</Button>
      </Col>
    </div>
  );
};

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);

AddUser.propTypes = propTypes;

export default AddUser;
