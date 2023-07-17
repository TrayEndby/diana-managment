import React from 'react';

import Layout from '../Layout';
import AchievementCard from './Card';

import userProfileSearchService from '../../../service/UserProfileSearchService';

class Achievement extends React.Component {
  constructor() {
    super();
    this.state = {
      achievements: [],
      saved: {
        achievementsSaved: true,
      },
    };
  }

  fetchData = async () => {
    const data = await userProfileSearchService.searchProfile();
    if (data && data.profile) {
      const achievements = data.profile.achievement || [];
      this.setState({
        achievements,
      });
    }
  };

  setAchievement = (newAchievement) => {
    const newId = newAchievement.id;
    let isNew = true;
    let achievements = this.state.achievements.map((achievement) => {
      const { id } = achievement;
      if (newId && id === newId) {
        // when update saved achievement or update a newly added achievement
        isNew = false;
        return newAchievement;
      } else {
        return achievement;
      }
    });

    if (isNew) {
      achievements = [...achievements, newAchievement];
    }
    this.setState({ achievements });
    this.markUnsaved('achievementsSaved', false);
  };

  saveAchievements = async () => {
    await userProfileSearchService.insertAchievementInfo(this.state.achievements);
  };

  deleteAchievement = async (id, index) => {
    if (id != null) {
      await userProfileSearchService.deleteAchievement(id);
      this.fetchData();
    } else {
      // new achivement
      const achievements = this.state.achievements.filter((_v, i) => i !== index);
      this.setState({ achievements });
    }
  };

  markUnsaved = (field, value) => {
    this.setState({
      saved: {
        ...this.state.saved,
        [field]: value,
      },
    });
  };

  saveChanges = async () => {
    const { saved } = this.state;
    if (!saved.achievementsSaved) {
      await this.saveAchievements();
      this.markUnsaved('achievementsSaved', true);
      this.fetchData();
    }
  };

  render() {
    const { achievements, saved } = this.state;
    return (
      <Layout saved={saved} onSave={this.saveChanges} onMount={this.fetchData}>
        <AchievementCard achievements={achievements} onChange={this.setAchievement} onDelete={this.deleteAchievement} />
      </Layout>
    );
  }
}

export default Achievement;
