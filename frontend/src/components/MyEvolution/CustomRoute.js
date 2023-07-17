import React from 'react';
import cn from 'classnames';

import { MONTHS } from 'util/helpers';
import withWindowDimensions from 'util/withWindowDimensions';

import getConfigOfCard from './helper';
import Mission from './Mission';

const WEEKS_PREFIXES = {
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th',
  5: '5th',
};

const CustomRoute = (props) => {
  const {
    isEditor,
    frames,
    week,
    month,
    handleShowHintMsg,
    index,
    activeIndex,
    setCurrentMessage,
    selectedGrade,
    windowWidth,
    windowHeight,
    onUpdateStatus,
  } = props;
  const [configOfCard, setConfigOfCard] = React.useState(null);
  const loading = frames == null;

  // React.useEffect(() => {
  //   if (isEditor && frames && !frames[0]) {
  //     missionService.saveMission(null, {
  //       grade: selectedGrade.id,
  //       week,
  //       month,
  //       description: `${selectedGrade.text} ${week} week of ${month} month`,
  //       whatToDo: [{ name: 'WHAT_TO_DO', action: 'Test task' }],
  //       howToDoIt: '',
  //     });
  //   }
  // }, [week, month, selectedGrade, frames, isEditor]);

  React.useEffect(() => {
    setConfigOfCard(getConfigOfCard());
  }, [windowWidth, windowHeight]);

  React.useEffect(() => {
    if (index === activeIndex) {
      if (frames && frames[1] == null) {
        setCurrentMessage(1, null);
      }
    }

    handleShowHintMsg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const isActive = index === activeIndex;
  if (!configOfCard) {
    return null;
  }

  const classes = {
    'bespoke-slide': true,
    'media-query': true,
    'bespoke-active': isActive,
    'bespoke-inactive': !isActive,
    'bespoke-before': index < activeIndex,
    [`bespoke-before-${activeIndex - index}`]: index < activeIndex,
    'bespoke-after': index > activeIndex,
    [`bespoke-after-${index - activeIndex}`]: index > activeIndex,
  };

  const missionCard = (index, double) => {
    const frame = loading ? {} : frames[index];
    if (!frame) {
      return null;
    }
    return (
      <Mission
        index={index}
        loading={loading}
        classes={{
          ...classes,
          single: !double,
          double,
        }}
        week={week}
        month={month}
        selectedGrade={selectedGrade}
        isActive={isActive}
        setCurrentMessage={setCurrentMessage}
        isEditor={isEditor}
        frame={frame}
        configOfCard={configOfCard}
        handleShowHintMsg={handleShowHintMsg}
        onUpdateStatus={onUpdateStatus}
      />
    );
  };

  return (
    <div className="mission-week">
      {missionCard(0, frames && frames[1] != null)}
      {!loading && missionCard(1, true)}
      <section className={cn('week-circle', classes)}>
        <div className="delimiter delimiter-left" />
        <div className="delimiter delimiter-right" />
        <div className="circle">
          <p>
            {WEEKS_PREFIXES[week]} week of <br />
            {MONTHS[month]}
          </p>
        </div>
      </section>
    </div>
  );
};

export default withWindowDimensions(React.memo(CustomRoute));
