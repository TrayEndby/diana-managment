import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

// props
const withInfiniteApiList = (Component) => (props) => {
  let { className, items, selectedItem, onClickItem, loadMore, totalResults, ...rest } = props;

  let children = items.map((item, index) => (
    <Component
      {...rest}
      key={index}
      item={item}
      selectedItem={selectedItem}
      onClick={() => onClickItem(item)}
    />
  ));

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      hasMore={items.length < totalResults}
      loader={
        <div className="loader ml-1 text-dark text-center" key={0}>
          Loading ...
        </div>
      }
      useWindow={false}
    >
      {children}
    </InfiniteScroll>
  );
};

export default withInfiniteApiList;
