import React from 'react';
import { Container, Table, Pagination } from 'react-bootstrap';

import ECAService from 'service/ECAService';
import * as ROUTES from 'constants/routes';

import style from './style.module.scss';
import { CaretDownFill } from 'react-bootstrap-icons';
import { useHistory, useLocation } from 'react-router-dom';

const Paging = ({ pageNumber, totalPages, onClick }) => {
  if (totalPages <= 1) {
    return null;
  }
  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === totalPages;
  // show 10 page items based on the current page number
  let startPage = 1;
  let endPage = Math.min(10, totalPages);
  if (totalPages > 10) {
    startPage = Math.max(1, pageNumber - 5);
    endPage = Math.min(startPage + 9, totalPages);
    startPage = Math.min(startPage, endPage - 9);
  }
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return (
    <Pagination className={style.pagination}>
      {!isFirstPage && <Pagination.First onClick={() => onClick(1)} />}
      {!isFirstPage && <Pagination.Prev onClick={() => onClick(pageNumber - 1)} />}
      {pages.map((page) => {
        return (
          <Pagination.Item key={page} active={page === pageNumber} onClick={() => onClick(page)}>
            {page}
          </Pagination.Item>
        );
      })}
      {!isLastPage && <Pagination.Next onClick={() => onClick(pageNumber + 1)} />}
      {!isLastPage && <Pagination.Last onClick={() => onClick(totalPages)} />}
    </Pagination>
  );
};

const FoundedSummerPograms = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [programs, setPrograms] = React.useState([]);

  const [pageNumber, setPageNumber] = React.useState(1);
  const [totalRows, setTotalRows] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const rowsPerPage = 20;

  const location = useLocation();
  const history = useHistory();

  React.useEffect(() => {
    ECAService.getCategories().then((categories) => {
      const search = location.search.replace(/%20/g, ' ');
      const searchParams = search.split(';');
      let selParams = '';
      if (searchParams[0].indexOf('s=') === -1) selParams = search;
      else selParams = searchParams[0].substr(searchParams[0].indexOf('s=') + 2);
      let locParams = '';
      if (searchParams.length > 1) locParams = searchParams[1].substr(searchParams[1].indexOf('l=') + 2);
      let queryParams = '';
      if (searchParams.length > 2) queryParams = searchParams[2].substr(searchParams[2].indexOf('q=') + 2);
      let tagParams = '';
      if (searchParams.length > 3) tagParams = searchParams[3].substr(searchParams[3].indexOf('t=') + 2);
      let wordParams = '';
      if (searchParams.length > 4) wordParams = searchParams[4];

      // const searchCriteria = {
      //   mode: 'program',
      //   program: { category: 21 },
      // };
      const searchCriteria = {
        mode: 'program',
        program: { type: 283 },
      };
      if (selParams.length > 0 && searchParams[0].indexOf('s=') !== -1)
        searchCriteria.program.selectiveness = selParams;
      if (locParams.length > 0) searchCriteria.program.location = locParams;
      if (queryParams.length > 0) searchCriteria.program.subject = queryParams;
      if (tagParams.length > 0) searchCriteria.program.tags = tagParams;

      if (searchParams[0].indexOf('s=') === -1) 
        searchCriteria.query = selParams.substr(1);
      else
        searchCriteria.query = wordParams;
      ECAService.findPrograms(searchCriteria, (pageNumber - 1) * rowsPerPage)
        .then((result) => {
          const extendedPrograms = result.program
            .filter((p) => p.category === 21)
            .map((p) => {
              const category = categories.find((c) => c.id === p.category);
              return { ...p, categoryName: category ? category.name : '' };
            });
          setPrograms(extendedPrograms);
          setTotalRows(result.totalRows);
          setTotalPages(Math.ceil(result.totalRows / rowsPerPage));
        })
        .finally(() => setIsLoading(false));
    });
  }, [location.search, pageNumber]);

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
              <span>Location</span>
              <CaretDownFill />
            </th>
            {/* <th width="200">
              <span>Last updated</span>
              <CaretDownFill />
            </th> */}
          </tr>
        </thead>
        <tbody>
          {programs.map((i) => (
            <tr key={i.id} onClick={() => history.push(`${ROUTES.PROGRAM_DETAILS}?programId=${i.id}`)}>
              <td>{i.title}</td>
              <td>{i.location}</td>
              {/* <td width="200">{moment(i.created_ts).fromNow()}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
      <div className={style.paging}>
        <Paging pageNumber={pageNumber} totalRows={totalRows} totalPages={totalPages} onClick={setPageNumber} />
      </div>
    </Container>
  );
};

export default React.memo(FoundedSummerPograms);
