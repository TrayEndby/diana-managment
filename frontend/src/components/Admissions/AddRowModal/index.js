import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { TypeDropdown } from '../../College/MyList';
import { TAB_NAMES } from '../Details';

import DateInput from '../../../util/DateInput';
import { getNameFromId } from '../../../util/helpers';

import tableStyle from '../Table/style.module.scss';
import style from './style.module.scss';

const propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

const AddRowModal = ({ show, handleClose, data, onChange, selectedData, onSave, variant, error }) => {
  if (!data) return null;
  const renderNameField = () => {
    switch (variant) {
      case TAB_NAMES.TEST_SCORES:
        return (
          <>
            <p className={style.modalText}>Test name</p>
            <TypeDropdown
              value={selectedData?.testName?.name || data.testsList[0]?.name}
              options={data.testsList}
              onSelect={(value) => onChange('testName', value)}
            />
          </>
        )
      case TAB_NAMES.ESSAYS:
        return (
          <>
            <p className={style.modalText}>Prompt</p>
            <input
              type="text"
              className={tableStyle.tableInput}
              onChange={(e) => onChange('prompt', e.target.value)}
            />
            {error && <p className={style.modalTextError}>This field already exist</p>}
          </>
        )
      case TAB_NAMES.REC_LETTERS:
        return (
          <>
            <p className={style.modalText}>Recommender</p>
            <input
              type="text"
              className={tableStyle.tableInput}
              onChange={(e) => onChange('recommender', e.target.value)}
            />
            {error && <p className={style.modalTextError}>This field already exist</p>}
          </>
        )
      default:
        return null;
    }
  }

  let importanceName;
  if (selectedData?.importance) {
    importanceName = getNameFromId(data.importanceList, selectedData.importance).name;
  }
  let statusName;
  if (selectedData?.status) {
    statusName = getNameFromId(data.statusList, selectedData.status).name;
  }

  return (
    <Modal show={show} onHide={handleClose} className={style.modalWrapper}>
      <div className={style.modalWrapper} aria-modal aria-hidden tabIndex={-1} role="dialog">
        <div className={style.modal} >
          <Modal.Header closeButton className='p-0 border-0'>
            <div className={style.modalHeader}>
              <h2 className={style.modalHeadline}>Add row</h2>
              <p className={style.modalText}>You must go to the official admissions website for College Name to confirm the following requirements and deadlines</p>
            </div>
          </Modal.Header>

          <form className={style.modalForm}>
            <label className={style.modalFormLabel}>
              {renderNameField()}
            </label>
            <label className={style.modalFormLabel}>
              <p className={style.modalText}>Importance</p>
              <TypeDropdown
                value={importanceName || data.importanceList[0].name}
                options={data.importanceList}
                onSelect={(value) => onChange('importance', value)}
              />
            </label>
            <label className={style.modalFormLabel}>
              <p className={style.modalText}>
                {variant === TAB_NAMES.TEST_SCORES && 'Test status'}
                {variant === TAB_NAMES.ESSAYS && 'Essay status'}
                {variant === TAB_NAMES.REC_LETTERS && 'Letter status'}
                {variant === TAB_NAMES.INTERVIEW && 'Interview status'}
              </p>
              <TypeDropdown
                value={statusName || data.statusList[0].name}
                options={data.statusList}
                onSelect={(value) => onChange('status', value)}
              />
            </label>

            {variant === TAB_NAMES.TEST_SCORES && (
              <label className={style.modalFormLabel}>
                <p className={style.modalText}>Overall Score</p>
                <input
                  type="text"
                  className={tableStyle.tableInput}
                  disabled
                  value={selectedData?.overallScore || data.testsList[0]?.overallScore}
                />
              </label>
            )}

            <label className={style.modalFormLabel}>
              <p className={style.modalText}>Deadline</p>
              <DateInput required value={selectedData?.deadline || ''} onChange={(e) => onChange('deadline', e.target.value)} />
            </label>
            <Button className={style.modalSubmit} onClick={onSave}>Save</Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}

AddRowModal.propTypes = propTypes;

export default AddRowModal;
