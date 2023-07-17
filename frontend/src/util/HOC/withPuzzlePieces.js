import React from 'react';
import missionService from 'service/MissionService';

export default (Component) => {
  return (props) => {
    const [puzzlePieces, setPuzzlePieces] = React.useState([]);

    React.useEffect(() => {
      missionService.getConstants().then((result) => {
        if (!result.PuzzlePiece) {
          return;
        }
        const puzzles = Object.keys(result.PuzzlePiece).map((key) => ({ id: result.PuzzlePiece[key], text: key }));
        setPuzzlePieces(puzzles);
      });
    }, []);

    return <Component {...props} puzzlePieces={puzzlePieces} />;
  };
};
