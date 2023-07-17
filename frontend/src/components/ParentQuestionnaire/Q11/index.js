import React, { useState } from 'react';
import { Layout, LeftCard, RightCard } from '../../Questionnaire/Layout';
import paymentService from '../../../service/PaymentService';
import * as ROUTES from '../../../constants/routes';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DotStepBar from '../../../util/DotStepBar';
import cn from 'classnames';
import { CheckCircle } from 'react-bootstrap-icons';
import style from './style.module.scss';

const Q11 = (props) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeStatus, setPromoCodeStatus] = useState();

  const handleChangePromo = (e) => {
    const { value } = e.target;
    setPromoCode(value);
  }

  const handleCheckPromo = async () => {
    try {
      const response = await paymentService.checkPromoCode(promoCode);
      const hasData = !!response && !!Object.entries(response).length;
      if (hasData && response?.is_csa) {
        const msg = response?.csa_name
        setPromoCodeStatus({ status: true, msg });
        props.onChange('csa_code', promoCode);
      } else {
        setPromoCodeStatus({ status: false, msg: 'Invalid CSA ID' });
      }
    } catch (error) {
      setPromoCodeStatus({ status: false, msg: 'Invalid CSA ID' });
    }
  }

  const onSave = async () => {
    props.onSave();
    props.onFinish();
  };

  return (
    <Layout>
      <DotStepBar steps={[11, 0, 0]} />
      <LeftCard section={1}>
        Please enter College Success Advisor ID, if you have one
      </LeftCard>
      <RightCard
        next="Finish"
        linkToNextPage={ROUTES.PARENT_PROFILE + '?signup'}
        onRedirect={onSave}
        save
      >
        <div className={style.promoContainer}>
          <Form.Group className={style.formGroup}>
            <Form.Control
              value={promoCode}
              onChange={handleChangePromo}
              className={cn('mr-3', style.promoInput)}
              placeholder="CSA ID" />
            <Button onClick={handleCheckPromo} className={cn({ 'disabled': !promoCode })}>Verify</Button>
          </Form.Group>
          <p className={cn(style.promoCodeStatus, promoCodeStatus?.status ? style.success : style.error)}>
            {promoCodeStatus?.status && <CheckCircle />}{promoCodeStatus?.msg}
          </p>
        </div>
      </RightCard>
    </Layout>
  );
}

export default Q11;
