import React from 'react';
import moment from 'moment';
import { Container, Table } from 'react-bootstrap';

import ECAService from '../../../../service/ECAService';
import * as ROUTES from '../../../../constants/routes';

import style from './style.module.scss';
import { CaretDownFill } from 'react-bootstrap-icons';
import { useHistory } from 'react-router-dom';

const Current = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [programs, setPrograms] = React.useState([]);

  const history = useHistory();

  React.useEffect(() => {
    ECAService.getCurrentPrograms()
      .then(async (rawPrograms) => {
        setIsLoading(true);
        const categories = await ECAService.getCategories();
        const result = [];
        for (const program of rawPrograms) {
          if (program.category === 21) {
            continue;
          }
          const category = categories.find(({ id }) => id === program.category);
          result.push({ ...program, categoryName: category.name });
        }
        setPrograms(result);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return isLoading ? (
    <h1 className={style.loading}>Loading...</h1>
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

export default React.memo(Current);
