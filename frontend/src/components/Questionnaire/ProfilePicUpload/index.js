import React from 'react';

import ProfilePicQuestion from './ProfilePicQuestion';
import ProfilePicForm from './ProfilePicForm';

import { Layout } from '../Layout';
import ProgressBar from 'react-bootstrap/ProgressBar';

/**
 * implement checking for file type and size, then display selected picture on screen with option to delete
 */
const ProfilePicUpload = () => (
  <Layout>
    <ProgressBar now={7} className="mb-3" />
    <ProfilePicQuestion />
    <ProfilePicForm />
  </Layout>
);

export default ProfilePicUpload;
