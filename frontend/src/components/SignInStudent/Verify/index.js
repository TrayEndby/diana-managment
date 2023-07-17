import React, { useEffect, useState, useCallback } from 'react';
import Button from 'react-bootstrap/Button';

import { PROFILE_TYPE_ID } from 'constants/profileTypes';
import ErrorDialog from 'util/ErrorDialog';
import useErrorHandler from 'util/hooks/useErrorHandler';
import authService from 'service/AuthService';
import style from './style.module.scss';

const propTypes = {};

const VerifyEmail = () => {
  const [error, setError] = useErrorHandler(null);
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

  const verify = useCallback(() => {
    const signInType = authService.getSignInType();
    const type_id = PROFILE_TYPE_ID[signInType];
    const verified = authService.isVerified(type_id);
    if (verified) {
      refresh();
    }
  }, []);

  const refresh = () => {
    window.location.reload();
  }

  // timer count
  useEffect(() => {
    if (count > 0) {
      setTimeout(() => {
        setCount((c) => c - 1);
      }, 1000);
    }
  }, [count]);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      verify();
    }, 600000); // 1 min per check

    return () => clearInterval(checkInterval);
  }, [verify]);

  return (
    <section className="App-body d-flex">
      <div className={style.container}>
        <ErrorDialog error={error} />
        <h3>Email Verification</h3>
        <p>
          We require our Users to verify their Email address. You have received an Email with an link, please follow the
          instructions in the email.
        </p>
        <Button disabled={sending || count > 0} onClick={sendVerification}>
          {count > 0 ? `Resend in ${count}s` : 'Resend'}
        </Button>
        <Button className="ml-2" onClick={() => refresh()}>Refresh the page</Button>
      </div>
    </section>
  );
};

VerifyEmail.propTypes = propTypes;

export default VerifyEmail;
