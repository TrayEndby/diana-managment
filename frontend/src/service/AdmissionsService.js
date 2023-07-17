import AbstractService from './AbstractService';

class AdmissionsService extends AbstractService {
  /**
   * Return user's college/admissions list:
   */

  // Get types and statuses
  async GetCollegeAdmissionType() {
    const payload = await this.post('/admission/GetCollegeAdmissionType', {})
    return payload.idNames || [];
  }

  async GetCollegeAdmissionApplicationStatus() {
    const payload = await this.post('/admission/GetCollegeAdmissionApplicationStatus', {})
    return payload.idNames || [];
  }

  async GetCollegeAdmissionCategoryStatus() {
    const payload = await this.post('/admission/GetCollegeAdmissionCategoryStatus', {})
    return payload.idNames || [];
  }

  /*
    Admission Tests API methods
  */
  async GetUserProfileTestInfos() {
    const payload = await this.post('/admission/GetCollegeAdmissionUserProfileTestInfos', {})
    return payload.userProfileTestInfos || [];
  }

  async GetUserCollegeTests() {
    const payload = await this.post('/admission/GetUserCollegeTests', {})
    return payload.userCollegeTests || [];
  }

  async InsertUserCollegeTests(data) {
    /* 
    data: [{
      college_id: number,
      user_test_id: number,
      status: number,
      deadline: string,
      description: string
    }]
    */
    const payload = await this.post('/admission/InsertUserCollegeTests', { 'userCollegeTests': data })
    return payload.res || [];
  }

  async UpdateUserCollegeTests(data) {
    /* 
    data: [{
      id: number,
      rest fields the same as in InsertUserCollegeTests
    }]
    */
    const payload = await this.post('/admission/UpdateUserCollegeTests', { 'userCollegeTests': data })
    return payload.res || [];
  }

  async DeleteUserCollegeTestById(id) {
    const payload = await this.post('/admission/DeleteUserCollegeTestById', { "userCollegeTests": [{ "id": id }] })
    return payload.res || [];
  }

  async DeleteUserCollegeTestByProfileId() {
    const payload = await this.post('/admission/DeleteUserCollegeTestByProfileId', {})
    return payload.res || [];
  }

  /*
    Admission Essay API methods
  */
  async GetUserEssays() {
    const payload = await this.post('/admission/GetUserEssays', {})
    return payload.userEssays || [];
  }

  async GetUserCollegeEssays() {
    const payload = await this.post('/admission/GetUserCollegeEssays', {})
    return payload.userCollegeEssays || [];
  }

  async InsertUserCollegeEssays(data) {
    /* 
    data: [{
      college_id: number,
      user_essay_id: number,
      status: number,
      importance: number,
      deadline: string,
      description: string
    }]
    */
    const payload = await this.post('/admission/InsertUserCollegeEssays', { 'userCollegeEssays': data })
    return payload.res || [];
  }

  async UpdateUserCollegeEssays(data) {
    /* 
    data: [{
      id: number,
      rest fields the same as in InsertUserCollegeEssays
    }]
    */
    const payload = await this.post('/admission/UpdateUserCollegeEssays', { 'userCollegeEssays': data })
    return payload.res || [];
  }

  async DeleteUserCollegeEssayById(id) {
    const payload = await this.post('/admission/DeleteUserCollegeEssayById', { "userCollegeEssays": [{ "id": id }] })
    return payload.res || [];
  }

  /*
    Admission reccomendation letters API methods
  */
  async GetUserCollegeRecLetters() {
    const payload = await this.post('/admission/GetUserCollegeRecommendationLetters', {})
    return payload.userCollegeRecommendationLetters || [];
  }

  async InsertUserCollegeRecLetters(data) {
    /* 
    data: [{
      college_id: number,
      recommender: string,
      status: number,
      importance: number,
      deadline: string,
      description: string // optional
    }]
    */
    const payload = await this.post('/admission/InsertUserCollegeRecommendationLetters', { 'userCollegeRecommendationLetters': data })
    return payload.res || [];
  }

  async UpdateUserCollegeRecLetters(data) {
    /* 
    data: [{
      id: number,
      rest fields the same as in InsertuserCollegeRecommendationLetters
    }]
    */
    const payload = await this.post('/admission/UpdateUserCollegeRecommendationLetters', { 'userCollegeRecommendationLetters': data })
    return payload.res || [];
  }

  async DeleteUserCollegeRecommendationLetterById(id) {
    const payload = await this.post('/admission/DeleteUserCollegeRecommendationLetterById', { "userCollegeRecommendationLetters": [{ "id": id }] })
    return payload.res || [];
  }

  /*
    Admission Interview API methods
  */
  async GetUserCollegeInterviews() {
    const payload = await this.post('/admission/GetUserCollegeInterviews', {})
    return payload.userCollegeInterviews || [];
  }

  async InsertUserCollegeInterviews(data) {
    /* 
    data: [{
      college_id: number,
      status: number,
      importance: number,
      deadline: string,
    }]
    */
    const payload = await this.post('/admission/InsertUserCollegeInterviews', { 'userCollegeInterviews': data })
    return payload.res || [];
  }

  async UpdateUserCollegeInterviews(data) {
    /* 
    data: [{
      id: number,
      rest fields the same as in InsertuserCollegeRecommendationLetters
    }]
    */
    const payload = await this.post('/admission/UpdateUserCollegeInterviews', { 'userCollegeInterviews': data })
    return payload.res || [];
  }

  async DeleteUserCollegeInterviewById(id) {
    const payload = await this.post('/admission/DeleteUserCollegeInterviewById', { "userCollegeInterviews": [{ "id": id }] })
    return payload.res || [];
  }
}

export default new AdmissionsService();
