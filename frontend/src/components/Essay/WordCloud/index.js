import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import WordCloud from 'react-d3-cloud';
import useIsMountedRef from 'util/hooks/useIsMountedRef';

const propTypes = {
  show: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf({
    text: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

const fontSizeMapper = (word) => Math.log2(word.value) * 2.5;
const rotate = () => 0;

const WordCloudSection = ({ data, width, height }) => {
  const [show, setShow] = useState(false);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    setTimeout(() => {
      if (isMountedRef.current) {
        setShow(true);
      }
    }, 500);
  }, [isMountedRef]);

  return (
    <div>
      {!show && <div className="text-white p-2">Loading...</div>}
      {show && <WordCloud data={data} fontSizeMapper={fontSizeMapper} rotate={rotate} width={width} height={height} />}
    </div>
  );
};

WordCloudSection.propTypes = propTypes;

export default React.memo(WordCloudSection);
