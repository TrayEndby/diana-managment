import { useState, useCallback } from 'react';

const useErrorHandler = (defaultValue) => {
  const [error, setError] = useState(defaultValue);
  const errorHandler = useCallback((e) => {
    if (!e) {
      setError(e);
    } else {
      console.error(e);
      if (typeof e === 'object') {
        setError(e.message || JSON.stringify(e));
      } else {
        setError(e);
      }
    }
  }, []);

  return [error, errorHandler];
};

export default useErrorHandler;
