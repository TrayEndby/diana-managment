import React from 'react';
import cn from 'classnames';
import { Badge } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import smallElipse from 'assets/myEvolution/SmallElipse.png';
import largeElipse from 'assets/myEvolution/LargeElipse.png';
import triangle from 'assets/myEvolution/triangle.png';

import withWindowDimensions from 'util/withWindowDimensions';
import EditMission from './EditMission';
import TaskItem from './TaskItem';
import { getGoalColorByType } from './helper';

const Mission = ({
  index,
  loading,
  classes,
  week,
  month,
  setCurrentMessage,
  isActive,
  selectedGrade,
  isEditor,
  frame,
  configOfCard,
  handleShowHintMsg,
  onUpdateStatus,
}) => {
  const [isShowedEditForm, setIsShowedEditForm] = React.useState(false);
  const { puzzle: puzzleId, title } = frame;
  const frameId = frame.id == null ? -1 : frame.id;
  const [duration, setDuration] = React.useState(0);
  const [workload, setWorkload] = React.useState(0);
  const [whatToDo, setWhatToDo] = React.useState([
    { id: -1, name: 'WHAT_TO_DO', action: 'Loading...' },
  ]);
  const [howToDoIt, setHowToDoIt] = React.useState('N/A');
  const [color, setColor] = React.useState('');
  const [progress, setProgress] = React.useState(0);

  const strokeDashoffset =
    configOfCard.lengthOfBorder * ((100 - progress) / 100);

  React.useEffect(() => {
    if (!loading) {
      const whatToDoItem = frame.item.filter((i) => i.name !== 'HOW_TO_DO_IT');
      setWhatToDo(whatToDoItem || []);

      const howToDoItItem = frame.item.find((i) => i.name === 'HOW_TO_DO_IT');
      setHowToDoIt(howToDoItItem ? howToDoItItem.action : 'N/A');

      setColor(getGoalColorByType(frame.goal));
      setDuration(frame.duration);
      setDuration(frame.workload);
    }
  }, [loading, frame]);

  // set what to do progress
  React.useEffect(() => {
    if (whatToDo.length === 0) {
      setProgress(0);
      return;
    }
    const progress =
      (whatToDo.reduce((a, b) => (b.status === 1 ? a + 1 : a), 0) * 100) /
      whatToDo.length;
    setProgress(progress);
  }, [whatToDo, isActive]);

  // set how to do message
  React.useEffect(() => {
    if (isActive && !loading) {
      setCurrentMessage(index, howToDoIt, title, color);
    }
  }, [loading, isActive, color]);

  const handleUpdateStatus = React.useCallback((task, status) => {
    setWhatToDo(whatToDo => {
      return whatToDo.map(t => t.id === task.id ? { ...t, status} : t)
    });
    onUpdateStatus(task.type, status === 1 ? 1 : -1, month);
  }, [month, onUpdateStatus]);

  return (
    <section
      style={{
        height: configOfCard.heightOfCard,
        width: configOfCard.widthOfCard,
      }}
      className={cn('mission-card', classes, color)}
    >
      <div className="mission-header">{title}</div>
      <div className="mission-title">
        WHAT TO DO?
      </div>
      <div className="mission-content">
        <div
          onDoubleClick={isEditor ? () => setIsShowedEditForm(true) : null}
          className="mission-content__text"
        >
          <EditMission
            week={week}
            month={month}
            duration={duration}
            workload={workload}
            setWorkload={setWorkload}
            setDuration={setDuration}
            puzzleId={puzzleId}
            selectedGrade={selectedGrade}
            whatToDo={whatToDo}
            setWhatToDo={setWhatToDo}
            howToDoIt={howToDoIt}
            setHowToDoIt={setHowToDoIt}
            isShowed={isShowedEditForm}
            hideModal={() => setIsShowedEditForm(false)}
            frameId={frameId}
            index={index}
          />
          {whatToDo &&
            whatToDo.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                frameId={frameId}
                onUpdate={handleUpdateStatus}
              />
            ))}
        </div>
      </div>
      <Button className="mission-hint-btn" onClick={handleShowHintMsg}>
        Hint
      </Button>
      <div className="badge-container">
        {duration ? (
          <Badge className="duration">
            Duration: {duration} {duration === 1 ? 'week' : 'weeks'}
          </Badge>
        ) : null}
        {workload ? (
          <Badge className="workload"> Work Load: {workload} Min./wk </Badge>
        ) : null}
      </div>
      <div className={'mission-icon'}>
        <img src={triangle} alt="triangle" />
      </div>
      <div className="small-elipse">
        <img src={smallElipse} alt="small-elipse" />
      </div>
      <div className="large-elipse">
        <img src={largeElipse} alt="large-elipse" />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={configOfCard.widthOfCard}
        height={configOfCard.heightOfCard}
        viewBox={`0 0 ${configOfCard.widthOfCard} ${configOfCard.heightOfCard}`}
        style={{ position: 'absolute', top: '-5px', zIndex: 11 }}
      >
        <RectShape
          strokeDashoffset={strokeDashoffset}
          configOfCard={configOfCard}
        />
      </svg>
    </section>
  );
};

const RectShape = ({ strokeDashoffset, configOfCard }) => {
  return (
    <rect
      fill="none"
      stroke="green"
      strokeWidth="6px"
      x="3"
      y="3"
      width={configOfCard.widthOfCard - 6}
      height={configOfCard.heightOfCard - 6}
      rx="105px"
      ry="105px"
      style={{
        transition: 'stroke-dashoffset .7s',
        strokeDashoffset,
        strokeDasharray: configOfCard.lengthOfBorder,
      }}
    />
  );
};

export default withWindowDimensions(React.memo(Mission));
