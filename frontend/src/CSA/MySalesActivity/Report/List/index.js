import React, { useEffect, useState } from 'react';

import { ListUl } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';

import Table from '../../Prospect/Table';
import Container from 'CSA/Container';

import Body from 'util/Body';
import MoneyText from 'util/MoneyText';
import useErrorHandler from 'util/hooks/useErrorHandler';
import myContactsService from 'service/CSA/MyContactsService';
import * as CSA_ROUTES from 'constants/CSA/routes';

import style from './style.module.scss';

const propTypes = {};

const headers = [
  {
    key: 'name',
    text: 'Customer Name',
    onClick: (history, row) => {
      history.push(`${CSA_ROUTES.SALES_REPORT_DETAIL}`, {
        customer: row,
      });
    },
  },
  { key: 'subscription_start_date', text: 'Start Date', sortable: true },
  { key: 'subscription_renew_date', text: 'Renew Date', sortable: true },
  { key: 'subscription_amount', text: 'Amount', sortable: true, render: (value) => <MoneyText value={value} /> },
  { key: 'is_student', text: 'Student?', sortable: true, render: (value) => value ? 'Yes' : 'No' },
  { key: 'num_of_children', text: 'Number of children', sortable: true },
];

const CustomerListSection = () => {
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [error, setError] = useErrorHandler();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const customers = await myContactsService.getCustomers();
        setLists(customers || []);
        setFilteredLists(customers || []);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [setError]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchKey(value);
    const searchKey = value.trim().toLowerCase();
    const filtered = lists.filter(({ name }) => name.toLowerCase().includes(searchKey));
    setFilteredLists(filtered);
  };

  return (
    <Container title="Customer Report" className="App-body">
      <Body loading={loading} error={error}>
        <div className={style.listContainer}>
          <header className={style.header}>
            <ListUl size={20} />
            <h5>Customer List</h5>
            <div className={style.search}>
              <Form.Control type="text" placeholder="Search list" value={searchKey} onChange={handleSearch} />
            </div>
          </header>
          <Table headers={headers} rows={filteredLists} total={lists.length} />
        </div>
      </Body>
    </Container>
  );
};

CustomerListSection.propTypes = propTypes;

export default CustomerListSection;
