import React, { useEffect, useState } from 'react';
import educatorService from '../../../../service/EducatorService';
import detailStyles from '../style.module.scss';

import ShortBio from './ShortBio';
import Skills from './Skills';
import ServiceExp from './ServiceExp';
import Education from './Education';
import Certification from './Certification';
import ProudProjects from './ProudProjects';

import useError from '../../../../util/hooks/useErrorHandler';
import ErrorDialog from '../../../../util/ErrorDialog';
import EducatorService from '../../../../service/EducatorService';

const defaultState = {
  bio: '',
  skills: [],
};

const EducatorAbout = ({ isEducator, educatorId }) => {
  const [profileEducatorInfo, setProfileEducatorInfo] = useState(defaultState);
  const [serviceExpInfo, setServiceExpInfo] = useState([]);
  const [education, setEducation] = useState([]);
  const [certification, setCertification] = useState([]);
  const [proudProjects, setProudProjects] = useState([]);
  const [error, setError] = useError();

  const fetchProfileInfo = async () => {
    try {
      const educatorProfileResp = await educatorService.getEducatorProfile();
      if (educatorProfileResp) {
        const educatorProfile = educatorProfileResp?.educatorProfile;
        setProfileEducatorInfo({ ...profileEducatorInfo, ...educatorProfile });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchServiceExp = async () => {
    try {
      const serviceExpResp = await educatorService.getServiceExperience();
      if (serviceExpResp) {
        const educatorWorkingExperience = serviceExpResp?.educatorWorkingExperience;
        setServiceExpInfo(educatorWorkingExperience);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEducation = async () => {
    try {
      const educationResp = await educatorService.getEducationInfo();
      if (educationResp) {
        const educatorWorkingExperience = educationResp?.educatorWorkingExperience;
        setEducation(educatorWorkingExperience);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCertification = async () => {
    try {
      const certificationResp = await educatorService.getCertificateInfo();
      if (certificationResp) {
        const educatorWorkingExperience = certificationResp?.educatorWorkingExperience;
        setCertification(educatorWorkingExperience);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProjects = async () => {
    try {
      const projectsResp = await educatorService.getProjectInfo();
      if (projectsResp) {
        const educatorWorkingExperience = projectsResp?.educatorWorkingExperience;
        setProudProjects(educatorWorkingExperience);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchProfileInfo();
      fetchServiceExp();
      fetchEducation();
      fetchCertification();
      fetchProjects();
    } else if (educatorId) {
      EducatorService.getEducatorInfo(educatorId).then((educator) => {
        setProfileEducatorInfo({ ...profileEducatorInfo, ...educator.educatorProfile });
        setServiceExpInfo(educator.educatorWorkingExperience);
        setEducation(educator.educatorEducationInfo);
        setCertification(educator.educatorCertificateInfo);
        setProudProjects(educator.educatorProjectInfo);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEducator, educatorId]);

  const handleSave = async (name, value) => {
    try {
      setError(null);
      if (name === 'bio' || name === 'skills') {
        const updatedState = { ...profileEducatorInfo, ...{ [name]: value } };
        await educatorService.educatorProfileUpdate(updatedState);
        setProfileEducatorInfo(updatedState);
      }

      if (name === 'serviceExpInfo') {
        const newItem = value;
        let result = null;
        if (newItem?.id) {
          result = await educatorService.updateServiceExperience(newItem);
        } else {
          result = await educatorService.insertServiceExperience(newItem);
        }

        if (result.res === 1) {
          fetchServiceExp();
        }
      }

      if (name === 'education') {
        const newItem = value;
        let result = null;
        if (newItem?.id) {
          result = await educatorService.updateEducationInfo(newItem);
        } else {
          result = await educatorService.insertEducationInfo(newItem);
        }

        if (result.res === 1) {
          fetchEducation();
        }
      }

      if (name === 'certification') {
        const newItem = value;
        let result = null;
        if (newItem?.id) {
          result = await educatorService.updateCertificateInfo(newItem);
        } else {
          result = await educatorService.insertCertificateInfo(newItem);
        }

        if (result.res === 1) {
          fetchCertification();
        }
      }

      if (name === 'proudProjects') {
        const newItem = value;
        let result = null;
        if (newItem?.id) {
          result = await educatorService.updateProjectInfo(newItem);
        } else {
          result = await educatorService.insertProjectInfo(newItem);
        }

        if (result.res === 1) {
          fetchProjects();
        }
      }
    } catch (e) {
      setError(e);
    }
  };

  const handleDelete = async (name, id) => {
    if (!id) return;
    try {
      if (name === 'serviceExpInfo') {
        const result = await educatorService.deleteServiceExperience(id);
        if (result.res === 1) {
          fetchServiceExp();
        }
      }

      if (name === 'education') {
        const result = await educatorService.deleteEducationInfo(id);
        if (result.res === 1) {
          fetchEducation();
        }
      }

      if (name === 'certification') {
        const result = await educatorService.deleteCertificateInfo(id);
        if (result.res === 1) {
          fetchCertification();
        }
      }

      if (name === 'proudProjects') {
        const result = await educatorService.deleteProjectInfo(id);
        if (result.res === 1) {
          fetchProjects();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const { bio, skills } = profileEducatorInfo;
  return (
    <div className={detailStyles.contentContainer}>
      <ErrorDialog error={error} />
      <ShortBio data={bio} handleSave={(value) => handleSave('bio', value)} isEducator={isEducator} />
      <ServiceExp
        data={serviceExpInfo}
        handleSave={(value) => handleSave('serviceExpInfo', value)}
        handleDelete={(value) => handleDelete('serviceExpInfo', value)}
        isEducator={isEducator}
      />
      <Education
        data={education}
        handleSave={(value) => handleSave('education', value)}
        handleDelete={(value) => handleDelete('education', value)}
        isEducator={isEducator}
      />
      <Skills data={skills} handleSave={(value) => handleSave('skills', value)} isEducator={isEducator} />
      <ProudProjects
        data={proudProjects}
        handleSave={(value) => handleSave('proudProjects', value)}
        handleDelete={(value) => handleDelete('proudProjects', value)}
        isEducator={isEducator}
      />
      <Certification
        data={certification}
        handleSave={(value) => handleSave('certification', value)}
        handleDelete={(value) => handleDelete('certification', value)}
        isEducator={isEducator}
      />
    </div>
  );
};

export default React.memo(EducatorAbout);
