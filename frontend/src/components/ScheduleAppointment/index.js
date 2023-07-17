import React, { useEffect, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import cn from 'classnames';

import DurationCard from './DurationCard';
import TimeCard from './TimeCard';
import DetailCard from './DetailCard';
import Confirmation from './Confirmation';

import {
  fetchSlots,
  getStartAndEndTimeBySlot,
  getDateAndTimeStr,
} from './util';
import Body from 'util/Body';
import useErrorHandler from 'util/hooks/useErrorHandler';
import { parseSearchParams } from 'util/helpers';
import userProfileSearchService, { ProfileSearchType } from 'service/UserProfileSearchService';
import calendarService from 'service/CalendarService';

import styles from './style.module.scss';

const propTypes = {};

const Steps = {
  SelectDuration: 'selectDuration',
  SelectTime: 'selectTime',
  FillDetail: 'fillDetail',
  Confirm: 'confirm',
};

const ScheduleAppointment = ({ history }) => {
  const id = parseSearchParams(history.location.search)?.id;
  const [owner, setOwner] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();
  const [step, setStep] = useState(Steps.SelectDuration);
  const [duration, setDuration] = useState();
  const [data, setData] = useState({
    start: null,
    end: null,
  });
  const [slotsInfo, setSlotsInfo] = useState({
    calendar_id: null,
    freeSlots: null,
    busySlots: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSelectDuration = (duration) => {
    setDuration(duration);
    setStep(Steps.SelectTime);
  };

  const handleSelectTimeSlot = ({ date, time }) => {
    setData({
      ...data,
      ...getStartAndEndTimeBySlot(date, time, duration),
    });
    setStep(Steps.FillDetail);
  };

  const handleSubmit = async ({ firstName, lastName, email, phone, note }) => {
    const { start, end } = data;
    const title = `1:1 ${owner} with ${firstName} ${lastName}`;
    try {
      setSubmitting(true);
      let summary = `Contact email: ${email} \n`;
      if (phone) {
        summary += `Contact phone: ${phone}\n`;
      }
      if (note) {
        summary += `Note: ${note}\n`;
      }
      await calendarService.bookFreeBlock(
        slotsInfo.calendar_id,
        start,
        end,
        title,
        email,
        firstName,
        lastName,
        summary,
      );
      setStep(Steps.Confirm);
    } catch (e) {
      setError(e);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchUserDataAndFreeBlocks = useCallback(
    async (ownerId) => {
      try {
        if (!ownerId) {
          return;
        }
        try {
          const limitedProfiles = await userProfileSearchService.searchLimitedProfiles(
            ProfileSearchType.Id,
            ownerId,
          );
          if (limitedProfiles && limitedProfiles[0]) {
            const profile = limitedProfiles[0];
            setOwner(`${profile.firstName} ${profile.lastName}`);
          }
        } catch {
          setOwner('');
        }
        const slotsInfo = await fetchSlots(ownerId);
        setSlotsInfo(slotsInfo);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [setError],
  );

  useEffect(() => {
    fetchUserDataAndFreeBlocks(id);
  }, [id, fetchUserDataAndFreeBlocks]);

  const shouldShow = error == null && owner != null;
  return (
    <div className={cn('App-body', styles.body)}>
      <Body loading={loading} error={error}>
        {owner == null && (
          <div className={styles.hint}>Cannot find the user</div>
        )}
        {shouldShow && step === Steps.SelectDuration && (
          <DurationCard owner={owner} onSelect={handleSelectDuration} />
        )}
        {shouldShow && step === Steps.SelectTime && (
          <TimeCard
            owner={owner}
            duration={duration}
            freeSlots={slotsInfo.freeSlots}
            busySlots={slotsInfo.busySlots}
            onNext={handleSelectTimeSlot}
            onBack={() => setStep(Steps.SelectDuration)}
          />
        )}
        {shouldShow && step === Steps.FillDetail && (
          <DetailCard
            title={getDateAndTimeStr(data)}
            owner={owner}
            duration={duration}
            submitting={submitting}
            onBack={() => setStep(Steps.SelectTime)}
            onSubmit={handleSubmit}
          />
        )}
        {shouldShow && step === Steps.Confirm && <Confirmation />}
      </Body>
    </div>
  );
};

ScheduleAppointment.propTypes = propTypes;

export default withRouter(ScheduleAppointment);
