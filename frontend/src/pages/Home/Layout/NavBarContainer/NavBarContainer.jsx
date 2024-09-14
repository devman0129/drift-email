import React from 'react';

import NavBarTopContainer from './NavBarTopContainer';
import NavBarBottomContainer from './NavBarBottomContainer';

import './NavBarContainer.scss';

const NavBarContainer = () => {
  return (
    <div className="navbar-container flex flex-col justify-between">
      <NavBarTopContainer />
      <NavBarBottomContainer />
    </div>
  );
};

export default NavBarContainer;
