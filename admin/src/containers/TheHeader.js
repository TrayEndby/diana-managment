import React from "react";
import { CHeader, CHeaderNav } from "@coreui/react";

import { TheHeaderDropdown } from "./index";

const TheHeader = ({title}) => {
  return (
    <CHeader withSubheader>
      <div style={{ flex: 1, flexDirection: 'row', margin: "auto", fontSize: "25px"}}>
        {title}
      </div>
      <CHeaderNav className="px-3">
        <TheHeaderDropdown />
      </CHeaderNav>
    </CHeader>
  );
};

export default TheHeader;
