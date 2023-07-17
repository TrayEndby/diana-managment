import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

import FormService from '../../../service/FormService';

import style from './style.module.scss';
import { withRouter } from 'react-router-dom';
import Markdown from '../../Markdown';

const ViewForm = ({ history, location: { pathname, hash } }) => {
  const [form, setForm] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (hash) {
      setIsLoading(true);
      FormService.getFormDetails(+hash.slice(1))
        .then((result) => {
          setIsOpen(true);
          setForm(result);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsOpen(false);
      setForm(null);
    }
  }, [hash]);

  const closeModal = () => {
    setIsOpen(false);
    history.push(pathname);
  };

  return (
    <Modal
      show={isOpen || isLoading}
      centered
      onHide={closeModal}
      data-prevent-scroll-propogation
      dialogClassName={style.modal}
    >
      <Modal.Header className={style.header} closeButton>
        {form && <h1>{form.name}</h1>}
      </Modal.Header>
      <Modal.Body className={style.body}>{form && <Markdown source={form.item[0].prompt} />}</Modal.Body>
    </Modal>
  );
};

export default React.memo(withRouter(ViewForm));
