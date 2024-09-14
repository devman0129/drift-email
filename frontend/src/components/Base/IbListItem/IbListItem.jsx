import React from 'react';
import classNames from 'classnames';
import './IbListItem.scss';

const IbListItem = (props) => {
  const getTimeDifference = (date) => {
    const receivedTime = new Date(date);
    return Math.round((Date.now() - receivedTime) / 3600000);
  };

  return (
    <div
      className={
        props.active ? classNames('IbListItem', 'active') : 'IbListItem'
      }
      onClick={props.onClick}
    >
      <div className="flex justify-between">
        <div className="ibl-name flex gap-2 text-left">
          {props?.from?.indexOf('<') >= 0
            ? props?.from?.slice(0, props?.from?.indexOf('<'))
            : props?.from}
          <p className="text-[#b5b5b5] font-normal">
            {props.count > 1 ? props.count : ''}
          </p>
        </div>
        <div className="ibl-date">{getTimeDifference(props.date)}hours ago</div>
      </div>
      <div className="ibl-subject text-left nooverflow">{props.subject}</div>
      <div className="ibl-body text-left nooverflow">{props.snippet}</div>
    </div>
  );
};

export default IbListItem;
