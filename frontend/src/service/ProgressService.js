import AbstractService from './AbstractService';

const months = [];

class ProgressService extends AbstractService {

  updateUserProgress = async (month, week, progress) => {
    const data = {
      progress:
      {
        grade: 10,
        month: month,
        week: week,
        progress: progress,
        memo: "Took SAT"
      }
    };
    months.push(data)
    const response = await this.post('/mission/update_progress', data)
    return response;
  };

  getWeeklyProgress = async (month, week) => {
    const data = {
      mode: "week",
      progress: {
        grade: 10,
        month: month,
        week: week,
      }
    };
    const response = await this.post('/mission/get_progress', data);
    return response;
  };

  getMonhtlyProgress = async (month) => {
    const data = {
      mode: "month",
      progress: {
        grade: 10,
        month: month,
      },
    };
    const response = await this.post('/mission/get_progress', data);
    return response;
  };

  getNmonthProgress = async (month) => {
    const data = {
      mode: "n-month",
      progress: {
        month: month,
      },
    };
    const response = await this.post('/mission/get_progress', data);
    return response;
  };

  getGradeProgress = async (grade) => {
    const data = {
      mode: "grade",
      progress: {
        grade: grade,
      },
    };
    const response = await this.post('/mission/get_progress', data);
    return response;
  };

  getYtdProgress = async () => {
    const data = {
      mode: "ytd",
    };
    const response = await this.post('/mission/get_progress', data);
    return response;
  };

}

export default new ProgressService();
