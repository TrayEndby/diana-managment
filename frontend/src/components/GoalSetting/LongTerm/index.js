import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import SelectMajors from './SelectMajors';
import MyMajors from './MyMajors';
import MyRec from './MyRec';

import Selection from './Selection';

import { useSelect, getIdsFromItems } from './util';
import useErrorHandler from '../../../util/hooks/useErrorHandler';
import Loading from '../../../util/Loading';
import ErrorDialog from '../../../util/ErrorDialog';
import strategyService from '../../../service/StrategyService';

const VIEW = {
  Loading: 'Loading',
  SelectMajor: 'SelectMajor',
  MyMajor: 'MyMajor',
  SelectInterests: 'SelectInterests',
  SelectDrives: 'SelectDrives',
  SelectPersonalities: 'SelectPersonalities',
  MyRec: 'MyRecommend',
};

const propTypes = {
  onChange: PropTypes.func.isRequired
};

const LongTermSection = ({ onChange }) => {
  const [error, setError] = useErrorHandler();
  const [view, setViews] = useState(VIEW.Loading);

  const [majorList, setMajorList] = useState([]);
  const [interestsList, setInterestsList] = useState([]);
  const [drivesList, setDrivesList] = useState([]);
  const [personalityList, setPersonalityList] = useState([]);
  const [recMajorList, setRecMajorList] = useState([]);

  const [myMajors, setMyMajors] = useState([]);
  const [selectedMajors, selectMajor, setSelectedMajors] = useSelect(3);
  const [selectedInterests, selectInterest, setSelectedInterests] = useSelect(3);
  const [selectedDrives, selectDrive, setSelectedDrives] = useSelect(3);
  const [selectedPersonalities, selectPersonality, setSelectedPersonalities] = useSelect(1);

  const initializeMajors = useCallback(async () => {
    const majorsList_res = await strategyService.listMajors();
    const myMajors_res = await strategyService.getMajors(majorsList_res);
    setMajorList(majorsList_res);
    setMyMajors([...myMajors_res]);
    setSelectedMajors([...myMajors_res]);
    return myMajors_res.length > 0 ? VIEW.MyMajor : VIEW.SelectMajor;
  }, [setSelectedMajors]);

  const initializeInterests = useCallback(async () => {
    const interestsList_res = await strategyService.listInterests();
    const interests_res = await strategyService.getInterests(interestsList_res);
    setInterestsList(interestsList_res);
    setSelectedInterests(interests_res);
  }, [setSelectedInterests]);

  const initializeDrives = useCallback(async () => {
    const drivesList_res = await strategyService.listDrives();
    const drives_res = await strategyService.getDrives(drivesList_res);
    setDrivesList(drivesList_res);
    setSelectedDrives(drives_res);
  }, [setSelectedDrives]);

  const initializePersonality = useCallback(async () => {
    const personalityList_res = await strategyService.listPersonalities();
    const personality_res = await strategyService.getPersonality(personalityList_res);
    setPersonalityList(personalityList_res);
    setSelectedPersonalities(personality_res);
  }, [setSelectedPersonalities]);

  const handleSaveMajors = async (majors) => {
    try {
      await strategyService.setMajors(getIdsFromItems(majors));
      setMyMajors([...majors]);
      setSelectedMajors([...majors]);
      setViews(VIEW.MyMajor);
      onChange();
    } catch (e) {
      setError(e);
    }
  };

  const handleSaveInterests = async (interests) => {
    try {
      await strategyService.setInterests(getIdsFromItems(interests));
      setViews(VIEW.SelectDrives);
    } catch (e) {
      setError(e);
    }
  };

  const handleSaveDrives = async (drives) => {
    try {
      await strategyService.setDrives(getIdsFromItems(drives));
      setViews(VIEW.SelectPersonalities);
    } catch (e) {
      setError(e);
    }
  };

  const handleSavePersonality = async (personalities) => {
    try {
      await strategyService.setPersonality(getIdsFromItems(personalities));
      recommendMajors();
    } catch (e) {
      setError(e);
    }
  };

  const recommendMajors = async () => {
    try {
      const res = await strategyService.recommendMajors(majorList);
      setRecMajorList(res);
      setViews(VIEW.MyRec);
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const view = await initializeMajors();
        const promises = [initializeInterests(), initializeDrives(), initializePersonality()];
        await Promise.all(promises);
        setViews(view);
      } catch (e) {
        setError(e);
        setViews(null);
      }
    })();
  }, [setError, initializeMajors, initializeInterests, initializeDrives, initializePersonality]);

  return (
    <div className="h-100 overflow-auto">
      <ErrorDialog error={error} />
      {view === VIEW.Loading && <Loading show={true} className="text-white" />}
      {view === VIEW.SelectMajor && (
        <SelectMajors
          type="goals"
          title="Selected your intended major"
          majors={majorList}
          selectedMajors={selectedMajors}
          onSelect={selectMajor}
          onHelp={() => setViews(VIEW.SelectInterests)}
          onSave={handleSaveMajors}
        />
      )}
      {view === VIEW.MyMajor && <MyMajors majors={myMajors} onClick={() => setViews(VIEW.SelectMajor)} />}
      {view === VIEW.SelectInterests && (
        <Selection
          title="What are you most interested in?"
          items={interestsList}
          selectedItems={selectedInterests}
          maxSelection={3}
          onSelect={selectInterest}
          onBack={() => setViews(VIEW.SelectMajor)}
          onNext={handleSaveInterests}
        />
      )}
      {view === VIEW.SelectDrives && (
        <Selection
          title="What drives you the most?"
          items={drivesList}
          selectedItems={selectedDrives}
          maxSelection={3}
          onSelect={selectDrive}
          onBack={() => setViews(VIEW.SelectInterests)}
          onNext={handleSaveDrives}
        />
      )}
      {view === VIEW.SelectPersonalities && (
        <Selection
          title="What's your Myers-Briggs personality type?"
          subTitle={
            <sub>
              Not sure? Take the test
              <a className="ml-1" href="https://www.16personalities.com/" target="_blank" rel="noopener noreferrer">
                here
              </a>
            </sub>
          }
          items={personalityList}
          selectedItems={selectedPersonalities}
          maxSelection={1}
          optional
          geItemName={(item) => (
            <>
              {item.name}
              <div style={{ fontSize: '15px', fontWeight: 'normal' }}>{item.personality}</div>
            </>
          )}
          getDescription={(item) => item.career}
          onSelect={selectPersonality}
          onBack={() => setViews(VIEW.SelectDrives)}
          onNext={handleSavePersonality}
        />
      )}
      {view === VIEW.MyRec && (
        <MyRec
          interests={selectedInterests}
          drives={selectedDrives}
          personality={selectedPersonalities[0]}
          majors={recMajorList}
          onHelp={() => setViews(VIEW.SelectInterests)}
          onBack={() => setViews(VIEW.SelectMajor)}
          onSave={handleSaveMajors}
        />
      )}
    </div>
  );
};

LongTermSection.propTypes = propTypes;

export default LongTermSection;
