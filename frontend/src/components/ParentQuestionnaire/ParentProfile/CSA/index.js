import React, { useState, useEffect } from 'react';
import AddEditModal from './AddEditModal';
import cn from 'classnames';
import { AddPlusGreen, EditPencilGreen } from 'util/Icon';
import paymentService from 'service/PaymentService';
import style from './style.module.scss';


const CSA = ({ code, onSubmit }) => {
  const [isAddModalShow, setIsAddModalShow] = useState(false);
  const [csaReferer, setCsaReferer] = useState({});

  useEffect(() => {
    const checkPromoCode = async () => {
      try {
        if (code) {
          const response = await paymentService.checkPromoCode(code);
          const hasData = !!response && !!Object.entries(response).length;
          if (hasData && response?.is_csa) {
            setCsaReferer({ code, name: response?.csa_name });
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    checkPromoCode();
  }, [code]);


  const showModal = () => setIsAddModalShow(true);
  const closeModal = () => setIsAddModalShow(false);

  const handleEdit = () => {
    showModal();
  }

  return (
    <div className={style.servicesWrap}>
      <div className={style.servicesHeader}>
        <h3 className={style.servicesTitle}>CSA ID</h3>
        <div onClick={showModal} className={cn(style.serviceAdd, { [style.addDisabled]: !csaReferer })}>
          <AddPlusGreen />
        </div>
      </div>
      {!!Object.entries(csaReferer).length && (
        <div className={style.servicesList}>
          <CsaItem
            name={csaReferer?.name}
            code={csaReferer?.code}
            onEdit={handleEdit}
          />
        </div>
      )}
      <AddEditModal
        name={csaReferer?.name}
        code={csaReferer?.code}
        show={isAddModalShow}
        onClose={closeModal}
        onSubmit={onSubmit}
        onEdit={handleEdit}
      />
    </div>
  );
};

const CsaItem = ({ name, code, onEdit }) => (
  <div className={style.serviceItem}>
    <div className={style.editButton} onClick={onEdit} title="Edit">
      <EditPencilGreen />
    </div>
    <div className={style.serviceItemRow}>
      <p className={cn(style.serviceItemInfo, style.serviceItemName)}>{code}</p>
    </div>
    <div className={style.serviceItemRow}>
      <p className={cn(style.serviceItemInfo, style.serviceItemEmail)}>{name}</p>
    </div>
  </div>
);

export default CSA;
