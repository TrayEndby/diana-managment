import React from 'react';

import ProfilePicQuestion from './ProfilePicQuestion';
import ProfilePicForm from './ProfilePicForm';

import { Layout } from '../../Questionnaire/Layout';
import DotStepBar from '../../../util/DotStepBar';

/**
 * implement checking for file type and size, then display selected picture on screen with option to delete
 */
const ProfilePicUpload = () => (
  <Layout>
    <DotStepBar steps={[3, 0, 0]} />
    <ProfilePicQuestion />
    <ProfilePicForm />
  </Layout>
);

export default ProfilePicUpload;
