import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import style from './style.module.scss';

const propTypes = {
  location: PropTypes.string,
  className: PropTypes.string,
};

const AddressMap = ({ location, className }) => {
  const [iframeUrl, setIframeUrl] = React.useState(null);
  const toggleLocationMap = (url) => (iframeUrl ? setIframeUrl(null) : setIframeUrl(url));

  return (
    <div className={cn('my-2', className)}>
      Location:
      <div
        className={style.locationLink}
        onClick={() => toggleLocationMap(`https://www.google.com/maps?q=${location.split(' ').join('+')}&output=embed`)}
      >
        {' '}
        {location}
      </div>
      {iframeUrl && (
        <div>
          <div
            style={{ width: '20px', marginLeft: 'calc(100% - 20px)', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => toggleLocationMap(null)}
          >
            X
          </div>
          <div className={style.iframeLocationWrap}>
            <iframe title="activity detail" width="100%" height="100%" src={iframeUrl}></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

AddressMap.propTypes = propTypes;

export default AddressMap;
