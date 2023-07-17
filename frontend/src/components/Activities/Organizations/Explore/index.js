import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

import Picture from '../../../../util/Picture';
import FrameCard from '../../../../util/FrameCard';
import ECAService from '../../../../service/ECAService';
import * as ROUTES from '../../../../constants/routes';

import style from './style.module.scss';

const ListOfPrograms = React.memo(({ type }) => {
  const [programs, setPrograms] = React.useState([]);
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const headerRef = React.useRef();
  const history = useHistory();

  React.useEffect(() => {
    ECAService.getProgramsByType(type.id).then((result) => {
      setPrograms(result);
    });
  }, [type]);
  const showedPrograms = isCollapsed ? programs.slice(0, 3) : programs;

  const toggleCollapseState = () => {
    setIsCollapsed(!isCollapsed);
    headerRef.current.scrollIntoViewIfNeeded();
  };

  const openProgramDetails = (program) => {
    history.push(`${ROUTES.PROGRAM_DETAILS}?programId=${program.id}`);
  };

  return showedPrograms.length ? (
    <section className={style.container}>
      <h2 className={style.header} ref={headerRef}>
        {type.name}
      </h2>
      <Container className='App-grid-list' fluid>
        {showedPrograms.map((program) => (
          <FrameCard
            key={program.id}
            onClick={() => openProgramDetails(program)}
            img={<Picture id={type.picture_id} customLoading='Loading...' />}
          >
            <h6 title={program.title}>{program.title}</h6>
            <p title={program.description}>
              {program.description}
            </p>
          </FrameCard>
        ))}
        {programs.length > 3 && (
          <Col className={style.seeMoreButton}>
            <Button variant="link" className={style.link} onClick={toggleCollapseState}>
              {isCollapsed ? 'Show more' : 'Show less'}
            </Button>
          </Col>
        )}
      </Container>
    </section>
  ) : null;
});

const ListOfTypes = React.memo(({ category: { id, name } }) => {
  const [types, setTypes] = React.useState([]);

  React.useEffect(() => {
    ECAService.getTypesByCategory(id).then((result) => {
      setTypes(result);
    });
  }, [id]);

  return (
    <section className={style.container}>
      {types.map((type) => (
        <ListOfPrograms key={type.id} type={type} />
      ))}
    </section>
  );
});

const Explore = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    ECAService.getCategories()
      .then((result) => {
        setCategories(result.filter((i) => i.id !== 21));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div style={{ overflowY: 'auto' }}>
      {isLoading ? (
        <p className={style.loading}>Loading...</p>
      ) : (
        categories.map((category) => <ListOfTypes key={category.id} category={category} />)
      )}
    </div>
  );
};

export default React.memo(Explore);
