import React from 'react';
import missionService from 'service/MissionService';
import Markdown from 'components/Markdown';

const TaskItem = React.memo(({ task, frameId, onUpdate }) => {
  const [isChecked, setIsChecked] = React.useState(task.status === 1);
  const [isLoading, setIsLoading] = React.useState(false);

  const onChangeHandler = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setIsChecked(!isChecked);
    try {
      await missionService.updateStatus(frameId, task.id, !isChecked);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    onUpdate(task, isChecked ? 0 : 1);
  };

  return (
    <div style={{ display: 'flex' }}>
      <span>
        <input
          type="checkbox"
          style={{ marginRight: '1rem', transform: 'scale(1.6)' }}
          checked={isChecked}
          onChange={onChangeHandler}
        />
      </span>
      <span>
        <Markdown source={task.action} />
      </span>
    </div>
  );
});

export default TaskItem;
