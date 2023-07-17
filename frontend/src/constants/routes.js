export const LANDING = '/';
export const SIGN_IN = '/signin';
export const SIGN_UP = '/signup';
export const HOME = '/home';
export const SIGN_IN_EDUCATOR = `/signin-educator`;
export const SIGN_UP_EDUCATOR = `/signup-educator`;
export const SIGN_IN_PARENT = `/signin-parent`;
export const SIGN_UP_PARENT = `/signup-parent`;
export const LANDING_FORM = '/connect';

export const LEGAL_TERM = '/legal/term-of-use';
export const LEGAL_PRIVACY = '/legal/privacy';
export const LEGAL_EULA = '/legal/EULA';

// webinar
export const WEBINAR = `/webinar`;
export const WEBINAR_DETAIL = `/webinardetail`;

// FAQ
export const FAQ = '/faq'

// sprint program
export const SPRINT = `/sprint`;
export const SPRINT_DETAIL = `/sprintdetail`;

// Monthly Counseling sessions
export const COUNSELING = '/counseling';
export const COUNSELING_DETAIL = '/counselingdetail';

//short video section routes
export const VIDEO_CHOOSING_COLLEGE = '/';
export const VIDEO_PAYING_COLLEGE = '/video-paying-college';
export const VIDEO_TUTOR = '/video-tutor';
export const VIDEO_TALENT = '/video-talent';
export const VIDEO_ESSAY = '/video-essay';
export const VIDEO_LETTER = '/video-letter';

// profile questionnaire
export const QUESTIONNAIRE = '/questionnaire';
export const QUESTIONNAIRE_Q1 = '/questionnaire/q1';
export const QUESTIONNAIRE_Q2 = '/questionnaire/q2';
export const QUESTIONNAIRE_Q3 = '/questionnaire/q3';
export const QUESTIONNAIRE_Q4 = '/questionnaire/q4';
export const QUESTIONNAIRE_Q5 = '/questionnaire/q5';
export const QUESTIONNAIRE_Q6 = '/questionnaire/q6';
export const QUESTIONNAIRE_Q7 = '/questionnaire/q7';
export const QUESTIONNAIRE_Q8 = '/questionnaire/q8';

// parent profile questionnaire
export const PARENT_QUESTIONNAIRE = '/parent-questionnaire';
export const PARENT_QUESTIONNAIRE_Q1 = '/parent-questionnaire/q1';
export const PARENT_QUESTIONNAIRE_Q2 = '/parent-questionnaire/q2';
export const PARENT_QUESTIONNAIRE_Q3 = '/parent-questionnaire/q3';
export const PARENT_QUESTIONNAIRE_Q4 = '/parent-questionnaire/q4';
export const PARENT_QUESTIONNAIRE_Q5 = '/parent-questionnaire/q5';
export const PARENT_QUESTIONNAIRE_Q6 = '/parent-questionnaire/q6';
export const PARENT_QUESTIONNAIRE_Q7 = '/parent-questionnaire/q7';
export const PARENT_QUESTIONNAIRE_Q8 = '/parent-questionnaire/q8';
export const PARENT_QUESTIONNAIRE_Q9 = '/parent-questionnaire/q9';
export const PARENT_QUESTIONNAIRE_Q10 = '/parent-questionnaire/q10';
export const PARENT_QUESTIONNAIRE_Q11 = '/parent-questionnaire/q11';
export const PARENT_PROFILE = '/parent-profile';

export const MY_PROFILE = '/my-profile';
export const PUBLIC_PROFILE = '/public-profile';

export const MY_CONTACT = '/contact';
export const CALENDAR = '/calendar';
export const Add_CALENDAR_EVENT = '/add-calendar-event';

// course
export const COURSE = '/course';
export const COURSE_WATCH = `${COURSE}/watch`;
export const COURSE_CHANNEL = `${COURSE}/channel`;
export const COURSE_PLAYLIST = `${COURSE}/myList`;
export const COURSE_NOTE = `${COURSE}/note`;

// goal setting
export const GOAL = '/plan';
export const GOAL_LONG_TERM = '/plan/strategy';
export const GOAL_MID_TERM = '/plan/annual';
export const GOAL_MID_TERM_GRADE = `${GOAL_MID_TERM}/grade`;

// task managers
export const TASKS = '/tasks';

// college
export const COLLEGE = '/college';
export const COLLEGE_SEARCH = `${COLLEGE}/search`;
export const COLLEGE_DETAIL = `${COLLEGE}/detail`;

export const ESSAY = '/essay';
export const ESSAY_PUBLIC = `${ESSAY}/public`;
export const ESSAY_CLUSTER = `${ESSAY}/category`;
export const ESSAY_SAVED = `${ESSAY}/saved`;
export const ESSAY_MY_ESSAY = `${ESSAY}/my`;
export const ESSAY_COMPOSE = `${ESSAY}/compose`;

export const TEST_PREP = '/testPrep';
export const TEST_PREP_CHANNEL = `${TEST_PREP}/channel`;

/**
 * https://drive.google.com/drive/u/1/folders/15xDdPAyLaau4yt1eBWpmkD8Z1FGKMsVS
 * Extracurricular activities (formerly activities & achievements)
 */
export const ACTIVITIES = '/activities';

export const ORGANIZATIONS = `${ACTIVITIES}/organizations`;
export const ORGANIZATIONS_CREATE = `${ORGANIZATIONS}/create`;
export const ORGANIZATIONS_EXPLORE = `${ORGANIZATIONS}/explore`;
export const ORGANIZATIONS_CURRENT = `${ORGANIZATIONS}/current`;
export const ORGANIZATIONS_SAVED = `${ORGANIZATIONS}/saved`;

export const PROGRAMS = `${ACTIVITIES}/programs`;
export const PROGRAMS_EXPLORE = `${PROGRAMS}/explore`;
export const PROGRAMS_SAVED = `${PROGRAMS}/saved`;
export const PROGRAMS_COMPLETED = `${PROGRAMS}/completed`;
export const PROGRAMS_CREATE = `${PROGRAMS}/create`;

export const PROGRAM_DETAILS = `${ACTIVITIES}/details`;

export const SEARCH = `${ACTIVITIES}/search`;
export const SEARCH_ORGANIZATIONS = `${ACTIVITIES}/search/organizations`;
export const SEARCH_PROGRAMS = `${ACTIVITIES}/search/programs`;

/**
 * Collaborations
 */
export const COLLABORATIONS = `${ACTIVITIES}/collaborations`;
export const COLLABORATIONS_CREATE = `${COLLABORATIONS}/create`;
export const COLLABORATIONS_WORKSPACE = `${COLLABORATIONS}/workspace`;
export const COLLABORATIONS_MY_PROJECTS = `${COLLABORATIONS}/my-projects`;
export const COLLABORATIONS_SUBSCRIPTIONS = `${COLLABORATIONS}/subscriptions`;
export const COLLABORATIONS_EXPLORE_PROJECTS = `${COLLABORATIONS}/explore-projects`;
export const COLLABORATIONS_COMPLETED = `${COLLABORATIONS}/completed`;

/**
 * https://drive.google.com/drive/u/1/folders/1hWro-t9AlXgdoROk3kEUCNI4BSntKOOy
 * Admissions Management
 */

export const ADMISSIONS = '/admissions';
export const ADMISSIONS_CALENDAR = '/admissions/calendar';

// My Progress
export const MY_PROGRESS = '/myProgress';
export const BENCHMARK_AND_CHANCING = `${MY_PROGRESS}/benchmark-and-chancing`;
export const MISSION_TRACKING = `${MY_PROGRESS}/missing-checking`;
export const PROGRESS_REPORT = `${MY_PROGRESS}/progress-report`;

// portfolio
export const PORTFOLIO = `${MY_PROGRESS}/portfolio`;
export const PORTFOLIO_COURSE = `${PORTFOLIO}/course`;
export const PORTFOLIO_TEST = `${PORTFOLIO}/test`;
export const PORTFOLIO_ECA = `${PORTFOLIO}/eca`;
export const PORTFOLIO_ACHIEVEMENT = `${PORTFOLIO}/achievement`;
export const PORTFOLIO_SUPPLEMENTARY = `${PORTFOLIO}/additional`;

// My Evolution
export const MY_EVOLUTION = `/my-evolution`;

// Financial aid
export const FIN_AID = '/financial-aid';
export const FIN_AID_SEARCH = `${FIN_AID}/search`;
export const FIN_AID_DETAIL = `${FIN_AID}/detail`;

// student find educator
export const MY_EDUCATOR = `/myEducator`;
export const EDUCATORS = `${MY_EDUCATOR}/educators`;
export const EDUCATOR_MY_LIST = `${MY_EDUCATOR}/educator-favorites`;

// educator app
export const EDUCATOR_PROFILE = `/educator-profile`;
export const EDUCATOR_DETAILS = `/educator-details`;
export const EDUCATOR_DETAILS_ABOUT = `${EDUCATOR_DETAILS}/about`;
export const EDUCATOR_DETAILS_SERVICE_REQUESTS = `${EDUCATOR_DETAILS}/service-requests`;
export const EDUCATOR_DETAILS_CALENDAR = `${EDUCATOR_DETAILS_SERVICE_REQUESTS}/calendar`;
export const EDUCATOR_DETAILS_MY_STUDENTS = `${EDUCATOR_DETAILS_SERVICE_REQUESTS}/students`;
export const EDUCATOR_DETAILS_FEEDBACK = `${EDUCATOR_DETAILS}/feedback`;
export const EDUCATOR_DETAILS_SHEDULE_SERVICE = `${EDUCATOR_DETAILS}/shedule-service`;

// conversations
export const CONVERSATIONS = `/conversations`;

// additional resource
export const RESOURCES = '/resources';
export const RESOURCES_PODCASTS = `${RESOURCES}/podcasts`;
export const RESOURCES_PODCASTS_DETAIL = `${RESOURCES}/podcasts/detail`;
export const RESOURCES_ARTICLES = `${RESOURCES}/articles`;
export const RESOURCES_ARTICLES_DETAIL = `${RESOURCES}/articles/detail`;

// sprints
export const MY_HOMEWORK = `/myHomework`;
export const SPRINT_WORKSHOP = `${MY_HOMEWORK}/workshop`;

export const HOMEWORK = `${MY_HOMEWORK}/homework`;
export const HOMEWORK_ADMIN_ASSIGNMENT = `${HOMEWORK}/admin_assignment`;
export const HOMEWORK_ADMIN_SUBMITTED = `${HOMEWORK}/admin_submitted`;
export const HOMEWORK_USER_ALL = `${HOMEWORK}/view`;
export const HOMEWORK_USER_MY = `${HOMEWORK}/my`;

// payment
export const PAYMENT = '/payment';
export const PAYMENT_ORDER = `${PAYMENT}/order`;
export const PAYMENT_SUCCESS = `${PAYMENT}/success`;
export const PAYMENT_DECLINED = `${PAYMENT}/declined`;
export const SUBSCRIPTION = `${PAYMENT}/subscription`;
export const RECEIPT = `${PAYMENT}/receipt`;

export const PAYMENT_OK = '/payment-success';

// brochures
export const PRODUCT_BROCHURE = '/product-brochure';
export const SERVICE_BROCHURE = '/service-brochure';
