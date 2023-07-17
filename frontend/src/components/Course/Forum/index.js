import React from 'react';

import Card from 'react-bootstrap/Card';


const CourseForum = () => {
  return (
    <div className="p-3">
      <h5>Course community</h5>
      <div className="my-2">
        <h6>Contact instructor</h6>
        <Card className="rounded-0 p-2" style={{height: "100px"}}>
          This feature will be available soon
        </Card>
      </div>
      <div className="my-2">
        <h6>Student discussion</h6>
        <Card className="rounded-0 p-2" style={{height: "100px"}}>
          This feature will be available soon
        </Card>
      </div>
    </div>
  )
};


export default CourseForum;