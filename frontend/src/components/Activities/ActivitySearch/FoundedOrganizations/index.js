import React from 'react';
import moment from 'moment';
import { Container, Table } from 'react-bootstrap';

import ECAService from '../../../../service/ECAService';
import * as ROUTES from '../../../../constants/routes';

import style from './style.module.scss';
import { CaretDownFill } from 'react-bootstrap-icons';
import { useHistory, useLocation } from 'react-router-dom';

const FoundedOrganizations = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [programs, setPrograms] = React.useState([]);

  const location = useLocation();
  const history = useHistory();

  React.useEffect(() => {
    ECAService.getCategories().then((categories) => {
      ECAService.findPrograms(decodeURI(location.search.slice(7)))
        .then((result) => {
          const extendedPrograms = result.program
            .filter((p) => p.category !== 21)
            .map((p) => {
              const category = categories.find((c) => c.id === p.category);
              return { ...p, categoryName: category ? category.name : '' };
            });
          setPrograms(extendedPrograms);
        })
        .finally(() => setIsLoading(false));
    });
  }, [location.search]);

  return isLoading ? (
    <h1 className={style.loading}>Loading...</h1>
  ) : programs.length === 0 ? (
    <h1 className={style.loading}>Not Found</h1>
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

export default React.memo(FoundedOrganizations);
