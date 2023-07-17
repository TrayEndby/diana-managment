import React from 'react';
import './style.scss';

const SkillsList = ({ skills, isEditable = false, handleRemove }) => {
  if (!Array.isArray(skills) || skills.length === 0) return;
  return (
    <div className="skill-container">
      {skills.map((skill, i) => {
        return (
          <div className="skill-item" key={i}>
            {skill}
            {isEditable && <span className="skill-item__remove" onClick={() => handleRemove(i)}></span>}
          </div>
        )
      })}
    </div>
  )
}

export default React.memo(SkillsList);