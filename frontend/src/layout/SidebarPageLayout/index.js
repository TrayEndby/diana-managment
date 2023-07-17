import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import sidebarStyles from '../../util/SideBar/style.module.scss';
import style from './style.module.scss';
import Header from './Header';

const propTypes = {
  sideBar: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  caption: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  search: PropTypes.string,
  searchURL: PropTypes.string,
  btnText: PropTypes.string,
  btnOnClick: PropTypes.func,
  noHeader: PropTypes.bool,
  rightSidebar: PropTypes.bool,
  wideSidebar: PropTypes.bool,
  sidebarStyle: PropTypes.object,
  headerClassName: PropTypes.string,
  contentClassName: PropTypes.string,
};

const SidebarPageLayout = ({
  sideBar,
  caption,
  children,
  title,
  searchPlaceholder,
  search,
  searchURL,
  btnText,
  btnOnClick,
  noHeader,
  rightSidebar,
  wideSidebar,
  sidebarStyle,
  headerClassName,
  contentClassName,
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  };

  return (
    <section className="App-body overflow-hidden position-relative">
      <div
        className={cn(sidebarStyles.wrap, { 'flex-row-reverse': rightSidebar })}
      >
        <div
          className={cn(sidebarStyles.sidebar, 'sidebar', {
            [sidebarStyles.sidebarOpen]: isSidebarOpen,
            [sidebarStyles.wideSidebar]: wideSidebar,
          })}
          style={{ ...sidebarStyle }}
        >
          <div className={style.crossBtnWrap}>
            <button
              className={style.crossBtn}
              onClick={() => toggleSidebar()}
            ></button>
          </div>
          <div className={sidebarStyles.sidebarContent}>
            {caption && <div className={cn(style.caption, 'caption')}>{caption}</div>}
            {sideBar(toggleSidebar)}
          </div>
        </div>
        <div className={cn(style.contentWrap, 'contentWrap')}>
          <div className={style.header}>
            <button
              className={style.openBtn}
              onClick={() => toggleSidebar()}
            ></button>
            {!noHeader && (
              <Header
                title={title}
                searchPlaceholder={searchPlaceholder}
                search={search}
                searchURL={searchURL}
                btnText={btnText}
                btnOnClick={btnOnClick}
                className={headerClassName}
                emptyToClear
              />
            )}
          </div>
          <div
            className={cn(contentClassName, style.content, {
              [style.withHeader]: !noHeader,
            })}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

SidebarPageLayout.propTypes = propTypes;

export default SidebarPageLayout;
