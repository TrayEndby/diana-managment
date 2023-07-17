import React from 'react';
import PlanetPopup from './PlanetPopup';
import * as ROUTES from 'constants/routes';

export default React.memo(({ popupCount, setPopupCount, tasks }) => {
  const total = tasks ? tasks.total : 0;
  const done = tasks ? tasks.done : 0;
  const [showPopup, setShowPopup] = React.useState(false);
  const svgRef = React.useRef(null);

  const handleClosePopup = () => {
    setPopupCount(--popupCount);
    setShowPopup(false);
  };

  const handleShowPopup = () => {
    setPopupCount(++popupCount);
    setShowPopup(true);
  };

  const togglePopup = () => {
    showPopup ? handleClosePopup() : handleShowPopup();
  };

  return (
    <>
      <PlanetPopup
        ref={svgRef}
        isShowed={showPopup}
        handleClose={handleClosePopup}
        planetName="Financial aid"
        planetLink={ROUTES.FIN_AID_SEARCH}
        completedMissions={done}
        allMissions={total}
      />
      <g
        id="planet-finances"
        transform="translate(330 -170)"
        className="App-clickable"
        ref={svgRef}
        onClick={togglePopup}
      >
        <path
          id="Path_16"
          data-name="Path 16"
          d="M302.732,388.347c0-.241,0-.483-.016-.724l0-.037c0-.8-.033-1.59-.079-2.378,0-.029,0-.058,0-.087-.041-.664-.091-1.321-.158-1.978-.058-.6-.124-1.188-.207-1.779l0-.022c-.086-.664-.188-1.324-.3-1.981l0-.025q-.134-.787-.294-1.567c-.1-.509-.219-1.014-.338-1.517v-.008a.662.662,0,0,0-.033-.141l-.005-.019c-.038-.16-.077-.319-.116-.478-.021-.084-.039-.167-.062-.251-.108-.441-.224-.873-.349-1.305q-.636-2.257-1.471-4.43a51.152,51.152,0,0,0-4.239-8.62q-.537-.873-1.1-1.721c-.117-.174-.238-.348-.358-.523s-.237-.354-.357-.524c-.308-.449-.632-.881-.956-1.313-.258-.349-.516-.69-.781-1.023-.183-.232-.375-.465-.566-.7-.1-.133-.216-.261-.324-.391s-.208-.261-.324-.39c0,0,0-.009-.008-.009-.225-.266-.457-.531-.69-.8a3.008,3.008,0,0,0-.225-.25c-.241-.282-.5-.557-.756-.831a.245.245,0,0,0-.075-.083c-.283-.308-.573-.607-.864-.906-.358-.366-.723-.732-1.1-1.081-.153-.154-.315-.3-.473-.445s-.312-.3-.474-.444c-.283-.258-.565-.515-.856-.765s-.565-.49-.856-.731c-.349-.3-.707-.59-1.073-.882h-.008c-.457-.365-.923-.723-1.388-1.072l-.008-.008c-.042-.031-.086-.059-.128-.09-.073-.054-.148-.1-.222-.157-.351-.253-.7-.506-1.063-.751-.1-.074-.2-.141-.3-.207-.266-.183-.523-.358-.789-.532s-.541-.349-.807-.516-.54-.34-.814-.5c-.275-.175-.549-.333-.823-.491-.224-.133-.441-.257-.665-.374a3.326,3.326,0,0,0-.341-.191c-.474-.266-.956-.524-1.438-.765-.241-.124-.482-.249-.731-.365-.308-.158-.624-.308-.939-.449-.018-.011-.04-.018-.059-.028l.012,0a.753.753,0,0,0-.091-.043c-.283-.133-.565-.266-.856-.39-.408-.175-.815-.349-1.222-.516-.466-.191-.931-.382-1.4-.557-.524-.2-1.047-.39-1.579-.565s-1.072-.357-1.613-.523-1.08-.316-1.629-.466l-.054-.013c-.432-.112-.864-.224-1.3-.328-.191-.05-.383-.091-.574-.141-.257-.058-.523-.116-.781-.166l-.541-.116-.037-.009c-.017-.008-.042-.008-.058-.017-.424-.083-.848-.166-1.272-.232a.33.33,0,0,0-.083-.017c-.183-.033-.374-.066-.565-.091-.79-.133-1.588-.241-2.394-.333-.092-.016-.191-.025-.291-.033-.233-.033-.466-.05-.707-.075-.532-.05-1.064-.091-1.6-.125-.557-.041-1.122-.066-1.687-.083-.59-.025-1.181-.033-1.771-.033h0c-1.562,0-3.108.066-4.638.208-.365.025-.723.058-1.08.1-.374.041-.748.083-1.122.133s-.748.1-1.114.157-.74.117-1.114.183c-.316.05-.64.108-.956.175q-1.172.224-2.319.5-.535.124-1.072.274c-.358.091-.715.191-1.064.291-.59.166-1.164.349-1.737.532h-.009c-.465.158-.939.316-1.4.474a.063.063,0,0,0-.033.016c-.474.166-.931.341-1.4.524l-.075.025c-.424.166-.847.341-1.263.515-.524.216-1.039.449-1.546.682-.432.2-.856.4-1.272.607-.449.224-.9.448-1.338.681l-.05.025c-.227.123-.453.253-.681.379-.182.1-.365.2-.544.3a.337.337,0,0,0-.038.019c-.433.241-.856.491-1.28.757h-.009c-.4.241-.789.482-1.18.731-.15.092-.291.191-.441.291-.415.266-.814.54-1.221.823-.5.341-.981.7-1.463,1.056-.424.315-.84.64-1.247.964a52.293,52.293,0,0,0-6.533,6.192c-.707.782-1.372,1.58-2.02,2.394a53.317,53.317,0,0,0-4.14,6.085c-.282.473-.548.955-.806,1.446-.133.237-.257.481-.382.724q-.63,1.206-1.2,2.449c-.042.094-.091.183-.133.276l0,.009-.032.073c-.154.347-.309.694-.463,1.049-.05.125-.108.258-.158.382-.116.274-.224.549-.332.831-.022.056-.04.115-.062.171-.221.57-.419,1.151-.621,1.73-.119.341-.252.672-.365,1.017-.265.8-.5,1.619-.722,2.441-.044.16-.084.32-.126.481-.08.306-.166.61-.241.918-.108.432-.207.873-.3,1.313-.007.033-.012.066-.02.1-.012.059-.023.12-.036.18-.075.347-.151.7-.21,1.043-.083.441-.166.881-.232,1.33-.007.036-.011.072-.017.109-.021.131-.038.263-.058.394-.043.281-.089.562-.125.843-.067.449-.116.9-.166,1.355-.017.108-.033.208-.042.316s-.015.237-.026.354c-.064.683-.113,1.37-.152,2.061,0,.057-.01.113-.013.17-.025.316-.042.64-.05.964-.025.624-.033,1.264-.033,1.9s.008,1.271.033,1.9c.024.694.067,1.381.12,2.066.014.184.033.367.049.552.027.3.048.6.081.906.007.072.021.142.028.213.107,1,.236,1.987.4,2.967.021.131.048.259.07.389q.219,1.268.5,2.514c.032.141.053.285.085.426.019.083.046.163.066.246q.331,1.4.737,2.767c.085.286.175.568.265.851.266.846.548,1.684.856,2.511.031.085.055.173.088.258a50.185,50.185,0,0,0,3.208,6.882c.515.956,1.081,1.895,1.671,2.818.731,1.139,1.5,2.253,2.319,3.325.765,1.03,1.579,2.036,2.435,3,.074.084.154.16.228.243q.918,1.035,1.89,2.016c.049.049.094.1.143.152.474.482.964.956,1.455,1.413.557.515,1.122,1.022,1.7,1.5.128.112.262.214.392.324.272.228.544.456.821.678.761.616,1.532,1.215,2.328,1.783.864.623,1.745,1.222,2.651,1.787.926.582,1.872,1.13,2.834,1.653.238.129.483.245.723.37.732.384,1.469.759,2.22,1.109.294.137.594.26.89.391l.145.064-.073-.011c.244.107.5.2.742.3.415.175.83.349,1.25.514.512.2,1.031.389,1.55.574.288.1.568.22.857.318.126.043.256.077.382.119.214.071.431.135.646.2l.082.025c.06.019.117.043.177.061l-.029-.015c.315.1.624.2.945.3.275.08.553.15.829.225l.22.06c.2.054.4.113.6.164.612.153,1.233.3,1.857.428.067.014.135.027.2.042.292.06.582.125.875.179.325.066.657.124.99.182.175.031.353.055.529.084l.331.052c.19.029.377.063.569.089.466.066.939.133,1.413.183.138.017.275.029.412.044.092.01.183.021.275.03s.207.024.311.034l1.163.1c.363.031.726.047,1.088.069l.141.008c.287.016.569.031.858.039.623.025,1.255.033,1.886.033h0a52.811,52.811,0,0,0,9.773-.908,52.115,52.115,0,0,0,12.069-3.839q1.425-.652,2.8-1.387h.008q1.2-.642,2.361-1.341t2.286-1.46q.869-.584,1.712-1.2a52.251,52.251,0,0,0,4.813-3.987c.307-.283.606-.574.906-.873s.6-.582.881-.889l.009-.01q.253-.261.5-.526l.052-.054c.565-.59,1.114-1.2,1.637-1.812.881-1.014,1.713-2.07,2.511-3.151.357-.49.714-.989,1.055-1.5.042-.058.083-.124.125-.191a50.652,50.652,0,0,0,3.134-5.245c.665-1.263,1.271-2.568,1.828-3.89.086-.209.162-.425.247-.637.216-.536.429-1.073.627-1.618.018-.049.039-.1.057-.147.225-.632.441-1.264.64-1.9a50.786,50.786,0,0,0,1.648-6.625q.2-1.129.355-2.278c.075-.527.137-1.06.191-1.6q.2-1.889.256-3.816C302.722,389.44,302.732,388.895,302.732,388.347Z"
          fill="#251d33"
        />
        <path
          id="Path_17"
          data-name="Path 17"
          d="M302.73,384.347c0,1.005-.025,2-.092,2.992a.015.015,0,0,1,0,.025c-.016.332-.041.665-.066,1-.075,1.023-.175,2.037-.316,3.034a51.094,51.094,0,0,1-2,8.9c-.2.64-.416,1.271-.64,1.9-.291.806-.607,1.613-.931,2.4-.557,1.322-1.164,2.627-1.829,3.89a50.467,50.467,0,0,1-3.133,5.245c-.042.067-.084.133-.125.191-.341.507-.7,1.006-1.056,1.5-.8,1.081-1.629,2.137-2.51,3.151-.524.615-1.072,1.222-1.638,1.812-.182.2-.374.39-.565.59-.282.307-.582.6-.881.889s-.6.59-.906.873a51.868,51.868,0,0,1-6.525,5.187,52.511,52.511,0,0,1-4.646,2.8h-.008a52.277,52.277,0,0,1-24.646,6.134c-.632,0-1.263-.008-1.887-.033-.307-.008-.607-.025-.914-.042-.391-.024-.781-.041-1.172-.074l-1.164-.1c-.332-.033-.665-.067-1-.108-.474-.05-.948-.116-1.413-.183-.482-.067-.956-.141-1.43-.224-.332-.059-.665-.117-.989-.183-.989-.183-1.97-.408-2.934-.649-.557-.141-1.106-.291-1.654-.449-.748-.216-1.48-.44-2.2-.689a52.268,52.268,0,0,1-11.138-5.287c-.906-.565-1.787-1.164-2.652-1.787-1.222-.873-2.4-1.795-3.541-2.784-.581-.483-1.147-.99-1.7-1.5-.49-.457-.98-.931-1.454-1.413-.782-.773-1.53-1.579-2.261-2.411-.856-.964-1.671-1.97-2.436-3-.822-1.072-1.587-2.186-2.319-3.325-.59-.923-1.155-1.862-1.67-2.818a50.308,50.308,0,0,1-3.209-6.882,50.984,50.984,0,0,1-2.011-6.633,52.628,52.628,0,0,1-1.081-6.509c-.125-1.163-.208-2.335-.249-3.524-.025-.632-.033-1.263-.033-1.9s.008-1.272.033-1.9c.008-.324.025-.648.05-.964.041-.873.108-1.729.191-2.585.008-.108.025-.208.041-.316.05-.457.1-.906.167-1.355s.124-.9.2-1.346.15-.889.233-1.33.166-.881.266-1.322.191-.881.3-1.313c.316-1.3.673-2.585,1.089-3.84q.486-1.483,1.047-2.918c.108-.282.216-.557.333-.831.05-.124.108-.257.158-.382.166-.382.332-.757.5-1.131.366-.814.748-1.62,1.164-2.41.175-.349.358-.7.549-1.039.257-.491.523-.973.806-1.446a53.529,53.529,0,0,1,4.139-6.085c.649-.814,1.314-1.612,2.02-2.394a52.3,52.3,0,0,1,6.534-6.192c.407-.324.822-.649,1.246-.964.482-.358.965-.715,1.463-1.056.408-.283.807-.557,1.222-.823.15-.1.291-.2.441-.291.39-.249.781-.49,1.18-.731h.008c.424-.266.848-.516,1.28-.757a.262.262,0,0,1,.067-.033c.39-.233.8-.449,1.2-.665l.05-.025c.44-.233.889-.457,1.338-.681.415-.208.839-.408,1.272-.607.507-.233,1.022-.466,1.546-.682.415-.174.839-.349,1.263-.515l.075-.025c.465-.183.923-.358,1.4-.524a.066.066,0,0,1,.034-.016c.457-.158.931-.316,1.4-.474H234c.574-.183,1.147-.366,1.738-.532.349-.1.706-.2,1.064-.291s.714-.191,1.072-.274q1.146-.275,2.319-.5c.316-.067.64-.125.956-.175.374-.066.739-.124,1.114-.183s.739-.108,1.113-.157.748-.092,1.123-.133c.357-.042.714-.075,1.08-.1,1.529-.142,3.076-.208,4.638-.208.59,0,1.18.008,1.771.033.565.017,1.13.042,1.687.083.54.034,1.072.075,1.6.125.241.025.474.042.707.075.1.008.2.017.291.033.806.092,1.6.2,2.394.333.191.025.382.058.565.091a.331.331,0,0,1,.083.017c.424.066.848.149,1.272.232.016.009.041.009.058.017l.582.125c.257.05.523.108.781.166.191.05.382.091.574.141.448.108.9.225,1.346.341l.175.05c.49.133.972.266,1.454.416.541.166,1.081.34,1.613.523s1.055.366,1.579.565c.474.175.939.366,1.4.557.407.167.814.341,1.222.516.291.124.573.257.856.39a.734.734,0,0,1,.141.067c.316.141.632.291.939.449.25.116.491.241.732.365.482.241.964.5,1.438.765a3.785,3.785,0,0,1,.341.191c.224.117.44.241.665.374.274.158.548.316.823.491.274.158.54.332.814.5s.54.333.806.516.524.349.79.532c.1.066.2.133.3.208.482.324.948.656,1.413,1l.009.008c.465.349.931.707,1.388,1.073h.008c.366.291.723.581,1.072.881.291.241.574.482.856.731s.574.507.857.765c.324.291.64.582.947.889.374.349.74.715,1.1,1.081.291.3.582.6.865.906a.245.245,0,0,1,.075.083c.257.274.515.548.756.831a2.827,2.827,0,0,1,.224.25c.233.266.466.531.69.8a.009.009,0,0,1,.009.009c.232.257.448.515.648.781.191.233.382.466.565.7.266.333.524.674.782,1.023.324.432.648.864.955,1.313.241.341.483.7.715,1.047q.561.849,1.1,1.721a51.159,51.159,0,0,1,4.24,8.62q.836,2.169,1.471,4.43c.125.432.241.864.349,1.305.066.249.125.5.183.748a.729.729,0,0,1,.033.141.016.016,0,0,1,0,.025c.249,1.014.457,2.037.632,3.067.116.674.216,1.347.307,2.028.083.591.15,1.181.208,1.779.067.657.116,1.314.158,1.978.05.832.075,1.663.083,2.5C302.73,383.864,302.73,384.106,302.73,384.347Z"
          fill="#ef7c50"
        />
        <path
          id="Path_18"
          data-name="Path 18"
          d="M264.1,333.693a30.15,30.15,0,0,1-.956,4.2c-.973,3.375-2.228,6.783-4.547,9.418-2.793,3.192-6.99,5.087-9.243,8.678-1.887,2.992-2.377,7.082-5.361,8.985-3.126,2-7.331.449-10.291-1.8a25.641,25.641,0,0,1-7.19-8.478c-1.413-2.694-5.851-8.246-7.755-12.41.482-.358.965-.715,1.463-1.056.408-.283.807-.557,1.222-.823.15-.1.291-.2.441-.291.39-.249.781-.49,1.18-.731h.008c.424-.266.848-.516,1.28-.757a.262.262,0,0,1,.067-.033c.39-.233.8-.449,1.2-.665l.05-.025c.44-.233.889-.457,1.338-.681.415-.208.839-.408,1.272-.607.507-.233,1.022-.466,1.546-.682.415-.174.839-.349,1.263-.515l.075-.025c.465-.183.923-.358,1.4-.524a.066.066,0,0,1,.034-.016c.457-.158.931-.316,1.4-.474H234c.574-.183,1.147-.366,1.738-.532.349-.1.706-.2,1.064-.291s.714-.191,1.072-.274q1.146-.275,2.319-.5c.316-.067.64-.125.956-.175.374-.066.739-.124,1.114-.183s.739-.108,1.113-.157.748-.092,1.123-.133c.357-.042.714-.075,1.08-.1,1.529-.142,3.076-.208,4.638-.208.59,0,1.18.008,1.771.033.565.017,1.13.042,1.687.083.54.034,1.072.075,1.6.125.241.025.474.042.707.075.1.008.2.017.291.033.806.092,1.6.2,2.394.333.191.025.382.058.565.091a.331.331,0,0,1,.083.017c.424.066.848.149,1.272.232.016.009.041.009.058.017l.582.125c.257.05.523.108.781.166.191.05.382.091.574.141.448.108.9.225,1.346.341Z"
          fill="#f49b5e"
        />
        <path
          id="Path_19"
          data-name="Path 19"
          d="M242.534,387.879c-1.7,1.621-3.924,2.535-6.01,3.608-3.067,1.554-6.026,3.6-7.788,6.55-2.161,3.624-2.228,8.062-3.234,12.16a24.289,24.289,0,0,1-9.376,14.073c-.581-.483-1.147-.99-1.7-1.5-.49-.457-.98-.931-1.454-1.413-.782-.773-1.53-1.579-2.261-2.411-.856-.964-1.671-1.97-2.436-3-.822-1.072-1.587-2.186-2.319-3.325-.59-.923-1.155-1.862-1.67-2.818a50.308,50.308,0,0,1-3.209-6.882,50.984,50.984,0,0,1-2.011-6.633,52.628,52.628,0,0,1-1.081-6.509c3.408.266,6.982.981,9.459.624a33.3,33.3,0,0,0,8.071-2.61c5.628-2.353,11.246-4.713,16.8-7.248a17.712,17.712,0,0,1,6.434-2.02c2.26-.092,4.729.931,5.618,3.009C245.293,383.69,244.229,386.267,242.534,387.879Z"
          fill="#f49b5e"
        />
        <path
          id="Path_20"
          data-name="Path 20"
          d="M301.957,375.336a15.823,15.823,0,0,1-4.106.15c-4.979-.465-9.551-2.776-14.139-4.755s-9.576-3.682-14.5-2.842c-1.837.307-3.649.972-5.5.848s-3.848-1.389-3.932-3.25c-.158-3.641,6.309-6.367,8.645-8.288,3.466-2.842,4.389-5.037,6.3-8.852a21.733,21.733,0,0,1,5.295-7.231c.482.324.948.656,1.413,1l.009.008c.465.349.931.707,1.388,1.073h.008c.366.291.723.581,1.072.881.291.241.574.482.856.731s.574.507.857.765c.324.291.64.582.947.889.374.349.74.715,1.1,1.081.291.3.582.6.865.906a.245.245,0,0,1,.075.083c.257.274.515.548.756.831a2.827,2.827,0,0,1,.224.25c.233.266.466.531.69.8a.009.009,0,0,1,.009.009c.232.257.448.515.648.781.191.233.382.466.565.7.266.333.524.674.782,1.023.324.432.648.864.955,1.313.241.341.483.7.715,1.047q.561.849,1.1,1.721a51.159,51.159,0,0,1,4.24,8.62q.836,2.169,1.471,4.43c.125.432.241.864.349,1.305.066.249.125.5.183.748a.729.729,0,0,1,.033.141.016.016,0,0,1,0,.025C301.574,373.283,301.782,374.306,301.957,375.336Z"
          fill="#f49b5e"
        />
        <path
          id="Path_21"
          data-name="Path 21"
          d="M293.6,413.929c-.341.507-.7,1.006-1.056,1.5-.8,1.081-1.629,2.137-2.51,3.151-.524.615-1.072,1.222-1.638,1.812-.182.2-.374.39-.565.59-.282.307-.582.6-.881.889s-.6.59-.906.873a51.868,51.868,0,0,1-6.525,5.187,52.511,52.511,0,0,1-4.646,2.8h-.008a52.277,52.277,0,0,1-24.646,6.134c-.632,0-1.263-.008-1.887-.033-.307-.008-.607-.025-.914-.042-.391-.024-.781-.041-1.172-.074l-1.164-.1c-.332-.033-.665-.067-1-.108-.474-.05-.948-.116-1.413-.183-.482-.067-.956-.141-1.43-.224-.332-.059-.665-.117-.989-.183-.989-.183-1.97-.408-2.934-.649-.557-.141-1.106-.291-1.654-.449-.748-.216-1.48-.44-2.2-.689-.108-9.767,1.471-22.692,9.359-24.3,1.513-.308,3.159-.158,4.522-.9,3.017-1.637,2.56-6.225,4.68-8.927a5.684,5.684,0,0,1,8.462-.116,31.051,31.051,0,0,1,1.82,2.984c2.41,3.724,7.273,4.954,11.7,5.17s9.019-.233,13.167,1.338A16.448,16.448,0,0,1,293.6,413.929Z"
          fill="#f49b5e"
        />
        <path
          id="Path_22"
          data-name="Path 22"
          d="M302.73,384.347c0,1.005-.025,2-.092,2.992a.015.015,0,0,1,0,.025c-.016.332-.041.665-.066,1-.075,1.023-.175,2.037-.316,3.034a51.094,51.094,0,0,1-2,8.9c-.2.64-.416,1.271-.64,1.9-.291.806-.607,1.613-.931,2.4-.2-.017-.391-.041-.59-.066a53.3,53.3,0,0,1-7.739-1.5,10,10,0,0,1-5.22-2.76c-2.967-3.54-.507-8.91-1.188-13.482-.333-2.269-1.455-4.671-.433-6.716,1.039-2.094,3.774-2.626,6.118-2.585a25.363,25.363,0,0,1,7.581,1.322,48.6,48.6,0,0,1,5.419,2.31c.05.832.075,1.663.083,2.5C302.73,383.864,302.73,384.106,302.73,384.347Z"
          fill="#f49b5e"
        />
        <path
          id="Path_23"
          data-name="Path 23"
          d="M224.139,372.8a4.322,4.322,0,0,1-2.468,2.269c-3.774,1.945-7.631,3.907-11.82,4.564-2.294.365-4.63.324-6.916.656a41.054,41.054,0,0,0-5.153,1.2c.041-.873.108-1.729.191-2.585.008-.108.025-.208.041-.316.05-.457.1-.906.167-1.355s.124-.9.2-1.346.15-.889.233-1.33.166-.881.266-1.322.191-.881.3-1.313c.316-1.3.673-2.585,1.089-3.84q.486-1.483,1.047-2.918c.108-.282.216-.557.333-.831.05-.124.108-.257.158-.382.166-.382.332-.757.5-1.131.366-.814.748-1.62,1.164-2.41.175-.349.358-.7.549-1.039a9.453,9.453,0,0,0,1.787,1.322c1.421.814,3.075,1.221,4.4,2.177A31.36,31.36,0,0,1,212.536,365a17.847,17.847,0,0,0,7.1,3.425,9.738,9.738,0,0,1,3.242,1.33A2.96,2.96,0,0,1,224.139,372.8Z"
          fill="#f49b5e"
        />
        <path
          id="Path_24"
          data-name="Path 24"
          d="M257.171,374.578a13.09,13.09,0,0,0-3.241,5.718,19.616,19.616,0,0,1-2.756,6.01,17.08,17.08,0,0,0-2.23,2.813,2.552,2.552,0,0,0,.533,3.241,3.753,3.753,0,0,0,1.973.375,24.534,24.534,0,0,1,10.63,2.662,6.022,6.022,0,0,0,3.1.993,5.357,5.357,0,0,0,2.489-1.147l4.145-2.868a5.739,5.739,0,0,0,3-4.936c.487-2.743.922-5.777-.548-8.144-1.393-2.241-4.094-3.228-6.6-4.064C264.265,374.094,260.367,371.743,257.171,374.578Z"
          fill="#f49b5e"
        />
        <path
          id="Path_25"
          data-name="Path 25"
          d="M257.944,350.744a17.692,17.692,0,0,0-4.018,2.452c-1.705,1.714-2.016,4.343-3.152,6.478-1.925,3.62-6.205,5.792-7.352,9.728,1.7-2.078,4.811-2.42,6.79-4.239,1.541-1.416,2.193-3.522,3.181-5.368a15.394,15.394,0,0,1,5.7-5.948,16.883,16.883,0,0,0,3.138-2,8.117,8.117,0,0,0,1.945-3.25c.916-2.582,1.619-6.682.264-9.22C264.063,344.006,262.142,348.342,257.944,350.744Z"
          fill="#dc704e"
        />
        <path
          id="Path_26"
          data-name="Path 26"
          d="M215.216,381.574l4.3-1.484a10.607,10.607,0,0,0,3.785-1.908c1.8-1.635,2.4-4.424,4.474-5.692-.948,1.513-1.017,3.4-1.557,5.1a9.7,9.7,0,0,1-8.985,6.584,9.478,9.478,0,0,0-2.976.16,15.793,15.793,0,0,0-2,1.06c-1.53.763-9.12-.124-7.319-1.88.861-.839,3.423-.221,4.546-.367A29.5,29.5,0,0,0,215.216,381.574Z"
          fill="#dc704e"
        />
        <path
          id="Path_27"
          data-name="Path 27"
          d="M232.317,395.752c-1.606,1.858-2.24,4.34-2.824,6.725q-2.005,8.183-4.012,16.364c2.371-3.659,4.79-7.435,5.621-11.715a21.615,21.615,0,0,1,1-4.513c1.4-3.249,5.027-4.786,8.2-6.361,2.2-1.1,4.59-2.6,5.791-4.83a5.1,5.1,0,0,0,.638-3.783c-.64-1.846-.751-1.215-1.691-.4-2.1,1.824-3.381,3.305-6.062,4.512C236.613,392.815,234.059,393.737,232.317,395.752Z"
          fill="#dc704e"
        />
        <path
          id="Path_28"
          data-name="Path 28"
          d="M276.673,387.134a8.471,8.471,0,0,1-.822,3.559,7.7,7.7,0,0,1-1.648,2,8.312,8.312,0,0,1-3.6,2.075,8.929,8.929,0,0,0,4.737-.9,6.084,6.084,0,0,0,2.571-3.731,13.811,13.811,0,0,0,.223-4.618c-.229-2.728-.757-6.767-2.91-8.722-.341,1.179.746,3.134.993,4.328A23.336,23.336,0,0,1,276.673,387.134Z"
          fill="#dc704e"
        />
        <path
          id="Path_29"
          data-name="Path 29"
          d="M275.634,406.469c2.96.063,5.945-.432,8.866.045a13.579,13.579,0,0,1,7.992,4.465c-1.949-2.608-4.283-5.249-7.454-5.987-2-.465-4.076-.111-6.119.038-3.578.261-6.792-.644-10.268-.939C269.6,406.06,273.717,406.428,275.634,406.469Z"
          fill="#dc704e"
        />
        <path
          id="Path_30"
          data-name="Path 30"
          d="M220.558,350.745c1.31,1.151,3.087,2.035,3.546,3.718.279,1.022-.013,2.136.269,3.158a5.3,5.3,0,0,0,1.392,2.124,29.01,29.01,0,0,0,7.949,5.934,47.842,47.842,0,0,1-8.262-2.887,5.479,5.479,0,0,1-1.715-1.074c-1.9-1.962-.358-5.543-1.91-7.789a13.637,13.637,0,0,0-2.756-2.292c-.6-.505-2.9-3.274-1.837-3.944C218.276,347.036,220,350.254,220.558,350.745Z"
          fill="#dc704e"
        />
        <path
          id="Path_31"
          data-name="Path 31"
          d="M232.867,384.114a18.162,18.162,0,0,0-3.774,4.089,29.547,29.547,0,0,0-1.845,4.381,24.826,24.826,0,0,1-4.43,7.256c-1.63,1.862-3.583,3.533-4.655,5.769-1.023,2.136-1.147,4.58-1.6,6.907a24.527,24.527,0,0,1-3.333,8.429c-.083.133-.175.274-.266.407-.782-.773-1.53-1.579-2.261-2.411-.856-.964-1.671-1.97-2.436-3-.822-1.072-1.587-2.186-2.319-3.325-.59-.923-1.155-1.862-1.67-2.818a50.308,50.308,0,0,1-3.209-6.882,50.984,50.984,0,0,1-2.011-6.633,50.582,50.582,0,0,0,5.12-.757,57.809,57.809,0,0,0,6.849-2.726,15.139,15.139,0,0,1,2.435-.914,26.4,26.4,0,0,1,2.935-.466C222.385,390.556,227.722,387.3,232.867,384.114Z"
          fill="#e89256"
        />
        <path
          id="Path_32"
          data-name="Path 32"
          d="M288.391,420.388c-.182.2-.374.39-.565.59-.282.307-.582.6-.881.889s-.6.59-.906.873a51.868,51.868,0,0,1-6.525,5.187,52.511,52.511,0,0,1-4.646,2.8h-.008a52.277,52.277,0,0,1-24.646,6.134c-.632,0-1.263-.008-1.887-.033-.307-.008-.607-.025-.914-.042-.391-.024-.781-.041-1.172-.074l-1.164-.1c-.332-.033-.665-.067-1-.108-.474-.05-.948-.116-1.413-.183-.482-.067-.956-.141-1.43-.224-.332-.059-.665-.117-.989-.183-.989-.183-1.97-.408-2.934-.649-.557-.141-1.106-.291-1.654-.449.648-1.911,1.471-3.765,2.294-5.61q1.483-3.342,2.976-6.683c1.147-2.577,2.385-5.278,4.654-6.949,1.2-.889,2.619-1.43,3.865-2.236a10.9,10.9,0,0,0,4.813-7.888c.141-1.189-.283-2.643,1.039-3.134,1.3-.473,3.142.831,3.923,1.738,1.231,1.421,1.854,3.258,2.835,4.862a16.56,16.56,0,0,0,7.622,6.193,20.283,20.283,0,0,0,6.218,1.67c2.252.208,4.563-.033,6.749.549a17.5,17.5,0,0,1,5.295,2.751C288.092,420.18,288.242,420.288,288.391,420.388Z"
          fill="#e89256"
        />
        <path
          id="Path_33"
          data-name="Path 33"
          d="M302.572,388.361c-.075,1.023-.175,2.037-.316,3.034a51.094,51.094,0,0,1-2,8.9c-.2.64-.416,1.271-.64,1.9-1.954-1.38-3.516-3.408-5.561-4.713-1.164-.748-2.485-1.247-3.632-2.02a4.635,4.635,0,0,1-2.253-3.325,4.387,4.387,0,0,1,1.455-3.266,7.744,7.744,0,0,0,1.122-1.205c.972-1.513.183-3.8,1.421-5.1a2.878,2.878,0,0,1,2.851-.607C297.7,382.734,300.718,385.61,302.572,388.361Z"
          fill="#e89256"
        />
        <path
          id="Path_34"
          data-name="Path 34"
          d="M301.292,372.1a8.976,8.976,0,0,1-2.843-.989,30.807,30.807,0,0,0-2.868-1.663c-1.579-.656-3.358-.581-5.045-.889-4.979-.9-8.985-5.087-14.022-5.6-1.921-.2-3.841.158-5.769.141-1.23,0-2.76-.424-2.959-1.646a2.022,2.022,0,0,1,.889-1.853,7.965,7.965,0,0,1,1.962-.915,16.884,16.884,0,0,0,10.523-14.97,3.669,3.669,0,0,1,.241-1.537.524.524,0,0,1,.033-.067l.009.008c.473.349.931.707,1.388,1.073h.008c.366.291.723.581,1.072.881.291.241.574.482.856.731s.574.507.857.765c.324.291.64.582.947.889.374.349.74.715,1.1,1.081.291.3.582.6.865.906a.245.245,0,0,1,.075.083c.257.274.515.548.756.831a2.827,2.827,0,0,1,.224.25c.233.266.466.531.69.8a.009.009,0,0,1,.009.009c.232.257.448.515.648.781.191.233.382.466.565.7.266.333.524.674.782,1.023.324.432.648.864.955,1.313.241.341.483.7.715,1.047q.561.849,1.1,1.721a51.159,51.159,0,0,1,4.24,8.62q.836,2.169,1.471,4.43c.125.432.241.864.349,1.305C301.175,371.6,301.234,371.854,301.292,372.1Z"
          fill="#e89256"
        />
        <path
          id="Path_35"
          data-name="Path 35"
          d="M261.228,332.995a8.073,8.073,0,0,1-.79,1.488c-1,1.6-2.07,3.15-3.15,4.7a42.5,42.5,0,0,1-6.542,7.954,58.66,58.66,0,0,0-5.112,4.373c-2.086,2.335-3.508,5.644-6.5,6.583a6.738,6.738,0,0,1-6.683-2.178,15.606,15.606,0,0,1-3.217-6.608,44.118,44.118,0,0,0-2.177-7.082,21.006,21.006,0,0,0-2.635-3.624c.39-.233.8-.449,1.2-.665l.05-.025c.44-.233.889-.457,1.338-.681.415-.208.839-.408,1.272-.607.507-.233,1.022-.466,1.546-.682.415-.174.839-.349,1.263-.515l.075-.025c.465-.183.923-.358,1.4-.524a.066.066,0,0,1,.034-.016c.457-.158.931-.316,1.4-.474H234c.574-.183,1.147-.366,1.738-.532.349-.1.706-.2,1.064-.291s.714-.191,1.072-.274q1.146-.275,2.319-.5c.316-.067.64-.125.956-.175.374-.066.739-.124,1.114-.183s.739-.108,1.113-.157.748-.092,1.123-.133c.357-.042.714-.075,1.08-.1,1.529-.142,3.076-.208,4.638-.208.59,0,1.18.008,1.771.033.565.017,1.13.042,1.687.083.54.034,1.072.075,1.6.125.241.025.474.042.707.075.1.008.2.017.291.033.806.092,1.6.2,2.394.333.191.025.382.058.565.091a.331.331,0,0,1,.083.017c.424.066.848.149,1.272.232.016.009.041.009.058.017Z"
          fill="#e89256"
        />
        <path
          id="Path_36"
          data-name="Path 36"
          d="M218.52,372.917a2.785,2.785,0,0,1-1.745,1.314q-2.22.885-4.455,1.762a39.668,39.668,0,0,1-7.947,2.527,20.4,20.4,0,0,1-6.359.066c.05-.457.1-.906.167-1.355s.124-.9.2-1.346.15-.889.233-1.33.166-.881.266-1.322.191-.881.3-1.313c.316-1.3.673-2.585,1.089-3.84q.486-1.483,1.047-2.918c.108-.282.216-.557.333-.831.05-.124.108-.257.158-.382.166-.382.332-.757.5-1.131a11.582,11.582,0,0,1,2.868,1.871c1.563,1.338,2.992,2.909,4.871,3.74,2.136.939,4.613.831,6.749,1.779C217.872,370.69,218.961,371.812,218.52,372.917Z"
          fill="#e89256"
        />
        <path
          id="Path_37"
          data-name="Path 37"
          d="M255.688,386.3c-.788.535-1.893.835-2.168,1.746-.3,1,.7,1.957,1.711,2.193s2.084.036,3.109.217a11.865,11.865,0,0,1,3.491,1.635,4.642,4.642,0,0,0,3.7.668,14.5,14.5,0,0,0,2.341-1.548c1.058-.634,2.391-.818,3.275-1.678a4.141,4.141,0,0,0,1.064-2.87c.154-4.9-4.457-9.14-9.123-9.789C257.307,376.076,259.09,384,255.688,386.3Z"
          fill="#e89256"
        />
        <path
          id="Path_38"
          data-name="Path 38"
          d="M228.956,431.393c-.906-.565-1.787-1.164-2.651-1.787a53.014,53.014,0,0,1-8.961-8.113c-.856-.964-1.67-1.97-2.435-3-.823-1.073-1.588-2.186-2.319-3.325-.59-.923-1.155-1.862-1.671-2.818a50.3,50.3,0,0,1-3.208-6.882,52.351,52.351,0,0,1-3.342-16.666c-.025-.632-.033-1.263-.033-1.9s.008-1.271.033-1.9c.042-1.2.125-2.377.241-3.549a52.285,52.285,0,0,1,6.849-20.98,53.3,53.3,0,0,1,4.14-6.084c.648-.815,1.313-1.613,2.02-2.394a52.3,52.3,0,0,1,6.533-6.192c.407-.325.823-.649,1.247-.965.482-.357.964-.715,1.463-1.055.407-.283.806-.557,1.222-.823.149-.1.291-.2.44-.291.391-.249.781-.49,1.18-.731h.009c.424-.266.848-.516,1.28-.757.415-.241.839-.474,1.263-.7l.05-.025c.441-.233.89-.457,1.338-.682.416-.208.84-.407,1.272-.606.507-.233,1.022-.466,1.546-.682.416-.175.84-.349,1.264-.515l.074-.025c.466-.183.923-.358,1.4-.524a.066.066,0,0,1,.033-.017c.457-.157.931-.315,1.4-.473h.009c.573-.183,1.147-.366,1.737-.532.349-.1.707-.2,1.064-.291s.715-.191,1.072-.275q1.147-.273,2.319-.5c.316-.067.64-.125.956-.175.374-.066.74-.125,1.114-.183s.74-.108,1.114-.158.748-.091,1.122-.133c.357-.041.715-.075,1.081-.1,1.529-.142,3.075-.208,4.638-.208.59,0,1.18.008,1.77.033.565.017,1.131.042,1.687.083s1.073.075,1.605.125c.241.025.473.041.706.075a2.872,2.872,0,0,1,.291.033c.806.091,1.6.2,2.394.332.191.025.382.059.565.092a.331.331,0,0,1,.083.017c.424.066.848.149,1.272.232.017.009.042.009.058.017,1.106.224,2.2.482,3.284.773.548.149,1.088.3,1.629.465l.131.043a.685.685,0,0,0-.091-.043c-.282-.133-.565-.266-.856-.39-.407-.175-.814-.349-1.222-.516-.465-.191-.93-.382-1.4-.557-.524-.2-1.048-.39-1.58-.565s-1.072-.357-1.612-.523-1.081-.316-1.629-.466c-1.081-.291-2.178-.549-3.284-.773-.016-.008-.041-.008-.058-.017-.424-.083-.848-.166-1.271-.232a.346.346,0,0,0-.084-.017c-.182-.033-.374-.066-.565-.091-.789-.133-1.587-.241-2.394-.333-.091-.016-.191-.025-.291-.033-.232-.033-.465-.05-.706-.075-.532-.05-1.064-.091-1.6-.125-.557-.041-1.122-.066-1.688-.083-.59-.025-1.18-.033-1.77-.033-1.563,0-3.109.066-4.638.208-.366.025-.723.058-1.081.1-.374.041-.748.083-1.122.133s-.748.1-1.114.157-.74.117-1.114.183c-.316.05-.64.108-.956.175q-1.171.224-2.319.5-.535.124-1.072.274c-.357.091-.715.191-1.064.291-.59.166-1.163.349-1.737.532h-.008c-.466.158-.94.316-1.4.474a.063.063,0,0,0-.033.016c-.474.166-.931.341-1.4.524l-.075.025c-.424.166-.848.341-1.264.515-.523.216-1.039.449-1.546.682-.432.2-.856.4-1.271.607-.449.224-.9.448-1.339.681l-.05.025c-.424.224-.847.457-1.263.7-.432.241-.856.491-1.28.757h-.008c-.4.241-.79.482-1.181.731-.149.092-.291.191-.44.291-.416.266-.815.54-1.222.823-.5.341-.981.7-1.463,1.056-.424.315-.84.64-1.247.964a52.292,52.292,0,0,0-6.533,6.192c-.707.782-1.372,1.58-2.02,2.394a53.267,53.267,0,0,0-4.139,6.085,52.3,52.3,0,0,0-6.85,20.979c-.116,1.172-.2,2.353-.241,3.549-.024.624-.033,1.264-.033,1.9s.009,1.271.033,1.9a52.345,52.345,0,0,0,3.342,16.666,50.422,50.422,0,0,0,3.208,6.882c.516.956,1.081,1.895,1.671,2.818.732,1.139,1.5,2.253,2.319,3.325.765,1.03,1.579,2.036,2.436,3a52.944,52.944,0,0,0,8.96,8.113c.864.623,1.746,1.222,2.652,1.787a52.2,52.2,0,0,0,12.42,5.7A52.413,52.413,0,0,1,228.956,431.393Z"
          fill="#fff"
          opacity="0.1"
        />
        <ellipse
          id="Ellipse_2"
          data-name="Ellipse 2"
          cx="13.754"
          cy="8.661"
          rx="13.754"
          ry="8.661"
          transform="translate(213.597 373.043) rotate(-64.632)"
          fill="#fff"
          opacity="0.1"
        />
        <path
          id="Path_39"
          data-name="Path 39"
          d="M236.255,384.867c-1.476,3.113-4.262,4.884-6.223,3.954s-2.353-4.207-.877-7.321,4.263-4.884,6.223-3.954S237.732,381.753,236.255,384.867Z"
          fill="#fff"
          opacity="0.1"
        />
        <path
          id="Path_40"
          data-name="Path 40"
          d="M302.713,383.623c-.008-1.512-.091-3-.241-4.48-.058-.6-.125-1.188-.208-1.779a50.958,50.958,0,0,0-1.5-7.314q-.636-2.257-1.471-4.43a51.159,51.159,0,0,0-4.24-8.62q-.536-.873-1.1-1.721c-.233-.349-.474-.706-.715-1.047-.307-.449-.631-.881-.955-1.313-.258-.349-.516-.69-.782-1.023-.183-.232-.374-.465-.565-.7-.2-.266-.416-.524-.648-.781a.009.009,0,0,0-.009-.009c-.224-.266-.457-.531-.69-.8a2.827,2.827,0,0,0-.224-.25c-.241-.283-.5-.557-.756-.831a.245.245,0,0,0-.075-.083c-.283-.308-.574-.607-.865-.906-.357-.366-.723-.732-1.1-1.081-.307-.307-.623-.6-.947-.889-.283-.258-.566-.515-.857-.765s-.565-.49-.856-.731c-.349-.3-.706-.59-1.072-.881h-.008q-1.509-1.211-3.109-2.286c-.266-.183-.524-.358-.79-.532s-.54-.349-.806-.516-.54-.34-.815-.5c-.274-.175-.548-.333-.822-.491-.225-.133-.441-.257-.665-.374a3.785,3.785,0,0,0-.341-.191c-.474-.266-.956-.524-1.438-.765-.241-.124-.482-.249-.732-.365-.307-.158-.623-.308-.939-.449a.734.734,0,0,0-.141-.067c-.283-.133-.565-.266-.856-.39-.408-.175-.815-.349-1.222-.516-.466-.191-.931-.382-1.4-.557-.524-.2-1.047-.39-1.579-.565s-1.072-.357-1.613-.523-1.08-.316-1.629-.466c-1.08-.291-2.178-.549-3.283-.773-.017-.008-.042-.008-.058-.017-.424-.083-.848-.166-1.272-.232a.331.331,0,0,0-.083-.017h-.005c.286.123.565.254.843.385a.677.677,0,0,1,.141.066c.316.141.632.291.939.449.25.116.491.241.732.366.482.241.964.5,1.438.764a3.788,3.788,0,0,1,.341.192c.224.116.44.241.665.374.274.158.548.316.822.49.275.158.541.333.815.5s.54.332.806.515.524.349.79.532q1.6,1.073,3.109,2.286h.008c.366.291.723.582,1.072.881.291.241.574.482.856.731s.574.507.857.765c.324.291.64.582.947.89.374.349.74.715,1.1,1.08.291.3.582.6.865.906a.246.246,0,0,1,.075.083c.257.275.515.549.756.832a2.964,2.964,0,0,1,.224.249c.233.266.466.532.69.8a.008.008,0,0,1,.009.008c.232.258.448.516.648.781.191.233.382.466.565.7.266.332.524.673.781,1.022.325.432.649.865.956,1.313.241.341.482.7.715,1.048q.561.848,1.1,1.72a51.272,51.272,0,0,1,4.24,8.62c.556,1.446,1.047,2.926,1.471,4.43a50.966,50.966,0,0,1,1.5,7.315c.083.59.15,1.18.208,1.779.15,1.479.233,2.967.241,4.48.017.241.017.482.017.723a51.823,51.823,0,0,1-.474,7.049,52.411,52.411,0,0,1-5.4,17.1,50.41,50.41,0,0,1-3.134,5.245c-.374.573-.773,1.13-1.18,1.687-.8,1.08-1.629,2.136-2.51,3.15a50.931,50.931,0,0,1-3.99,4.164,51.687,51.687,0,0,1-6.525,5.187,52.507,52.507,0,0,1-4.646,2.8H262.7a52.607,52.607,0,0,1-33.64,5.362,52.575,52.575,0,0,0,45.8-1.689h.009a52.511,52.511,0,0,0,4.646-2.8,51.868,51.868,0,0,0,6.525-5.187,50.921,50.921,0,0,0,3.99-4.164c.881-1.014,1.712-2.07,2.51-3.151.407-.556.806-1.113,1.18-1.687a51.6,51.6,0,0,0,6.534-13.44,51.094,51.094,0,0,0,2-8.9,51.813,51.813,0,0,0,.474-7.048C302.73,384.106,302.73,383.864,302.713,383.623Z"
          opacity="0.1"
        />
        <text x="200" y="480">
          Finances
        </text>
      </g>
      <animateMotion xlinkHref="#planet-finances" dur="18s" repeatCount="indefinite" calcMode="linear">
        <mpath xlinkHref="#ellipse_7" />
      </animateMotion>
    </>
  );
});
