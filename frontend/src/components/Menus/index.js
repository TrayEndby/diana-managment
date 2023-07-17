import React from 'react';
import cn from 'classnames';

import AnnualPlanningIcon from 'assets/menus/AnnualPlanning.svg';
import CourseIcon from 'assets/menus/Courses.svg';
import TestPrepIcon from 'assets/menus/TestPrep.svg';
import ECAIcon from 'assets/menus/ECA.svg';
import CollegeIcon from 'assets/menus/CollegeSearch.svg';
import EssayIcon from 'assets/menus/Essays.svg';
import AdmissionIcon from 'assets/menus/AdmissionsManagement.svg';
import FinancialAidIcon from 'assets/menus/FinancialAID.svg';
import PodcastsIcon from 'assets/menus/Podcasts_Articles.svg';

import MenuCard from './MenuCard';
import HelpCenter from 'components/HelpCenter';
import ArrowNavIcon from 'util/ArrowNavIcon';

import * as ROUTES from 'constants/routes';
import styles from './style.module.scss';

const propTypes = {};

const menus = [
  {
    icon: AnnualPlanningIcon,
    text: 'Annual Planning',
    description: '',
    path: ROUTES.GOAL,
  },
  {
    icon: CourseIcon,
    text: 'Course',
    description:
      'Explore and complete online courses that support your academic and extracurricular needs or interests',
    path: ROUTES.COURSE,
  },
  {
    icon: TestPrepIcon,
    text: 'Test Prep',
    description:
      'Track your preparation for standardized tests such as the SAT/ACT and receive personalized online course and tutoring recommendations for improving your scores',
    path: ROUTES.TEST_PREP_CHANNEL,
  },
  {
    icon: ECAIcon,
    text: 'Extracurricular Activity ',
    description:
      'Track your participation in student organizations and summer programs, and browse new organizations and programs that spark your interest',
    path: ROUTES.PROGRAMS_EXPLORE,
  },
  {
    icon: CollegeIcon,
    text: 'College Search ',
    description:
      'Find and research the colleges that match your needs and interests',
    path: ROUTES.COLLEGE_SEARCH,
  },
  {
    icon: EssayIcon,
    text: 'Essays',
    description:
      'Browse exemplary college application essays, write your own essays, and manage your essay progress',
    path: ROUTES.ESSAY,
  },
  {
    icon: AdmissionIcon,
    text: 'Admissions Management',
    description:
      'Manage your college application materials and deadlines for each school to which you are applying',
    path: ROUTES.ADMISSIONS,
  },
  {
    icon: FinancialAidIcon,
    text: 'Financial Aid',
    description:
      'Browse and complete scholarship and financial aid applications',
    path: ROUTES.FIN_AID_SEARCH,
  },
  {
    icon: PodcastsIcon,
    text: 'Podcasts & Articles',
    description: '',
    path: ROUTES.RESOURCES,
  },
];

const Menus = () => {
  return (
    <div className={cn('App-body', styles.container)}>
      <ArrowNavIcon direction="left" text="Task Manager" path={ROUTES.TASKS} />
      <div className={styles.menus}>
        {menus.map((menu, index) => (
          <MenuCard key={index} {...menu} />
        ))}
      </div>
      <ArrowNavIcon
        direction="right"
        text="Autopilot"
        path={ROUTES.MY_EVOLUTION}
      />
      <HelpCenter />
    </div>
  );
};

Menus.propTypes = propTypes;

export default Menus;
