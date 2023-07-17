import React from 'react';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';
import * as ROUTES from 'constants/routes';
import image1 from '../../assets/brochures/service-image1.svg';

import styles from './style.module.scss';

const ServiceBrochure = () => {
  const history = useHistory();
  return (
    <div className={cn(styles['service-container'])}>
      <div className={cn(styles['hero-container'])}>
        <div style={{ display: 'flex', width: '100%' }}>
          <div
            className={cn(styles['hero-logo'])}
            onClick={() => {
              history.push(ROUTES.LANDING)
            }}
          ></div>
          <div className={cn(styles['hero-url'])}>
            <a href={ROUTES.LANDING}>www.kyros.ai</a>
          </div>
        </div>
        <div className={cn(styles['hero-details'])}></div>
      </div>

      <div className={cn(styles['service-info'])}>
        <h2>1. Signature Sprint Programs</h2>
        <p>
          Each Sprint Program is designed to support a critical mission in the
          process and is led by highly qualified and experienced instructors.
        </p>
        <div className={cn(styles.moon)}></div>
        <img
          src={image1}
          alt="Signature Sprint Programs screenshot"
          className={cn(styles.image1)}
        />

        <h2>2. 24 Bi-weekly Counseling Sessions</h2>
        <p>
          Our counselors and former admissions officers share the best
          practices, case studies and latest updates.
        </p>

        <ul>
          <li>
            College prep{' '}
            <span className={cn(styles.highlight)}>strategies</span>
          </li>
          <li>
            Select balanced{' '}
            <span className={cn(styles.highlight)}>courses</span>
          </li>
          <li>
            Research{' '}
            <span className={cn(styles.highlight)}>colleges/majors</span> and
            find the best-fit
          </li>
          <li>
            Ace <span className={cn(styles.highlight)}>standardized tests</span>
          </li>
          <li>
            Avoid common mistakes in{' '}
            <span className={cn(styles.highlight)}>
              extracurricular activities
            </span>
          </li>
          <li>
            <span className={cn(styles.highlight)}>Summer program</span> and{' '}
            <span className={cn(styles.highlight)}>internship</span>{' '}
            applications
          </li>
          <li>
            How to discover your{' '}
            <span className={cn(styles.highlight)}>passion</span>
          </li>
          <li>
            Write captivating{' '}
            <span className={cn(styles.highlight)}>essays</span>
          </li>
          <li>
            Prepare for brag sheets and request{' '}
            <span className={cn(styles.highlight)}>
              letters of recommendation
            </span>
          </li>
          <li>
            How to build your{' '}
            <span className={cn(styles.highlight)}>support network</span>
          </li>
          <li>
            Research and apply for{' '}
            <span className={cn(styles.highlight)}>financial aid</span>
          </li>
          <li>
            What to get out of{' '}
            <span className={cn(styles.highlight)}>campus visits</span>
          </li>
          <li>
            How to prepare for alumni{' '}
            <span className={cn(styles.highlight)}>interviews</span>
          </li>
          <li>
            Apply for <span className={cn(styles.highlight)}>2+2 College</span>{' '}
            to get the best education in the most affordable way
          </li>
        </ul>

        <h2>3. Educator Network for 1-on-1 service</h2>
        <p>
          We hand selected highly qualified tutors and counselors to provide
          additional services if needed outside of sprint programs in a most
          cost-effective way (hourly rate applies).
        </p>
        <h2>4. 24x7 Support</h2>
        <p>
          If you can’t find answers from our FAQs, “Ask Questions” is open to
          Kyros members. We also provide “Public Channel”, “Private Channel”,
          and “Direct Message” functionalities where you can reach Kyros and
          educators instantly. You are always in good hands.
        </p>
      </div>
      <div className={cn(styles['service-footer'])}>
        <div className={cn(styles['footer-learn-more'])} />
        <div className={cn(styles['footer-info'])}>
          <span>
            Email Us |{' '}
            <span className={cn(styles.highlight)}>info@kyros.ai</span>
          </span>
          <span>
            Follow us on{' '}
            <span className={cn(styles.highlight)}>
              YouTube Channel "Rise With Kyros"
            </span>
          </span>
          <span>
            Attend our free counseling session |{' '}
            <a className={cn(styles.highlight)} href="www.kyros.ai/counseling">
              www.kyros.ai/counseling
            </a>
          </span>
        </div>
        <div className={cn(styles['footer-logo'])}></div>
      </div>
    </div>
  );
};

export default ServiceBrochure;
