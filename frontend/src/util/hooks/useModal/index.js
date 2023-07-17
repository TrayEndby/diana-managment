import { useState } from 'react';

/*Reusable hook for modals*/

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggleModal() {
    setIsShowing(!isShowing);
  }

  return [isShowing, toggleModal]
};

export default useModal;