import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

const INITIAL_NUM_SHOW = 20;
const INC_NUM = 30;

// props
const withInfiniteList = (Component) => (props) => {
  const [numToShow, setNumToShow] = useState(INITIAL_NUM_SHOW);
  let { view, className, items, selectedItem, onClickItem, style, loadMore, totalResults, ...rest } = props;
  const customLoadMore = typeof loadMore === 'function';
  let hasMore = null;
  let slicedItems = null;
  if (!customLoadMore) {
    loadMore = () => {
      setNumToShow(Math.min(numToShow + INC_NUM, items.length));
    };
    slicedItems = items.slice(0, numToShow);
    hasMore = numToShow < items.length;
  } else {
    slicedItems = items;
    hasMore = items.length < totalResults;
  }
  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      hasMore={hasMore}
      loader={
        <div className="loader ml-1" key={0}>
          Loading ...
        </div>
      }
      useWindow={false}
      className={className}
      style={style}
    >
      {slicedItems.map((item, index) => (
        <Component
          {...rest}
          key={index}
          view={view}
          item={item}
          selectedItem={selectedItem}
          onClick={() => onClickItem(item)}
        />
      ))}
    </InfiniteScroll>
  );
};

export default withInfiniteList;
