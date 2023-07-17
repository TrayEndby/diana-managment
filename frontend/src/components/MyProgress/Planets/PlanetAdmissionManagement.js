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
        planetName="Admission management"
        planetLink={ROUTES.ADMISSIONS}
        completedMissions={done}
        allMissions={total}
      />

      <g
        id="planet-admission-management"
        transform="translate(280, 0)"
        className="App-clickable"
        ref={svgRef}
        onClick={togglePopup}
      >
        <path
          id="Path_129"
          data-name="Path 129"
          d="M454.982,230.35l.1.2a50.245,50.245,0,0,1,2.3,5.771c.078.223.152.438.219.657a52.947,52.947,0,0,1,2.468,17.929c-.028.8-.078,1.6-.144,2.4-.1,1.255-.251,2.506-.445,3.74-.093.685-.216,1.365-.347,2.049-.26,1.331-.561,2.653-.926,3.959a51.5,51.5,0,0,1-1.837,5.523,52.3,52.3,0,0,1-3.707,7.552,53.256,53.256,0,0,1-3.025,4.564l-.008,0a53,53,0,0,1-48.728,21c-1.07-.123-2.133-.288-3.191-.482a53.583,53.583,0,0,1-11.68-3.522c-1.022-.435-2.037-.91-3.024-1.426-.16-.082-.331-.168-.494-.258-1.214-.621-2.393-1.306-3.553-2.028-.937-.587-1.859-1.2-2.742-1.847a50.764,50.764,0,0,1-5.9-4.889A52.826,52.826,0,0,1,360.058,277.5c-.3-.565-.577-1.137-.854-1.721s-.542-1.163-.789-1.743c-.48-1.109-.915-2.221-1.315-3.341-.22-.619-.421-1.239-.615-1.862a52.63,52.63,0,0,1-2.214-20.231,53.882,53.882,0,0,1,1.143-7.339c.239-1.023.5-2.038.807-3.056.428-1.485.936-2.961,1.495-4.4.542-1.381,1.133-2.738,1.784-4.068.231-.472.47-.947.72-1.419.285-.534.57-1.069.877-1.6.25-.434.5-.857.759-1.279.093-.156.179-.308.276-.456.248-.4.5-.785.76-1.177l.007,0c.272-.426.55-.837.84-1.243.275-.4.561-.795.85-1.183l.035-.045c.3-.4.613-.8.926-1.2.289-.37.589-.735.9-1.1.362-.431.731-.866,1.115-1.29.3-.339.614-.681.929-1.016l.058-.055c.345-.368.686-.725,1.046-1.082a.059.059,0,0,1,.024-.029c.348-.342.712-.691,1.068-1.036l.008,0c.444-.415.888-.83,1.354-1.237.275-.241.558-.487.844-.725s.569-.483.859-.714q.927-.745,1.9-1.458c.26-.2.53-.39.8-.572.313-.223.621-.434.937-.649s.628-.418.947-.626.643-.407.966-.606.62-.378.942-.558q2-1.187,4.14-2.2c.538-.255,1.08-.5,1.629-.736.523-.229,1.049-.451,1.575-.654.507-.2,1.01-.4,1.516-.58.231-.081.45-.167.677-.237.1-.036.189-.071.28-.1.774-.265,1.549-.512,2.326-.732.186-.06.374-.112.555-.161a.37.37,0,0,1,.083-.021c.416-.122.838-.23,1.261-.337.018,0,.041-.011.06-.011,1.105-.273,2.217-.513,3.328-.715.309-.053.607-.111.908-.161l.779-.119c.565-.082,1.133-.157,1.7-.22s1.121-.123,1.685-.168c.508-.045,1.015-.072,1.522-.1.443-.025.89-.042,1.337-.059.319-.012.634-.013.95-.014a.75.75,0,0,1,.157,0c.349-.008.7-.008,1.051,0,.278,0,.551.007.825.017.544.011,1.1.038,1.642.075a3.608,3.608,0,0,1,.394.027c.255.009.506.03.768.054.318.025.637.051.962.091.319.025.637.069.959.1s.636.07.958.122.628.092.95.143c.629.092,1.257.2,1.877.317.647.13,1.3.267,1.946.423l.008,0c.459.107.911.217,1.359.339.37.094.731.192,1.1.3s.742.214,1.112.327c.421.125.835.254,1.248.4.492.157.984.332,1.468.511.395.147.79.294,1.18.452a.237.237,0,0,1,.105.044c.353.138.707.277,1.049.43a3.018,3.018,0,0,1,.312.131c.257.11.5.217.751.331.079.028.153.067.224.1.007,0,.011,0,.011,0,.323.134.632.276.929.432.275.13.55.259.817.392.387.189.769.388,1.155.6.483.254.965.508,1.44.784.367.206.741.428,1.105.646q.877.529,1.744,1.094a51.712,51.712,0,0,1,7.594,6.027q1.7,1.617,3.258,3.4a51.451,51.451,0,0,1,4.536,6.019c.331.5.647,1.012.959,1.532.776,1.285,1.495,2.606,2.157,3.982C454.773,229.91,454.878,230.13,454.982,230.35Z"
          fill="#7f7f7f"
        />
        <path
          id="Path_130"
          data-name="Path 130"
          d="M372.314,238.822c.678,2.211-.016,4.575-.266,6.874s.194,5.042,2.233,6.134a4.877,4.877,0,0,0,3.244.337,6.28,6.28,0,0,0,4.926-4.307c.668-2.629-.819-5.266-2.16-7.623s-2.619-5.186-1.557-7.681c.691-1.627,2.272-2.771,2.864-4.437,2.367-6.671-8.035-8.067-11.837-5.017C363.085,228.457,370.756,233.742,372.314,238.822Z"
          fill="#7a7a7a"
        />
        <path
          id="Path_131"
          data-name="Path 131"
          d="M369.966,227.785a6.758,6.758,0,0,0,.665,2.558c1.118,2.535,2.937,4.776,3.607,7.465a13.214,13.214,0,0,1-.157,6.164,6.227,6.227,0,0,0-.264,1.816,2.73,2.73,0,0,0,4.34,2.018,4,4,0,0,0,1.1-4.222,26.316,26.316,0,0,0-1.912-4.213,14.173,14.173,0,0,1-.311-10.923,3.775,3.775,0,0,0,.427-2.653,2.476,2.476,0,0,0-1.326-1.25C373.653,223.388,369.9,224.69,369.966,227.785Z"
          fill="#60605e"
        />
        <path
          id="Path_132"
          data-name="Path 132"
          d="M377.137,285.211c1.492,3.159,3.645,6.368,6.985,7.394,2.024.621,4.249.353,6.251,1.043,3.707,1.278,6.066,5.614,9.974,5.936a22.885,22.885,0,0,0,3.957-.405c2.57-.238,5.112.534,7.669.889a23.963,23.963,0,0,0,11.115-1.1c2.862-.995,5.79-2.876,6.44-5.835.716-3.26-1.787-6.56-4.887-7.8s-6.592-.872-9.87-.245-6.574,1.5-9.9,1.229-6.787-1.994-8.019-5.1c-.543-1.368-.619-2.9-1.291-4.214-1.054-2.053-3.321-3.129-5.432-4.062-3.471-1.534-10.127-4.174-13.522-.937C373.329,275.143,375.546,281.842,377.137,285.211Z"
          fill="#7a7a7a"
        />
        <path
          id="Path_133"
          data-name="Path 133"
          d="M380.841,281.837a9.9,9.9,0,0,0,6.726,5.075c1.751.445,3.672.6,5.087,1.729,1.518,1.206,2.147,3.305,3.734,4.419,2.149,1.508,5.117.66,7.673,1.255A22.586,22.586,0,0,1,408.2,296.1a17.2,17.2,0,0,0,11.965.829,7.34,7.34,0,0,0,3.362-1.863,3.492,3.492,0,0,0,.836-3.586c-.692-1.669-2.768-2.2-4.563-2.4a86.981,86.981,0,0,0-13.516-.206c-3.737.154-8.052.112-10.444-2.762-1.25-1.5-1.694-3.5-2.557-5.249a11.99,11.99,0,0,0-8.5-6.371C380.725,273.806,379.39,278.645,380.841,281.837Z"
          fill="#60605e"
        />
        <path
          id="Path_134"
          data-name="Path 134"
          d="M402.317,207.048c1.913.233,3.733,1.282,5.648,1.07a22.09,22.09,0,0,0,3.366-1.035,7.484,7.484,0,0,1,8.29,3.468,3.833,3.833,0,0,1,.541,2.649,5.141,5.141,0,0,1-2.316,2.739c-1.577,1.138-3.741,2.268-5.321,1.135-1.011-.725-1.318-2.124-2.254-2.944a3.816,3.816,0,0,0-3.246-.665,16.947,16.947,0,0,0-3.211,1.194,22.451,22.451,0,0,1-4.95,1.44c-1.934.328-4.332.187-5.3-1.522C391.079,210.159,399.23,206.674,402.317,207.048Z"
          fill="#7a7a7a"
        />
        <path
          id="Path_135"
          data-name="Path 135"
          d="M395.752,211.072c-.6,1.09.412,2.495,1.619,2.787a6.4,6.4,0,0,0,3.623-.593,20.279,20.279,0,0,1,5.334-1.383,7.763,7.763,0,0,1,5.253,1.3,8.254,8.254,0,0,0,2.352,1.622,3.206,3.206,0,0,0,1.316.074,3.287,3.287,0,0,0,1.334-.443,2.97,2.97,0,0,0,1.069-3.426,4.255,4.255,0,0,0-2.762-2.518,7.721,7.721,0,0,0-3.833-.1c-1.924.376-3.814,1.185-5.766,1-1.785-.171-3.513-1.047-5.331-.576C398.689,209.145,396.4,209.888,395.752,211.072Z"
          fill="#60605e"
        />
        <path
          id="Path_136"
          data-name="Path 136"
          d="M435.468,265.583a5.121,5.121,0,0,0,1.561,4.147c.982.888,2.352,1.332,3.148,2.39.981,1.3.8,3.1.872,4.728a2.7,2.7,0,0,0,.553,1.753,2.814,2.814,0,0,0,2.413.53c1.742-.2,3.746-.886,4.228-2.571.334-1.169-.207-2.419-.069-3.627a5.484,5.484,0,0,1,2.23-3.377,16.151,16.151,0,0,0,3.072-2.77,6.727,6.727,0,0,0,.9-5.373c-.406-1.774-1.632-3.576-3.439-3.793a8.793,8.793,0,0,0-3.291.661,45.157,45.157,0,0,1-5.359.729C438.892,259.52,435.738,261.941,435.468,265.583Z"
          fill="#969898"
        />
        <path
          id="Path_137"
          data-name="Path 137"
          d="M435.179,265.514a5.126,5.126,0,0,0,1.56,4.148c.982.888,2.352,1.332,3.148,2.389.981,1.3.8,3.1.873,4.729a2.683,2.683,0,0,0,.553,1.752,2.814,2.814,0,0,0,2.413.53c1.741-.2,3.746-.885,4.227-2.57.335-1.17-.207-2.419-.069-3.627a5.486,5.486,0,0,1,2.23-3.378,16.116,16.116,0,0,0,3.072-2.769,6.719,6.719,0,0,0,.9-5.373c-.4-1.775-1.632-3.577-3.439-3.793a8.774,8.774,0,0,0-3.291.661,45.359,45.359,0,0,1-5.359.729C438.6,259.451,435.448,261.872,435.179,265.514Z"
          fill="#7a7a7a"
        />
        <path
          id="Path_138"
          data-name="Path 138"
          d="M438.993,261.645a1.362,1.362,0,0,0-.518.374,1.393,1.393,0,0,0-.2.6,5.443,5.443,0,0,0-.113,1.525c.15,1.322,1.206,2.331,2.191,3.226s2.029,1.927,2.141,3.253a5.511,5.511,0,0,1-.277,1.86,5.112,5.112,0,0,0-.252,1.862,1.778,1.778,0,0,0,1,1.492,1.681,1.681,0,0,0,1.045.028,2.313,2.313,0,0,0,1.367-1.036,4.7,4.7,0,0,0,.25-3.075,4.437,4.437,0,0,1,.312-3.061,5.233,5.233,0,0,1,1.931-1.468,15.2,15.2,0,0,0,2.818-2.077,5.622,5.622,0,0,0,1.229-1.508,2.511,2.511,0,0,0,.222-1.892,3.069,3.069,0,0,0-1.569-1.625,4.449,4.449,0,0,0-4.736.056c-.317.248-.587.555-.923.778a2.306,2.306,0,0,1-2.075.228A4.289,4.289,0,0,0,438.993,261.645Z"
          fill="#60605e"
        />
        <path
          id="Path_139"
          data-name="Path 139"
          d="M392.6,248.137c-.175,2.284-2.1,3.971-3.744,5.561a37.619,37.619,0,0,0-4.445,5.146,3.925,3.925,0,0,0-1.015,2.951,3.141,3.141,0,0,0,1.229,1.721,6.787,6.787,0,0,0,7.664.351c1.9-1.231,3.1-3.385,5.082-4.487a3.153,3.153,0,0,1,2.332-.419,5.483,5.483,0,0,1,1.485.839,9.623,9.623,0,0,0,9.607.505,5.4,5.4,0,0,0,2.105-1.8c1.42-2.234.149-5.208-1.519-7.264s-3.809-3.953-4.322-6.55c-.562-2.846,1.043-5.695,3.04-7.8a6.294,6.294,0,0,0,1.5-1.983,3.6,3.6,0,0,0-.756-3.443,8.67,8.67,0,0,0-2.989-2.118c-5.586-2.727-10.1-2.251-15.577.292-4.155,1.93-6.06,4.534-4.224,9.2C389.249,241.9,392.865,244.632,392.6,248.137Z"
          fill="#7a7a7a"
        />
        <path
          id="Path_140"
          data-name="Path 140"
          d="M362.06,236.931c.711,2.439-3.612,3.171-4.154,5.238a14.4,14.4,0,0,0,.56,8.62c.823,1.95,2.168,3.67,2.741,5.7a13.224,13.224,0,0,1-.261,6.772,8.134,8.134,0,0,1-2.544,4.716,4.907,4.907,0,0,1-1.917.854,52.63,52.63,0,0,1-2.214-20.231,53.882,53.882,0,0,1,1.143-7.339c.239-1.023.5-2.038.807-3.056.428-1.485.936-2.961,1.495-4.4a2.926,2.926,0,0,1,.326.022,5.734,5.734,0,0,1,3.179,1.927A2.829,2.829,0,0,1,362.06,236.931Z"
          fill="#7a7a7a"
        />
        <path
          id="Path_141"
          data-name="Path 141"
          d="M454.982,230.35l.1.2a12.5,12.5,0,0,1-6.07-.073c-1.687-.444-3.344-1.255-5.084-1.126a17.059,17.059,0,0,0-3.627,1.024,4.085,4.085,0,0,1-3.618-.327c-2-1.539-.772-4.973-2.2-7.063a5.151,5.151,0,0,0-4.037-1.836,23.614,23.614,0,0,1-4.579-.316c-1.486-.392-2.921-1.577-2.942-3.109-.024-1.362,1.031-2.466,1.96-3.464a36.784,36.784,0,0,0,4.346-5.655,3.161,3.161,0,0,0,.586-1.466,2.755,2.755,0,0,0-.388-1.348,8.33,8.33,0,0,0-.7-1.106c.079.028.153.067.224.1.007,0,.011,0,.011,0,.323.134.632.276.929.432.275.13.55.259.817.392.387.189.769.388,1.155.6.483.254.965.508,1.44.784.367.206.741.428,1.105.646q.877.529,1.744,1.094a51.712,51.712,0,0,1,7.594,6.027q1.7,1.617,3.258,3.4a51.451,51.451,0,0,1,4.536,6.019c.331.5.647,1.012.959,1.532.776,1.285,1.495,2.606,2.157,3.982C454.773,229.91,454.878,230.13,454.982,230.35Z"
          fill="#7a7a7a"
        />
        <path
          id="Path_142"
          data-name="Path 142"
          d="M429.494,215.643c-.495.279-1.141.538-1.2,1.1a1.251,1.251,0,0,0,.706,1.073,11.76,11.76,0,0,0,3.67,1.157,4.71,4.71,0,0,1,3.189,1.983,10.921,10.921,0,0,1,.665,2.468,2.257,2.257,0,0,0,1.608,1.809,8.126,8.126,0,0,0,1.6-.2,5.176,5.176,0,0,1,2.736,1.061,2.768,2.768,0,0,0,2.81.313c1-.662.874-2.216.254-3.242-1.667-2.759-5.7-3.637-6.844-6.648-.242-.634-.33-1.316-.546-1.959-.629-1.878-2.932-3.782-5.028-3.51C430.751,211.356,431.448,214.543,429.494,215.643Z"
          fill="#60605e"
        />
        <path
          id="Path_143"
          data-name="Path 143"
          d="M419.157,262.957a10.437,10.437,0,0,0,1.883-7.21,24.235,24.235,0,0,0-2.033-7.315,12.876,12.876,0,0,1-1.321-4.608,5.9,5.9,0,0,1,7.453-5.8,14.526,14.526,0,0,0,2.429.7c2.613.238,4.522-2.572,7.087-3.124a6.532,6.532,0,0,1,5.03,1.42c1.561,1.125,2.953,2.964,2.475,4.828-.43,1.673-2.151,2.619-3.705,3.371l-6.041,2.923a10.337,10.337,0,0,0-2.926,1.846c-1.874,1.881-2.022,4.842-1.877,7.493s.427,5.49-.887,7.8c-1.393,2.446-4.206,3.645-6.33,5.492a41.622,41.622,0,0,1-3.091,2.811,8.118,8.118,0,0,1-10.832-1.86c-2.938-4.106,2.729-4.1,5.419-4.69A12.46,12.46,0,0,0,419.157,262.957Z"
          fill="#7a7a7a"
        />
        <path
          id="Path_144"
          data-name="Path 144"
          d="M421.976,246.907c.312,1.779.948,3.5,1.136,5.295a21.507,21.507,0,0,1-.4,5.606,12.264,12.264,0,0,1-1.378,4.607c-2.17,3.5-7.039,3.917-10.479,6.175a2.187,2.187,0,0,0-1.1,1.331,1.649,1.649,0,0,0,1.395,1.7,4.628,4.628,0,0,0,2.376-.343c3.3-1.108,6.727-2.56,8.7-5.425,1.931-2.795,2.116-6.384,2.675-9.735a39.448,39.448,0,0,1,1.685-6.566,3.558,3.558,0,0,1,.657-1.264,3.062,3.062,0,0,1,.979-.654,28.6,28.6,0,0,1,4.774-1.385,8.1,8.1,0,0,0,4.288-2.367,3.641,3.641,0,0,0,.231-4.566c-1.392-1.57-3.962-1.068-5.835-.124s-3.812,2.247-5.877,1.875c-1.73-.311-2.669-.863-3.421.9A9.058,9.058,0,0,0,421.976,246.907Z"
          fill="#60605e"
        />
        <path
          id="Path_145"
          data-name="Path 145"
          d="M457.38,236.325c.078.223.152.438.219.657a52.947,52.947,0,0,1,2.468,17.929c-.028.8-.078,1.6-.144,2.4a14.96,14.96,0,0,1-4.158-2.5c-.56-.514-1.058-1.1-1.656-1.554-1.6-1.211-3.724-1.372-5.722-1.492l-4.587-.275a3.965,3.965,0,0,1-2.277-.611.74.74,0,0,1-.354-.63.909.909,0,0,1,.36-.552,14.742,14.742,0,0,0,1.522-1.371,22.629,22.629,0,0,0,1.971-3.461,15.117,15.117,0,0,1,2.887-3.152,20.293,20.293,0,0,1,5.621-3.966C454.8,237.224,456.162,236.949,457.38,236.325Z"
          fill="#7a7a7a"
        />
        <path
          id="Path_146"
          data-name="Path 146"
          d="M454.982,230.35l.1.2a50.245,50.245,0,0,1,2.3,5.771c.078.223.152.438.219.657a52.947,52.947,0,0,1,2.468,17.929c-.028.8-.078,1.6-.144,2.4-.1,1.255-.251,2.506-.445,3.74-.093.685-.216,1.365-.347,2.049-.26,1.331-.561,2.653-.926,3.959a51.5,51.5,0,0,1-1.837,5.523,52.3,52.3,0,0,1-3.707,7.552,53.256,53.256,0,0,1-3.025,4.564l-.008,0a53.114,53.114,0,0,1-27.571,19.215c31.09-43.762,7.932-85.424-4.967-102.908.647.13,1.3.267,1.946.423l.008,0c.459.107.911.217,1.359.339.37.094.731.192,1.1.3s.742.214,1.112.327c.421.125.835.254,1.248.4.492.157.984.332,1.468.511.395.147.79.294,1.18.452a.237.237,0,0,1,.105.044c.353.138.707.277,1.049.43a3.018,3.018,0,0,1,.312.131c.257.11.5.217.751.331.079.028.153.067.224.1.007,0,.011,0,.011,0,.323.134.632.276.929.432.275.13.55.259.817.392.387.189.769.388,1.155.6.483.254.965.508,1.44.784.367.206.741.428,1.105.646q.877.529,1.744,1.094a51.712,51.712,0,0,1,7.594,6.027q1.7,1.617,3.258,3.4a51.451,51.451,0,0,1,4.536,6.019c.331.5.647,1.012.959,1.532.776,1.285,1.495,2.606,2.157,3.982C454.773,229.91,454.878,230.13,454.982,230.35Z"
          opacity="0.05"
        />
        <path
          id="Path_147"
          data-name="Path 147"
          d="M383.005,300.273c-.16-.082-.331-.168-.494-.258-1.214-.621-2.393-1.306-3.553-2.028-.937-.587-1.859-1.2-2.742-1.847a50.764,50.764,0,0,1-5.9-4.889A52.826,52.826,0,0,1,360.058,277.5c-.3-.565-.577-1.137-.854-1.721s-.542-1.163-.789-1.743c-.48-1.109-.915-2.221-1.315-3.341-.22-.619-.421-1.239-.615-1.862a52.63,52.63,0,0,1-2.214-20.231,53.882,53.882,0,0,1,1.143-7.339c.239-1.023.5-2.038.807-3.056.428-1.485.936-2.961,1.495-4.4.542-1.381,1.133-2.738,1.784-4.068.231-.472.47-.947.72-1.419.285-.534.57-1.069.877-1.6.25-.434.5-.857.759-1.279.093-.156.179-.308.276-.456.248-.4.5-.785.76-1.177l.007,0c.272-.426.55-.837.84-1.243.275-.4.561-.795.85-1.183l.035-.045c.3-.4.613-.8.926-1.2.289-.37.589-.735.9-1.1.362-.431.731-.866,1.115-1.29.3-.339.614-.681.929-1.016l.058-.055c.345-.368.686-.725,1.046-1.082a.059.059,0,0,1,.024-.029c.348-.342.712-.691,1.068-1.036l.008,0c.444-.415.888-.83,1.354-1.237.275-.241.558-.487.844-.725s.569-.483.859-.714q.927-.745,1.9-1.458c.26-.2.53-.39.8-.572.313-.223.621-.434.937-.649s.628-.418.947-.626.643-.407.966-.606.62-.378.942-.558q2-1.187,4.14-2.2c.538-.255,1.08-.5,1.629-.736.523-.229,1.049-.451,1.575-.654.507-.2,1.01-.4,1.516-.58.231-.081.45-.167.677-.237.1-.036.189-.071.28-.1.774-.265,1.549-.512,2.326-.732.186-.06.374-.112.555-.161a.37.37,0,0,1,.083-.021c.416-.122.838-.23,1.261-.337.018,0,.041-.011.06-.011,1.105-.273,2.217-.513,3.328-.715.309-.053.607-.111.908-.161C385.12,213.57,355.435,249.822,383.005,300.273Z"
          fill="#fff"
          opacity="0.05"
        />
        <path
          id="Path_148"
          data-name="Path 148"
          d="M403.087,238.093c-.811,10.024-6.116,17.775-11.85,17.311s-9.724-8.966-8.913-18.991,6.116-17.775,11.85-17.311S403.9,228.068,403.087,238.093Z"
          fill="#fff"
          opacity="0.1"
        />
        <path
          id="Path_149"
          data-name="Path 149"
          d="M409.888,258.83c-.4,5.009-3.056,8.882-5.921,8.65s-4.859-4.48-4.454-9.489,3.056-8.882,5.921-8.651S410.293,253.821,409.888,258.83Z"
          fill="#fff"
          opacity="0.1"
        />
        <text x="290" y="350">
          Admission Management
        </text>
      </g>
      <animateMotion
        xlinkHref="#planet-admission-management"
        begin="-8s"
        dur="15s"
        repeatCount="indefinite"
        calcMode="linear"
      >
        <mpath xlinkHref="#ellipse_8" />
      </animateMotion>
    </>
  );
});
