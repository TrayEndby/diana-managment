import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Row, Button, Container, Col } from 'react-bootstrap';

import ECAService from '../../../../service/ECAService';
import * as ROUTES from '../../../../constants/routes';

import style from './style.module.scss';
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
      <Container className={style.row} fluid>
        <Row>
          {showedOrganizations.map((org) => (
            <Col lg key={org.id} className={style.col} onClick={() => openOrganizationDetails(org.id)}>
              <Card className={style.card}>
                <Card.Img
                  className={style.image}
                  src={org?.picture_url || IMG_PLACEHOLDER}
                />
                <Card.Footer className={style.footer}>
                  <Card.Text title={org.name}>{org.title}</Card.Text>
                  <Card.Text className={style.subtext} title={org.source}>
                    {org.source}
                  </Card.Text>
                  <Card.Text className={style.subtext} title={org.description}>
                    {org.description}
                  </Card.Text>
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
                </Card.Footer>
              </Card>
            </Col>
          ))}
          {programs.length > 20 && (
            <Col className={style.seeMoreButton}>
              <Button variant="link" className={style.link} onClick={toggleCollapseState}>
                {isCollapsed ? 'Show more' : 'Show less'}
              </Button>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
});

const Saved = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [programs, setPrograms] = React.useState([]);

  React.useEffect(() => {
    ECAService.getSavedPrograms()
      .then(({ savedPrograms }) => {
        setPrograms(savedPrograms.filter((p) => p.category === 21));
      })
      .finally(() => setIsLoading(false));
  }, []);

  return <div>{isLoading ? <p className={style.loading}>Loading...</p> : <List programs={programs} />}</div>;
};

export default React.memo(Saved);
