import React from 'react';
import cn from 'classnames';
import * as CSA_ROUTES from 'constants/CSA/routes';
import Back from "../../MySalesActivity/Prospect/Back"

import style from './style.module.scss';

const EULA = () => {
  return (
    <div className={cn(style.container, 'App-body')}>
      <div style={{ marginTop: "15px", marginLeft: "13px" }} >
        <Back text='Back to all' path={CSA_ROUTES.POLICIES} />
      </div>
      <div className="container">
        <h1 className="mb-3 mt-4">Kyros End User License Agreement for
        Software and Subscription Services
        </h1>
        <div className={style.itemContainer}>
          Please read this document carefully before proceeding. By clicking on the “I Accept” or “Agree” button or accessing or using the Kyros software and subscription services, you are agreeing to the terms of this end user license agreement <b>(“Agreement”)</b>.
        </div>
        <div className={style.itemContainer}>
          This is a legal agreement between you a parent and/or householder <b>(“Householder”)</b> and Kyros AI Corp., a Delaware registered corporation <b>(“Kyros”)</b>. As used herein, each of Kyros and Householder may be referred to as a <b>“Party”</b> and collectively as the <b>“Parties”.</b> If you have previously accepted the most recent version of this Agreement, you are not required to re-accept or re-agree to this Agreement. If you are in doubt, click “I Accept” or “I Agree”. Kyros may in the future amend or update this Agreement and we will try to inform you of any such amendment or update before it is implemented. In addition, any amendment or update to this Agreement will be posted at <span style={{ color: '#53a548' }}>csa-program.kyros.ai/eula</span>  and we encourage you to visit this site on a regular basis. By continuing to use the Licensed Software after we post an amendment or update, you are indicating your acceptance of the amendment or update.
        </div>
        <div className={style.itemContainer}>
          This Agreement governs your use of Kyros’s various software products, including any updates and upgrades Kyros implements thereto<b>(“Licensed Software”)</b> and Kyros’s cloud-based subscription service made available now or in the future <b>(“Subscription Service”)</b>(together the <b>“Solution”</b>).
        </div>
        <div className={style.itemContainer}>
          <p style={{ color: '#53a548' }}>
            1) <b>License Grant and Restrictions</b>
          </p>
        </div>
        <ul className={style.list}>
          <li>
            <p>
              1.1) <b>License Grant.</b> Subject to the terms and conditions of this Agreement, Kyros hereby grants to Householder a non-exclusive, non-sublicensable, non-assignable license to use the Solution, in object code form, provided to Householder by subscription.
          </p>
          </li>
          <li>
            <p>
              1.2) <b>Subscription Services.</b> Unless otherwise provided in an accepted order, (a) Subscription Services are purchased as subscriptions for the term stated in the applicable order or in the applicable online purchasing portal and the first Subscription Service shall be referred to as “Primary Subscription Services” and will entitle you, Householder, and one student in your household to use the Solution, (b) additional subscriptions for Subscription Services may be ordered by you, Householder, during the Primary Subscription Services term at a discount, such Subscription Services shall be referred to as “Secondary Subscription Services” and each such Secondary Subscription Service shall permit one other student member of your household to use the Solution, and (c) all Secondary Subscription Services will terminate on the same date as the underlying Primary Subscription Services end. (The price for Secondary Subscription Services shall not be pro-rated, even if purchased after the term of the Primary Subscription Services has commenced.)
          </p>
          </li>
          <li>
            <p>
              1.3) <b>Restrictions. </b> Householder shall not, and shall not permit any person in their household or third party, to:
              <ul className={style.list}>
                <li className="mt-3">a) assign, sell, lease, distribute, license, sublicense or otherwise transfer or attempt to transfer rights to the Solution;</li>
                <li>b) extract, reverse engineer, decompile, disassemble or otherwise attempt to derive source code or algorithms from the Solution, except to the extent expressly permitted by applicable law notwithstanding this restriction;</li>
                <li>c) modify, translate, or create derivative works, adaptations or compilations of, or based on, any part of the Solution;</li>
                <li>d) remove or otherwise interfere with any part of the Solution designed to monitor Householder’s compliance with this Agreement;</li>
                <li>e) copy the Solution, in whole or in part, except as specifically authorized by this Agreement; or</li>
                <li>f) remove any proprietary notices or labels on or in any of the Solution. </li>
              </ul>
            </p>
          </li>
          <li>
            <p>
              1.4) <b>Reservation of Rights.</b>  Except for the limited rights granted in Section 1.1, Kyros retains all right, title and interest in and to the Solution, and all intellectual property rights therein and thereto. Nothing in this Agreement shall constitute a transfer of any ownership rights by Kyros to Householder in the Solution or otherwise. All rights in the Solution not expressly granted hereunder are reserved by Kyros and its licensors.
          </p>
          </li>
          <li>
            <p>
              1.5) <b>Use of Data.</b> Kyros shall obtain information concerning Householder's use of the Solution <b>(“Data”)</b>. Kyros may use the Data to open Householder support tickets, optimize the Solution, to support, improve and promote Kyros’s services and products to Householder, other Householders, Kyros’s service providers, and/or partners, and for other purposes. Kyros may also use the Data in an aggregated and anonymized manner which will not identify the Householder. All such uses of Data by Kyros shall be in compliance with applicable law.
          </p>
          </li>
          <li>
            <p>
              1.6) <b> Processing of any Personal Data. </b>To the extent that Kyros receives, or is processing personal data of Householder or members of Householder’s householder in a capacity as data processor, Kyros’s use of any such data shall be subject Kyros’s Privacy Policy which can be found at <span style={{ color: '#53a548' }}>www.kyros.com/legal/privacy.</span>
            </p>
          </li>
          <li>
            <p>
              1.7) <b>  Updates.  </b> During the term of this Agreement, Kyros may update the Solution to reflect changes in, for instance, laws, regulations, technology, industry practices and patterns of use. Kyros shall take all commercially reasonable efforts to ensure that any such updates will not materially reduce the level of performance, functionality, security or availability of the Solution.
            </p>
          </li>
        </ul>
        <div className={style.itemContainer}>
          <p style={{ color: '#53a548' }}>
            2) <b>Disclaimers and Limitations of Liability</b>
          </p>
        </div>
        <ul className={style.list}>
          <li>
            <p>
              2.1) <b>Warranty.</b> Kyros warrants that the Solution will conform in all material respects with the published specifications for the term of the Subscription Services purchased by Householder. The Solution shall include the provision of error corrections, improved usability, improved performance, and/or enhancements and updates of the Solution. Householder’s sole and exclusive remedy and Kyros’s sole and exclusive liability in the event of non-conformance shall be to use commercially reasonable efforts to correct or modify the Solution so as to conform in all material respects with published specifications.
          </p>
          </li>
          <li>
            <p>
              2.2) <b>Disclaimer. </b>KYROS HEREBY DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE WITH RESPECT TO THE LICENSED SOFTWARE, SUBSCRIPTION SERVICES OR ANY OTHER MATERIALS AND SERVICES FURNISHED OR PROVIDED UNDER OR IN CONNECTION WITH THIS AGREEMENT, AND WITH RESPECT TO THE USE OF ANY OF THE FOREGOING. KYROS DOES NOT WARRANT THAT EACH WILL BE ERROR-FREE OR SECURE, OR WILL WORK WITHOUT INTERRUPTIONS.
          </p>
          </li>
          <li>
            <p>
              2.3) <b>Limitation of Liability. </b>IN NO EVENT WILL KYROS BE LIABLE FOR ANY LOSS OF PROFITS, LOSS OF USE, BUSINESS INTERRUPTION, LOSS OF DATA, COST OF COVER, OR INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE OR CONSEQUENTIAL DAMAGES OF ANY KIND IN CONNECTION WITH OR ARISING OUT OF THE FURNISHING, PERFORMANCE, OR USE OF THE LICENSED SOFTWARE,  SUBSCRIPTION SERVICES OR ANY OTHER SERVICES, WHETHER ALLEGED AS A BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER CLAIM OR CAUSE OF ACTION, EVEN IF KYROS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. KYROS’S LIABILITY UNDER THIS AGREEMENT FOR DAMAGES WILL NOT, IN ANY EVENT, EXCEED THE AMOUNTS PAID BY HOUSEHOLDER FOR THE SUBSCRIPTION SERVICES DURING THE SIX (6) MONTHS PRECEDING THE EVENTS WHICH GAVE RISE TO THE DAMAGES.
          </p>
          </li>
        </ul>
        <div className={style.itemContainer}>
          <p style={{ color: '#53a548' }}>
            3) <b>Term and Termination</b>
          </p>
        </div>
        <ul className={style.list}>
          <li>
            <p>
              3.1) <b>Term.</b> Unless terminated pursuant to Sections 3.3 or 3.4, this Agreement shall commence on the Effective Date and continue for the term of the Primary Subscription Services purchased by Householder and any renewal thereof <b>(“Subscription Term”).</b>
            </p>
          </li>
          <li>
            <p>
              3.2) <b>Termination by Householder Without Cause.</b>This Agreement may be terminated by Householder at any time without cause, provided that no such termination will entitle Householder to a refund of any prepaid fees.
          </p>
          </li>
          <li>
            <p>
              3.3) <b>Termination by Kyros for Cause.</b>Kyros may, by providing written notice to Householder, terminate this Agreement if Householder or anyone in Householder’s household is in material breach of any term, condition or provision of this Agreement, which breach, if capable of being cured, is not cured within thirty (30) days after Kyros provides Householder with written notice of such breach.
          </p>
          </li>
          <li>
            <p>
              3.4) <b>Effect of Termination.</b> Upon termination of this Agreement pursuant to Sections 3.2 or 3.3, the license granted to Householder and anyone in Householder’s household using Secondary Subscription Services will immediately cease and Householder and anyone in Householder’s household using Secondary Subscription Services will have no further rights to use the Solution.
          </p>
          </li>
          <li>
            <p>
              3.5) <b>Survival. </b> If this Agreement is not renewed, the following provisions will survive any termination of this Agreement: Sections 1.2, 1.4, 2.3, and 4.
          </p>
          </li>
        </ul>
        <div className={style.itemContainer}>
          <p style={{ color: '#53a548' }}>
            4) <b>Miscellaneous</b>
          </p>
        </div>
        <ul className={style.list} style={{ marginBottom: '32px' }}>
          <li>
            <p>
              4.1) <b>Assignment.</b> Neither this Agreement nor any rights under this Agreement may be assigned or otherwise transferred by Householder, in whole or in part without the prior written consent of Kyros. Kyros may assign or transfer this Agreement, in whole or in part. Subject to the foregoing, this Agreement will be binding upon and will inure to the benefit of the Parties and their respective successors and assigns.
            </p>
          </li>
          <li>
            <p>
              4.2) <b>Relationship of Parties. </b>Nothing contained in this Agreement shall be construed as creating any agency, partnership or other form of joint enterprise between the Parties. This Agreement confers no rights upon either Party except those expressly granted herein.
          </p>
          </li>
          <li>
            <p>
              4.3) <b>Backup Copies.</b>Kyros is not responsible for the backup storage of Householder’s data. Accordingly, Householder shall be responsible for the backup of its data and Householder assumes responsibility for any loss or damage from its failure to so maintain backup copies.
          </p>
          </li>
          <li>
            <p>
              4.4) <b>Notices.</b>  Any notice to Kyros required or permitted under the terms of this Agreement or required by law must be in writing and must be (a) delivered in person, (b) sent by first class registered mail, or air mail, as appropriate or (c) sent by overnight air courier, in each case properly posted and fully prepaid to the address of the Party concerned.
          </p>
          </li>
          <li>
            <p>
              4.5) <b>Waiver. </b>  Any waiver of the provisions of this Agreement or of a Party’s rights or remedies under this Agreement must be in writing to be effective. Failure, neglect or delay by a Party to enforce the provisions of this Agreement or its rights or remedies at any time will not be construed as, and will not be deemed to be, a waiver of such Party’s rights under this Agreement, and will not in any way affect the validity of the whole or any part of this Agreement or prejudice such Party’s right to take subsequent action. No exercise or enforcement by either Party of any right or remedy under this Agreement will preclude the enforcement by such Party of any other right or remedy under this Agreement or any other right or remedy that such Party is entitled by law to enforce.
          </p>
          </li>
          <li>
            <p>
              4.6) <b>Severability. </b>  If any term, condition or provision in this Agreement is found to be invalid, unlawful or unenforceable to any extent, such invalid term, condition or provision will be severed from the remaining terms, conditions and provisions, which will continue to be valid and enforceable to the fullest extent permitted by law.
          </p>
          </li>
          <li>
            <p>
              4.7) <b>Integration. </b>  This Agreement contains the entire agreement of the Parties with respect to the subject matter of this Agreement and supersedes all previous communications, representations, understandings and agreements, either oral or written, between the Parties with respect to said subject matter. This Agreement may not be amended, except by a writing signed by both Parties.
          </p>
          </li>
          <li>
            <p>
              4.8) <b>Governing Law. </b>  This Agreement will be interpreted and construed in accordance with the laws of the State of California and the United States of America, without regard to conflict of law principles. The Parties agree that the United Nations Convention on Contracts for the International Sale of Goods is specifically excluded from application to this Agreement. Any judicial action or proceeding arising hereunder or relating hereto shall be brought in, and the Parties hereby consent to the exclusive personal jurisdiction of, the state and federal courts located in Santa Clara County, California.
          </p>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default EULA;
