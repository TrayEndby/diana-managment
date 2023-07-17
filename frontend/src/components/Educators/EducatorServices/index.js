import React, { useState, useEffect } from 'react';

import AddServiceModal from '../EducatorProfile/AddServiceModal';
import educatorService from '../../../service/EducatorService';
import { getNameFromId } from '../../../util/helpers';
import cn from 'classnames';
import CloseButton from '../../../util/CloseButton';
import { AddPlusGreen } from '../../../util/Icon';

import style from './style.module.scss';

const EducatorServices = ({ servicesList, addService, onRemove, disabled }) => {
  const [serviceCategoryList, setServiceCategoryList] = useState([]);
  const [isAddModalShow, setIsAddModalShow] = useState(false);

  useEffect(() => {
    const fetchServiceCategories = async () => {
      const catListResp = await educatorService.getServiceCategories();
      setServiceCategoryList(catListResp);
    };

    fetchServiceCategories();
  }, []);

  const showModal = () => setIsAddModalShow(true);
  const closeModal = () => setIsAddModalShow(false);

  return (
    <div className={style.servicesWrap}>
      <div className={style.servicesHeader}>
        <h3 className={style.servicesTitle}>Provide Services</h3>
        <div onClick={showModal} className={cn(style.serviceAdd, { [style.addDisabled]: disabled })}>
          <AddPlusGreen />
        </div>
      </div>

      {Array.isArray(servicesList) && servicesList.length !== 0 && (
        <div className={style.servicesList}>
          {servicesList.map((service) => {
            const { id, type, name, hourly_rate, years_experience } = service;
            const nameFromId = getNameFromId(serviceCategoryList, type)?.name;
            return (
              <ServiceItem
                id={id}
                key={id}
                name={name}
                category={nameFromId}
                rate={hourly_rate}
                experience={years_experience}
                onRemove={onRemove}
              />
            );
          })}
        </div>
      )}

      <AddServiceModal
        servicesList={servicesList}
        show={isAddModalShow}
        serviceCategoryList={serviceCategoryList}
        onClose={closeModal}
        onSubmit={addService}
      />
    </div>
  );
};

const ServiceItem = ({ id, name, rate, experience, onRemove }) => (
  <div className={style.serviceItem}>
    <CloseButton dark className={style.closeButton} onClick={() => onRemove(id)} title="Remove service" />
    <div className={style.serviceItemRow}>
      <span className={style.serviceItemHint}>Name: </span>
      <p className={cn(style.serviceItemInfo, style.serviceItemName)}>{name}</p>
    </div>
    <div className={style.serviceItemRow}>
      <span className={style.serviceItemHint}>Hourly rate: </span>
      <p className={style.serviceItemInfo}>${rate}/Hr</p>
    </div>
    <div className={style.serviceItemRow}>
      <span className={style.serviceItemHint}>Years of experience: </span>
      <p className={style.serviceItemInfo}>{experience} years</p>
    </div>
  </div>
);

export default EducatorServices;
