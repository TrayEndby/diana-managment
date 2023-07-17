import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import CourseList from '../../List';

import courseService from '../../../../service/CourseService';

import styles from './style.module.scss';

const propTypes = {
  subjectId: PropTypes.number,
  onFetchCategories: PropTypes.func.isRequired,
  onFetchCoursesInCategory: PropTypes.func.isRequired,
};

class ChannelBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      categories: [], // [{id: number, name: string, courses: [{id: number, title: string}]}],
      level: [], // a array of object for each level from course to unit, to unit_videos, level: [{item: object, name: string, onClick: Func}]
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.subjectId !== prevProps.subjectId) {
      this.fetchCategories();
    } else if (this.props.location && this.props.location.search && this.props.location.search.includes('home')) {
      this.fetchCategories();
      this.props.history.push(this.props.location.pathname);
    }
  }

  toggleLoading = (loading) => {
    this.setState({ loading });
  };

  refresh = (level) => {
    this.setState({
      level: [...level],
      error: null,
    });
  };

  handleError(error) {
    console.error(error);
    this.setState({
      error: error.message,
    });
  }

  fetchCategories = async () => {
    try {
      this.toggleLoading(true);
      const { subjectId, onFetchCategories } = this.props;
      const categories = await onFetchCategories(subjectId);
      if (categories.length) {
        this.setState({
          categories,
          level: [],
          error: null,
        });
      } else {
        this.handleNoCategoryCase();
      }
    } catch (e) {
      this.handleError(e);
    } finally {
      this.toggleLoading(false);
    }
  };

  gotoSubject = () => {
    this.setState({
      level: [],
      error: null,
    });
  };

  // when the subject has no categories and
  // subjectId should be used to fetch course directly
  handleNoCategoryCase = () => {
    let { subjectId } = this.props;
    let categories = [];
    let category = { id: subjectId };
    categories[-1] = category; // a very special way to store category
    this.setState({
      categories,
      level: [],
      error: null,
    });
    this.gotoCategory(category);
  };

  gotoCategory = async (category) => {
    try {
      let courses = category.courses;
      if (courses == null) {
        courses = await this.props.onFetchCoursesInCategory(category.id);
      }
      category.courses = courses;
      let level = this.state.level;
      level = [
        {
          item: category,
          name: category.name,
          onClick: () => this.gotoCategory(category),
        },
      ];
      this.refresh(level);
    } catch (e) {
      this.handleError(e);
    }
  };

  goToCourse = async (course) => {
    try {
      let units = course.units;
      if (units == null) {
        units = await courseService.listUnitsInCourse(course.id);
      }
      course.units = units;
      let level = this.state.level;
      level[1] = {
        item: course,
        name: course.title,
        onClick: () => this.goToCourse(course),
      };
      level = level.slice(0, 2);
      this.refresh(level);
    } catch (e) {
      this.handleError(e);
    }
  };

  goToUnit = async (unit) => {
    try {
      let videos = unit.videos;
      if (videos == null) {
        videos = await courseService.listUnitVideo(unit.id);
      }
      unit.videos = videos;
      const level = this.state.level;
      const { section_number, unit_number } = unit;
      let name = `Unit ${unit_number}`;
      if (section_number != null) {
        name = `Section ${section_number} ${name}`;
      }
      level[2] = {
        item: unit,
        name,
        onClick: () => this.goToUnit(unit),
      };
      this.refresh(level);
    } catch (e) {
      this.handleError(e);
    }
  };

  getListToView() {
    switch (this.state.level.length) {
      case 1:
        let category = this.state.level[0].item;
        return <SubjectList courses={category.courses} onClick={this.goToCourse} />;
      case 2:
        let course = this.state.level[1].item;
        return <UnitList units={course.units} onClick={this.goToUnit} />;
      case 3:
        let unit = this.state.level[2].item;
        return <CourseList courses={unit.videos} view="grid" />;
      default:
        return <CategoryList categories={this.state.categories} onClick={this.gotoCategory} />;
    }
  }

  render() {
    const { error, loading, categories, level } = this.state;
    return (
      <div className={styles.borad}>
        <Breadcrumb>
          {categories[-1] == null && <Breadcrumb.Item onClick={this.gotoSubject}>Subject</Breadcrumb.Item>}
          {level &&
            level.map((item, index) => (
              <Breadcrumb.Item key={index} onClick={item.onClick}>
                {/* can only be Subject when categories has -1 item  */}
                {item.name || 'Subject'}
              </Breadcrumb.Item>
            ))}
        </Breadcrumb>
        <div className="h-100 overflow-auto py-1">
          {error && <div className="text-center w-100">{error}</div>}
          {loading && <div className="text-white">Loadig...</div>}
          {!loading && !error && this.getListToView()}
        </div>
      </div>
    );
  }
}

const GeneralList = ({ children, onClick }) => (
  <Card className="rounded-0 px" style={{ marginTop: '-1px' }}>
    <Card.Title className="mb-0">
      <Button variant="link" onClick={onClick}>
        {children}
      </Button>
    </Card.Title>
  </Card>
);

const CategoryList = ({ categories, onClick }) => {
  return (
    <>
      {categories.map((category) => {
        let { id, name } = category;
        return (
          <GeneralList key={id} onClick={() => onClick(category)}>
            {name}
          </GeneralList>
        );
      })}
    </>
  );
};

const SubjectList = ({ courses, onClick }) => {
  if (!courses.length) {
    return <div className="text-white">No courses available</div>;
  }
  return (
    <>
      {courses.map((course) => {
        let { id, title } = course;
        return (
          <GeneralList key={id} onClick={() => onClick(course)}>
            {title}
          </GeneralList>
        );
      })}
    </>
  );
};

const UnitList = ({ units, onClick }) => {
  // order units by section
  let sectionName = [];
  let sections = []; // [[s1_unit1, s1_unit2], [s2_unit1...], ...]
  let noSectionUnit = [];
  units.forEach((unit) => {
    let { section_number, unit_number } = unit;
    if (section_number == null) {
      // section_number may not included
      noSectionUnit[unit_number] = unit;
    } else {
      if (!sections[section_number]) {
        sections[section_number] = [];
        sectionName[section_number] = unit.section;
      }
      sections[section_number][unit_number] = unit;
    }
  });
  sections.push(noSectionUnit);
  return (
    <>
      {sections.map((units, index) => {
        if (!units) {
          return null;
        }
        return (
          <section key={index}>
            {sectionName[index] && <h5 className="text-white">{`Section ${index}: ${sectionName[index]}`}</h5>}
            <div>
              {units.map((unit) => {
                let { id, unit_number, topic, description } = unit;
                return (
                  <Card key={id} className="mb-2 rounded-0">
                    <Card.Title className="mb-0">
                      <Button variant="link" className="text-left" onClick={() => onClick(unit)}>
                        {`Unit ${unit_number}: ${topic}`}
                      </Button>
                    </Card.Title>
                    <Card.Body className="py-1 px-3">{description}</Card.Body>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
};

ChannelBoard.propTypes = propTypes;

export default withRouter(ChannelBoard);
