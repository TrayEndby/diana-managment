import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import DateInput from '../../../util/DateInput';

import style from '../AddRowModal/style.module.scss';
import tableStyle from '../Table/style.module.scss';

const propTypes = {
  show: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  handleClose: PropTypes.func,
};

const EditRowModal = ({ show, handleClose, onChange, onSave, RegularAdmissionDeadline }) => {
  return (
    <Modal show={!!show} onHide={handleClose} className={style.modalWrapper}>
      <div className={style.modalWrapper} aria-modal aria-hidden tabIndex={-1} role="dialog">
        <div className={style.modal} >
          <Modal.Header closeButton className='p-0 border-0'>
            <div className={style.modalHeader}>
              <h2 className={style.modalHeadline}>Edit row</h2>
              <p className={style.modalText}>You must go to the official admissions website for College Name to confirm the following requirements and deadlines</p>
            </div>
          </Modal.Header>

          <form className={style.modalForm}>
            {show === 'essay' && <label className={style.modalFormLabelBig}>
              <p className={style.modalText}>
                Number of required essays
              </p>
              <input
                type="text"
                className={tableStyle.tableInput}
                onChange={(e) => onChange('essay_required', e.target.value)}
              />
            </label>}

            {show === 'tests' &&
              <label className={style.modalFormLabelBig}>
                <p className={style.modalText}>
                  Number of required tests
              </p>
                <input
                  type="text"
                  className={tableStyle.tableInput}
                  onChange={(e) => onChange('test_required', e.target.value)}
                />
              </label>}

            {show === 'recLetters' &&
              <label className={style.modalFormLabelBig}>
                <p className={style.modalText}>
                  Number of required recommendation letters
              </p>
                <input
                  type="text"
                  className={tableStyle.tableInput}
                  onChange={(e) => onChange('recommendation_letter_required', e.target.value)}
                />
              </label>}

            {show === 'deadline' &&
              <label className={style.modalFormLabelBig}>
                <p className={style.modalText}>Deadline</p>
                <DateInput required value={RegularAdmissionDeadline || ''} onChange={(e) => onChange('RegularAdmissionDeadline', e.target.value)} />
              </label>}
            <Button className={style.modalSubmit} onClick={onSave}>Save</Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}

EditRowModal.propTypes = propTypes;

export default EditRowModal;
