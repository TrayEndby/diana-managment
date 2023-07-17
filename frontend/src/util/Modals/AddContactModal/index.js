import React from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { CONTACT_TAG } from 'constants/contactTags';
import contactService from 'service/ContactService';
import style from './style.module.scss';

const tags = [
  { tag: CONTACT_TAG.EDUCATOR, name: 'Educator' },
  { tag: CONTACT_TAG.STUDENT, name: 'Student' },
  { tag: CONTACT_TAG.PARENT, name: 'Parent' },
]

const AddContactModal = ({ isOpened, closeModal, userId }) => {
  const [selectedTag, setSelectedTag] = React.useState(tags[0].tag);
  const [isContact, setIsContact] = React.useState('');

  React.useEffect(() => {
    let isSubscribed = true;
    contactService.listContact().then((contacts) => {
      const isConnected = contacts.some((contact) => contact.contact_id === userId);
      if (isSubscribed) {
        setIsContact(isConnected);
      }
    });

    return () => isSubscribed = false;
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contacts = await contactService.listContact();
    const educatorContact = contacts.find((contact) => contact.contact_id === userId);
    if (!educatorContact) {
      await contactService.addContact(userId, 2, selectedTag);
    } else {
      await contactService.updateContact(userId, 2, selectedTag);
    }
    closeModal();
  };

  return (
    <Modal show={isOpened} onHide={() => closeModal()} centered dialogClassName={style.modal}>
      <Form onSubmit={handleSubmit}>
        <Card className={style.card}>
          <Modal.Header closeButton className={style.header}>
            <h2>Add this user to Contacts list</h2>
          </Modal.Header>

          <Card.Body className={style.body}>
            <Form.Group className={style.formField}>
              <Form.Label className={style.label}>Save user as</Form.Label>
              <Form.Control
                as="select"
                value={selectedTag}
                name="userTag"
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                {tags.map(({ tag, name }, key) => (
                  <option key={key} value={tag}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              disabled={isContact}
              title={isContact ? 'You already have a contact with this user' : 'Send request'}
            >
              Add
            </Button>
          </Card.Body>
        </Card>
      </Form>
    </Modal>
  );
};

export default React.memo(AddContactModal);
