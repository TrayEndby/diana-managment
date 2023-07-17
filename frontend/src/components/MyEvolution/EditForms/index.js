import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import {
  Book,
  Trash,
  CloudArrowUpFill,
  ClipboardCheck,
  Pencil,
  Eye,
} from 'react-bootstrap-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Markdown from 'components/Markdown';
import formService from 'service/FormService';
import Tooltip from 'util/Tooltip';

import style from './style.module.scss';

const EditForms = ({ isShowedModal, setIsShowedModal }) => {
  const [forms, setForms] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  React.useEffect(() => {
    formService.getForms().then((result) => {
      setForms(result);
    });
  }, []);

  const finishAddingNewForm = (form) => {
    setIsEdit(false);
    setForms([form, ...forms]);
  };

  const deleteHandler = ({ id }) => {
    const accepted = window.confirm(
      'Are you sure you want to delete the form?',
    );
    if (!accepted) {
      return;
    }

    formService.deleteForm(id).then(() => {
      setForms(forms.filter((form) => form.id !== id));
    });
  };

  const updateHandler = async (name, content, fullForm) => {
    await formService.updateForm(name, content, fullForm);
    setForms(
      forms.map((form) =>
        form.id === fullForm.id ? { ...fullForm, name } : form,
      ),
    );
  };

  return (
    <>
      <Tooltip title="Edit Forms">
        <Book size="30px" role="button" onClick={() => setIsShowedModal(true)} />
      </Tooltip>
      <Modal
        show={isShowedModal}
        onHide={() => setIsShowedModal(false)}
        data-prevent-scroll-propogation
        dialogClassName={style.modal}
      >
        <Modal.Header className={style.header} closeButton>
          <Modal.Title>Edit Forms</Modal.Title>
          <section className={style.headerActionBar}>
            <Button onClick={() => setIsEdit(!isEdit)}>
              <Pencil />
            </Button>
          </section>
        </Modal.Header>
        <Modal.Body className={style.body}>
          {isEdit && <NewForm finishAddingNewForm={finishAddingNewForm} />}
          <Accordion as="ul">
            {forms.map((form) => (
              <FormDetails
                form={form}
                key={form.id}
                deleteHandler={deleteHandler}
                updateHandler={updateHandler}
              />
            ))}
          </Accordion>
        </Modal.Body>
      </Modal>
    </>
  );
};

const FormDetails = React.memo(
  withRouter(
    ({
      form,
      deleteHandler,
      updateHandler,
      history,
      location: { pathname },
    }) => {
      const [isCollapsed, setIsCollapsed] = useState(true);
      const [nameEditable, setNameEditable] = useState(form.name);
      const [contentEditable, setContentEditable] = useState('');
      const [fullForm, setFullForm] = useState(null);

      React.useEffect(() => {
        if (!isCollapsed) {
          formService.getFormDetails(form.id).then((result) => {
            setFullForm(result);
            setContentEditable(result.item[0].prompt);
            setNameEditable(result.name);
          });
        }
      }, [isCollapsed, form.id]);

      const isEdited =
        fullForm &&
        (fullForm.item[0].prompt !== contentEditable ||
          fullForm.name !== nameEditable);

      const saveHandler = React.useCallback(async () => {
        await updateHandler(nameEditable, contentEditable, fullForm);
        setIsCollapsed(true);
      }, [contentEditable, fullForm, nameEditable, updateHandler]);

      return (
        <article>
          <Accordion.Toggle
            as={'li'}
            eventKey={form.id}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <input
              style={{ width: '40%' }}
              onClick={(e) => !isCollapsed && e.stopPropagation()}
              value={nameEditable}
              onChange={(e) => setNameEditable(e.target.value)}
            />
            <section onClick={(e) => e.stopPropagation()}>
              {isEdited && (
                <CloudArrowUpFill size="24px" onClick={saveHandler} />
              )}
              <Trash size="24px" onClick={() => deleteHandler(form)} />
              <a href={`#${form.id}`}>
                <Eye size="24px" />
              </a>
              <CopyToClipboard text={`#${form.id}`}>
                <ClipboardCheck size="24px" />
              </CopyToClipboard>
            </section>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={form.id}>
            {!isCollapsed ? (
              <div className={style.editBox}>
                <textarea
                  value={contentEditable}
                  onChange={(e) => setContentEditable(e.target.value)}
                />
                <section>
                  <Markdown source={contentEditable} />
                </section>
              </div>
            ) : (
              <p />
            )}
          </Accordion.Collapse>
        </article>
      );
    },
  ),
);

const NewForm = ({ finishAddingNewForm }) => {
  const [content, setContent] = useState('');
  const [name, setName] = useState('');

  const saveHandler = (e) => {
    e.preventDefault();
    formService.createNewForm(name, content).then((form) => {
      finishAddingNewForm(form);
    });
  };

  return (
    <Form className={style.form} onSubmit={saveHandler}>
      <Form.Group controlId="MyEvolution.EditForms.newForm.Name">
        <Form.Label>Name</Form.Label>
        <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Group>
      <section className={style.editBox}>
        <Form.Group controlId="MyEvolution.EditForms.newForm.Content">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="MyEvolution.EditForms.newForm.Preview">
          <Form.Label>Preview</Form.Label>
          <Markdown source={content} />
        </Form.Group>
      </section>
      <Button type="submit" variant="primary">
        Add new Form
      </Button>
    </Form>
  );
};

export default React.memo(EditForms);
