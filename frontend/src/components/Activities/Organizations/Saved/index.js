import React from 'react';
import moment from 'moment';
import { Container, Table } from 'react-bootstrap';

import ECAService from '../../../../service/ECAService';
import * as ROUTES from '../../../../constants/routes';

import style from './style.module.scss';
import { CaretDownFill } from 'react-bootstrap-icons';
import { useHistory } from 'react-router-dom';

const Saved = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [programs, setPrograms] = React.useState([]);

  const history = useHistory();

  React.useEffect(() => {
    ECAService.getCategories().then((categories) => {
      ECAService.getSavedPrograms()
        .then(({ savedPrograms }) => {
          const extendedPrograms = savedPrograms
            .filter((p) => p.category !== 21)
            .map((p) => {
              const category = categories.find((c) => c.id === p.category);
              return { ...p, categoryName: category ? category.name : '' };
            });
          setPrograms(extendedPrograms);
        })
        .finally(() => setIsLoading(false));
    });
  }, []);

  return isLoading ? (
    <h1 className={style.loading}>Loading...</h1>
  ) : programs.length === 0 ? (
    <h1 className={style.loading}>You haven't saved programs</h1>
  ) : (
    <Container fluid>
      <Table striped borderless responsive hover className={style.table}>
        <thead>
          <tr>
            <th>
              <span>Name</span>
              <CaretDownFill />
            </th>
            <th>
              <span>Category</span>
              <CaretDownFill />
            </th>
            <th width="200">
              <span>Last updated</span>
              <CaretDownFill />
            </th>
          </tr>
        </thead>
        <tbody>
          {programs.map((i) => (
            <tr key={i.id} onClick={() => history.push(`${ROUTES.PROGRAM_DETAILS}?programId=${i.id}`)}>
              <td>{i.title}</td>
              <td>{i.categoryName}</td>
              <td width="200">{moment(i.created_ts).fromNow()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default React.memo(Saved);
