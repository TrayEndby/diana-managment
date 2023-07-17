import React from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

import FrameCard from '../../../../util/FrameCard';
import ECAService from '../../../../service/ECAService';
import * as ROUTES from '../../../../constants/routes';

import style from '../../Organizations/Explore/style.module.scss';
import { IMG_PLACEHOLDER } from 'constants/placeholders';

const List = React.memo(({ programs }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const history = useHistory();

  const showedOrganizations = isCollapsed ? programs.slice(0, 20) : programs;
  const toggleCollapseState = () => {
    setIsCollapsed(!isCollapsed);
  };

  const openOrganizationDetails = (programId) => {
    history.push(`${ROUTES.PROGRAM_DETAILS}?&programId=${programId}`);
  };
  return (
    <section className={style.container}>
      <Container className="App-grid-list" fluid>
        {showedOrganizations.map((org) => (
          <FrameCard
            key={org.id}
            className={style.card}
            onClick={() => openOrganizationDetails(org.id)}
            img={
              <Card.Img src={org?.picture_url || IMG_PLACEHOLDER} />
            }
          >
            <h6 title={org.name}>{org.title}</h6>
            <p title={org.source}>
              {org.source}
            </p>
            <p title={org.description}>
              {org.description}
            </p>
            <Card.Link
              rel="nofollow noopener"
              target="_blank"
              href={org.url}
              onClick={(e) => e.stopPropagation()}
              className={style.subtext}
              title={org.url}
            >
              Website
            </Card.Link>
          </FrameCard>
        ))}
        {programs.length > 20 && (
          <Col className={style.seeMoreButton}>
            <Button variant="link" className={style.link} onClick={toggleCollapseState}>
              {isCollapsed ? 'Show more' : 'Show less'}
            </Button>
          </Col>
        )}
      </Container>
    </section>
  );
});

const Explore = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [programs, setPrograms] = React.useState([]);

  React.useEffect(() => {
    ECAService.getSummerPrograms()
      .then((result) => {
        setPrograms(result);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return <div>{isLoading ? <p className={style.loading}>Loading...</p> : <List programs={programs} />}</div>;
};

export default React.memo(Explore);
