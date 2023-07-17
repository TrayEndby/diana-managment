import React, { useState } from 'react';
import {
  Switch,
  Route,
  Link
} from 'react-router-dom';

import classNames from 'classnames';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import TableBoard from './Table';
import CalendarBoard from './Calendar';
import AdmissionDetails from './Details';

import style from './style.module.scss';
import tableStyle from './Table/style.module.scss';

import * as ROUTES from '../../constants/routes';

const AdmissionsPage = () => {
  return (
    <div className="card-group d-flex flex-row App-body" >
      <section className="leftSection d-flex flex-column col p-0">
        <Switch>
          <Route exact path={ROUTES.ADMISSIONS_CALENDAR}>
            <CalendarPage />
          </Route>
          <Route path={ROUTES.ADMISSIONS}>
            <TablePage tableView={true} />
          </Route>
        </Switch>
      </section>
    </div>
  )
}


const TablePage = ({ tableView }) => {
  const [selectedCollege, setSelectedCollege] = useState();

  let calendarView = (
    <Link to={ROUTES.ADMISSIONS_CALENDAR}>
      <Button className={`ml-auto mr-4 invisible`}>
        Go to Calendar View
      </Button>
    </Link>
  );

  return (
    <AdmissionsLayout
      calendarView={calendarView}
      tableView={tableView}
      selectedCollege={selectedCollege}
      handleSelectedCollege={setSelectedCollege}
    >
      <div className={tableStyle.contentWrap}>
        {
          !selectedCollege ?
            <TableBoard onSelect={setSelectedCollege} />
            :
            <AdmissionDetails collegeInfo={selectedCollege} />
        }
      </div>

    </AdmissionsLayout>
  )
};

const AdmissionsLayout = ({ tableView, calendarView, children, selectedCollege, handleSelectedCollege }) => {
  const tableHeadBtns = (
    <>
      {selectedCollege ?
        (
          <>
            <Button
              className="mr-auto ml-auto ml-md-4"
              onClick={() => handleSelectedCollege(null)}
            >
              Back to overview
            </Button>

          </>
        )
        : (
          <Link
            to={ROUTES.COLLEGE}
            className={`mr-auto ml-auto ml-md-4`}
          >
            <Button className="ml-auto">
              Go to my colleges list
            </Button>
          </Link>
        )
      }
    </>
  );

  const calendarHeadBtns = (
    <>
      <Link
        to={ROUTES.COLLEGE}
        className={`ml-auto ${style.btn}`}
      >
        Go to my colleges list
      </Link>
    </>
  );

  const headlineSectionClasses = classNames(
    'row m-0 rounded-0',
    style.headlineSection,
    { [style["headlineSection--dark"]]: !tableView }
  )
  const headlineClasses = classNames(
    'text-center col-lg',
    style.headline,
    { [style["headline--white"]]: !tableView }
  )

  let selectedCollegeName;
  if (selectedCollege) {
    selectedCollegeName = JSON.parse(selectedCollege.internal).name;
  }

  return (
    <Card className="rounded-0 border-0">
      <Card.Header className={headlineSectionClasses}>
        {tableView ? tableHeadBtns : calendarHeadBtns}
        <h5 className={headlineClasses}>{selectedCollege ? selectedCollegeName : 'Admissions management'}</h5>
        {tableView ? (selectedCollege ? (
          <Button
            className="mr-auto ml-auto mr-md-4"
          >
            Cancel application
          </Button>) : calendarView
        ) : null}
      </Card.Header>
      <Card.Body className={style.cardBody}>
        {children}
      </Card.Body>
    </Card >
  )
};

const CalendarPage = ({ tableView }) => {
  let button = (
    <Link to={ROUTES.ADMISSIONS}>
      <Button className={`ml-auto ${style.btn}`}>
        Go to table view
      </Button>
    </Link>
  );
  return (
    <AdmissionsLayout calendarView={button} tableView={tableView}>
      <CalendarBoard />
    </AdmissionsLayout>
  )
};




export default AdmissionsPage;