import React, { useEffect, useMemo, useState } from "react";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CCardText,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";

import { PROFILE_TYPE_ID, PROFILE_TYPE } from 'constants/profileTypes';
import * as ADMIN_ROUTES from "../routes";
import authService from "service/AuthService";

const TheSidebar = () => {
  const navigation = useMemo(() => [
    {
      _tag: "CSidebarNavDropdown",
      name: "USER REPORTS",
      _children: [
        {
          _tag: "CSidebarNavItem",
          name: "User Sign Up",
          to: ADMIN_ROUTES.USER_SIGN_UP,
          acl: [PROFILE_TYPE.AccountAdmin],
        },
        {
          _tag: "CSidebarNavItem",
          name: "User Transaction",
          to: ADMIN_ROUTES.USER_TRANSACTION,
          acl: [PROFILE_TYPE.AccountAdmin],
        },
        {
          _tag: "CSidebarNavItem",
          name: "Event Registration",
          to: ADMIN_ROUTES.EVENT_REGISTRAION,
          acl: [PROFILE_TYPE.EventEmailAdmin],
        },
      ],
    },
    {
      _tag: "CSidebarNavDropdown",
      name: "EMAIL",
      _children: [
        {
          _tag: "CSidebarNavItem",
          name: "Create",
          to: ADMIN_ROUTES.EMAIL_CREATE,
        },
        {
          _tag: "CSidebarNavItem",
          name: "Templates",
          to: ADMIN_ROUTES.EMAIL_TEMPLATE,
        },
        {
          _tag: "CSidebarNavItem",
          name: "Sent",
          to: ADMIN_ROUTES.EVENT_REGISTRAION,
        },
        {
          _tag: "CSidebarNavItem",
          name: "Scheduled",
          to: ADMIN_ROUTES.EVENT_REGISTRAION,
        },
        {
          _tag: "CSidebarNavItem",
          name: "Drafts",
          to: ADMIN_ROUTES.EMAIL_DRAFT,
        },
      ],
      acl: [PROFILE_TYPE.EventEmailAdmin],
    },
    {
      _tag: "CSidebarNavDropdown",
      name: "CONTENT MANAGEMENT",
      _children: [
        {
          _tag: "CSidebarNavItem",
          name: "Speakers",
          to: ADMIN_ROUTES.CONTENT_SPEAKERS,
        },
        {
          _tag: "CSidebarNavItem",
          name: "Events",
          to: ADMIN_ROUTES.CONTENT_EVENTS,
        },
        {
          _tag: "CSidebarNavItem",
          name: "Videos",
          to: ADMIN_ROUTES.CONTENT_VIDEOS,
        },
        {
          _tag: "CSidebarNavItem",
          name: "Flyers",
          to: ADMIN_ROUTES.CONTENT_FLYERS,
        },
        {
          _tag: "CSidebarNavItem",
          name: "Slides",
          to: ADMIN_ROUTES.CONTENT_SLIDES,
        },
      ],
      acl: [PROFILE_TYPE.EventEmailAdmin],
    },
    {
      _tag: "CSidebarNavDropdown",
      name: "CONTACTS",
      to: ADMIN_ROUTES.MAILING_LIST,
      _children: [
        {
          _tag: "CSidebarNavItem",
          name: "Mailing List",
          to: ADMIN_ROUTES.MAILING_LIST,
        },
      ],
      acl: [PROFILE_TYPE.EventEmailAdmin],
    },
  ], [])

  const [filteredNavigation, setFilteredNavigation] = useState(navigation);

  useEffect(() => {
    const filterNavigation = () => {
      let userTypes = authService.getVerifiedUserTypes();
      let nav = [];
      navigation.forEach(n => {
        let groupValid = false;
        if ('acl' in n) {
          n.acl.forEach(a => {
            if (userTypes.includes(a)) {
              groupValid = true;
            }
          });
        }
        let children = [];
        if ('_children' in n) {
          n._children.forEach(c => {
            if ('acl' in c) {
              let childValid = false;
              c.acl.forEach(a => {
                if (userTypes.includes(a)) {
                  childValid = true;
                }
              });
              if (childValid) {
                children.push(c);
              }
            } else if (groupValid) {
              children.push(c);
            }
          });
        }
        if (children.length >= 0) {
          n._children = children;
          nav.push(n);
        }
      });
      setFilteredNavigation(nav);
    }
    filterNavigation();
  }, [navigation]);

  const isVerifiedAdmin = () => {
      return (
        authService.isVerified(PROFILE_TYPE_ID[PROFILE_TYPE.DataAdmin]) ||
        authService.isVerified(PROFILE_TYPE_ID[PROFILE_TYPE.AccountAdmin]) ||
        authService.isVerified(PROFILE_TYPE_ID[PROFILE_TYPE.EventEmailAdmin])
      );
  }

  return (
    <CSidebar show={isVerifiedAdmin()}>
      <CSidebarBrand className="d-md-down-none">
        <img alt={"Logo"} src="/logo512.png" className="logoImg"></img>
        <CCardText className="logoText">RISE WITH KYROS</CCardText>
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={filteredNavigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
          }}
        />
      </CSidebarNav>
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
