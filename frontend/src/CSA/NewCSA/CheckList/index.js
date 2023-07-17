import React from 'react';
import CSABodyContainer from 'CSA/Container';
import style from './style.module.scss';

const CSAAgreementCheckList = () => (
  <CSABodyContainer title="New CSA Checklist" className={style.commissionWorks}>
    <div className={style.container}>
      <h4>
        As a <b>Kyros.ai College Success Advisor (CSA),</b> there is a lot to know!
      </h4>
      <h5 style={{ marginTop: "10px" }}>
        So we've made it easier for you to keep track of your progress with a{' '}
        <i style={{ color: '#f78154' }}>New CSA Checklist!</i>
      </h5>
      <h6 style={{ width: '70%', marginLeft: '15%', marginTop: '20px' }}>
        This is the perfect tool to help you get acquainted with the different platforms you’ll use as a CSA and ensure
        you keep track of what ground you’ve covered as you move through it all!{' '}
        <p style={{ color: '#53a548', display: 'inline' }}>Tip: Click Here for a Printable Version.</p>
      </h6>
    </div>
    <div className={style.container}>
      <div style={{ textAlign: 'left', width: '80%', marginLeft: '10%' }}>
        <h4 style={{ color: '#53a548' }}>New CSA Guide to Getting Started </h4>
        <h6 style={{ fontWeight: "bolder", marginTop: "15px" }}>Sign into your CSA Portal, i.e. your Back Office: </h6>
        <ul>
          <li>Your Role, Kyros.ai & Who We Are & How it Works</li>
          <li>Why Kyros.ai & Your WHY… write it down! </li>
          <li>Setup your CSA Back Office profile under “My Profile” </li>
          <li>Successfully requested to join Kyros’ CSA Facebook community </li>
          <li>Subscribe to “Kyros.ai” Youtube Channel </li>
          <li>Setup your own VIP Group</li>
          <li>Visit your personalized <span style={{ color: "#53a548", fontWeight: "bolder" }}>csa-program.kyros.ai</span> website </li>
          <li>Set GOALS</li>
        </ul>
        <h4 style={{ color: '#53a548' }} className="mt-4 ">New CSA Tour of Your Back Office</h4>
        <h6>
          We recommend you review each of the tabs noted, in the sequence we’ve displayed them in below. For example, we
          suggest you review the Training tab before the My Customers, My Business tab so you have a better
          understanding of the terms before you review them.
        </h6>
        <h4 style={{ color: '#f78154' }} className="mt-4">My Profile</h4>
        <ul>
          <li>Completed your CSA PROFILE </li>
          <li>Add your social media accounts so you can easily post marketing flyers and videos</li>
          <li>Setup your DIRECT DEPOSIT info so you can get paid</li>
        </ul>
        <h4 style={{ color: '#f78154' }} className="mt-4">My Business</h4>
        <ul>
          <li>Checked your <b>My Kyros.ai Website</b> link and customize the content as needed</li>
          <li>My Conversation and chat with paid customers and my team </li>
          <li>
            Sales Consultation Schedule (internal facing): setup your free vs. busy time to allow your prospects to
            schedule an appointment with you{' '}
          </li>
          <li>Team Building events: </li>
          <li>Set up a group calendar, group chat, group training/update webinar etc. </li>
          <li>Tax Tools (coming soon) </li>
          <li>Track your business expenses so you are prepared for tax time! </li>
          <li>Reviewed the CSA Agreement & Privacy Policy  </li>
          <li>Reviewed the Code of Ethics  </li>
          <li>Reviewed the Privacy Policy  </li>
        </ul>
        <h4 style={{ color: '#f78154' }} className="mt-4">My Earnings</h4>
        <ul>
          <li>Monthly Summary will show you the current month’s summary of your earnings</li>
          <li>Product Summary report </li>
          <li>How Commission Works: information on what are eligible sales and what it means to be an “Active CSA”</li>
        </ul>
        <h4 style={{ color: '#f78154' }} className="mt-4">Marketing Tools</h4>
        <ul>
          <li style={{ fontWeight: "bolder" }}>Flyers </li>
          <ul>
            <li>
              Check out the big and small flyers – these were created by the Kyros.ai Content Team and CSAs are
              encouraged to use them!{' '}
            </li>
          </ul>
          <li style={{ fontWeight: "bolder" }}>Videos </li>
          <ul>
            <li>
              “How-to” videos to showcase our product features to your prospects or refresh the memory of your existing
              customers{' '}
            </li>
            <li>
              Get a glimpse into events and promotional campaigns of the past. See how much we’ve grown and how far
              we’ve come!
            </li>
          </ul>
          <li style={{ fontWeight: "bolder" }}>Social Media Basics Training on how to use Social Media sites (facebook, instagram) Webinar Schedule </li>
          <ul>
            <li>User Acquisition - for your prospects </li>
            <ul>
              <li>Product demo and panel discussion webinars for your prospective families </li>
            </ul>
            <li>User Retention - for your existing customers: </li>
            <ul>
              <li>
                Monthly webinar (with specific/seasonal topics, guest speakers) to better engage parents and high school
                students{' '}
              </li>
            </ul>
          </ul>
          <li ><b>Product Updates</b> - Blog, News/Press release </li>
        </ul>
        <h4 style={{ color: '#f78154' }}>Kyros.ai Community</h4>
        <ul>
          <li style={{ fontWeight: "bolder" }}>Training/ Certificate </li>
          <ul>
            <li>CSA Training </li>
            <ul>
              <li>Kyros.ai product training videos and quiz </li>
              <li>College planning and admission processes/quiz </li>
              <li>
                How to develop business and use back office tools - Synchronized or Asynchronized (Videos & Webinars){' '}
              </li>
              <ul>
                <li>Pipeline management: Enter the key information of your prospects </li>
                <ul>
                  <li>Update the lead status to prioritize your follow-up </li>
                  <li>Remind yourself of next appointment </li>
                  <li>Forecast your sales </li>
                </ul>
                <li>Social media basics </li>
                <li>How to place an order? </li>
                <ul>
                  <li>Individual order </li>
                  <li>Group order </li>
                </ul>
                <li>How to recruit and start new CSAs</li>
              </ul>
            </ul>
            <li>Certification process to qualify as Kyros.ai specialized consultants </li>
          </ul>
          <li><b>Insider Info:</b> Success Stories, Contests, News, Challenges & Tips, it’s all here! </li>
          <li style={{ fontWeight: "bolder" }}>Incentive Trips (TBD) </li>
          <li><b>“Wiki” page </b>- internal jargon & industry terms defined, for example “EA, ED” etc. </li>
        </ul>
      </div>
    </div>
  </CSABodyContainer>
);

export default CSAAgreementCheckList;
