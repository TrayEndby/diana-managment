import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import * as CSA_ROUTES from 'constants/CSA/routes';
import style from './style.module.scss';
import Back from '../../MySalesActivity/Prospect/Back';

const CSAAgreement = () => (
  <div className={cn(style.container, 'App-body')}>
    <div style={{ marginTop: '15px', marginLeft: '13px' }}>
      <Back text="Back to all" path={CSA_ROUTES.POLICIES} />
    </div>
    <div className="container">
      <h1 className="mb-3 mt-4">Kyros.ai CSA Agreement</h1>
      <p>
        Please read this document carefully before proceeding. By clicking on the “I Accept” or “Agree” button you are
        agreeing to the terms of this Independent College Success Advisor Agreement (“Agreement”) in order to be
        authorized to arrange for the sale of Kyros products in my capacity as a College Success Advisor.
      </p>
      <p>
        This is a legal Agreement between you, College Success Advisor, and Kyros AI Corp., a Delaware registered
        corporation (“Kyros”). I understand that Kyros has the right to promulgate rules and requirements relative to my
        relationship with Kyros, including a Code of Ethics, the latest version of which can be found at{' '}
        <Link to={CSA_ROUTES.CODEOFETHICS}>
          csa-program.kyros.ai/ethics
        </Link>
        . Kyros may in the future amend or update this Agreement, and its rules and requirements and we will try to
        inform you of any such amendment or update before it/they are implemented. In addition, any amendment or update
        to this Agreement and to our rules and requirements will be posted at{' '}
        <Link to={CSA_ROUTES.AGREEMENT}>
          csa-program.kyros.ai/agreement{' '}
        </Link>
        and we encourage you to visit this site on a regular basis.
      </p>
      <p>
        1) <b>Definition of this Agreement.</b> As an independent College Success Advisor I understand that I am
        responsible for the means and methods by which I make sales commissions and bonuses. To the extent not reflected
        in this document, my agreement with Kyros also requires me to employ integrity, honesty, and responsibility in
        my behaviour and actions with Kyros, my customers and my fellow College Success Advisors including and without
        limitations, presenting and promoting Kyros products in a truthful manner. I will comply with any Kyros online
        community group rules and guidelines. I will help create a welcoming, supportive and educational environment,
        treating everyone with respect and respecting everyone’s privacy. I agree only to use sales materials approved
        in writing by Kyros.
      </p>
      <p>
        2) <b>Independent Contractor Status.</b> I understand and agree that I am an independent contractor and not an
        employee of Kyros and shall not be entitled to receive from Kyros any benefits whatsoever nor will Kyros be
        required to make any employment contributions in respect of payments made to me as a College Success Advisor. I
        agree that I shall be fully responsible for paying all applicable federal and state taxes, income taxes,
        worker's compensation contributions, health insurance and any other similar taxes and contributions. I agree
        that I have been directed to and had been given ample opportunity to obtain independent accounting and legal
        advice with respect to the provisions of this Agreement. I further agree that as an independent contractor, I am
        not an employee, agent, partner, legal representative or franchisee of Kyros. I shall be solely responsible for
        paying all expenses incurred by myself, including but not limited to travel, food, lodging, secretarial, office,
        long distance calls, etc. I will have and maintain control of the manner and means of my performance under this
        Agreement. I will have no power or authority to incur any debt, obligation or liability on Kyros’s behalf.
      </p>
      <p>
        3) <b>Competency, Compliance and Training.</b>
      </p>
      <p>
        a) I am of legal age to enter into binding contracts and I have carefully read, understand, and agree to this
        Agreement. I have the right to arrange for the sale of any Kyros products and services in accordance with
        Agreement. I will comply with all federal, state, and municipal laws, ordinances, rules, and regulations related
        to my acting as a Kyros College Success Advisor.
      </p>
      <p>
        b) I understand that from time to time I may be required to undertake training provided by Kyros and agree that
        my appointment as a College Success Advisor is subject to my completing any such training. I further understand
        that the level of training, certifications and regularity of training may depend upon which Kyros products I am
        authorized to promote.
      </p>
      <p>
        4) <b>Appointment of Downline Kyros College Success Advisors.</b> As a Kyros College Success Advisor you will
        have the right to nominate Downline Tier College Success Advisors. A College Success Advisor who nominates a
        Downline College Success Advisor shall also be known as a Mentor College Success Advisor. Kyros may, in its
        absolute discretion refuse to accept any College Success Advisor nominated by a Mentor College Success Advisor.
        All College Success Advisors so nominated by a Mentor College Success Advisor will be required to accept this
        Agreement. All Mentor College Success Advisors will have an obligation to train and motivate, on an on-going
        basis, the College Success Advisors they have nominated.
      </p>
      <p>
        5) <b>Services to be Performed by College Success Advisor and Commissions.</b>
      </p>
      <p>
        a) I understand that the Kyros products that I am authorized to promote may depend upon the level of on-going
        training that I have successfully completed.
      </p>
      <p>
        b) As a College Success Advisor I will promote and sell Kyros products to ultimate users. I will receive: (a)
        [25]% commission, once earned, on sale items ordered through me directly, on my personal Kyros website. Sales
        commissions are earned once Kyros has collected the non-refunable payment from the ultimate user for the Kyros
        product so ordered and calculated on such payments before taxes and any handling and shipping costs and after
        any discounts. In addition, a Mentor College Success Advisor will also earn [8]% of the personal sales, once
        earned as provided above, from sales of any immediate Downline Tier College Success Advisor nominated by him or
        her. (By way of example, if a Downline Tier College Success Advisor is responsible for the sale, his or her
        Mentor College Success Advisor (who would be the person who nominated the Downline College Success Advisor) will
        be entitled to a [8]% commission on the non-refundable collection from the ultimate user for the product so
        ordered. In this example, the College Success Advisors above that Mentor College Success Advisor would not be
        entitled to any commission from the College Success Advisor’s sale.)
      </p>
      <p>
        c) Commissions on memberships are calculated in the same way as commissions on product sales, namely they are
        earned once payment has been received by Kyros for the non-cancellable period of the membership. By way of an
        example, if a customer purchases an annual or multi-year membership, but such membership is payable in
        non-refundable instalments, the College Success Advisor or downline College Success Advisor will only earn
        commission once the instalment has been received by Kyros. Again, a [25]% commission will payable to the College
        Success Advisor or Downline College Success Advisor directly responsible for the sale of the membership and if a
        Downline Tier College Success Advisor is responsible for the sale, only the Mentor College Success Advisor who
        nominated the Downline College Success Advisor will receive [8]%.
      </p>
      <p>
        6) <b>Amendments to this Agreement and Commission Percentages.</b> I understand that this Agreement and
        commission percentages may be amended at any time at the sole discretion of Kyros and I agree that any
        amendments will apply to me. The continuation of my Kyros independent business or my acceptance of commissions
        or other benefits after the amendment becomes effective shall constitute my acceptance of any and all
        amendments. Any amendments will become effective immediately once notice has been given by Kyros.
      </p>
      <p>
        7) <b>Use of Kyros Intellectual Property.</b> I acknowledge that upon Kyros’s acceptance of this Agreement,
        Kyros has granted me a limited, non-exclusive license to use its trademarks, service marks, trade names, patents
        and copyrighted materials (referred to as “Kyros Intellectual Property”). All Kyros Intellectual Property is
        owned solely by Kyros. I may use Kyros Intellectual Property only (a) after obtaining written permission from
        Kyros prior to use, or (b) where the Kyros Intellectual Property appears on materials distributed by Kyros for
        use by College Success Advisors. I agree to use only written, recorded or other promotional or advertising
        materials that have been produced, distributed and approved in writing by Kyros. All rights and licenses granted
        in or under this Agreement shall terminate automatically upon the termination of this Agreement.
      </p>
      <p>
        8) <b>Use of your Personal Website.</b> I am required to choose a Personal Website address, to have access to
        the backend office when I first sign up as a College Success Advisor. The cost of this is free of charge.
      </p>
      <p>
        9) <b>Ownership and Use of Confidential Information.</b> I acknowledge that Kyros owns all product, supplier
        information, educational institution and student data that I may create or compile, including but not limited to
        student profile data, sales lists, operating procedures, product development information, financial data and
        marketing materials (collectively, “Confidential Information”), and that all Confidential Information is
        confidential and that its disclosure could cause irreparable harm to Kyros. I will not use or disclose
        Confidential Information to any person except in strict accordance with this Agreement. I will not use
        Confidential Information to sell products or services other than Kyros products or services or in connection
        with any other business during the term of and after termination of this Agreement. I may be required from time
        to time to provide Kyros with information relating to my sales activities. I hereby authorize and consent to the
        collection, use and disclosure of personal information about me relating to such activities.
      </p>
      <p>
        10) <b>Sale of Other Products and Services.</b> I understand that I may not market, sell, offer for sale to
        anyone, or promote any ancillary products related to or competing with Kyros’s business unless approved in
        writing by Kyros.
      </p>
      <p>
        11) <b>Non-Solicitation.</b> As an inducement to Kyros to enter into this Agreement and in consideration of the
        mutual covenants contained herein, during the term of this Agreement and for a period of one year thereafter, I
        shall not directly or indirectly, on my own behalf or any other person or entity, solicit, induce, hire or
        attempt to solicit, induce or hire any College Success Advisor to terminate or alter his or her business
        relationship with Kyros.
      </p>
      <p>
        12) <b>Photo and Video Release.</b> I hereby give Kyros and its agents or assigns a non-exclusive license to
        use, for any purpose, photographs or videos submitted by me to Kyros. Kyros may use any photographs or videos
        taken of me at a Kyros event for any purpose. I hereby waive my right to inspect or approve the finished
        photographs, videos, advertising copy or printed matter that may be used in conjunction therewith or the
        eventual use that the photographs or video may be applied.
      </p>
      <p>
        13) <b>Termination of this Agreement.</b>
      </p>
      <p>
        a) Termination without Cause. Termination without Cause. This Agreement is effective from the date of acceptance
        by Kyros and will terminate in one year unless a College Success Advisor renews this Agreement. Kyros reserves
        the right to terminate this Agreement with any College Success Advisor, at any tier level, at any time for any
        reason (including failure to meet Kyros’s on-going training requirements and failure to secure product and/or
        membership sales set by Kyros) upon 30 days written notice.
      </p>
      <p>
        b) With Cause. Kyros may immediately terminate this Agreement without notice in the event of College Success
        Advisor’s insolvency, assignment for the benefit of creditors, or misrepresentation in or breach of any
        provision of this Agreement, as herein defined. If College Success Advisor is terminated by Kyros for cause,
        Kyros reserves the right to reject any future re-application by you.
      </p>
      <p>
        14) <b>Events Occurring Upon Termination of this Agreement.</b> Upon termination of this Agreement, I will (1)
        within five days of termination, pay all amounts due and owing to Kyros; (2) cease representing myself as a
        College Success Advisor of Kyros; and (3) be ineligible to receive any un-accrued compensation or benefits as a
        College Success Advisor. I will immediately cease all use of Kyros Intellectual Property and Confidential
        Information. I will cease offering for sale or selling Kyros products. If requested by Kyros, I will hand over
        all Confidential Information to Kyros.
      </p>
      <p>
        15) <b>Transferability.</b> Neither this Agreement nor my Kyros business may be transferred or assigned by
        College Success Advisor. Kyros may assign this Agreement at any time.
      </p>
      <p>
        16) I will comply with any Kyros online community group rules and guidelines to positively engage with the
        community and further, extend the same principles into my own personally run and operated online groups, parties
        and forums
      </p>
      <p>
        17) <b>Entire Agreement.</b> This Agreement supersedes all prior communications, understandings and agreements
        between the parties and contains the entire agreement between the parties relating to its subject matter. In the
        event of any conflict between the terms of this Agreement or any other document and any amendments, the
        amendment shall take precedence and control.
      </p>
      <p>
        18) <b>Indemnification/Offset.</b> I will indemnify and hold harmless Kyros and its agents and assigns from and
        against any damages, claims or liabilities and expenses (including attorneys' fees), incident to my (a)
        activities as a College Success Advisor including, without limitation, any unauthorized representations made by
        me; (b) breach of the terms of this Agreement; or (c) violation of, or failure to comply with any applicable
        federal, state or local laws or regulations. Kyros shall have the right to offset any amounts owed by College
        Success Advisor to Kyros (including, without limitation, the repayment of commissions as a result of product
        returns) against the amount of any commissions or bonuses owed to me.
      </p>
      <p>
        19) <b>Cumulative Remedies/Waiver.</b> All rights, powers and remedies given to Kyros are cumulative, non-
        exclusive and in addition to any and all other rights and remedies provided by law. No failure or delay of Kyros
        to exercise any power or right under this Agreement or to insist upon strict compliance by College Success
        Advisor with any obligation or provision shall constitute a waiver of Kyros’s right to demand exact compliance
        therewith. Waiver by Kyros may be effective only in writing by an authorized officer of Kyros.
      </p>
      <p>
        20) <b>Injunctive Relief.</b> Upon any breach of this Agreement by me, Kyros will be irreparably harmed and
        cannot be made whole solely by monetary damages. Accordingly, in addition to any other remedies in law or equity
        that it may have, College Success Advisor agrees that Kyros shall be entitled, without the necessity of proving
        actual damages, to temporary and permanent injunctive relief to prevent the breach of any provision of this
        Agreement and/or to compel specific performance of this Agreement. In addition, Kyros shall be entitled to its
        costs and expenses, including reasonable attorneys' fees, in enforcing its rights under this Agreement.
      </p>
      <p>
        21) <b>Background Checks.</b> Kyros reserves the right to conduct background investigations and/or reference
        checks of all its potential College Success Advisors. Your appointment is, therefore, contingent upon a
        clearance of any such background investigation and/or reference check.
      </p>
      <p>
        22) <b>FERPA and the Processing of Personal Data.</b> To the extent that the Family Educational Rights and
        Privacy Act (“FERPA”) applies, all College Success Advisors and all Downline College Success Advisors agree to
        comply with FERPA. In addition, to the extent that Kyros receives, or is processing personal data of College
        Success Advisors and their students and customers in the capacity of a data processor, Kyros’s use of any such
        data shall be subject Kyros’s Privacy Policy which can be found at Kyros.com/legal/privacy-statement.
      </p>
      <p>
        23) <b>Miscellaneous.</b> I agree that if any portion of this Agreement is judicially determined to be invalid,
        that invalidity will not affect the remaining portions of this Agreement. The headings in this Agreement are
        inserted only for convenience and are not part of the Agreement. All written notices required by this Agreement
        to be given to me will be deemed received if emailed to my most current email address on file with Kyros.
      </p>
      <p>
        24) <b>Governing Law.</b> This Agreement shall be deemed to have been executed and delivered in the State of
        California, and shall be governed by, and construed and enforced in accordance with, the laws of the State of
        California, regardless of the laws that might otherwise govern under applicable principles of conflict of laws
        thereof.
      </p>
    </div>
  </div>
);

export default CSAAgreement;
