import React, { useEffect, useState } from 'react';

import AddGroupModal from 'components/Conversations/Modals/AddGroupModal';
import { CalendarBoard } from 'components/Calendar';

import educatorService from 'service/EducatorService';
import calendarService from 'service/CalendarService';
import authService from 'service/AuthService';

const propTypes = {};

const EducatorCalendar = ({ isEducator, educatorId }) => {
  const [showModal, setShowModal] = useState(false);
  const [educatorName, setEducatorName] = useState('');
  const [noCalendar, setNoCalendar] = useState(false);
  const showCalendar = isEducator || !noCalendar;

  useEffect(() => {
    (async () => {
      if (!isEducator) {
        try {
          const res = await educatorService.getEducatorInfo(educatorId);
          const { basic } = res;
          const { firstName, lastName } = basic;
          setEducatorName(`${firstName} ${lastName}`);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [educatorId, isEducator]);

  const normalizeEventToAdd = ({ eventToAdd }) => {
    const EventFlag = calendarService.getEventFlag();
    if (isEducator) {
      return {
        ...eventToAdd,
        flag: EventFlag.ShowFree,
      };
    } else {
      return {
        ...eventToAdd,
        flag: EventFlag.ShowBusy,
        invitee: [
          {
            invitee_id: educatorId,
            name: educatorName,
          },
        ],
      };
    }
  };

  const filterCalendars = (calendars) => {
    const owner_id = isEducator ? authService.getUID() : educatorId;
    const filteredCalendars = calendars.filter(({ creator_id }) => creator_id === owner_id);
    if (filteredCalendars.length === 0) {
      setNoCalendar(true);
    }
    return filteredCalendars;
  };

  return (
    <>
      {!showCalendar && (
        <div className="h-100 d-flex align-items-center">
          <div className="mx-auto text-white">
            You are not in the educator's group yet, please make a request to the educator first
          </div>
        </div>
      )}
      {showCalendar && (
        <CalendarBoard
          title={isEducator ? 'My calendars' : 'Calendars'}
          style={{ height: '70vh' }}
          owner={isEducator ? null : educatorId}
          editable
          selectable
          customNav={
            isEducator ? (
              <div className="text-white App-clickable" onClick={() => setShowModal(true)}>
                + Add group
              </div>
            ) : null
          }
          noGuestsSelection
          noFlagSelection={!isEducator}
          onFetchCalendars={filterCalendars}
          onAddEvent={normalizeEventToAdd}
        />
      )}
      {showModal && <AddGroupModal show={true} onClose={() => setShowModal(false)} />}
    </>
  );
};

EducatorCalendar.propTypes = propTypes;

export default React.memo(EducatorCalendar);
