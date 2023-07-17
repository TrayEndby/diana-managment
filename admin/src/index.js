import React from 'react';
import ReactDOM from 'react-dom';
import './constants/variables.scss';
import './index.scss';
import Firebase, { FirebaseContext } from './views/Firebase';

import * as serviceWorker from './serviceWorker';

let BuildTarget;

BuildTarget = require("./App").default;

ReactDOM.render(
    <React.StrictMode>
        <FirebaseContext.Provider value={new Firebase()}>
            <BuildTarget />
        </FirebaseContext.Provider>
    </React.StrictMode>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
