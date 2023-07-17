import React, { useEffect, useState } from 'react';
import FriendCard from 'components/MyContacts/MyFriends/FriendCard';
import FormControl from 'react-bootstrap/FormControl';
import GroupService from 'service/GroupService';
import AuthService from 'service/AuthService';
import UserProfileSearchService from 'service/UserProfileSearchService';
import EducatorService from 'service/EducatorService';
import Spinner from 'util/Spinner';
import * as ROUTES from 'constants/routes';
import { GROUP_TYPE } from 'constants/groupTypes';
import style from './style.module.scss';

const MyStudents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [stGroupId, setStGroupId] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const fetchStudents = async (serviceName) => {
    setIsLoading(true);
    if (!serviceName) return;
    let groups = await GroupService.list();
    if (groups.length) {
      const hasSuchServiceGroup = groups.find((group) => group.name === serviceName && group.type === GROUP_TYPE.GroupTypeTutoring);
      if (!hasSuchServiceGroup) {
        await GroupService.create({ name: serviceName, type: GROUP_TYPE.GroupTypeTutoring, description: `Group for tutoring ${serviceName}` });
        groups = await GroupService.list();
      }
    } else {
      await GroupService.create({ name: serviceName, type: GROUP_TYPE.GroupTypeTutoring, description: `Group for tutoring ${serviceName}` });
      groups = await GroupService.list();
    }

    const studentsGroupId = groups.find(group => group.name === serviceName).id;
    if (studentsGroupId) {
      setStGroupId(studentsGroupId);
      const studentsResp = await GroupService.listMembers(studentsGroupId);
      if (Array.isArray(studentsResp) && studentsResp.length) {
        const filteredStudentsResp = studentsResp.filter(fr => fr.user_id !== AuthService.getUID())
        const promises = filteredStudentsResp.map(async (fr) => {
          return { user_id: fr.user_id, profile_info: await UserProfileSearchService.searchProfile(fr.user_id) }
        })
        const friendsWithProfileDataResp = await Promise.all(promises);
        setStudents(friendsWithProfileDataResp);
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    const getServices = async () => {
      const servicesResp = await EducatorService.getServices();
      if (servicesResp?.educatorService) {
        setServices(servicesResp?.educatorService);
        setSelectedService(servicesResp?.educatorService[0]?.name);
      }
    }
    getServices();
  }, [])

  useEffect(() => {
    fetchStudents(selectedService);
  }, [services, selectedService])

  const handleRemove = async (uid) => {
    if (stGroupId && uid) {
      const res = await GroupService.deleteMember(stGroupId, uid);
      if (res) {
        fetchStudents(selectedService);
      }
    }
  }

  const handleSelect = (e) => {
    const { value } = e.target;
    setSelectedService(value);
  }

  const renderNoStudents = () => <h3 className="text-dark">No students in this group</h3>
  return (
    <div className={style.container}>
      <div className={style.header}>
        {services.length && (
          <FormControl as="select" onChange={handleSelect}>
            {services.map((service, key) => (
              <option key={key} value={service.name}>{service.name}</option>
            ))}
          </FormControl>
        )}
      </div>
      {isLoading ? <Spinner /> : (
        <>
          {students.length ?
            <>
              <div className={style.content}>
                {students.map((st, key) =>
                  <FriendCard
                    key={key}
                    uid={st.user_id}
                    profile={st.profile_info.profile}
                    onRemove={handleRemove}
                    redirectOnMessage={ROUTES.EDUCATOR_DETAILS_SERVICE_REQUESTS}
                  />
                )}
              </div>
            </> :
            renderNoStudents()}
        </>)
      }
    </div >
  );
};

export default React.memo(MyStudents);
