import { configureStore } from '@reduxjs/toolkit';

import myEvolutionReducer from 'components/MyEvolution/evolutionSlice';

export default configureStore({
  reducer: {
    myEvolution: myEvolutionReducer,
  },
});
