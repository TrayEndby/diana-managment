import React, { useState, useEffect, useCallback } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { formatNumber } from 'util/helpers';
import style from './style.module.scss';

const propTypes = {
  history: PropTypes.array,
  updatePersonalAmount: PropTypes.func,
  updateDownlineAmount: PropTypes.func,
  updateTotalAmount: PropTypes.func,
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const initialState = {
  type: '0',
  year: '2020',
  month: '0',
  total: 0,
};

const TransactionHistorySection = (props) => {
  const [transType, setTransType] = useState(initialState.type);
  const [transYear, setTransYear] = useState(initialState.year);
  const [transMonth, setTransMonth] = useState(initialState.month);
  const [totalAmount, setTotalAmount] = useState(initialState.total);
  const [history, setHistory] = useState([]);
  const [rowCount, setRowCount] = useState(1);

  const {
    history: propsHistory,
    updatePersonalAmount,
    updateDownlineAmount,
    updateTotalAmount,
  } = props;

  const filterHistory = useCallback(
    (transType, transYear, transMonth, totalAmount) => {
      let personalAmt = 0;
      let downlineAmt = 0;
      let totalAmt = 0;

      let historyList = propsHistory.reduce((total, his) => {
        const historyDate = new Date(his.date);
        const nowDate = new Date();

        if (
          historyDate.getMonth() === nowDate.getMonth() &&
          historyDate.getFullYear() === nowDate.getFullYear()
        ) {
          if (parseInt(his.type) === 1) personalAmt += parseInt(his.amount);
          if (parseInt(his.type) === 2) downlineAmt += parseInt(his.amount);
        }

        if (
          parseInt(transMonth) !== 0 &&
          historyDate.getMonth() + 1 !== parseInt(transMonth)
        )
          return total;
        if (parseInt(historyDate.getFullYear()) !== parseInt(transYear))
          return total;
        if (
          parseInt(transType) !== 0 &&
          parseInt(his.type) !== parseInt(transType)
        )
          return total;

        let historyDateString = `${
          months[historyDate.getMonth()]
        } ${historyDate.getDate()}, ${historyDate.getFullYear()}`;

        totalAmt += parseInt(his.amount);

        return total.concat([{ ...his, date: historyDateString }]);
      }, []);
      setHistory(historyList);
      setTotalAmount(totalAmt);
      updatePersonalAmount(personalAmt);
      updateDownlineAmount(downlineAmt);
      updateTotalAmount(totalAmount);
    },
    [
      propsHistory,
      updatePersonalAmount,
      updateDownlineAmount,
      updateTotalAmount,
    ],
  );

  useEffect(() => {
    filterHistory(
      initialState.type,
      initialState.year,
      initialState.month,
      initialState.total,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTransType = (event) => {
    const type = event.target.value;
    setTransType(type);
    setRowCount(1);
    filterHistory(type, transYear, transMonth, totalAmount);
  };

  const handleTransYear = (event) => {
    const year = event.target.value;
    setTransYear(year);
    setRowCount(1);
    filterHistory(transType, year, transMonth, totalAmount);
  };

  const handleTransMonth = (event) => {
    const month = event.target.value;
    setTransMonth(event.target.value);
    setRowCount(1);
    filterHistory(transType, transYear, month, totalAmount);
  };

  return (
    <div className={style.transactionHistory}>
      <div className={style.historyHeaderDiv}>
        <div className={style.transactionHistoryLabel}>Transaction history</div>
        <Form.Control
          required
          as="select"
          style={{ width: '19%', marginRight: '3%', float: 'left' }}
          onChange={(e) => handleTransType(e)}
        >
          <option value="0">All transactions</option>
          <option value="1">Personal commission</option>
          <option value="2">Downline commission</option>
        </Form.Control>
        <Form.Control
          required
          as="select"
          style={{ width: '10%', marginRight: '3%', float: 'left' }}
          onChange={(e) => handleTransYear(e)}
        >
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
        </Form.Control>
        <Form.Control
          required
          as="select"
          style={{ width: '15%' }}
          onChange={(e) => handleTransMonth(e)}
        >
          <option value="0">All months</option>
          {months.map((month, idx) => (
            <option key={idx} value={idx + 1}>
              {month}
            </option>
          ))}
        </Form.Control>
      </div>
      <div className={style.tableDiv}>
        <Table borderless className={style.table}>
          <thead className={style.thead}>
            <tr>
              <th>Date</th>
              <th>Transaction by</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {history.map(
              (his, idx) =>
                his != null &&
                idx < rowCount * 10 && (
                  <tr key={idx}>
                    <td>{his.date}</td>
                    <td>{his.user_name}</td>
                    <td>
                      {parseInt(his.type) === 1
                        ? 'Personal Commission'
                        : 'Downline Commission'}
                    </td>
                    <td>${formatNumber(his.amount)}</td>
                  </tr>
                ),
            )}
            <tr style={{ backgroundColor: '#152332' }}>
              <td style={{ color: '#f78154' }}>Total Amount</td>
              <td></td>
              <td></td>
              <td style={{ color: 'white' }}>${formatNumber(totalAmount)}</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <Button
        variant="primary"
        onClick={() => setRowCount(rowCount + 1)}
        style={{ width: '150px', height: '45px', marginBottom: '16px' }}
      >
        See more...
      </Button>
    </div>
  );
};

TransactionHistorySection.propTypes = propTypes;

export default TransactionHistorySection;
