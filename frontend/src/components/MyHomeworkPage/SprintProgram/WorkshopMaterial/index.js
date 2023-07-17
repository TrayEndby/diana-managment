import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import SprintContainer from '../Container';
import { Search as SearchIcon } from 'react-bootstrap-icons';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import DocIcon from 'assets/docs.png';
import PptIcon from 'assets/ppt.png';
import MultimediaIcon from 'assets/multimedia.png';
import style from './style.module.scss';
import VideoCard from 'CSA/Community/Training/TrainingVideos/Card';
import OfficeCard from '../Card';
import * as ROUTES from 'constants/routes';
import SideBar from 'util/SideBar';
import ErrorDialog from 'util/ErrorDialog';
import useErrorHandler from 'util/hooks/useErrorHandler';
import ResourceService from 'service/ResourceService';

const propTypes = {};

const WorkshopMaterial = () => {
  const location = useLocation();

  const [searchKey, setSearchKey] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [detailType, setDetailType] = useState(0);
  const [detailItem, setDetailItem] = useState(null);
  const [materialList, setMaterialList] = useState([]);
  const [wsId, setWSId] = useState(0);
  const [error, setError] = useErrorHandler(null);
  const [workshopNavBar, setWorkshopNavBar] = useState([]);
  const [sprintList, setSprintList] = useState([]);

  const initPage = useCallback(() => {
    let thisId = 0;
    if (location.search != null && location.search !== '')
      thisId = location.search.substr(4);
    let thisTitle = '';
    if (thisId !== 0) {
      let thisObject = sprintList.filter((obj) => obj[0].object_id === thisId);
      if (thisObject.length > 0) {
        thisObject = thisObject[0];
        thisTitle = thisObject[0].description.substr(
          thisObject[0].description.indexOf('-') + 1,
        );
      } else thisObject = [];
      setMaterialList(thisObject);
    }
    setWSId(thisId);
    const menuItems = document.getElementsByClassName('card-text');
    for (let i = 0; i < menuItems.length; i++) {
      const menuItem = menuItems.item(i);
      menuItem.setAttribute('style', 'background-color: transparent');
      if (thisTitle === menuItem.getAttribute('title')) {
        menuItem.setAttribute('style', 'background-color: #f78154');
      }
    }
  }, [location.search]);

  const fetchSprintList = useCallback(async () => {
    try {
      const q1Tabs = [];
      const resourceList = await ResourceService.list(7);
      const objectList = [];
      resourceList[0].forEach((res) => {
        const objItem = objectList.filter(
          (obj) => obj[0].object_id === res.object_id,
        );
        if (objItem.length > 0) {
          const thisObject = objItem[0];
          thisObject.push(res);
        } else {
          objectList.push([res]);
        }
      });
      setSprintList(objectList);

      objectList.forEach((obj) => {
        q1Tabs.push({
          name: obj[0].description.substr(obj[0].description.indexOf('-') + 1),
          path: `${ROUTES.SPRINT_WORKSHOP}?id=${obj[0].object_id}`,
        });
      });
      const wsnavBars = [
        {
          title: 'Q1 Sprint Program',
          tabs: q1Tabs,
        },
      ];
      setWorkshopNavBar(wsnavBars);
      initPage();
    } catch (e) {
      setError(e);
    }
  }, [setError, initPage]);

  useEffect(() => {
    fetchSprintList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initPage();
  });

  const handleClickMaterial = (mat) => {
    const type = getTypeFromTitle(mat.title);
    setShowDetail(true);
    setDetailType(type);
    setDetailItem({
      title: mat.title,
      source: mat.source,
      url: mat.url,
      type: type,
    });
  };

  const getIconFromTitle = (title) => {
    const type = getTypeFromTitle(title);
    switch (type) {
      case 1:
        return PptIcon;
      case 2:
        return DocIcon;
      case 3:
        return MultimediaIcon;
      default:
        return PptIcon;
    }
  };

  const getTypeFromTitle = (title) => {
    const extension = title.substr(title.indexOf('.') + 1);
    if (extension === 'ppt' || extension === 'pptx') {
      return 1;
    }
    if (extension === 'doc' || extension === 'docx') {
      return 2;
    }
    if (extension === 'mp4' || extension === 'avi' || extension === 'mov') {
      return 3;
    }
    return 0;
  };

  return (
    <SprintContainer
      caption="Workshop Material"
      selectedTab={0}
      sideBar={(closeSidebar) => (
        <SideBar navBars={workshopNavBar} onCloseSidebar={closeSidebar} />
      )}
    >
      {error && <ErrorDialog error={error} />}
      {wsId === 0 && (
        <div className={style.workshopPage} style={{ padding: '25px' }}>
          Please selecte a sprint program on the left bar
        </div>
      )}
      {wsId !== 0 && (
        <div className={style.workshopPage}>
          <div className={style.topBar}>
            <div className={style.searchBar}>
              <SearchIcon />
              <Form.Control
                required={false}
                type="text"
                placeholder="Search by name"
                value={searchKey}
                className={style.searchText}
                onChange={(e) => setSearchKey(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Table borderless className={style.table}>
              <thead className={style.thead}>
                <tr>
                  <td style={{ paddingLeft: '43px' }}>Name</td>
                  <td>Owner</td>
                  <td>Last Modified</td>
                  <td>Format</td>
                </tr>
              </thead>
              <tbody>
                {materialList.map(
                  (material, index) =>
                    material.title.indexOf(searchKey) !== -1 && (
                      <tr
                        key={index}
                        className={style.tr}
                        onClick={() => handleClickMaterial(material)}
                      >
                        <td>
                          <img
                            alt="material"
                            src={getIconFromTitle(material.title)}
                            style={{ marginRight: '8px' }}
                          />
                          {material.title}
                        </td>
                        <td>{material.source}</td>
                        <td>
                          {moment(material.updated_ts).format('MM/DD/YYYY')}
                        </td>
                        <td>
                          {material.title.substr(material.title.indexOf('.'))}
                        </td>
                      </tr>
                    ),
                )}
              </tbody>
            </Table>
          </div>
        </div>
      )}
      <Modal
        size="lg"
        centered
        show={showDetail}
        onHide={() => setShowDetail(false)}
      >
        <Modal.Header
          style={{ borderBottom: '0px' }}
          closeButton
        ></Modal.Header>
        <Modal.Body
          style={{
            maxHeight: '730px',
            overflow: 'auto',
          }}
        >
          {(detailType === 1 || detailType === 2) && (
            <OfficeCard deck={detailItem} isPrivate={true} />
          )}
          {detailType === 3 && (
            <VideoCard video={detailItem} isPrivate={true} />
          )}
        </Modal.Body>
      </Modal>
    </SprintContainer>
  );
};

WorkshopMaterial.propTypes = propTypes;

export default React.memo(WorkshopMaterial);
