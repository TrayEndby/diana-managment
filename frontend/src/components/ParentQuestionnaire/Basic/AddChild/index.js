import React, { useState, useEffect } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import style from './style.module.scss';
import { AddPlusGreen } from '../../../../util/Icon'

const AddChild = ({ childrenList, maxItems, handleChange, handleRemove, addRow }) => {
  const [isAddDisabled, setIsAddDisabled] = useState(false);

  useEffect(() => {
    if (childrenList.length === maxItems) {
      setIsAddDisabled(true);
    } else {
      setIsAddDisabled(false);
    }
  }, [childrenList, maxItems])

  return (
    <div className={style.container}>
      {childrenList.map((child, id) => (
        <div key={id} className={style.row}>
          <FormControl required value={child.name} className={style.input} name="name" placeholder="Name" onChange={(e) => handleChange(e, id)} />
          <FormControl required value={child.email} className={style.input} name="email" type="email" placeholder="Email address" onChange={(e) => handleChange(e, id)} />
          <Button className={style.removeBtn} onClick={() => handleRemove(id)}>Remove</Button>
        </div>
      ))}

      {!isAddDisabled && (
        <div className={style.add} onClick={addRow}>
          <AddPlusGreen />
          <p>Add child</p>
        </div>
      )}
    </div>
  )
}

export default AddChild;
