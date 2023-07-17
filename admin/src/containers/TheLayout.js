import React from "react";
import { TheContent, TheHeader } from "./index";

const TheLayout = (props) => {
  return (
    <div className="c-wrapper">
      <TheHeader title={props.title}/>
      <div className="c-body">
        <TheContent>{props.children}</TheContent>
      </div>
    </div>
  );
};

export default TheLayout;
