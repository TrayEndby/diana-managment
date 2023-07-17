import { useState } from 'react';
import PropTypes from 'prop-types';

export const useSelect = (maxSelection) => {
  const [items, setItems] = useState([]);
  const selectItems = (selectedVal, selected) => {
    if (selected === true) {
      // select when less then 3 results
      if (items.length < maxSelection) {
        setItems([...items, selectedVal]);
      } else {
        // remove the last one and put the new one
        setItems([...items.slice(0, maxSelection - 1), selectedVal]);
      }
    } else {
      // unselect
      setItems(
        items.filter((val) => {
          if (typeof selectedVal === 'object') {
            return val.id !== selectedVal.id;
          } else {
            return val !== selectedVal;
          }
        }),
      );
    }
  };

  return [items, selectItems, setItems];
};

export const getIdsFromItems = (items) => items.map(({ id }) => id);

export const StrategyItem = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
});

export const StrategyItems = PropTypes.arrayOf(StrategyItem);