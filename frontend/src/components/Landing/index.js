import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Accordion, Card, Container } from 'react-bootstrap';
import { StarFill, TelephoneFill, GeoAlt } from 'react-bootstrap-icons';

import Julie from 'assets/JulieMontgomery.png';
import Natalie from 'assets/Natalie.png';
import Benjamin from 'assets/BenjaminChen.png';
import topSection from "../../assets/KyrosHomePage/Kyros-TopSection.svg"
import headerText from "../../assets/KyrosHomePage/Header-Text.svg"
import middleSection from "../../assets/KyrosHomePage/Kyros-JourneySection.png"
import studentSection from "../../assets/KyrosHomePage/Kyros-StudentSection.png"
import bottomSection from "../../assets/KyrosHomePage/Kyros-BottomSection.png"
import bottomText from "../../assets/KyrosHomePage/Bottom-Text.svg"
import astronaut from "../../assets/KyrosHomePage/Astronaut2.svg"
import footerLogo from "../../assets/KyrosHomePage/RiseWithKyrosLogo.svg"

import Box1 from "../../assets/KyrosHomePage/Box1.svg"
import Box2 from "../../assets/KyrosHomePage/Box2.svg"
import Box3 from "../../assets/KyrosHomePage/Box3.svg"

import telescope from "../../assets/KyrosHomePage/Telescope.svg"


import * as ROUTES from 'constants/routes';
import SocialIcons from 'util/SocialIcons';
import './style.scss';



const LandingPage = () => (
  <div className="landingPage App-body">
    <MainView />
    <MiddleSection />
    <LowerSection />
    <StudentSection />
    <LearnMore />
    <Footer />
  </div>
);

const MainView = () => {
  const history = useHistory();
  return (
    <Container fluid className="d-flex flex-row justify-content-center header-background">
      <img className="responsive top-section" src={topSection} alt="topSection"></img>

      <div className="sky-container">
        <div className="star"></div>
        <div className="star mobile-not-visible"></div>
      </div>
      <div className="sky-container1">
        <div className="star1"></div>
        <div className="star1"></div>
        <div className="star1"></div>
      </div>
      <div className="sky-container2">
        <div className="star2"></div>
        <div className="star2"></div>
        <div className="star2"></div>
      </div>
      <div className="sky-container3">
        <div className="star3"></div>
      </div>
      <div className="d-flex justify-self-start header-content">
        <div className="header-text1">
          <img className="responsive-text" src={headerText} alt="headerText"></img>
          <div className="d-flex flex-row action-buttons">
            <div className="text-center mr-4">
              <Button
                className="btn-journey"
                size="sm"
                style={{ height: '47px', marginRight: "24px" }}
                onClick={() => history.push(ROUTES.LANDING_FORM)}
              >
                Let's connect
              </Button>
            </div>
          </div>
        </div>
        <div className="home-box">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="flex-column justify-self-end">
        <div className="social-icons-div">
          <SocialIcons />
        </div>
      </div>
      <div className="flex-column justify-self-end">
        <div className="astronaut">
          <img src={astronaut} alt="astronaut"></img>
        </div>
      </div>
    </Container>
  )
};

const MiddleSection = () => (
  <Container fluid className="d-flex flex-column justify-content-center align-items-center middle-background">
    <img className="responsive middle-section" src={middleSection} alt="middleSection"></img>
    <Container className="d-flex justfy-content-center align-items-center service-question"><h1><b>How Kyros.ai helps you?</b></h1></Container>
    <Container className="d-flex justfy-content-center align-items-center service-cards p-0">
      <Col>
        {/* <div className="box-top">JUST FOR YOU</div> */}
        <div className="box">
          <div className="box-img1"><img src={Box1} alt="Box1"></img></div>
          <div className="box-div">
            <p className="box-header">Personalized <br></br>roadmap</p>
            <p className="box-text">Based on student’s profile and data points, it's the solution just for you. Curated content to fit students’ needs.</p>
          </div>
        </div>
      </Col>
      <Col>
        {/* <div className="box-top">NEVER ALONE</div> */}
        <div className="box">
          <div className="box-img2"><img src={Box2} alt="Box2"></img></div>
          <div className="box-div">
            <p className="box-header"><b>Build your support <br></br>network</b></p>
            <p className="box-text">50 Instructor-led workshops to support students to reach for
            key milestones; <br></br>24 webinars;
            discussion with peers; online support available; you are always in good hands</p>
          </div>
        </div>
      </Col>
      <Col>
        {/* <div className="box-top">ON TARGET AND ON TOP</div> */}
        <div className="box">
          <div className="box-img3"> <img src={Box3} alt="Box3"></img></div>
          <div className="box-div">
            <p className="box-header">Track, analyze and manage your progress</p>
            <p className="box-text">Weekly reports and in-depth
            analysis keep you on track and
            on top of tasks. We’ll help you set goals and keep you on track
            by managing your calendar,
        sending reminders, and assessing your progress.</p>
          </div>
        </div>
      </Col>
    </Container >
  </Container >
);


const LowerSection = () => (
  <Container fluid className="d-flex flex-column align-items-center lower-background">
    <Row>
      <Col lg={{ span: 1 }} ></Col>
      <Col lg={{ span: 7 }} className="d-flex flex-column justify-content-center advisory-div">
        <h1 className="edStars">Meet our EdStars</h1>
        <Accordion>
          <Card className="card">
            <Card.Header className="d-flex flex-row">
              <div className="front-image"><img src={Julie} alt="Julie" /> </div>
              <div className="ml-4 advisory-text">
                <h1 className="name">Julie Montgomery</h1>
                <p className="m-0">
                  <b>AP Math teacher for 20+ years </b>at one of the highest performing high schools.<br></br> Master's degree from <b className="color-text">"Stanford University, School of Education"</b>
                </p>
                <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="0" className="p-0 d-flex align-items-center "><StarFill color="#65AD59" className="mr-1" />read more</Accordion.Toggle></div>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0" style={{ backgroundColor: "#65AD59" }}><Card.Body>
              <div style={{ fontSize: "16px", color: "white" }}>
                <span className="small-name">Julie Montgomery</span> is an AP Calculus teacher at Leland High
                      School, the highest performing high school in San Jose Unified School District. Teaching the
                      entire mathematics curriculum from Algebra 1 through AP Calculus BC for the past 20 years, Julie's
                      extensive mathematics knowledge and skills lend themselves well to tutoring students from 5th
                      grade through Calculus. With a proven track record since 2013 of a 100% pass rate for her AP
                      Calculus BC students and an average of 89% earning a perfect score of 5, Julie's experience
                      benefits all students both inside and outside her classroom. Her support of students' college
                      applications through letters of recommendation enables many of her students to matriculate at MIT,
                      Harvard, Stanford, Princeton, Brown, Columbia, UPenn, Caltech, UChicago, Harvey Mudd, Carnegie
                      Mellon, Berkeley, UCLA. Many of her students report being at the top of their Calculus classes in
                      their first year of college.
                    </div>
              <br></br>
              <div style={{ fontSize: "16px", color: "white" }}>
                Julie's educational experience includes teaching physics and chemistry for the Peace Corps,
                running the K-8 MAthematics Program for the premiere distance learning program, EPGY, part of
                Stanford Pre-Collegiate Studies, and teaching CTY summer courses. She advised CTY on
                implementation methods before they launched their own K-8 Mathematics distance learning course.
                Julie also partnered with the international branch of the Education Development Center as a
                materials development specialist in the Republic of Guinea.
                    </div>
              <br></br>
              <div style={{ fontSize: "16px", color: "white" }}>
                Julie earned her bachelor's degree in mathematics at Mount Holyoke College and her master's degree
                in international development education at Stanford University's School of Education.
              </div>

            </Card.Body></Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header className="d-flex flex-row">
              <div className="front-image"><img src={Natalie} alt="Natalie" /> </div>
              <div className="ml-4 advisory-text">
                <h1 className="name">Nathalie Galindo</h1>
                <p className="m-0">
                  Former <b>Harvard Admissions Officer</b>, and a <b>Vice President of Admissions at 2U</b>. <br></br>Master's
                  degree from <b className="color-text">"Harvard University, School of Education"</b>
                </p>
                <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="1" className="p-0 d-flex align-items-center"><StarFill color="#65AD59" className="mr-1" />read more</Accordion.Toggle></div>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="1" style={{ backgroundColor: "#65AD59" }}><Card.Body>
              <div style={{ fontSize: "16px", color: "white" }}>
                <span className="small-name">Nathalie Galindo-Lee </span> is an admissions and education
                      technology professional with 10+ years of experience in undergraduate and graduate admissions. As
                      a Harvard graduate and former Harvard Admissions Officer, Nathalie is especially familiar with Ivy
                      League and Elite university admissions for both multidisciplinary undergraduate programs and
                      graduate business and data science degrees. Nathalie has expertise in coaching students 1-1 as
                      well as training and developing admissions counselors to most effectively support and coach
                      aspiring university students throughout their admissions processes.{' '}
              </div>
              <br></br>
              <div style={{ fontSize: "16px", color: "white" }}>
                Nathalie has worked at various education technology companies, college access organizations, and
                higher education institutions in an effort to expand access to opportunity and learning. Her
                experiences include working as a Program Manager with the Google Cloud Learning Services team for
                higher education, and being Vice President of Admissions at 2U, a leading online program manager
                for university online degrees, short-courses, and bootcamps. She's a proud alumna of Harvard
                College, the Harvard Graduate School of Education, and UNC Kenan-Flagler Business School, and is
                thrilled to join the Kyros.ai Counselor Advisory Board.
                </div>
            </Card.Body></Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header className="d-flex flex-row">
              <div className="front-image "><img src={Benjamin} alt="Ben" /> </div>
              <div className="ml-4 advisory-text">
                <h1 className="name">Benjamin Chen</h1>
                <p className="m-0">
                  <b>Mentor for international students.</b> Alumni from <b className="color-text"> Harvard,<br></br> Stanford, MIT, and A Quest Scholar @ Stanford University.</b>
                </p>
                <div className="d-flex justify-content-end"> <Accordion.Toggle as={Button} variant="link" eventKey="2" className="d-flex align-items-center p-0"><StarFill color="#65AD59" className="mr-1" />read more</Accordion.Toggle></div>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="2" style={{ backgroundColor: "#65AD59" }}><Card.Body>
              <div style={{ fontSize: "16px", color: "white" }}>
                <span className="small-name">Benjamin Chen</span> is Managing Director at Crimson Capital
                      Management where he oversees public investments in US small and mid-cap biotechnology companies.
                      The fund has won multiple awards including Top 10 Biotechnology/Healthcare Hedge Fund Award by
                      BarclayHedge in 2018, 2019 and 2020. Prior to this, he has worked at McKinsey & Co. Corporate
                      Finance Group in Asia and Goldman Sachs IBD in New York. Ben received his MBA from University of
                      Chicago and A.B. from Harvard College with Honor and as a John Harvard Scholar (top 10% of his
                      class). Ben was also a Quest Scholar from Stanford University.
              </div>
              <br></br>
              <div style={{ fontSize: "16px", color: "white" }}>
                Aside from being a successful investor, Ben also has a personal <b>passion for mentoring</b> young
                high school students and inspiring them to achieve the best version of themselves. He has been
                mentoring 200+ <b>international students</b> over the past decade to be admitted into Ivy Colleges including Harvard, Stanford, MIT, Columbia, Yale Universities with an{' '}
                <b>outstanding success rate.</b>
              </div>
              <br></br>
              <div style={{ fontSize: "16px", color: "white" }}>
                Ben is an alumni from <b>Harvard, Stanford, MIT and Univ. of Chicago</b>, he is also a
                <b> Quest Scholar @ Stanford University.</b>
              </div>
            </Card.Body></Accordion.Collapse>
          </Card>
        </Accordion>
      </Col>
      <Col lg={{ span: 3 }} className="telescope-div d-flex align-items-end justify-content-center"><img src={telescope} alt="telescope"></img></Col>
    </Row>
  </Container >
)


const StudentSection = () => (
  <Container
    fluid
    style={{ width: '100%', height: 'auto' }}
    className="d-flex flex-column justify-content-center student-section"
  >
    <img
      className="responsive-dark"
      style={{ width: '100%' }}
      src={studentSection}
      alt="studentSection"
    ></img>
    {/* <Col className="student-text-div"><h3>Amelia</h3><div><p className="orange-text">I really love that kyros.ai has assessment & recommendations for when students should complete which college prep tasks.</p><p> These are timelines created by Ivy League admissions officers. Some these prep services wanted to charge me $13,000 for just SAT prep, so kyros.ai is way more affordable! </p></div></Col>
    <Col className="student-text-div"><h3>Olivia</h3><div><p className="orange-text"> Kyros.ai is a great resource for high schoolers seeking college guidance.</p><p>I'm very pleased with the test prep and major & college search which will have a high impact in choosing a college. Within the "test prep" module, Kyros provides study tips and the filtered search to discover courses by subject. It's so simple to use!</p></div></Col>
    <Col className="student-text-div"><h3>John</h3><div><p className="orange-text">Kyros.ai design and the content have been streamlined extremely well.</p><p>I particularly found the <b>Essays, Financial aid,  Additional Resources useful</b>.  Financial aid is hard to figure out so that was a great recommendation from Kyros.ai - <b>the AI algorithm is tailored for my needs.</b></p></div></Col> */}
    <div className="student-question">What our students are saying...</div>
  </Container>
);


const LearnMore = () => {
  const history = useHistory();
  return (
  <Container
    fluid
    style={{ width: '100%', height: 'auto' }}
    className="d-flex flex-column justify-content-center bottom-section"
  >
    <img
      className="responsive"
      style={{ width: '100%' }}
      src={bottomSection}
      alt="bottomSection"
    ></img>
    <div className="bottom-text">
      <img className="responsive-text" src={bottomText} alt="bottomText"></img>
      <div className="d-flex flex-row action-buttons justify-content-end">
        <div className="text-center">
          <Link >
            <Button className="btn-journey-bottom" size="sm" style={{ height: '47px' }} onClick={() => history.push(ROUTES.LANDING_FORM)}>
              Let's talk
         </Button>
          </Link>
        </div>
      </div>
    </div>
  </Container>
  )
};

export const Footer = () => (
  <div className="footer">
    <Container fluid className="d-flex flex-row footer-container">
      <Container fluid className="d-flex" style={{ marginTop: "45px" }}>
        <Container className="text-left d-flex flex-column ml-4">
          <div className="text-white text-left"><b>CONTACT</b></div>
          <div className="d-flex flex-row">
            <Button variant="outline" className="mt-2 mb-0 phone-number"><TelephoneFill className="mr-2" />(650) 684-8678‬</Button>
            <div className="text-white text-left mb-1"></div>
            <div>
              <a href="mailto:info@kyros.ai" rel="noopener noreferrer" target="_blank">
                <Button variant="primary" className="mt-2 mb-0 footer-button">Email Us</Button>
              </a>
            </div>
          </div>
        </Container>
        <Container className="text-left d-flex flex-column align-items-center">
          <div >
            <div className="text-white text-left mb-2"><b>AGREEMENTS</b></div>
            <div className="d-flex flex-row" style={{ marginTop: "20px" }}>
              <div>
                <Link to={ROUTES.LEGAL_PRIVACY}>
                  <p className="mt-0 mb-1 footer-text">Privacy Policy</p>
                </Link>
              </div>
              <div>
                <Link to={ROUTES.LEGAL_EULA}>
                  <p className=" mt-0 mb-1 footer-text">EULA</p>
                </Link>
              </div>
              <div>
                <Link to={ROUTES.LEGAL_TERM}>
                  <p className="mt-0 mb-1 footer-text">Terms of Use</p>
                </Link>
              </div>
            </div>
          </div>
        </Container>
        <Container className="d-flex flex-row social-media-container justify-content-center">
          <div className="d-flex flex-column" style={{ width: "70%" }}>
            <img src={footerLogo} alt="footerLogo"></img>
          </div>
        </Container>
      </Container>
    </Container>
  </div >
);

// Temporary commented out

// function ShortVideoSection() {
//     return (
//         <div>
//             <Route exact path={ROUTES.VIDEO_CHOOSING_COLLEGE} component={VIDEO_COMPONENTS.ChoosingCollege} />
//             <Route path={ROUTES.VIDEO_PAYING_COLLEGE} component={VIDEO_COMPONENTS.PayingCollege} />
//             <Route path={ROUTES.VIDEO_TUTOR} component={VIDEO_COMPONENTS.Tutor} />
//             <Route path={ROUTES.VIDEO_TALENT} component={VIDEO_COMPONENTS.Talent} />
//             <Route path={ROUTES.VIDEO_ESSAY} component={VIDEO_COMPONENTS.Essay} />
//             <Route path={ROUTES.VIDEO_LETTER} component={VIDEO_COMPONENTS.Letter} />
//             <div>
//                 <Link to={ROUTES.VIDEO_CHOOSING_COLLEGE}>
//                     <Button size='sm'>1</Button>
//                 </Link>
//                 <Link to={ROUTES.VIDEO_PAYING_COLLEGE}>
//                     <Button size='sm'>2</Button>
//                 </Link>
//                 <Link to={ROUTES.VIDEO_TUTOR}>
//                     <Button size='sm'>3</Button>
//                 </Link>
//                 <Link to={ROUTES.VIDEO_TALENT}>
//                     <Button size='sm'>4</Button>
//                 </Link>
//                 <Link to={ROUTES.VIDEO_ESSAY}>
//                     <Button size='sm'>5</Button>
//                 </Link>
//                 <Link to={ROUTES.VIDEO_LETTER}>
//                     <Button size='sm'>6</Button>
//                 </Link>
//             </div>
//         </div>
//     )
// }


export default LandingPage;
