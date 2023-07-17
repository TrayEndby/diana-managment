import React from 'react';
import { Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import CSABodyContainer from 'CSA/Container';
import * as CSA_ROUTES from 'constants/CSA/routes';

import CSAAgreementImage from 'assets/Agreements/CSA Agreement.png';
import CodeOfEthicsImage from 'assets/Agreements/Code of Ethics.png';
import EULAAgreementImage from 'assets/Agreements/EULA Agreement.png';
import PrivacyStatementImage from 'assets/Agreements/Privacy Statement.png';
import style from './style.module.scss';

const CSAAgreement = () => (
  <CSABodyContainer title="Agreements & Policies" className={style.agreementPage}>
    <div className={style.container}>
      <div className={style.scheduleItem}>
        <Image src={CSAAgreementImage} className={style.agreementImage} />
        <div style={{ marginTop: '56px' }}>
          <h6>
            <b style={{ fontSize: '1.25rem' }}>The Kyros.ai CSA Agreement</b>&nbsp;is amended from time to time as our
            company grows - when changes are needed, we will notify you of the updates. You can view the most recent
            agreement here.
          </h6>
          <Link to={CSA_ROUTES.AGREEMENT} className={style.readmore}>Read More</Link>
        </div>
      </div>
      <div className={style.scheduleItem}>
        <Image src={EULAAgreementImage} className={style.agreementImage} />
        <div style={{ marginTop: '52px' }}>
          <h5>
            <b>End User License Agreement</b>
          </h5>
          <h6>
            EULA is a legally binding agreement between Kyros and the end-user - a contract between the licensor of a
            product and the licensee.
          </h6>
          <Link to={CSA_ROUTES.EULA} className={style.readmore}>Read More</Link>
        </div>
      </div>
      <div className={style.scheduleItem}>
        <Image src={PrivacyStatementImage} className={style.agreementImage} />
        <div style={{ marginTop: '56px' }}>
          <h5>
            <b>Your Privacy is Important to Us!</b>
          </h5>
          <h6>Please click on the link to read our Privacy Statement.</h6>
          <Link to={CSA_ROUTES.PRIVACY} className={style.readmore}>Read More</Link>
        </div>
      </div>
      <div className={style.scheduleItem} style={{ marginBottom: '50px' }}>
        <Image src={CodeOfEthicsImage} className={style.agreementImage} />
        <div style={{ marginTop: '32px' }}>
          <h5>
            <b>Our Ethical Standards!</b>
          </h5>
          <h6>
            We strive to uphold the highest ethical standards because that's who we are as people and we want to be a
            company you can be proud of. As a representative of the company, we ask that you review the Code of Ethics
            to help conduct your business in a way that is aligned with me Kyros.ai brand.
          </h6>
          <Link to={CSA_ROUTES.CODEOFETHICS} className={style.readmore}>Read More</Link>
        </div>
      </div>
    </div>
  </CSABodyContainer>
);

export default CSAAgreement;
