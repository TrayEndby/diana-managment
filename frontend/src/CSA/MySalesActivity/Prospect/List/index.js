import React, { useCallback, useEffect, useState } from 'react';

import { ListUl, Plus } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import ProspectForm from '../Form';
import Table from '../Table';
import Container from 'CSA/Container';

import Body from 'util/Body';
import MoneyText from 'util/MoneyText';
import useErrorHandler from 'util/hooks/useErrorHandler';
import { getNameFromId } from 'util/helpers';
import prospectService from 'service/CSA/ProspectService';
import * as CSA_ROUTES from 'constants/CSA/routes';

import style from './style.module.scss';

const propTypes = {};

const headers = [
  {
    key: 'name',
    text: 'Prospect Name',
    onClick: (history, row) => {
      history.push(`${CSA_ROUTES.SALES_PROSPECT_EDIT}/${row.prospect_id}`);
    },
  },
  { key: 'starting_date', text: 'Start Date', sortable: true },
  { key: 'closing_date', text: 'Close Date', sortable: true },
  { key: 'estimated_amount', text: 'Amount', sortable: true, render: (value) => <MoneyText value={value} /> },
  { key: 'stage', text: 'Stage', sortable: true },
  {
    key: 'motivation',
    text: 'Motivation to buy',
    render: (value) => {
      if (value && value.startsWith('Other')) {
        return value.split(':')[1];
      } else {
        return value;
      }
    },
  },
];

const ProspectListSection = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [stageList, setStageList] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [error, setError] = useErrorHandler();

  const fetchList = useCallback(
    async (stageList) => {
      try {
        const res = await prospectService.listAll();
        const lists = res.map((list) => {
          const stage = getNameFromId(stageList, list.stage);
          return {
            ...list,
            stage: stage?.name,
          };
        });
        setLists(lists);
        setFilteredLists(lists);
      } catch (e) {
        setError(e);
      }
    },
    [setError],
  );

  const fetchStage = useCallback(async () => {
    const res = await prospectService.listStage();
    setStageList(res);
    return res;
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchKey(value);
    const searchKey = value.trim().toLowerCase();
    const filtered = lists.filter(
      ({ first_name, last_name }) =>
        first_name.toLowerCase().includes(searchKey) || last_name.toLowerCase().includes(searchKey),
    );
    setFilteredLists(filtered);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const stageList = await fetchStage();
        await fetchList(stageList);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchList, fetchStage, setError]);

  return (
    <Container title="Prospecting" className="App-body">
      <Body loading={loading} error={error}>
        <div className={style.listContainer}>
          <header className={style.header}>
            <ListUl size={20} />
            <h5>Prospect List</h5>
            <div className={style.search}>
              <Form.Control type="text" placeholder="Search list" value={searchKey} onChange={handleSearch} />
            </div>
            <Button onClick={() => setShowNewForm(true)}>
              <Plus />
              <span>New</span>
            </Button>
          </header>
          <Table headers={headers} rows={filteredLists} total={lists.length} />
        </div>
      </Body>
      {showNewForm && (
        <Modal size="lg" show={true} onHide={() => setShowNewForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add prospect</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: 0, height: '80vh' }}>
            <ProspectForm
              onSubmit={() => {
                fetchList(stageList);
                setShowNewForm(false);
              }}
            />
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

ProspectListSection.propTypes = propTypes;

export default ProspectListSection;
