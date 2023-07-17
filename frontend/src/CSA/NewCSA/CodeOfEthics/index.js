import React from 'react';
import cn from 'classnames';
import * as CSA_ROUTES from 'constants/CSA/routes';
import { ReactComponent as AstIcon } from 'assets/svg/Astronaut.svg';
import Back from "../../MySalesActivity/Prospect/Back"

import style from './style.module.scss';

const CodeOfEthicsPage = () => {
  return (
    <div className={cn(style.container, 'App-body')}>
      <div style={{ marginTop: "15px", marginLeft: "13px" }} >
        <Back text='Back to all ' path={CSA_ROUTES.POLICIES} />
      </div>
      <div className="container">
        <h1 className="mb-3 mt-4">Code of Ethics</h1>
        <div className={style.secondContainer}>
          <div className={style.rectangleContainer}>
            <div>
              <AstIcon style={{ width: '75px', height: '100px', marginRight: '30px' }} />
            </div>
            <div>
              We strive to uphold the highest ethical standards on we can always be a company you can be proud of. As a
              representative of the company, we ask that you review the Code of Ethics to help conduct your business in
              the Kyros.ai spirit.
            </div>
          </div>
        </div>
        <div className={style.itemContainer}>
          Kyros requires me to employ integrity, honesty, and responsibility in my behaviour and actions with Kyros, my
          customers and my fellow College Success Advisors including and without limitations, presenting and pomoting
          Kyros products in a truthful manner.
        </div>
        <div className={style.itemContainer}>
          <b>I will comply </b>with any Kyros online community group rules and guidelines.
        </div>
        <div className={style.itemContainer}>
          <b>I will help </b>create a welcoming, supportive and educational environment, treating everyone with respect
          and respecting everyone's privacy.
        </div>
        <div className={style.itemContainer}>
          <b>I understand </b>that from time to time I may be required to undertake training provided by Kyros and agree
          that my appointment as a College Success Advisor is subject to my completing any such training.
        </div>
        <div className={style.itemContainer}>
          <b>I agree </b>that I shall be fully responsible for paying all applicable federal and state taxes, income
          taxes, worker's compensation contributions, health insurance and any other similar taxes and contributions
          based on any commissions and other payments received from Kyros.
        </div>
        <div className={style.itemContainer}>
          All Mentor College Success Advisors will have an obligation to train and motivate, on an on-going basis, the
          College Success Advisors they have nominated.
        </div>
        <div className={style.itemContainer} style={{ marginBottom: '32px' }}>
          <b>I will comply </b>with any Kyros online community group rules and guidelines to positively engage with the
          community and further extend the same principles into my own personally run and operated online groups,
          parties and forums.
        </div>
      </div>
    </div>
  );
};
export default CodeOfEthicsPage;
