import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CDataTable,
  CButton,
  CInput,
  CInputGroup,
  CInputGroupText,
  CInputGroupPrepend,
} from "@coreui/react";

import moment from "moment-timezone";
import TheLayout from "containers/TheLayout";
import UserService from "service/Admin/UserService";

const UserTransaction = () => {
  const itemsPerPage = 20;
  const [isloading, setLoading] = useState(true);
  const [txList, setTxList] = useState([]);
  const [totalPayment, setTotalPayment] = useState('');
  const [paymentViaCSA, setPaymentViaCSA] = useState('');

  const keyList = useMemo(() => [
    "email",
    "username",
    "payment_date",
    "csa_code",
    "csa_name",
    "csa_email",
    "coupon_code",
    "multi_year_discount",
    "order_total",
    "promo_code",
    "promo_discount",
    "months",
    "children_emails",
  ], []);

  const fields = [
    { label: "#", key: "rowNo", _style: {width: "1%"} },
    { label: "Name", key: "username" },
    { label: "Email", key: "email" },
    { label: "Order Total($)", key: "order_total" },
    { label: "Payment Date", key: "payment_date" },
    { label: "Subscription Months", key: "months" },
    { label: "Renewal Date", key: "renewal_date" },
    { label: "Children Emails", key: "children_emails" },
    { label: "CSA Code", key: "csa_code" },
    { label: "CSA Name", key: "csa_name" },
    { label: "CSA Email", key: "csa_email" },
    { label: "Coupon Code", key: "coupon_code" },
    { label: "Promo Discount", key: "promo_discount" },
    { label: "MultiYear Discount", key: "multi_year_discount" },
  ];

  const getTransactions = useCallback(async (params) => {
    try {
      setLoading(true);
      const tx = await UserService.getUserTransactions(params);
      let csaCodes = {};
      let total = 0.0;
      let csaPay = 0.0;
      const txList = tx.map((t, index) => {
        let obj = JSON.parse(t.transactionJson);
        let paymentDate = moment(t.updatedTs);
        let entry = {
          ...t,
          ...obj,
          payment_date: paymentDate.format("YYYY-MM-DD"),
        };
        if ("lastName" in t) {
          entry.username = t.firstName + " " + t.lastName;
        }
        let childrenEmails = []
        obj.item.forEach((value, index) => {
          if (value.user_email.toLowerCase() === entry.email.toLowerCase()) {
            entry.months = Math.round(value.num_years * 12);
            entry.renewal_date = paymentDate.add(entry.months, "months").format("YYYY-MM-DD");
          } else {
            childrenEmails.push(value.user_email);
          }
        });
        entry.children_emails = childrenEmails.join(", ");

        keyList.forEach((key) => {
          if (!(key in entry) || entry[key] == null || entry[key] === 0) {
            entry[key] = "";
          } else {
            if (key === "promo_discount") {
              entry.promo_discount = (entry.promo_discount * 100).toString() + "%";
            } else if (key === "multi_year_discount") {
              entry.multi_year_discount = (entry.multi_year_discount * 100).toString() + "%";
            } else if (key === "csa_code") {
              if (entry.csa_code !== "") {
                entry.csa_code = entry.csa_code.toUpperCase();
                csaCodes[entry.csa_code] = true;
              }
            }
          }
        });
        if (entry?.order_total > 0) {
          total = total + entry.order_total;
          if (entry?.csa_code.length > 0) {
            csaPay += entry.order_total;
          }
          entry.order_total = entry.order_total.toLocaleString('en')
        }
        return entry;
      });
      const csa = await UserService.getCSAByCodes({
        csaCodes: Object.keys(csaCodes),
      });
      csa.forEach((value, index) => {
        csaCodes[value.csa_code] = value;
      });
      setTxList(txList.map((value, index) => {
        if (value.csa_code === "") {
          return value;
        }
        let cv = csaCodes[value.csa_code];
        return {
          ...value,
          csa_name: cv.firstName + " " + cv.lastName,
          csa_email: cv.email,
        };
      }));

      setTotalPayment(total.toLocaleString('en'));
      setPaymentViaCSA(csaPay.toLocaleString('en'));
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [keyList])

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  const handleSort = (field) => {
    if (field.asc) txList.sort((a, b) => a[field.column] - b[field.column]);
    else txList.sort((a, b) => b[field.column] - a[field.column]);
  };

  return (
    <TheLayout title="User Transactions">
      <CCard>
        <CCardHeader>
          <CButton
            color="success"
            shape="pill"
            style={{ marginRight: "24px", float: "left" }}
            onClick={() => getTransactions()}
          >
            Refresh
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CContainer>
            <CRow>
              <CCol>
                <CInputGroup>
                  <CInputGroupPrepend>
                    <CInputGroupText className={'bg-info text-white'}>
                      Total($)
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    disabled={true}
                    style={{backgroundColor: "white"}}
                    value={totalPayment}
                  />
                </CInputGroup>
              </CCol>
              <CCol>
                <CInputGroup style={{float: "right"}}>
                  <CInputGroupPrepend>
                    <CInputGroupText className={'bg-info text-white'}>
                      Total via CSA($)
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    disabled={true}
                    style={{backgroundColor: "white"}}
                    value={paymentViaCSA}
                  />
                </CInputGroup>
              </CCol>
            </CRow>
          </CContainer>
          <hr />
          <CDataTable
            items={txList}
            fields={fields}
            itemsPerPage={itemsPerPage}
            pagination
            tableFilter
            loading={isloading ? true : false}
            border
            sorter
            onSorterValueChange={(field) => handleSort(field)}
            scopedSlots={{
              rowNo: (item, index) => (
                <td>{index+1}</td>
              ),
            }}
          />
        </CCardBody>
      </CCard>
    </TheLayout>
  );
}

export default UserTransaction;
