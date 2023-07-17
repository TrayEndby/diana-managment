import React, { useEffect, useState } from "react";
import { CAlert, CButton } from "@coreui/react";

import authService from "service/AuthService";
import style from "./style.module.scss";

const propTypes = {};

const VerifyEmail = () => {
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [count, setCount] = useState(0);

  const sendVerification = async () => {
    try {
      setError(null);
      setSending(true);
      await authService.verifyEmail();
      setCount(5);
    } catch (e) {
      setError(e);
    } finally {
      setSending(false);
    }
  };

  // timer count
  useEffect(() => {
    if (count > 0) {
      setTimeout(() => {
        setCount((c) => c - 1);
      }, 1000);
    }
  }, [count]);

  return (
    <section className="App-body d-flex">
      <div className={style.container}>
        <h3>Email Verification</h3>
        <p>
          We require our Users to verify their Email address. You have received
          an Email with an link, please follow the instructions in the email.
        </p>
        <CButton disabled={sending || count > 0} onClick={sendVerification}>
          {count > 0 ? `Resend in ${count}s` : "Resend"}
        </CButton>
      </div>
      <CAlert>{error}</CAlert>
    </section>
  );
};

VerifyEmail.propTypes = propTypes;

export default VerifyEmail;
