import React from 'react';
import cn from 'classnames';
import * as ROUTES from 'constants/routes';
import { useHistory } from 'react-router-dom';
import image1 from '../../assets/brochures/product-image1.png';
import image2 from '../../assets/brochures/product-image2.png';
import image3 from '../../assets/brochures/product-image3.png';

import styles from './style.module.scss';

const ProductBrochure = () => {
  const history = useHistory();
  return (
    <div className={cn(styles['product-container'])}>
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

      <div className={cn(styles['product-info'])}>
        <h2>1. Manual Drive</h2>

        <img
          src={image1}
          alt="manual derive screenshot"
          className={cn(styles['image1'])}
        />
        <ul>
          <li>
            <span className={cn(styles['highlight'])}>“Annual Planning”</span>-
            an assessment on your interest, strength and personality to discover
            the best-fit major and colleges, then break it down into semester,
            annual planning and action items.
          </li>
          <li>
            <span className={cn(styles['highlight'])}>“Courses”</span>- explore
            and complete courses that complement your academic achievements.
            “Test Prep” - research and prepare you for standards tests such as
            PSAT/SAT/ACT, receive personalized online courses and tutoring
            services to improve your scores.
          </li>
          <li>
            <span className={cn(styles['highlight'])}>
              “Extracurricular Activities”
            </span>
            - research and track your participation in summer programs, student
            organizations and virtual project collaboration.
          </li>
          <li>
            <span className={cn(styles['highlight'])}>“College Search”</span>-
            find the college and major that meet your needs and interests,
            culture and social life, within your financial budget.
          </li>
          <li>
            <span className={cn(styles['highlight'])}>“Essays”</span>- browse
            exemplary essays from the specific colleges, topics and prompts.
            Have your own drafted, shared with your reviewers and manage the
            process with ease.
          </li>
          <li>
            <span className={cn(styles['highlight'])}>
              “Admissions Management”
            </span>
            - get organized and make a to-do list for applications, such as
            deadlines, number of essays/LoRs needed, interview or not etc. for
            each college.
          </li>
          <li>
            <span className={cn(styles['highlight'])}>“Financial Aid”</span>-
            browse thousands of scholarships and financial aids, and find the
            ones you want to apply for, by award type, amount, qualified
            institutions at which the award can be used, etc.
          </li>
          <li>
            <span className={cn(styles['highlight'])}>
              “Podcasts & Articles”
            </span>
            - thousands of podcasts, and articles to provide the relevant and
            latest tips and guidance.
          </li>
        </ul>

        <h2>2. Auto Pilot</h2>
        <img
          src={image2}
          alt="auto pilot screenshot"
          className={cn(styles['image2'])}
        />
        <p>
          If you aren’t exactly sure where you should begin your college journey
          and need a little more guidance,{' '}
          <span className={cn(styles['highlight'])}>“Autopilot”</span> gives you
          weekly tasks according to your school year, and based on your personal
          inputs.{' '}
          <span className={cn(styles['highlight'])}>
            If you complete all those tasks consistently, you should be good to
            go!
          </span>
        </p>

        <h2>3. Support System</h2>
        <img
          src={image3}
          alt="support system screenshot"
          className={cn(styles['image3'])}
        />
        <ul>
          <li>
            <span className={cn(styles['highlight'])}>“Educator Network”</span>-
            you are not alone! Kyros brings a community with highly-qualified
            tutors, counselors, former admissions officers, and study buddies.
            You can organize them in your contact list, and connect with them on
            Public Channel, Private Channel or Direct Message.
          </li>
          <li>
            <span className={cn(styles['highlight'])}>
              “Calendar and Task Management”
            </span>{' '}
            - get organized by using Kyros’ task management, calendar service,
            and appointment booking system with the educators.
          </li>
          <li>
            <span className={cn(styles['highlight'])}>
              “Reports and Analysis”
            </span>
            - a set of comprehensive reports and analysis, including task
            accomplishment, and week-by-week, month-by-month, year-by-year
            tracking. The unique qualitative and quantitative analysis leverages
            Big Data to provide you with resumes from students like you, then
            benchmark and chance you against the college admitted student’s
            profiles.
          </li>
        </ul>
      </div>
      <div className={cn(styles['footer'])}>
        <div className={cn(styles['footer-logo'])}></div>
        <div className={cn(styles['footer-learn-more'])}></div>
        <div className={cn(styles['footer-info'])}>
          <span>
            Email Us |{' '}
            <span className={cn(styles['highlight'])}>info@kyros.ai</span>
          </span>
          <span>
            Follow us on{' '}
            <span className={cn(styles['highlight'])}>
              YouTube Channel "Rise With Kyros"
            </span>
          </span>
          <span>
            Attend our free counseling session |{' '}
            <a
              className={cn(styles['highlight" href="www.kyros.ai/counseling'])}
            >
              www.kyros.ai/counseling
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductBrochure;
