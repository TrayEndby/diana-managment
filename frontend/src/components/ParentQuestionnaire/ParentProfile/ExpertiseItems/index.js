import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import FormControl from 'react-bootstrap/FormControl';
import { AddPlusGreen } from 'util/Icon';
import cn from 'classnames';
import { X } from 'react-bootstrap-icons';

const MAX_DROPDOWNS = 3;

const ExpertiseItems = ({ selected, expertiseList, handleChange, onRemove }) => {
  const [dropdowns, setDropdowns] = useState([]);
  const [hasAdd, setHasAdd] = useState(true);

  useEffect(() => {
    setDropdowns(selected)
  }, [selected])

  useEffect(() => {
    const isMaxItems = dropdowns?.length < MAX_DROPDOWNS;
    const isAddPossible = !dropdowns?.find(x => x.id === 0);
    if (isMaxItems && isAddPossible) {
      setHasAdd(true)
    } else {
      setHasAdd(false)
    }
  }, [dropdowns])

  const handleAddSelect = () => {
    setDropdowns(prev => [...prev, { id: 0, expertise: 0 }])
  }

  const handleRemove = (id) => {
    if (id) {
      onRemove(id)
    } else {
      const dataToUpdate = [...dropdowns];
      dataToUpdate.pop();
      setDropdowns(dataToUpdate);
    }
  }

  return (
    <div className={style.expWrap}>
      <div className={style.expContentWrap}>
        {Array.isArray(dropdowns) && dropdowns.length !== 0 && (
          <>
            {dropdowns?.map((sel, i) => (
              <div key={i * 100} className={style.expItem}>
                <div className={style.expRemove} onClick={() => handleRemove(sel.id)}>
                  <X />
                </div>
                <FormControl as="select" value={sel.expertise} onChange={(e) => handleChange(sel.id, e)}>
                  <option key={sel.id} value={0}>Select expertise</option>
                  {expertiseList.map((exp, key) => (
                    <option key={key * 1000} value={exp.id}>{exp.name}</option>
                  ))}
                </FormControl>
              </div>
            ))}
          </>
        )}

        <div className={cn(style.expAdd, { [style.disabled]: !hasAdd })} onClick={handleAddSelect}>
          <AddPlusGreen />
        </div>
      </div>
    </div>
  );
};

export default ExpertiseItems;
