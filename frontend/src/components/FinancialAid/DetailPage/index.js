import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import financialAidService from '../../../service/FinancialAidService';
import AddProgramModal from '../MyList/AddModal';
import style from './style.module.scss';
import Button from 'react-bootstrap/Button';
import CloseButton from '../../../util/CloseButton';
import { normalizeMapList } from '../MyList';

const FinAidDetailPage = ({ location: { search, state }, history }) => {
  const searchParams = new URLSearchParams(search);
  const programId = searchParams.get('programId');
  const [loading, setLoading] = useState(true);
  const [programInfo, setProgramInfo] = useState();
  const [programToAdd, setProgramToAdd] = useState();
  const [statusStr, setStatusStr] = useState();
  const [finAidStatus, setfinAidStatus] = useState(null);

  const fetchProgramInfo = async (programId) => {
    let info = await financialAidService.GetFinAidList([{ finaid_id: programId }]);
    info = info[0];

    const myList = await financialAidService.GetUserFinAidList();
    const programStatus = myList.find(x => x.finaid_id === info.id)?.status;
    info = { ...info, status: programStatus };

    setProgramInfo(info);
    const programStatusName = await getStatusName(programStatus);
    setStatusStr(programStatusName);
  };

  const handleAddProgramToMyList = async (ret) => {
    const [finaid_id, status] = ret;
    setfinAidStatus({ finaid_id, status });
    const programStatusName = await getStatusName(status);
    setStatusStr(programStatusName);
    setProgramToAdd(null);
  };

  const Cost = ({ children }) => {
    return <>{children ? (`$${children.toLocaleString()}`) : ('')}</>
  };

  const NumberToLocal = ({ children }) => {
    return <>{children ? (`${children.toLocaleString()}`) : ('')}</>
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchProgramInfo(programId);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    initialize(programId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const handleClose = () => {

    if (state?.prevLocation.pathname && state?.prevLocation.search) {
      const { pathname, search } = state.prevLocation;
      let programToChangeStatus = null;

      if (finAidStatus) {
        const { finaid_id, status } = finAidStatus;
        programToChangeStatus = { programToChangeStatus: [finaid_id, status] }
      }
      history.push({
        pathname,
        search,
        state: programToChangeStatus
      });
    } else {
      history.goBack();
    }
  }

  const getStatusName = async (status) => {
    if (!status) return
    const FinAidConstants = await financialAidService.GetFinAidConstants();
    const statusListResponse = FinAidConstants.user_finaid_status;
    const statusList = normalizeMapList(statusListResponse);
    const statusName = statusList.find(x => x.id === status)?.name;
    return statusName;
  }

  return (
    <div className="App-body light-dark-container overflow-hidden">
      {loading ? (
        'Loadig...'
      ) : (
          <div className={style.pageWrap}>
            <div className={style.header}>
              <h5 className={style.headline}>{programInfo.name}</h5>
              <div className={style.headerStatus}>
                {statusStr ? (
                  <div className="mx-1">{`Status: ${statusStr}`}</div>
                ) : (
                    <Button size="sm" className="btn-primary text-white" onClick={() => setProgramToAdd(programInfo)}>
                      add to list
                    </Button>
                  )}

                <CloseButton onClick={handleClose} className={style.headerClose} ></CloseButton>
              </div>
            </div>

            <div className={style.content}>
              <h5 className={style.contentHeadline}>Financial aid details</h5>

              <div className={style.rowContainer}>
                {programInfo.sponsor && <div className={style.row}>
                  <p className={style.rowCategory}>Sponsor:</p>
                  <div className={style.rowTextContainer}>
                    <p className={style.rowText}>{programInfo.sponsor}</p>
                  </div>
                </div>}
              </div>

              <div className={style.rowContainer}>
                <h5 className={style.rowHeadline}>Eligibility requirements</h5>
                {programInfo.residency_requirements &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Residency:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}>{programInfo.residency_requirements}</p>
                    </div>
                  </div>}

                {programInfo.age_requirements &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Age:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}>{programInfo.age_requirements}</p>
                    </div>
                  </div>}

                {programInfo.other_requirements &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Other requirements:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}>{programInfo.other_requirements}</p>
                    </div>
                  </div>}

                {programInfo.qualified_institution &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Qualified institution:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}>{programInfo.qualified_institution}</p>
                    </div>
                  </div>}

                {programInfo.qualified_study &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Qualified study:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}>{programInfo.qualified_study}</p>
                    </div>
                  </div>}
              </div>

              {programInfo.application_requirements &&
                <div className={style.rowContainer}>
                  <h5 className={style.rowHeadline}>Application Requirements</h5>
                  <div className={style.row}>
                    <div className={style.rowTextContainerFullWidth}>
                      <p className={style.rowTextLeft}>{programInfo.application_requirements}</p>
                      {/* <ul className={style.rowList}>
                        <li className={style.rowText}>FAFSA - fill out the form <a href='../' className={style.rowLink}>here</a></li>
                        <li className={style.rowText}>Academic achievement.</li>
                        <li className={style.rowText}>Applicant must be a Tennessee resident for one year prior to enrollment.</li>
                        <li className={style.rowText}>Award amount is up to $6,000 for four-year institutions, up to $3,000 for two-year institutions.</li>
                      </ul> */}
                    </div>
                  </div>
                </div>}

              <div className={style.rowContainer}>
                <h5 className={style.rowHeadline}>General Information</h5>
                {programInfo.award_type &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Type of award:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}>{programInfo.award_type}</p>
                    </div>
                  </div>}

                {programInfo.award_amount &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Award amount:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}><Cost>{programInfo.award_amount}</Cost></p>
                    </div>
                  </div>}

                {programInfo.total_award &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Total amount awarded:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}><Cost>{programInfo.total_award}</Cost></p>
                    </div>
                  </div>}

                {programInfo.num_awards &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Number of awards granted:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}><Cost>{programInfo.num_awards}</Cost></p>
                    </div>
                  </div>}

                {programInfo.num_applicants &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Number of applicants:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}><NumberToLocal>{programInfo.num_applicants}</NumberToLocal></p>
                    </div>
                  </div>}
              </div>

              {(programInfo.application_deadline ||
                programInfo.notification_deadline ||
                programInfo.application_fee) &&
                <div className={style.rowContainer}>
                  <h5 className={style.rowHeadline}>Deadlines & Fees</h5>
                  {programInfo.application_deadline &&
                    <div className={style.row}>
                      <p className={style.rowCategory}>Application deadline:</p>
                      <div className={style.rowTextContainer}>
                        <p className={style.rowText}>{programInfo.application_deadline}</p>
                      </div>
                    </div>}

                  {programInfo.notification_deadline &&
                    <div className={style.row}>
                      <p className={style.rowCategory}>Notification deadline:</p>
                      <div className={style.rowTextContainer}>
                        <p className={style.rowText}>{programInfo.notification_deadline}</p>
                      </div>
                    </div>}

                  {programInfo.application_fee &&
                    <div className={style.row}>
                      <p className={style.rowCategory}>Fee:</p>
                      <div className={style.rowTextContainer}>
                        <p className={style.rowText}><Cost>{programInfo.application_fee}</Cost></p>
                      </div>
                    </div>}
                </div>}

              <div className={style.rowContainer}>
                <h5 className={style.rowHeadline}>Contact information:</h5>
                {programInfo.contact_address &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Application deadline:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}>{programInfo.contact_address}</p>
                    </div>
                  </div>}

                {programInfo.contact_phone &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Contact phone:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}>{programInfo.contact_phone}</p>
                    </div>
                  </div>}

                {programInfo.contact_email &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Contact email:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}>{programInfo.contact_email}</p>
                    </div>
                  </div>}

                {programInfo.website &&
                  <div className={style.row}>
                    <p className={style.rowCategory}>Website:</p>
                    <div className={style.rowTextContainer}>
                      <p className={style.rowText}><a href={`http://${programInfo.website}`} target="__blank" rel="noopener noreferrer" className={style.rowLink}>{programInfo.website}</a></p>
                    </div>
                  </div>}
              </div>
            </div>

            <AddProgramModal
              program={programToAdd}
              onSubmit={handleAddProgramToMyList}
              onClose={() => setProgramToAdd(null)}
            />
          </div>
        )}
    </div>
  );
};

export default withRouter(FinAidDetailPage);
