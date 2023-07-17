import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useAccordionToggle } from 'react-bootstrap';

import { CaretDownFill, CaretRightFill } from 'react-bootstrap-icons';

import styles from './style.module.scss';

const propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const CustomToggle = ({ className, children, eventKey }) => {
  const [isOpened, setIsOpened] = React.useState(true);
  const decoratedOnClick = useAccordionToggle(eventKey, () =>
    setIsOpened(!isOpened),
  );

  return (
    <Card.Header
      onClick={decoratedOnClick}
      className={cn(styles.header, className)}
    >
      {isOpened ? <CaretDownFill /> : <CaretRightFill />} {children}
    </Card.Header>
  );
};

const CustomAccordion = ({ className, title, children }) => {
  return (
    <Accordion key={title} defaultActiveKey={title}>
      <Card className={styles.card}>
        <CustomToggle className={className} eventKey={title}>
          {title}
        </CustomToggle>
        <Accordion.Collapse eventKey={title}>{children}</Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

CustomAccordion.propTypes = propTypes;

export default CustomAccordion;
