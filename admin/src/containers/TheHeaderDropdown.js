import React, { useEffect, useState } from "react";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CImg
} from "@coreui/react";

import authService from "service/AuthService";
import userProfilePicService from "service/UserProfilePicService";
import SignOutButton from "views/SignOut";

const TheHeaderDropdown = () => {
  const [profilePic, setProfilePic] = useState(null);
  useEffect(() => {
    getProfilePic();
  }, []);


  const getProfilePic = async () => {
    const pic = await userProfilePicService.download();
    setProfilePic(pic);
  };

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={profilePic}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem header>
          {authService.getDisplayName()} ({authService.getEmail()})
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem disabled>Roles:</CDropdownItem>
        {
          authService.getVerifiedUserTypes().map((value, index) => {
            return <CDropdownItem key={value} disabled> &nbsp;&nbsp;{value} </CDropdownItem>
          })
        }
        <CDropdownItem divider />
        <CDropdownItem>
          <SignOutButton />
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
