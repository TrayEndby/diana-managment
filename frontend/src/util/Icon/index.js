import React from 'react';
import hands from "../../assets/svg/hands.svg"
import style from './style.module.scss';

const Icon = ({ color, variant }) => {
  switch (variant) {
    case 'educators':
      return <Educators />;
    case 'redTriangle':
      return <RedTriangle />;
    default:
      return null;
  }
};

export default Icon;

const Educators = () => {
  return (
    <div className="hands" aria-hidden="true" >
      <object className={style.hands} data={hands} type="image/svg+xml" aria-label="hands"></object>
    </div>
  )
};

const RedTriangle = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="36"
      viewBox="0 0 42 36"
    >
      <defs>
        <mask id="vdz6b" width="2" height="2" x="-1" y="-1">
          <path fill="#fff" d="M4 1h34v27H4z"></path>
          <path d="M21 1l17 27H4z"></path>
        </mask>
        <filter
          id="vdz6a"
          width="66"
          height="62"
          x="-12"
          y="-15"
          filterUnits="userSpaceOnUse"
        >
          <feOffset
            dy="3"
            in="SourceGraphic"
            result="FeOffset1025Out"
          ></feOffset>
          <feGaussianBlur
            in="FeOffset1025Out"
            result="FeGaussianBlur1026Out"
            stdDeviation="2.4 2.4"
          ></feGaussianBlur>
        </filter>
      </defs>
      <g filter="url(#vdz6a)">
        <path fill="none" d="M21 1l17 27H4z" mask='url("#vdz6b")'></path>
        <path fillOpacity="0.16" d="M21 1l17 27H4z"></path>
      </g>
      <path fill="#f78154" d="M21 1l17 27H4z"></path>
      <g>
        <text
          dominantBaseline="text-before-edge"
          style={{ lineHeight: 32, fontKerning: "normal" }}
          fill="#fff"
          fontFamily="'Avenir','Avenir-Heavy'"
          fontSize="18"
          transform="translate(18 5)"
        >
          <tspan>!</tspan>
        </text>
      </g>
    </svg>
  );
};

export const SidebarCloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="41"
      height="41"
      viewBox="0 0 41 41"
      className="App-clickable"
    >
      <g data-name="Group 2440" transform="translate(-453 -89)">
        <path
          fill="#d6d6d6"
          d="M20.5 0A20.5 20.5 0 110 20.5 20.5 20.5 0 0120.5 0z"
          data-name="Path 1644"
          transform="translate(453 89)"
        ></path>
        <g
          stroke="#585858"
          strokeWidth="2"
          data-name="Group 2439"
          transform="translate(463 100.726) translate(2 1.274)"
        >
          <path d="M0 0L17 17" data-name="Line 9"></path>
          <path d="M0 17L17 0" data-name="Line 10"></path>
        </g>
      </g>
    </svg>
  )
}

export const SidebarOpenIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      className="App-clickable"
    >
      <g data-name="Group 2441" transform="translate(-10 -88)">
        <path
          fill="#d6d6d6"
          d="M24 0A24 24 0 110 24 24 24 0 0124 0z"
          data-name="Path 1290"
          transform="translate(10 88)"
        ></path>
        <g fill="#5f5f5f" transform="translate(21 102.065)">
          <path
            d="M4.321 2.16A2.16 2.16 0 112.16 0a2.16 2.16 0 012.161 2.16zm0 0"
            data-name="Path 1646"
          ></path>
          <path
            d="M4.321 172.828a2.16 2.16 0 11-2.16-2.16 2.16 2.16 0 012.16 2.16zm0 0"
            data-name="Path 1647"
            transform="translate(0 -162.027)"
          ></path>
          <path
            d="M4.321 343.492a2.16 2.16 0 11-2.16-2.16 2.16 2.16 0 012.16 2.16zm0 0"
            data-name="Path 1648"
            transform="translate(0 -324.05)"
          ></path>
          <path
            d="M150.412 23.492h16.2a1.08 1.08 0 000-2.16h-16.2a1.08 1.08 0 100 2.16zm0 0"
            data-name="Path 1649"
            transform="translate(-141.771 -20.252)"
          ></path>
          <path
            d="M166.615 192h-16.2a1.08 1.08 0 100 2.16h16.2a1.08 1.08 0 000-2.16zm0 0"
            data-name="Path 1650"
            transform="translate(-141.771 -182.279)"
          ></path>
          <path
            d="M166.615 362.668h-16.2a1.08 1.08 0 100 2.16h16.2a1.08 1.08 0 100-2.16zm0 0"
            data-name="Path 1651"
            transform="translate(-141.771 -344.305)"
          ></path>
        </g>
      </g>
    </svg>
  )
}

export const EditPencilGrey = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="App-clickable" width="49" height="49" viewBox="0 0 49 49">
      <g id="Edit-gray" transform="translate(-423 -142)">
        <path id="Path_1290" data-name="Path 1290" d="M24.5,0A24.5,24.5,0,1,1,0,24.5,24.5,24.5,0,0,1,24.5,0Z" transform="translate(423 142)" fill="#d6d6d6" />
        <g id="pencil-edit-button" transform="translate(437 154.711)">
          <path id="Path_1280" data-name="Path 1280" d="M13.949,5.014l4.563,4.563L6.962,21.127,2.4,16.564Zm8.025-1.1L19.939,1.879a2.019,2.019,0,0,0-2.853,0L15.138,3.828,19.7,8.391l2.274-2.274A1.556,1.556,0,0,0,21.974,3.913ZM.013,22.978a.519.519,0,0,0,.628.618l5.085-1.233L1.166,17.8Z" transform="translate(0)" fill="#7e7e7e" />
        </g>
      </g>
    </svg>
  )
}

export const EditPencilOrange = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="App-clickable" width="42.215" height="42.215" viewBox="0 0 42.215 42.215">
      <g id="Edit-orange" transform="translate(-375 -207.785)">
        <path id="Path_1305" data-name="Path 1305" d="M21.107,0A21.107,21.107,0,1,1,0,21.107,21.107,21.107,0,0,1,21.107,0Z" transform="translate(375 207.785)" fill="#fde8df" />
        <g id="pencil-edit-button" transform="translate(387 218.126)">
          <path id="Path_1280" data-name="Path 1280" d="M11.815,4.444,15.68,8.309,5.9,18.092,2.034,14.227Zm6.8-.932L16.889,1.788a1.71,1.71,0,0,0-2.416,0L12.822,3.439,16.687,7.3l1.926-1.926A1.318,1.318,0,0,0,18.613,3.512ZM.011,19.66a.44.44,0,0,0,.532.523L4.85,19.139.987,15.274Z" transform="translate(0)" fill="#f78153" />
        </g>
      </g>
    </svg>
  )
}

export const EditPencilGreen = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
    >
      <path
        fill="#c8e2c4"
        d="M0 15C0 6.716 6.716 0 15 0c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15-8.284 0-15-6.716-15-15z"
      ></path>
      <path
        fill="#53a548"
        d="M8.008 22.898c-.055.25.17.474.42.413l3.404-.825-3.052-3.055zM22.71 10.136l-1.362-1.363a1.352 1.352 0 00-1.91 0l-1.304 1.305 3.054 3.055 1.522-1.522a1.041 1.041 0 000-1.475zM9.607 18.604l3.053 3.055 7.732-7.732-3.055-3.055z"
      ></path>
    </svg>
  );
}

export const AddPlusOrange = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="App-clickable" width="42.215" height="42.215" viewBox="0 0 42.215 42.215">
      <g id="Plus-orange" transform="translate(-375 -207.785)">
        <path id="Path_1305" data-name="Path 1305" d="M21.107,0A21.107,21.107,0,1,1,0,21.107,21.107,21.107,0,0,1,21.107,0Z" transform="translate(375 207.785)" fill="#fde8df" />
        <g id="plus" transform="translate(386 218.568)">
          <g id="Group_2090" data-name="Group 2090">
            <path id="Path_1296" data-name="Path 1296" d="M19.634,9.418h-8.62V.8a.8.8,0,1,0-1.6,0v8.62H.8a.8.8,0,1,0,0,1.6h8.62v8.62a.8.8,0,0,0,1.6,0v-8.62h8.62a.8.8,0,0,0,0-1.6Z" fill="#f78153" />
          </g>
        </g>
      </g>
    </svg>
  )
}

export const AddPlusGreen = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39">
      <g>
        <g>
          <g>
            <path fill="#53a548" fillOpacity=".24" d="M0 19.5C0 8.73 8.73 0 19.5 0S39 8.73 39 19.5 30.27 39 19.5 39 0 30.27 0 19.5z" /></g><g><g><g><path fill="#53a548" d="M28.634 18.986h-8.62v-8.62a.798.798 0 1 0-1.596 0v8.62h-8.62a.798.798 0 1 0 0 1.596h8.62v8.62a.798.798 0 1 0 1.596 0v-8.62h8.62a.798.798 0 1 0 0-1.596z" />
            </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export const AddPlusWhite = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 33 33"
    >
      <defs>
        <clipPath id="i2r0a">
          <path
            fill="#fff"
            d="M0 16.5C0 7.387 7.387 0 16.5 0S33 7.387 33 16.5 25.613 33 16.5 33 0 25.613 0 16.5z"
          ></path>
        </clipPath>
      </defs>
      <path
        fill="#e3e3e3"
        d="M24.336 15.836h-7.172V8.664a.664.664 0 10-1.328 0v7.172H8.664a.664.664 0 100 1.328h7.172v7.172a.664.664 0 101.328 0v-7.172h7.172a.664.664 0 100-1.328z"
      ></path>
      <path
        fill="none"
        stroke="gray"
        strokeMiterlimit="20"
        strokeWidth="2"
        d="M0 16.5C0 7.387 7.387 0 16.5 0S33 7.387 33 16.5 25.613 33 16.5 33 0 25.613 0 16.5z"
        clipPath='url("#i2r0a")'
      ></path>
    </svg>
  )
}

export const SendMessage = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="37"
      height="27"
      viewBox="0 0 37 27"
    >
      <g transform="translate(-1746 -928)">
        <g data-name="Group 2114" transform="translate(1058.004 431.445)">
          <rect
            width="37"
            height="27"
            fill="#53a548"
            data-name="Rectangle 684"
            rx="2"
            transform="translate(687.996 496.555)"
          ></rect>
        </g>
        <g transform="translate(1757 896.307)">
          <g data-name="send" transform="translate(0 37.25)">
            <path
              fill="#fff"
              d="M0 55.693l17.916-8.722L0 38.25v6.784l12.8 1.938L0 48.91z"
              data-name="Path 1385"
              transform="translate(0 -38.25)"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  )
}

export const Like = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      viewBox="0 0 21 20"
    >
      <path
        fillOpacity="0.36"
        d="M2.138 8.55A2.14 2.14 0 000 10.688v6.84a2.14 2.14 0 002.138 2.138h2.565c.481 0 .924-.162 1.282-.433V8.55zM20.521 11.757c0-.514-.203-.993-.556-1.346a2.126 2.126 0 00.547-1.632c-.1-1.087-1.08-1.939-2.23-1.939H13c.262-.794.68-2.25.68-3.42 0-1.854-1.575-3.42-2.564-3.42-.889 0-1.523.5-1.55.52a.43.43 0 00-.16.335v2.9L6.943 9.088l-.103.052v9.165c.696.328 1.577.505 2.138.505h7.849c.93 0 1.746-.628 1.937-1.494a1.923 1.923 0 00-.155-1.284 1.915 1.915 0 00.856-2.566 1.914 1.914 0 001.056-1.71z"
      ></path>
    </svg>
  );
}


export const Dislike = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      viewBox="0 0 21 20"
    >
      <path
        fillOpacity="0.36"
        d="M18.335 11.398a2.14 2.14 0 002.211-2.061l.239-6.837A2.14 2.14 0 0018.723.29L16.16.2c-.48-.017-.929.13-1.296.388l-.373 10.676zM.075 7.552c-.018.514.168 1 .509 1.365a2.123 2.123 0 00-.604 1.612c.062 1.09 1.01 1.975 2.161 2.015l5.279.184c-.29.785-.76 2.226-.8 3.395-.065 1.853 1.455 3.473 2.444 3.507.888.031 1.54-.446 1.568-.466a.43.43 0 00.171-.329l.101-2.897 2.647-5.246.105-.048.32-9.16c-.684-.352-1.558-.56-2.119-.579L4.013.631c-.93-.032-1.767.567-1.988 1.426-.114.441-.072.892.11 1.289A1.915 1.915 0 001.19 5.88 1.914 1.914 0 00.075 7.552z"
      ></path>
    </svg>
  );
}

export const AddUser = ({ onClick }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="33"
      viewBox="0 0 33 33"
      onClick={onClick}
      title="Invite friends"
    >
      <path
        id="add-group"
        d="M33,27.586H27.586V33H25.008V27.586H19.594V25.008h5.414V19.594h2.578v5.414H33ZM19.291,14.4a7.278,7.278,0,0,1-2.411,7.143l.136.054v2.849a9.67,9.67,0,0,0-4.641-1.18v0h-.064v0A9.743,9.743,0,0,0,2.578,33H0A12.33,12.33,0,0,1,7.588,21.632a7.282,7.282,0,0,1,5.989-12.8A7.267,7.267,0,1,1,25.3,12.863a12.151,12.151,0,0,1,5.3,4.088H27.137a9.692,9.692,0,0,0-5.947-2.436c-.171.012-.343.019-.517.019A7.266,7.266,0,0,1,19.291,14.4ZM15.984,7.267a4.689,4.689,0,1,0,4.689-4.689A4.694,4.694,0,0,0,15.984,7.267Zm.9,8.718a4.705,4.705,0,1,0-4.705,4.705A4.71,4.71,0,0,0,16.887,15.984Zm0,0"
        fill="rgba(0,0,0,0.49)"
      />
    </svg>
  );
}
