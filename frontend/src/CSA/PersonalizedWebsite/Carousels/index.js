import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import Carousel from 'react-bootstrap/Carousel';

import EditButton from '../Edit';

import styles from '../style.module.scss';

const propTypes = {
  className: PropTypes.string,
  editable: PropTypes.bool,
  items: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
};

const Carousels = ({ editable, items, className, onEdit }) => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const firstSlides = [items[0], items[1], items[2]];
  const secondSlides = [items[3], items[4], items[5]];

  return (
    <Carousel
      className={className}
      activeIndex={index}
      controls={true}
      interval={null}
      prevIcon={<ChevronLeft size="20" />}
      nextIcon={<ChevronRight size="20" />}
      onSelect={handleSelect}
    >
      {[firstSlides, secondSlides].map((slides, index) => (
        <Carousel.Item key={index}>
          <div className={styles.item}>
            {slides.map((item, itemIndex) => {
              return (
                <div className={styles.placeholder} key={itemIndex}>
                  {item}
                  {editable && (
                    <EditButton onClick={() => onEdit(index * 3 + itemIndex)} />
                  )}
                </div>
              );
            })}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

Carousels.propTypes = propTypes;

export default React.memo(Carousels);
