import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';

import FormCard from './FormCard';
import Item from './Item';
import AddButton from './AddButton';
import SaveChange from './SaveChange';
import UnsavedAlert from './UnsavedAlert';

import ErrorDialog from 'util/ErrorDialog';

import styles from './style.module.scss';

const propTypes = {
  saved: PropTypes.object.isRequired,
  onMount: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
};

class Layout extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      error: null,
    };
  }

  componentDidMount = async () => {
    try {
      await this.props.onMount();
    } catch (e) {
      this.handleError(e);
    }
  };

  handleError = (e) => {
    console.error(e);
    this.setState({ error: e.message });
  };

  isUnsaved = (savedInfo) => {
    return Object.values(savedInfo).includes(false);
  };

  handleSave = async () => {
    try {
      this.setState({ error: null });
      await this.props.onSave();
      return true;
    } catch (e) {
      this.handleError(e);
      return false;
    }
  };

  render() {
    const { error } = this.state;
    const { saved, children } = this.props;
    const unsaved = this.isUnsaved(saved);

    return (
      <Card className="overflow-auto d-flex flex-column">
        {(error || unsaved) && (
          <Card.Body className={styles.top}>
            {error && <ErrorDialog error={error} />}
            {this.isUnsaved(saved) && <UnsavedAlert onSave={this.handleSave} />}
          </Card.Body>
        )}
        <Card.Body className={styles.main}>
          {children}
          <SaveChange onClick={this.handleSave} />
        </Card.Body>
      </Card>
    );
  }
}

Layout.propTypes = propTypes;

export default Layout;

export { FormCard, Item, AddButton };
