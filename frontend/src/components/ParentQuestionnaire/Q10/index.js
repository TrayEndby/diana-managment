import React, { useState } from 'react';
import { Layout, LeftCard, RightCard } from '../../Questionnaire/Layout';
import AddChild from '../Basic/AddChild';
import DotStepBar from '../../../util/DotStepBar';
import ParentService from '../../../service/ParentService';
import * as ROUTES from '../../../constants/routes';

const defaultNewItem = { name: '', email: '' };
const MAX_CHILD_COUNT = 7;

const Q10 = () => {
  const [childrenList, setChildrenList] = useState([defaultNewItem]);

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    const updatedList = [...childrenList];
    updatedList.splice(id, 1, { ...updatedList[id], [name]: value });
    setChildrenList(updatedList);
  }

  const addRow = () => {
    setChildrenList([...childrenList, defaultNewItem])
  }

  const handleRemove = (id) => {
    const updatedList = [...childrenList];
    updatedList.splice(id, 1);
    setChildrenList(updatedList);
  }

  const onSave = async () => {
    const filteredChildren = childrenList.filter(child => child.name && child.email);
    if (filteredChildren.length) {
      await ParentService.parentInsertOrUpdateChildren(filteredChildren);
    }
  };

  return (
    <Layout>
      <DotStepBar steps={[10, 0, 0]} />
      <LeftCard section={1}
        instr="You and child are included to use our app, you can add your other childrenas additional users"
      >
        Please enter information about your child
      </LeftCard>
      <RightCard
        next="Go to question 11"
        linkToNextPage={ROUTES.PARENT_QUESTIONNAIRE_Q11}
        onRedirect={onSave}
        save
      >
        <AddChild childrenList={childrenList} maxItems={MAX_CHILD_COUNT} handleChange={handleChange} addRow={addRow} handleRemove={handleRemove} />
      </RightCard>
    </Layout>
  );
}

export default Q10;
