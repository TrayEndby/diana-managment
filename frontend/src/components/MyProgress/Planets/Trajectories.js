import React from 'react';
import './style.scss';

const STROKE_WIDTH = 5;
const OFFSET_11 = 5000;
const OFFSET_22 = 4580;
const OFFSET_33 = 4120;
const OFFSET_44 = 3647;
const OFFSET_55 = 3142;
const OFFSET_66 = 2640;
const OFFSET_77 = 2122;
const OFFSET_88 = 1492;

export default React.memo(({ percents }) => {
  const calcPercents = (percent, offset) => {
    return offset + (offset * percent) / 100;
  };

  return (
    <g>
      {/* PROGRESS  */}
      <path
        id="ellipse_11"
        d="M0.5,540a1000,540 0 1,0 2000,0a1000,540 0 1,0 -2000,0"
        strokeDasharray={calcPercents(percents.find((p) => p.id === 3)?.percent || 100, OFFSET_11)}
        strokeDashoffset={OFFSET_11}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <path
        id="ellipse_22"
        d="M0.5,475.5a916,475 0 1,0 1832,0a916,475 0 1,0 -1832,0"
        transform="translate(83 26)"
        strokeDasharray={calcPercents(percents.find((p) => p.id === 7)?.percent || 100, OFFSET_22)}
        strokeDashoffset={OFFSET_22}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <path
        id="ellipse_33"
        d="M0.5,417.5a824,417 0 1,0 1648,0a824,417 0 1,0 -1648,0"
        transform="translate(192 53)"
        strokeDasharray={calcPercents(percents.find((p) => p.id === 5)?.percent || 100, OFFSET_33)}
        strokeDashoffset={OFFSET_33}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <path
        id="ellipse_44"
        d="M0.5,359.5a729.5,359 0 1,0 1459,0a729.5,359 0 1,0 -1459,0"
        transform="translate(284 85)"
        strokeDasharray={calcPercents(percents.find((p) => p.id === 4)?.percent || 100, OFFSET_44)}
        strokeDashoffset={OFFSET_44}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <path
        id="ellipse_55"
        d="M0.5,304.5a628.5,304 0 1,0 1257,0a628.5,304 0 1,0 -1257,0"
        transform="translate(385 120)"
        strokeDasharray={calcPercents(percents.find((p) => p.id === 6)?.percent || 100, OFFSET_55)}
        strokeDashoffset={OFFSET_55}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <path
        id="ellipse_66"
        d="M0.5,248.5a528,248 0 1,0 1056,0a528,248 0 1,0 -1056,0"
        transform="translate(494 160)"
        strokeDasharray={calcPercents(percents.find((p) => p.id === 2)?.percent || 100, OFFSET_66)}
        strokeDashoffset={OFFSET_66}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <path
        id="ellipse_77"
        d="M0.5,188.5a424.5,188 0 1,0 849,0a424.5,188 0 1,0 -849,0"
        transform="translate(591 211)"
        strokeDasharray={calcPercents(percents.find((p) => p.id === 9)?.percent || 100, OFFSET_77)}
        strokeDashoffset={OFFSET_77}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <path
        id="ellipse_88"
        d="M0.5,120a298.5,119.5 0 1,0 597,0a298.5,119.5 0 1,0 -597,0"
        transform="translate(718 271)"
        strokeDasharray={calcPercents(percents.find((p) => p.id === 8)?.percent || 100, OFFSET_88)}
        strokeDashoffset={OFFSET_88}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      {/* END PROGRESS  */}

      <path
        id="ellipse_1"
        d="M0.5,540a1000,540 0 1,0 2000,0a1000,540 0 1,0 -2000,0"
        stroke="#707070"
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />

      <path
        id="ellipse_2"
        d="M0.5,475.5a916,475 0 1,0 1832,0a916,475 0 1,0 -1832,0"
        transform="translate(83 26)"
        stroke="#707070"
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />

      <path
        id="ellipse_3"
        d="M0.5,417.5a824,417 0 1,0 1648,0a824,417 0 1,0 -1648,0"
        transform="translate(192 53)"
        stroke="#707070"
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <path
        id="ellipse_4"
        d="M0.5,359.5a729.5,359 0 1,0 1459,0a729.5,359 0 1,0 -1459,0"
        transform="translate(284 85)"
        stroke="#707070"
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <path
        id="ellipse_5"
        d="M0.5,304.5a628.5,304 0 1,0 1257,0a628.5,304 0 1,0 -1257,0"
        transform="translate(385 120)"
        stroke="#707070"
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <path
        id="ellipse_6"
        d="M0.5,248.5a528,248 0 1,0 1056,0a528,248 0 1,0 -1056,0"
        transform="translate(494 160)"
        stroke="#707070"
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <path
        id="ellipse_7"
        d="M0.5,188.5a424.5,188 0 1,0 849,0a424.5,188 0 1,0 -849,0"
        transform="translate(591 211)"
        stroke="#707070"
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <path
        id="ellipse_8"
        d="M0.5,120a298.5,119.5 0 1,0 597,0a298.5,119.5 0 1,0 -597,0"
        transform="translate(718 271)"
        stroke="#707070"
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
    </g>
  );
});
