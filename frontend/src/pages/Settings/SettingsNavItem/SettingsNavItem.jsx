import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import './SettingsNavItem.scss';

const SettingsNavItem = (props) => {
  const navigator = useNavigate();

  return (
    <div
      className={
        props.active
          ? classNames('SettingsNavItem', 'active')
          : 'SettingsNavItem'
      }
      onClick={() => {
        navigator(props.link);
      }}
    >
      {props.text}
    </div>
  );
};

export default SettingsNavItem;
