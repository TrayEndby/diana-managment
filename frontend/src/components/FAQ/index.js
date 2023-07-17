import React, { useState } from 'react';
import './style.scss';
import { Accordion, Card, Container, Button, Row, Col } from 'react-bootstrap'
import faq from "../../assets/KyrosHomePage/FAQ.png"
import astronaut from "../../assets/KyrosHomePage/Astronaut2.svg"
import { ChevronRight } from 'react-bootstrap-icons';

// import SearchBar from 'util/SearchBar';

// const faq1 = [
//   { q: "t1", a: "a1", eventKey: 0 },
//   { q: "t2", a: "a2", eventKey: 1 },
//   { q: "t3", a: "a3", eventKey: 2 },
//   { q: "t4", a: "a4", eventKey: 3 },
//   { q: "t5", a: "a5", eventKey: 4 },
//   { q: "t6", a: "a6", eventKey: 5 },
//   { q: "t7", a: "a7", eventKey: 6 },
//   { q: "t8", a: "a8", eventKey: 7 },
//   { q: "t9", a: "a9", eventKey: 8 },
//   { q: "t10", a: "a10", eventKey: 9 }
// ]

// const faq2 = [
//   { q: "t1", a: "a1", eventKey: 0 },
//   { q: "t2", a: "a2", eventKey: 1 },
//   { q: "t3", a: "a3", eventKey: 2 },
//   { q: "t4", a: "a4", eventKey: 3 },
//   { q: "t5", a: "a5", eventKey: 4 },
//   { q: "t6", a: "a6", eventKey: 5 },
//   { q: "t7", a: "a7", eventKey: 6 },
//   { q: "t8", a: "a8", eventKey: 7 },
//   { q: "t9", a: "a9", eventKey: 8 },
//   { q: "t10", a: "a10", eventKey: 9 }
// ]
const FAQ = () => {
  // const [keyword, setKeyword] = useState('');

  return (
    <div className="faq-page">
      <Container fluid className="d-flex flex-row justify-content-center faq-background">
        < img className="responsive-faq faq-top-section" src={faq} alt="faq" ></img>
        <div className="d-flex justify-content-center faq-content">
          <div className="faq-text">
            <h1>Looking for an answer?</h1>
            <p>We've shared some of our frequently asked questions to help you out</p>
            {/* <SearchBar
              // onSubmit={setKeyword}
              title="Search"
            /> */}
          </div>
        </div>
        <div className="flex-column justify-self-end">
          <div className="astronaut">
            <img src={astronaut} alt="astronaut"></img>
          </div>
        </div>
      </Container >
      <Container fluid className="faq-container">
        <Row className="d-flex justify-content-center questions-row">
          <Col lg={{ span: 5 }} >
            <Accordion>

              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="0" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      How do you find the essay questions that might be asked for an application this far in advance?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    You can create a Common Application account/profile early and see the questions! Personal Statement essays will very likely stay the same year to year, whereas supplemental essays may change. You can work on drafts for every kind of essay in Kyros.ai’s Essays module. You can also share your essays with contacts so they can be proofread and polished before you submit. Please make sure to sign up for our signature essay writing sprint program in July!
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="1" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      I’m a junior looking to improve my extracurriculars (ECs). Is it too late?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="1" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    No, it’s definitely not too late! There’s a lot you can do between now and next year. We’re happy to chat through some of your ideas and offer suggestions. Feel free to email us at info@kyros.ai to schedule a free consultation with one of our advisors!
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="2" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      Where and when can we start the Common App?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="2" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    You can get acquainted with the Common App early on. They should have many essay prompts and school questions available. You can also check out the basic application. The Common App opens for actual applications on August 1. Check individual schools’ application deadlines.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="3" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      Do we need to be involved only in ECs that pertain to our majors and careers, or can we be involved in activities that are totally unrelated to what we want to pursue in the future?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="3" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    A1: It’s absolutely helpful and strongly recommended to engage in ECs that pertain to what you want to do in the future. That being said, not every EC needs to be related to a future major or career pathway. Involving yourself in 3-4 ECs (including sports) is recommended, and one of them can be something fun or community service related. However, you know your schedule best. Don’t try to involve yourself in every activity and organization under the sun. Pick a few that interest you, stick with at least one throughout your four years, and make a big impact. Obtain leadership roles and try your hardest to win awards. If you don’t have time to engage in 3-4 ECs, try to make the ECs you are involved in more serious/future-oriented.
                  <br></br>
                  A2: An example I can give you is that we have many STEM-focused students who launch extracurricular initiatives that use STEM to support other interests. One of our students developed a program that took their research and experience with medicine and educated people on the effects of classical music on the brain and mental health.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="4" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      Does class rank matter? What is a good goal for class rank?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="4" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Your class rank matters less than how you performed and participated in relation to your other classmates. An example of this is how many AP courses you took in comparison to your classmates and how many your school offers. The same applies for extracurriculars! Also, given that school districts determine class rank differently, if they rank at all, college admissions officers do not put much stock in class rankings or use that as a comparison tool. The same is true with GPA, but to a lesser extent.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="5" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      Is it bad if I go test optional if I am a current junior? (Class of 2022)
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="5" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    It is not bad but we are recommending to all of our students that they still take the standardized exams. Harvard’s early application round this year saw over 70% of applicants submitting SAT/ACT scores, so while it is optional, it is still recommended!
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="6" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      How important is freshman year? My grades have gotten so much better since then, will colleges see that?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="6" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Freshman year is not as important in comparison to your following years. For example, if your grades weren't great your freshman year, admissions officers want to see how you improved throughout 10th-12th grade. For extracurriculars, freshman year is ideal for exploration, so you don't have to have your passion/interest solidified by this time. If you need help passing a course or preparing for a test, Kyros.ai has curated thousands of help/review videos for almost every class and standardized test available.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="7" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      Should my extracurriculars and leadership roles be related to what my career/major interests are?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="7" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Ideally yes! Admissions officers want to see how you put your interests into practice. You can absolutely have supplemental activities that don't directly relate, though! As long as you show passion for and dedication to an activity, project, subject, etc., you will be fine.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"></div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="8" className="p-0 d-flex align-items-center"><ChevronRight size={40} className="chevron" /></Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      I haven’t won any awards except two. How do I show leadership and accomplishments?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="8" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    You can take online courses, launch your own extracurricular initiative, etc. You can also show leadership by innovating within organizations or clubs you're already a part of!
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image "></div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end">
                      <Accordion.Toggle as={Button} variant="link" eventKey="9" className="d-flex align-items-center p-0"><ChevronRight size={40} className="chevron" /></Accordion.Toggle></div>
                    <p className="m-0">
                      Would colleges consider it “too late” if I participate more outside of school in forms of volunteering, work, sports during my senior year? (I’m a junior)
                  </p>

                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="9" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Honestly, probably. You’re going to want to make sure you’re consistently involved in ECs and showing growth throughout your entire four years. However, if you don’t really find your niche until senior year and all of a sudden you’ve completed a huge passion project and are winning awards/recognition, colleges are more inclined to overlook your other three years. Luckily, Kyros.ai has an extracurricular activities module in which you can search for hundreds of extracurricular and summer programs to stoke your passions!
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image "></div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end">
                      <Accordion.Toggle as={Button} variant="link" eventKey="10" className="d-flex align-items-center p-0"><ChevronRight size={40} className="chevron" /></Accordion.Toggle></div>
                    <p className="m-0">
                      How can Kyros help prepare me for the college application process?
                  </p>

                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="10" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Kyros has many features specifically designed to help streamline the process of applying to college for students. The main feature that helps many students who don’t have a plan for their college years is the annual planning and mission boards module, which helps define the steps one should take over their college years to establish themselves as a good college applicant.

                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image "></div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end">
                      <Accordion.Toggle as={Button} variant="link" eventKey="11" className="d-flex align-items-center p-0"><ChevronRight size={40} className="chevron" /></Accordion.Toggle></div>
                    <p className="m-0">
                      I don’t know how to find or apply for scholarships, what is a good way to find scholarships?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="11" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    One way of finding scholarships is to ask your school counselor. They should be able to provide a list of scholarships, both local and national, that you can apply to. The financial aid module in Kyros has a comprehensive list of scholarships that you can filter by categories by award amount and type, which will save lots of your time. Kyros also runs a sprint program in January to help you go through the process of applying for scholarships!
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image "></div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end">
                      <Accordion.Toggle as={Button} variant="link" eventKey="12" className="d-flex align-items-center p-0"><ChevronRight size={40} className="chevron" /></Accordion.Toggle></div>
                    <p className="m-0">
                      If I haven’t taken any SAT/ACT prep courses, should I still attempt to take the exam?
                  </p>

                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="12" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Yes! You can take either exam as many times as you need to in order to get the score you are looking for. Even without practice, it can help to take one of the exams to find out how much prep you need before you take it again. Kyros has many test prep modules for both the SAT and ACT which encompass each section of both tests. The modules also cover strategies for taking the tests to help you use your time more effectively. Kyros runs a <a className="text-white click-here" rel="noreferrer noopener"
                      target="_blank" href="https://www.kyros.ai/sprint">sprint program in February, July and late September to help you get ready for standardized tests!</a>
                  </div>
                </Card.Body></Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col lg={{ span: 5 }} >
            <Accordion>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="0" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      What if we want to volunteer, but can't exactly do so during this pandemic?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    There are so many ways to volunteer online! Here is a link to many ideas: https://rusticpathways.com/virtual-volunteer-opportunities/ Volunteering in local food pantries, writing letters to veterans, collecting school supplies for children in need, etc. are all great, safe ideas.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="1" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      For the Common App EC list, is it better to list 10 even if you just participate in a couple or list less where you have leadership roles in all?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="1" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Add extracurriculars that are relevant, and list them in order of importance or impressiveness. ECs in which you have demonstrated leadership and have been recognized for your participation/contributions are going to be your most important and impressive ones. Try to stick to listing those ECs and/or ECs you’ve been a part of for 3+ years but maybe haven’t won awards for/held leadership positions in.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="2" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      Can you apply to the same colleges through Questbridge and Common App at the same time?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="2" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    It depends on the university!
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="3" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      I participated in a lot of activities in grades 6-9. Should they be listed on the EC section of the Common App or on my supplemental resume?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="3" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Generally, no. Colleges mainly want to know what you’ve accomplished in the last four years so you will mainly want to focus on activities from 9th-12th grade. However, if there are really prominent, career- or major-oriented activities, in which you won regional, statewide, or national recognition and/or managed a significant number of people (20+), from 6th-8th grade, you can find a way to incorporate those. Ideally, these activities should have also carried over into high school.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="4" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      How many colleges/universities do you apply for?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="4" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Some students apply to 10, others apply to 15+. Regardless, you should have a solid list of safety, target, and reach schools. Kyros.ai’s college match tool can help you compile a perfectly balanced college list based on your personal interests and academic aptitudes.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="5" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      How does applying early decision affect my chances of getting in?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="5" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Applying early puts you in a pool of less applicants, so yes it can actually improve your chances of getting in! It also demonstrates your interest to admissions officers and shows them that if you get in, you will either attend (Early Decision) or will very likely attend (Early Action).
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="6" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      Is it okay if most of my extracurriculars are science-based if I’m a STEM major? Or is it better to branch out?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="6" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    That’s ok! As long as you are showing your passion and dedication through those extracurriculars, you will be in good shape. Don’t think that you can't include smaller interests such as music, sports, or anything else that you enjoy but don't necessarily focus on.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"> </div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="7" className="p-0 d-flex align-items-center "><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      How many community service hours are required?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="7" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Getting community service hours looks amazing on your application, but just like with ECs, make sure you are doing it because you love it, and not just so that it looks good on your application. Trust me, admissions officers can tell! Get as many as reasonable. Some schools require students to earn a certain number of community service hours to graduate, so make sure you check your school’s requirements. Also, you can earn scholarships if you have a significant number of community service hours. Kyros has curated several podcasts on our platform that discuss how admission offices approach community service hours, as well as webinars with former admissions officers who can answer your questions themselves!
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"></div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"><Accordion.Toggle as={Button} variant="link" eventKey="8" className="p-0 d-flex align-items-center"><ChevronRight size={40} className="chevron" />
                    </Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      What are some online extracurriculars ideas? Is online volunteering worth it?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="8" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Check out this awesome resource! <a className="text-white click-here" rel="noreferrer noopener"
                      target="_blank" href="https://pages.crimsoneducation.org/ecl-online-project-guide.html?utm_source=digital%20advertising&utm_medium=blog&utm_campaign=mhm">Click here</a>
                  </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"></div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"> <Accordion.Toggle as={Button} variant="link" eventKey="9" className="d-flex align-items-center p-0 chevron"><ChevronRight size={40} /></Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      I’ve been hearing about “passion projects” a lot lately, but I don’t really know what they are. Could you please explain that to me? Is it helpful at all?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="9" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Great question! Completing a passion project essentially just means that you are launching an initiative that you are passionate about and demonstrates what you want to potentially want to do in the future. It's an incredible way to stand out against students with very typical extracurriculars.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"></div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"> <Accordion.Toggle as={Button} variant="link" eventKey="10" className="d-flex align-items-center p-0 chevron"><ChevronRight size={40} /></Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      I’m taking dual enrollment courses. Should I finish my associate’s degree with the same college after high school or should I apply for Stanford as soon as I graduate high school?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="10" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    The transfer process is incredibly competitive, more so than undergraduate/first-year admissions. If you are able to apply out of high school we really recommend it, and worst case scenario, you can attempt to transfer if you don't get in.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"></div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"> <Accordion.Toggle as={Button} variant="link" eventKey="11" className="d-flex align-items-center p-0 chevron"><ChevronRight size={40} /></Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      I don’t play sports. Can that hurt me on the application?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="11" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    Not at all! Thousands of applicants never include sports on their application.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
              <Card className="faq-card">
                <Card.Header className="d-flex flex-row faq-header">
                  <div className="front-image"></div>
                  <div className="advisory-text">
                    <div className="d-flex justify-content-end"> <Accordion.Toggle as={Button} variant="link" eventKey="12" className="d-flex align-items-center p-0 chevron"><ChevronRight size={40} /></Accordion.Toggle>
                    </div>
                    <p className="m-0">
                      I have a total of 4 APs only until sophomore year and am going to pursue IB Diploma (3 HL and 3 SL). Is this too weak for Ivies?
                  </p>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="12" style={{ backgroundColor: "#65AD59" }}><Card.Body>
                  <div style={{ fontSize: "16px", color: "white" }}>
                    There is no perfect number of APs, but 4 courses is a great start, and going for an IB diploma will also look wonderful on your application.
                </div>
                </Card.Body></Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div >
  )
}

export default FAQ;
