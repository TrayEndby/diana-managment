import React from 'react'
import Alert from 'react-bootstrap/Alert'
import SaveChange from '../SaveChange';

function UnsavedInfoAlert(props) {
  return (
    <Alert variant='danger'>
      <p>
        You have unsaved changes to your profile information.
      </p>
      <SaveChange onClick={props.saveChanges} />
    </Alert>
  )
}

export default UnsavedInfoAlert
