import React from 'react';
import { CButton } from "@coreui/react";

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase, mode }) => (
    <CButton onClick={firebase.doSignOut}>Log out</CButton>
);

export default withFirebase(SignOutButton);
