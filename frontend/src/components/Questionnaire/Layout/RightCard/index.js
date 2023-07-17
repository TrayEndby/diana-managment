import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import classNames from 'classnames';

import ErrorDialog from '../../../../util/ErrorDialog';

import style from '../style.module.scss';

const propTypes = {
  children: PropTypes.any.isRequired,
  next: PropTypes.string.isRequired,
  linkToNextPage: PropTypes.string.isRequired,
  linkToPrevPage: PropTypes.string,
  classes: PropTypes.string,
  contentClasses: PropTypes.string,
  skip: PropTypes.bool,
  save: PropTypes.bool,
  title: PropTypes.string,
  onRedirect: PropTypes.func,
};

class RightCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }


  onNextStep = async () => {
    // when onRedirect throw error or return false, don't go to next question
    const { linkToNextPage, onRedirect } = this.props;
    try {
      let valid = true;
      if (typeof onRedirect === 'function') {
        valid = await onRedirect();
      }
      if (valid !== false) {
        this.props.history.push(linkToNextPage);
      }
    } catch (e) {
      console.error(e);
      this.setState({
        error: e.message,
      });
    }
  };

  onSkip = () => {
    const { linkToNextPage } = this.props;
    this.props.history.push(linkToNextPage);
  };

  render() {
    const { title, children, next, linkToPrevPage, skip, classes, contentClasses } = this.props;
    const { error } = this.state;
    return (
      <div className={classNames(style.rightCard, classes)}>
        <header>{title}</header>
        <div>
          <ErrorDialog error={error} />
        </div>
        <div className={`${style.content} ${contentClasses}`}>{children}</div>
        <div className={style.button}>
          <div>
            {linkToPrevPage && (
              <Link to={linkToPrevPage} className={style.link}>
                <button className="btn btn-primary">Go to previous</button>
              </Link>
            )}
          </div>
          <div>
            {skip && (
              <Button variant="link" onClick={this.onSkip} className="mr-2">
                Skip this question
              </Button>
            )}
            <Button onClick={this.onNextStep}>{next}</Button>
          </div>
        </div>
      </div>
    );
  }
}

RightCard.propTypes = propTypes;

export default withRouter(RightCard);
