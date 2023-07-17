import React, { useState } from 'react';
import cn from 'classnames';
import Collapse from 'react-bootstrap/Collapse';

import style from '../style.module.scss';

const Requests = ({ title, data, onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  const countOfIncomingRequests = data.filter(request => request.source_user_name).length;

  return countOfIncomingRequests ? (
    <div className={style.sidebarItem}>
      <div className={cn(style.sidebarItemTitle, { [style.open]: isOpen })} onClick={() => setIsOpen(!isOpen)}>
        {title}
      </div>
      <Collapse in={isOpen} className={style.sidebarItemContent}>
        <div>
          {data.map(({ source_user_name, id }, i) =>
            <div key={i} className={style.sidebarItemText} onClick={() => onSelect(id)}>
              <span className={style.text}>{source_user_name}</span>
              <span className={style.unreadedRequests}>1</span>
            </div>)}
        </div>
      </Collapse>
    </div>
  ) : null
}

export default Requests;