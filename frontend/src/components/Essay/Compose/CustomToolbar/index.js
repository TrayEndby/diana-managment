import React from 'react';
import { Table } from 'react-bootstrap-icons';

const propTypes = {};

const ID = 'essay-toolbar';

const CustomButton = () => <Table title="Insert table" />;

/*
 * Event handler to be attached using Quill toolbar module (see line 73)
 * https://quilljs.com/docs/modules/toolbar/
 */
function insertTable() {
  this.quill.getModule('better-table').insertTable(3, 3);
}

/*
 * Custom toolbar component including insertStar button and dropdowns
 */
const CustomToolbar = () => (
  <div id={ID}>
    <select className="ql-header" defaultValue={''} onChange={(e) => e.persist()}>
      <option value="1" />
      <option value="2" />
      <option selected />
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-strike" />
    <button className="ql-blockquote" />
    <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
      <button className="ql-indent" value="-1"></button>
      <button className="ql-indent" value="+1"></button>
      <select className="ql-align" defaultValue={''} onChange={(e) => e.persist()}>
        <option selected />
        <option value="center" />
        <option value="right" />
        <option value="justify" />
      </select>
    <select className="ql-color">
      <option value="red" />
      <option value="green" />
      <option value="blue" />
      <option value="orange" />
      <option value="violet" />
      <option value="#d0d1d2" />
      <option selected />
    </select>
    <select className="ql-background">
      <option value="red" />
      <option value="green" />
      <option value="blue" />
      <option value="orange" />
      <option value="violet" />
      <option value="#d0d1d2" />
      <option selected />
    </select>
    <button className="ql-link" />
    <button className="ql-image" />
    <button className="ql-insertTable">
      <CustomButton />
    </button>
  </div>
);

CustomToolbar.propTypes = propTypes;

export default CustomToolbar;

export const toolbar = {
  container: `#${ID}`,
  handlers: {
    insertTable,
  },
};
