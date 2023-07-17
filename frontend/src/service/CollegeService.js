import AbstractService from './AbstractService';

class CollegeService extends AbstractService {
    constructor() {
        super();
        this.campusSettingsCache = null;
        this.collegeTypesCache = null;
        this.applyStatusCache = null;
        this.sportsCache = null;
    }
    /**
     * Return a list of campus, each with
     * {id: string, name: string}
     */
    async listCampusSettings() {
        if (!this.campusSettingsCache) {
            let payload = await this.post('/c/college/list', { mode: 10 });
            this.campusSettingsCache = this.getSortedList(payload);
        }
        return this.campusSettingsCache;
    }

    /**
     * Return a list of college types, each with
     * {id: string, name: string}
     */
    async listCollegeTypes() {
        if (!this.collegeTypesCache) {
            let payload = await this.post('/c/college/list', { mode: 11 });
            this.collegeTypesCache = this.getSortedList(payload);
        }
        return this.collegeTypesCache;
    }

    /**
     * The list or majors that backend has data
     */
    listMajors() {
        return [
            { key: 'Architecture', text: 'Architecture' },
            { key: 'Business', text: 'Business' },
            { key: 'Chemistry', text: 'Chemistry' },
            { key: 'ComputerScience', text: 'Computer Science' },
            { key: 'CriminalJustice', text: 'Criminal Justice' },
            { key: 'Economics', text: 'Economics' },
            { key: 'Engineering', text: 'Engineering' },
            { key: 'English', text: 'English' },
            { key: 'Film', text: 'Film' },
            { key: 'Finance', text: 'Finance' },
            { key: 'History', text: 'History' },
            { key: 'PoliticalScience', text: 'Political Science' },
            { key: 'Premed', text: 'Premed' },
            { key: 'Psychology', text: 'Psychology' },
        ];
    }

    /**
     * Return a list of sports, each with
     * {id: number, name: string}
     */
    async listSportsAsync() {
        if (!this.sportsCache) {
            let payload = await this.post('/c/college/list', { mode: 13 });
            const idNames = payload.idNames || [];
            idNames.sort((a, b) => (a.id < b.id ? -1 : a.id === b.id ? 0 : 1));
            this.sportsCache = idNames;
        }
        return this.sportsCache;
    }

    listSports() {
        return [
            { key: 'AllTrackCombined', text: 'All Track Combined' },
            { key: 'Archery', text: 'Archery' },
            { key: 'Baseball', text: 'Baseball' },
            { key: 'Basketball', text: 'Basketball' },
            { key: 'BeachVolleyball', text: 'Beach Volleyball' },
            { key: 'Bowling', text: 'Bowling' },
            { key: 'Equestrian', text: 'Equestrian' },
            { key: 'Fencing', text: 'Fencing' },
            { key: 'FieldHockey', text: 'Field Hockey' },
            { key: 'Football', text: 'Football' },
            { key: 'Golf', text: 'Golf' },
            { key: 'Gymnastics', text: 'Gymnastics' },
            { key: 'IceHockey', text: 'Ice Hockey' },
            { key: 'Lacrosse', text: 'Lacrosse' },
            { key: 'Rifle', text: 'Rifle' },
            { key: 'Rodeo', text: 'Rodeo' },
            { key: 'Rowing', text: 'Rowing' },
            { key: 'Sailing', text: 'Sailing' },
            { key: 'Skiing', text: 'Skiing' },
            { key: 'Soccer', text: 'Soccer' },
            { key: 'Softball', text: 'Softball' },
            { key: 'Squash', text: 'Squash' },
            { key: 'Swimming', text: 'Swimming' },
            { key: 'SwimmingandDiving', text: 'Swimming and Diving' },
            { key: 'SynchronizedSwimming', text: 'Synchronized Swimming' },
            { key: 'Tennis', text: 'Tennis' },
            { key: 'TrackandFieldIndoor', text: 'Track and Field Indoor' },
            { key: 'TrackandFieldOutdoor', text: 'Track and Field Outdoor' },
            { key: 'TrackandFieldXCountry', text: 'Track and Field across Country' },
            { key: 'Volleyball', text: 'Volleyball' },
            { key: 'WaterPolo', text: 'Water Polo' },
            { key: 'Wrestling', text: 'Wrestling' },
            { key: 'OtherSports', text: 'Other Sports' },
        ];
    }

    /**
     * Return a list of college status, each with
     * {id: string, name: string}
     */
    async listCollegeApplyStatus(applyOrConsiderOnly = false) {
        if (!this.applyStatusCache) {
            let payload = await this.post('/c/college/list', { mode: 12 });
            this.applyStatusCache = this.getSortedList(payload);
        }
        if (applyOrConsiderOnly) {
            return this.applyStatusCache.filter(({ name }) => {
                return name === 'Applying' || name === 'Considering';
            });
        } else {
            return this.applyStatusCache;
        }
    }

    async getIdToApplyStatusMap(applyOrConsiderOnly = false) {
        let applyStatus = await this.listCollegeApplyStatus(applyOrConsiderOnly);
        let map = new Map();
        applyStatus.forEach(({ id, name }) => {
            map.set(id, name);
        });
        return map;
    }

    listEvaluationTypes() {
        return ['Safety', 'Target', 'Reach'];
    }

    getSortedList(payload) {
        let list = payload.idNames;
        list.sort((a, b) => a.name.localeCompare(b.name));
        return list;
    }

    formatNumToPercentage(num) {
        if (num == null) {
            return 'N/A';
        }
        return Math.floor(num) + '%';
    }

    /** Search and filter functionality ***/
    /**
     *
     * @param {*} searchData
     * @param {*} fromRow row number to start with, 1 based
     */
    async searchAndSort(searchData, fromRow) {
        const {
            campusSettings,
            collegeTypes,
            testScores,
            msports,
            wsports,
            major,
            inStateTuition,
            outstateTution,
            percentageAdmittedMin,
            percentageAdmittedMax,
            evaluationReach,
            evaluationSafety,
            evaluationTarget
        } = searchData;        
        const [colleges, totalRows] = await this.search(
            {
                campusSettings,
                collegeTypes,
                testScores,
                msports,
                wsports,
                majors: major ? [major] : undefined,
                inStateTuition,
                outstateTution,
                percentageAdmittedLow: Number(percentageAdmittedMin),
                percentageAdmittedHigh: Number(percentageAdmittedMax),
                evaluation: this._getEvaluation(evaluationReach, evaluationSafety, evaluationTarget)
            },
            fromRow,
        );
        colleges.sort((collegeA, collegeB) => (collegeA.name < collegeB.name ? -1 : 1));
        return [colleges, totalRows];
    }

    _getEvaluation(evaluationReach, evaluationSafety, evaluationTarget) {
        const set = {
            'Reach': evaluationReach,
            'Safety': evaluationSafety,
            'Target': evaluationTarget
        };
        const evaluation = [];
        for (const key in set) {
            if (set[key] === true) {
                evaluation.push(key);
            }
        }
        return evaluation.length ? evaluation : undefined;
    }

    /**
     * @param fromRow: row number to start with, 1 based
     * Return totalRows and a list of colleges with following attributes
     * Id
     * name
     * address
     * city
     * state
     * zip
     * url
     * description
     * evaluation
     * ranking
     * facultyratio
     * inStateTuition
     * outStateTuition
     * totalEnrollment
     * totalUGEnrollment
     * percentageOfOutOfState
     * percentageOfInState
     * percentageOfInternational
     * averagePrice
     * salaryAfter10Years
     * totalApplicants
     * percentageAdmitted
     * percentageAdmittedandEnrolled
     * rankRangeLow
     * rankRangeHigh
     * imageLink
     * avgGPA
     * campusSetting
     * collegeType
     *  // major ranking
     * Architecture
     * Business
     * Chemistry
     * ComputerScience
     * CriminalJustice
     * Economics
     * Engineering
     * English
     * Film
     * Finance
     * History
     * PoliticalScience
     * Premed
     * Psychology
     * // Sports program
     * Sports MenSports: [ids], use listSports to map
     * Sports WomenSports: [ids], use listSports to map
     * ???
     * distance: 1234
     * FeeWaiverAvailable: "Available"
     * Interview: "Not required"
     * AdmissionAddress: "208,Alamosa, CO 81101"
     * AdmissionEmail: "[email protected]"
     * AdmissionFax: "(719) 587-7522"
     * AdmissionOfficeURL: "https://www.prepscholar.com/sat/s/colleges/Adams-State-University-admission-requirements"
     * AdmissionOtherNotes: "Audition for music majors, portfolio for art majors recommended for some freshmen"
     * AdmissionPhone: "(719) 587-7712"
     * ApplicationFee: "$30"
     * CommonApplication: "Not accepted"
     * EarlyAction: "No"
     * EarlyDecision: "No"
     * ElectronicApplication: "Available"
     * EssayorPersonalStatement: "Required for some freshmen"
     * FederalStudentLoansBeginningUndergratudates: {
     *  AverageAmountofAidreceived: 8846,
     *  NumberReceivingAid: 332,
     *  PercentReceivingAid: 88,
     *  TotalAmountOfAidReceived: 2936839
     * }
     * FieldInfos?: {
     *  id: 337358,
     *  fieldid: 5009,
     *  degree: 8,
     *  ipeds_count1: 5
     * }
     */
    async search(searchData, fromRow) {
        let data = {
            mode: 2,
            fromRow,
            ...searchData,
        };
        let res = await this.post('/c/college/search', data);
        const totalRows = res.res || 0;
        const colleges = res.collegeEvaluationInfos || [];
        return [colleges, totalRows];
    }

    async searchCollegeById(collegeId) {
        let data = {
            mode: 1,
            collegeId: collegeId,
        };
        let res = await this.post('/c/college/search', data);
        return res.collegeEvaluationInfos || [];
    }
    /** End of Search and filter functionality */

    /** College and admission functionality */
    /**
     * Attributes of the apis
     * id: number
     * profile_id: string
     * college_id: number
     * major_id: number
     * status: string
     * progress: number
     * description: string
     * deadline: string
     * recommendation_letter_required: number
     * recommendation_letter_sent: number
     * testscore_due_in_office: string
     * interview_required: number
     * application_fee: number
     * notification_rolling: number
     * notification_date: string
     * internal: blob
     */

    /**
     * Return user's college list, each attribute of the list includes:
     */
    async getMyList() {
        let payload = await this.get('/admission/GetUserCollegeAdmissions');
        return payload.userCollegeAdmissions || [];
    }

    async insertToMyList(insertList) {
        let data = {
            userCollegeAdmissions: [insertList],
        };
        return this.post('/admission/InsertUserCollegeAdmissions', data);
    }

    async updateMyList(updatedList) {
        let data = {
            userCollegeAdmissions: [updatedList],
        };
        return this.post('/admission/UpdateUserCollegeAdmissions', data);
    }

    async deleteFromMyList(id) {
        let data = {
            userCollegeAdmissions: [{ id }],
        };
        return await this.post('/admission/DeleteUserCollegeAdmissionById', data);
    }
    /** End of college and admission functionality */
}

export default new CollegeService();
