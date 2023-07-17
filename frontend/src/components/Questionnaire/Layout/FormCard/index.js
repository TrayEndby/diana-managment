import React from 'react';
import PropTypes from 'prop-types';

import ErrorDialog from '../../../../util/ErrorDialog';

const propTypes = {
  children: PropTypes.any.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

const FormCard = React.memo(({ children, loading, error }) => (
  <>
    {loading && <div className="mx-auto">Loading...</div>}
    <ErrorDialog error={error} />
    {!loading && children}
  </>
));

FormCard.propTypes = propTypes;

export default FormCard;
