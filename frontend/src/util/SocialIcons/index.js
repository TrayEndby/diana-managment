import React from 'react';

import facebook from "assets/CSA/Landing/Facebook.svg";
import instagram from "assets/CSA/Landing/Instagram.svg";
import tiktok from "assets/CSA/Landing/TikTok.svg";
import youtube from "assets/CSA/Landing/Youtube.svg";

const propTypes = {};

const SocialIcons = () => {
  return (
    <>
      <div className="social-icons">
        <a
          href="https://m.youtube.com/channel/UC7Dpgqmw1gPJr6vYVTqfIBQ"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img className="footer-icon" src={youtube} alt="youtube" />
        </a>
      </div>
      <div className="social-icons">
        <a
          href="https://www.facebook.com/risewithkyrosai"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img className="footer-icon" src={facebook} alt="facebook" />
        </a>
      </div>
      <div className="social-icons">
        <a
          href="https://www.instagram.com/kyros.ai/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img className="footer-icon" src={instagram} alt="instagram" />
        </a>
      </div>
      <div className="social-icons">
        <a
          href="https://www.tiktok.com/@kyros.ai"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img className="footer-icon" src={tiktok} alt="tiktok" />
        </a>
      </div>
    </>
  );
};

SocialIcons.propTypes = propTypes;

export default SocialIcons;
