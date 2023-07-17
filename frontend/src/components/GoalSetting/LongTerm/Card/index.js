import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Check2 } from 'react-bootstrap-icons';

import style from './style.module.scss';

const propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired | PropTypes.element.isRequired,
    description: PropTypes.string,
    selected: PropTypes.bool.isRequired,
    selectText: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

const Card = ({ item, onSelect }) => {
  const { name, description, selected, selectText } = item;
  return (
    <div
      className={classNames(style.card, {
        [style.selected]: selected,
        [style.canHover]: description != null,
      })}
      onClick={() => onSelect(!selected)}
    >
      <div className={style['card-inner']}>
        <div className={style['card-front']}>
          {selected && (
            <div className={style.circle}>
              {selectText ?
                <span className={style.check}>{selectText}</span> :
                <Check2 className={style.check} />
              }  
            </div>
          )}
          <div className={style.name}>{name}</div>
        </div>
        {description && <div className={style['card-back']}>
          <p>{description}</p>
        </div>}
      </div>
    </div>
  );
};

Card.propTypes = propTypes;

export default Card;
