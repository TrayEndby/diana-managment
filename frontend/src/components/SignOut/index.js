import React from 'react';
import Button from 'react-bootstrap/Button';

import { withFirebase } from '../Firebase';
import styles from './style.module.scss';

const SignOutButton = ({ firebase, mode }) => (
    <Button variant="link" className={mode ? styles.navButtonStyle : styles.dropButtonStyle} onClick={firebase.doSignOut}>Log out</Button>
);

export default withFirebase(SignOutButton);