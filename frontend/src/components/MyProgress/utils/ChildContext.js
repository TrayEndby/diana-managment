import React, { createContext, useState, useEffect } from 'react';
import ParentService from 'service/ParentService';

export const ChildContext = createContext({});

export const ChildContextProvider = ({ children }) => {
    const [myChild, setMyChild] = useState({});
    const [myChildrenList, setMyChildrenList] = useState([]);
    const [userType, setUserType] = useState();

    useEffect(() => {
        return () => {
          ParentService.updateAuthParam('');
        }
      }, []);

    return (
        <ChildContext.Provider
            value={{
                myChild,
                setMyChild,
                myChildrenList,
                setMyChildrenList,
                userType,
                setUserType
            }}
        >
            {children}
        </ChildContext.Provider>
    );
}