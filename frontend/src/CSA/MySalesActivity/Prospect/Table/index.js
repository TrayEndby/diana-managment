import React from 'react';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';

import PropTypes from 'prop-types';
import style from './style.module.scss';

const propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      render: PropTypes.func,
    }),
  ).isRequired,
  rows: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
};

const Table = ({ headers, rows, total }) => {
  const history = useHistory();
  return (
    <div className={style.table}>
      <div className={style.thead}>
        <div className={style.tr}>
          {headers.map(({ key, text }) => (
            <div key={key} className={style.td}>
              {text}
            </div>
          ))}
        </div>
      </div>
      <div className={style.tbody}>
        {total === 0 && <div className="text-center my-2">No rows to display</div>}
        {rows.length === 0 && total > 0 && <div className="text-center my-2">No rows to display (after filter)</div>}
        {rows.map((row, index) => (
          <div key={index} className={style.tr}>
            {headers.map(({ key, onClick, render }) => (
              <div
                key={key}
                className={cn(style.td, style[key])}
                onClick={onClick ? () => onClick(history, row) : null}
              >
                {render == null ? row[key] : render(row[key])}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

Table.propTypes = propTypes;

export default Table;
