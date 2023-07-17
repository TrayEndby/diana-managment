import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import DotStepBar from '../../../util/DotStepBar';

import SelectMajors from '../../GoalSetting/LongTerm/SelectMajors';
import { useSelect } from '../../GoalSetting/LongTerm/util';

import ParentService from 'service/ParentService';
import * as ROUTES from 'constants/routes';

import style from './style.module.scss';

const Q9 = () => {
  const [expList, setExpList] = useState([]);
  const [selectedExp, selectExp, setSelectedExp] = useSelect(3);
  const history = useHistory();

  const fetchExpertiseList = useCallback(async () => {
    try {
      const list = await ParentService.listParentExpertiseType();
      const expResp = await ParentService.getExpertise();
      const normalizedExp = normalizeExpertise(expResp, 'forward');
      setExpList(list);
      setSelectedExp(normalizedExp);
    } catch (e) {
      console.error(e);
    }
  }, [setSelectedExp]);

  const normalizeExpertise = (expList, type) => {
    if (type === 'forward') {
      return expList.map(exp => ({ internalId: exp.id, id: exp.expertise }))
    } else {
      return expList.map(exp => ({ id: exp.internalId, expertise: exp.id }))
    }
  }

  const onSkip = () => {
    history.push(ROUTES.PARENT_QUESTIONNAIRE_Q10);
  }

  const onSave = async () => {
    const preparedData = normalizeExpertise(selectedExp);
    await ParentService.parentExpertiseUpdate(preparedData);
    history.push(ROUTES.PARENT_QUESTIONNAIRE_Q10);
  };

  useEffect(() => {
    fetchExpertiseList();
  }, [fetchExpertiseList]);

  return (
    <div className={style.expertise}>
      <div className={style.expertiseContent}>
      <DotStepBar steps={[9, 0, 0]} />
        <SelectMajors
          title="What expertise you’d like to offer?"
          subtitle="The parent can volunteer their expertise to mentor our students and exchange resources with other parents"
          majors={expList}
          selectedMajors={selectedExp}
          onSelect={selectExp}
          onSave={() => null}
        />
        <div className={style.footer}>
          <Button variant="link" onClick={onSkip} className="mr-2">
            Skip this question
          </Button>
          <Button onClick={onSave}>Go to question 10</Button>
        </div>
      </div>
    </div>
  );
}

export default Q9;
