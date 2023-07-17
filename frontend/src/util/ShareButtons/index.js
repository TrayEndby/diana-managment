import React from 'react';
import PropTypes from 'prop-types';
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from 'react-share';

const propTypes = {
  url: PropTypes.string.isRequired,
};

const buttons = [
  [TwitterShareButton, TwitterIcon],
  [FacebookShareButton, FacebookIcon],
  [LinkedinShareButton, LinkedinIcon]
];

const ShareButtons = ({ url }) => {
  return (
    <div>
      {buttons.map(([Button, Icon], index) => (
        <Button key={index} url={url}>
          <Icon size="28" className="mr-2"/>
        </Button>
      ))}
    </div>
  );
};

ShareButtons.propTypes = propTypes;

export default React.memo(ShareButtons);
