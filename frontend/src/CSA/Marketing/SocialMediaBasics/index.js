import React from 'react';
import CSABodyContainer from 'CSA/Container';
import { ReactComponent as AstIcon } from 'assets/svg/Astronaut.svg';
import { ReactComponent as DontIcon } from 'assets/svg/DoNOT.svg';

import style from './style.module.scss';

class SocialMediaBasicsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionType: 1,
      accountCount: 1,
      subscriptionYear: 1,
      childCount: 0,
      discountPrice: 0,
    };
  }

  componentDidMount() {
    this.calcDiscount();
  }

  getSubscriptionYearFee = () => {
    const year = parseInt(this.state.subscriptionYear);
    if (year === 0) return 0;
    const fee = year === 1 ? 0 : year === 2 ? 0.05 : 0.1;
    return fee;
  };

  calcDiscount = () => {
    const transactionFee = parseInt(this.state.transactionType) === 1 ? 0.3 : 0.1;
    const promotionCodeFee = 0.05;
    const discountPrice =
      (1200 * parseInt(this.state.accountCount) + 600 * parseInt(this.state.childCount)) *
      (1 - promotionCodeFee - this.getSubscriptionYearFee()) *
      parseInt(this.state.subscriptionYear) *
      transactionFee;
    this.setState({ discountPrice });
  };

  handleTransactionType = async (e) => {
    await this.setState({ transactionType: e.target.value });
    this.calcDiscount();
  };

  handleAccountCount = async (e) => {
    await this.setState({ accountCount: e.target.value });
    this.calcDiscount();
  };

  handleSubscriptionYear = async (e) => {
    await this.setState({ subscriptionYear: e.target.value });
    this.calcDiscount();
  };

  handleChildCount = async (e) => {
    await this.setState({ childCount: e.target.value });
    this.calcDiscount();
  };

  render() {
    return (
      <CSABodyContainer title="Social Media Basics" className={style.socialMediaBasics}>
        <div className={style.subContainter}>
          <div className={style.secondContainer} style={{ marginTop: '40px' }}>
            <div className={style.rectangleContainer}>
              <div>
                <AstIcon style={{ width: '65px', height: '80px', marginRight: '30px' }} />
              </div>
              <div >
                <b style={{ fontSize: "20px" }}>Facebook</b> <p style={{ fontSize: "17px", display: "inline-block" }}>is not just for having online events but an important tool for your business.</p>
              </div>
            </div>
          </div>
          <div className={style.itemContainer}>
            <h3>Why should I have a separate Facebook business page for Kyros.ai?</h3>
            You need a Facebook business page to promote new kyros.ai features, success stories, summer program
            comparisons, college admission trending and analysis, etc. which are the heart of our business. If you were
            to try and post those updates everyday from your personal page, you run the risk of being shut down by
            Facebook. Plus, this gives you a professional place to post business related information and showcase you as
            a professional College Success Advisor.
          </div>
          <div className={style.itemContainer}>
            <h3>How often should I post?</h3>
            We recommend that you post one to three times a week when driving specific product sales or enticing
            prospects to attend our product demo webinars. If you’re just helping your Clients by giving them tips or
            how-to’s, keep posting away! But when it comes to “marketing,” less is more. Make the sales based posts
            impactful and have fun. Less is more…just like accessories :).
          </div>
          <div className={style.itemContainer}>
            <h3>Personalize Your Page</h3>
            Take a moment to really personalize your business page. Use one of our beautiful images from the Flyers
            section (under Marketing Tools) in your back office. Share a little more about yourself on your page. People
            do business with people they like and trust. Sharing (positive!) things about yourself makes you relatable.
          </div>
          <div className={style.itemContainer}>
            <h3>How to Share It on Facebook</h3>
            Your first time posting to Facebook can be interesting. You may encounter certain screens based on how you
            currently use Facebook. If you have multiple Facebook pages, another pop-up is going to ask you to select
            which page you want to use.
          </div>
          <div className={style.itemContainer}>
            <DontIcon className={style.icon} /> <b>Don't post</b> your shopping page link to several pages on Facebook
            in a short period. <br /> This may come across as spam. Some groups may ask for people to share links, as it
            helps group members get to know each other and supports others’ pages. Just share your link sporadically
            over a period of time.
          </div>
          <div className={style.itemContainer}>
            <DontIcon className={style.icon} /> <b>Do not</b> send friend requests to people you do not know. <br /> Use
            social media to connect, not collect. If you send a friend request, and that person ignores it, Facebook
            will ask the person if he or she knows you. If the person replies NO, Facebook will flag your account. After
            too many flags, Facebook may block your account.
          </div>
          <div className={style.itemContainer}>
            <DontIcon className={style.icon} /> <b>Do not</b> use Facebook Messenger to send promotional content to a
            large group. <br /> Use social media to connect, not collect. If you send a friend request, and that person
            Facebook allows you to message up to 20 people, but not for advertising. When you send a group message,
            every reply on that message notifies everyone on the thread. People may leave the conversation and mark it
            as spam. Also, Facebook rules prohibit sending promotional content to people without consent.
          </div>
          <div className={style.itemContainer} style={{ marginBottom: '80px' }}>
            <DontIcon className={style.icon} /> <b>Do not</b> send the same message to numerous people, or post the same
            message over and over on numerous pages. <br /> Facebook sees this behavior as spam. If you want to share a
            post to several groups or pages, add a unique caption that is relevant to the Facebook page or group. Spread
            these posts over a period of time.
          </div>
        </div>
      </CSABodyContainer>
    );
  }
}

export default SocialMediaBasicsPage;
