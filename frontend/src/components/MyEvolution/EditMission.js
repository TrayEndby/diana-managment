import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { Trash } from 'react-bootstrap-icons';

import Markdown from 'components/Markdown';
import missionService from 'service/MissionService';

import EditForms from './EditForms';
import style from './style.module.scss';

const EditMission = ({
  index,
  week,
  month,
  duration,
  setDuration,
  workload,
  setWorkload,
  puzzleId,
  selectedGrade,
  whatToDo,
  setWhatToDo,
  howToDoIt,
  setHowToDoIt,
  isShowed,
  hideModal,
  frameId,
}) => {
  const [puzzlePieces, setPuzzlePieces] = React.useState([]);
  const [selectedPuzzlePiece, setSelectedPuzzlePiece] = React.useState(null);
  const [isShowedFormsEdit, setIsShowedFormsEdit] = React.useState(false);

  React.useEffect(() => {
    missionService.getConstants().then((result) => {
      if (!result.PuzzlePiece) {
        return;
      }
      const puzzles = Object.keys(result.PuzzlePiece).map((key) => ({
        id: result.PuzzlePiece[key],
        text: key,
      }));
      setSelectedPuzzlePiece(puzzles[0]);
      setPuzzlePieces(puzzles);
    });
  }, []);

  React.useEffect(() => {
    const puzzle = puzzlePieces.find((i) => i.id === puzzleId);
    if (puzzle) {
      setSelectedPuzzlePiece(puzzle);
    }
  }, [puzzleId, puzzlePieces]);

  const saveMission = async () => {
    await missionService
      .saveMission(index, {
        grade: selectedGrade.id,
        week,
        month,
        workload,
        puzzle: selectedPuzzlePiece
          ? selectedPuzzlePiece.id
          : selectedPuzzlePiece[0].id,
        duration,
        description: `${selectedGrade.text} ${week} week of ${month} month`,
        whatToDo,
        howToDoIt,
      })
      .catch(console.error);
    hideModal();
  };

  const onChangePuzzlePiece = (event) => {
    const puzzle = puzzlePieces.find((g) => g.id === +event.target.value);
    setSelectedPuzzlePiece(puzzle);
  };

  const onChangeWhatToDo = (value, task) => {
    setWhatToDo([
      ...whatToDo.map((t) =>
        t.id !== task.id ? t : { ...task, action: value },
      ),
    ]);
  };

  const addNewWhatToDo = async () => {
    const [task] = await missionService.createTask(frameId, {
      action: 'Test task',
      name: `WHAT_TO_DO_${whatToDo.length}`,
    });

    setWhatToDo([...whatToDo, task]);
  };

  const removeTask = async (task) => {
    const accepted = window.confirm(
      'Are you sure you want to delete the form?',
    );
    if (!accepted) {
      return;
    }

    await missionService.removeTask(frameId, task.id);

    setWhatToDo([...whatToDo.filter((t) => t.id !== task.id)]);
  };

  return (
    <Modal
      size="lg"
      centered
      show={isShowed}
      onHide={hideModal}
      data-prevent-scroll-propogation
      hidden={isShowedFormsEdit}
    >
      <Modal.Header className={style.header} closeButton>
        <Modal.Title>Edit Mission</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className={style.actionBar}>
          <Form.Group controlId="EditMissionForm.Duration">
            <Form.Label>Duration(count of weeks)</Form.Label>
            <Form.Control
              min="0"
              type="number"
              onChange={(e) => setDuration(e.target.value)}
              value={duration}
            />
          </Form.Group>
          <Form.Group controlId="EditMissionForm.Workload">
            <Form.Label>Workload(Min./wk)</Form.Label>
            <Form.Control
              min="0"
              type="number"
              onChange={(e) => setWorkload(e.target.value)}
              value={workload}
            />
          </Form.Group>
          <Form.Group
            onChange={onChangePuzzlePiece}
            controlId="EditMissionForm.PuzzlePiece"
          >
            <Form.Label>Puzzle Pieces</Form.Label>
            <Form.Control as="select">
              {puzzlePieces.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  selected={item.id === selectedPuzzlePiece.id}
                >
                  {item.text}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <EditForms
            isShowedModal={isShowedFormsEdit}
            setIsShowedModal={setIsShowedFormsEdit}
          />
          <Button onClick={saveMission}>Save</Button>
        </section>
        <Dropdown.Divider />
        <Button variant="primary" onClick={addNewWhatToDo}>
          Add new task
        </Button>
        {whatToDo &&
          whatToDo.map((task, index) => (
            <Row key={task.id}>
              <Col>
                <h3>
                  <Trash
                    size="24"
                    color="red"
                    style={{ cursor: 'pointer' }}
                    onClick={() => removeTask(task)}
                  />
                  Task {index + 1}
                </h3>
                <textarea
                  value={task.action}
                  onChange={(e) => onChangeWhatToDo(e.target.value, task)}
                  style={{ height: '100px', width: '100%' }}
                />
              </Col>
              <Col>
                <Markdown source={task.action} />
              </Col>
            </Row>
          ))}
        <Dropdown.Divider />
        <Row>
          <Col>
            <h3>How to do it</h3>
            <textarea
              value={howToDoIt}
              onChange={(e) => setHowToDoIt(e.target.value)}
              style={{ height: '35vh', width: '100%' }}
            />
          </Col>
          <Col>
            <Markdown source={howToDoIt} />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default React.memo(EditMission);
