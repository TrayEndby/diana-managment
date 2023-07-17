import React from "react";
import { CContainer } from "@coreui/react";

const TheContent = ({ children }) => {
  return (
    <main className="c-main">
      <CContainer fluid>{children}</CContainer>
    </main>
  );
};

export default React.memo(TheContent);
