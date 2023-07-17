import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import CollegeDetail from '../Detail';
import CollegeService from '../../../service/CollegeService';
import AddCollegeModal from '../MyList/AddModal';

import * as ROUTES from '../../../constants/routes';

const CollegeDetailPage = ({ location: { search }, history }) => {
  const searchParams = new URLSearchParams(search);
  const collegeId = searchParams.get('collegeId');
  const from = searchParams.get('from');
  const [loading, setLoading] = useState(true);
  const [collegeInfo, setCollegeInfo] = useState();
  const [sportsList, setSportsList] = useState();
  const [collegeToAdd, setCollegeToAdd] = useState();
  let collegeToApplyStatusMap = new Map();

  const fetchCollegeInfo = async (collegeId) => {
    const info = await CollegeService.searchCollegeById(collegeId);
    if (info.length === 0) {
      setCollegeInfo();
      return;
    }
    const idToApplyStatusMap = await CollegeService.getIdToApplyStatusMap(true);
    const myAdmissionList = await CollegeService.getMyList();
    let colToApplyStatusMap = new Map();
    myAdmissionList.forEach(({ college_id, status }) => {
      colToApplyStatusMap.set(college_id, idToApplyStatusMap.get(Number(status)));
    });
    collegeToApplyStatusMap = colToApplyStatusMap;
    const infoWithStatus = addApplyStatusToColleges(info[0]);
    setCollegeInfo(infoWithStatus);
  };

  const fetchSportsList = async () => {
    const list = await CollegeService.listSportsAsync();
    setSportsList(list);
  };

  const addApplyStatusToColleges = (college) => {
    return {
      ...college,
      status_str: collegeToApplyStatusMap.get(college.id),
    };
  };

  const handleAddCollegeToMyList = async (ret) => {
    const [college_id, status] = ret;
    const map = await CollegeService.getIdToApplyStatusMap(true);
    const status_str = map.get(Number(status));
    collegeToApplyStatusMap.set(college_id, status_str);
    setCollegeInfo(addApplyStatusToColleges(collegeInfo));
    setCollegeToAdd(null);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const promise1 = fetchCollegeInfo(collegeId);
        const promise2 = fetchSportsList();
        await Promise.all([promise1, promise2]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    initialize(collegeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeId]);

  return (
    <div className="App-body light-dark-container">
      {loading ? (
        'Loading...'
      ) : (
        <>
          <CollegeDetail
            college={collegeInfo}
            sportsList={sportsList}
            onSelect={() => setCollegeToAdd(collegeInfo)}
            onClose={() => (from === 'search' ? history.push(ROUTES.COLLEGE_SEARCH) : history.push(ROUTES.COLLEGE))}
          />
          <AddCollegeModal
            college={collegeToAdd}
            onSubmit={handleAddCollegeToMyList}
            onClose={() => setCollegeToAdd(null)}
          />
        </>
      )}
    </div>
  );
};

export default withRouter(CollegeDetailPage);
