import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from 'react-bootstrap/Card';
import { Trash, FileText, Share } from 'react-bootstrap-icons';

import Tooltip from 'util/Tooltip';
import { utcToLocal } from 'util/helpers';

import style from './style.module.scss';

const propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.number,
      title: PropTypes.string.isRequired,
      updated_ts: PropTypes.string.isRequired,
      share: PropTypes.bool,
      user_name: PropTypes.string,
    }),
  ).isRequired,
  wholePage: PropTypes.bool,
  filtered: PropTypes.bool,
  noShare: PropTypes.bool,
  noDelete: PropTypes.bool,
  onShare: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const DocItemList = ({
  label,
  items,
  wholePage,
  filtered,
  noDelete,
  noShare,
  onShare,
  onSelect,
  onDelete,
}) => {
  return (
    <Card className={classNames(style.list, { [style.fullPage]: wholePage })}>
      <div className={style.tHead}>
        <div className={style.tr}>
          <div className={classNames(style.td, style.name)}>
            {filtered ? `Filtered ${label}` : `All ${label}`}
          </div>
          <div className={classNames(style.td, style.date)}>Last modified</div>
          <div className={classNames(style.td, style.action)}></div>
        </div>
      </div>
      <div className={style.tbody}>
        {!items.length && <span>{`No ${label}`}</span>}
        {items.map((item, index) => {
          const { id, title, updated_ts, shared, user_name } = item;
          return (
            <div
              key={index}
              className={classNames(style.tr, 'App-clickable')}
              onClick={() => onSelect(id)}
            >
              <div
                className={classNames(style.td, style.name, 'App-textOverflow')}
              >
                <FileText />
                <span>{title || ''}</span>
              </div>
              <div className={classNames(style.td, style.date)}>
                {utcToLocal(updated_ts)}
              </div>
              <div className={classNames(style.td, style.action)}>
                {shared && (
                  <b className="App-text-orange">
                    {user_name ? `Shared by ${user_name}` : 'Shared'}
                  </b>
                )}
                {!shared && !noShare && (
                  <ShareButton
                    className="mr-2 App-clickable"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare(id);
                    }}
                  />
                )}
                {!shared && !noDelete && (
                  <Trash
                    className="App-clickable"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(id);
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const ShareButton = ({ className, onClick }) => {
  return (
    <Tooltip title="Share">
      <Share className={classNames(className)} onClick={onClick} />
    </Tooltip>
  );
};

DocItemList.propTypes = propTypes;

export default DocItemList;
