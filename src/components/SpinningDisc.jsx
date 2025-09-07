import React from 'react';
import './SpinningDisc.css';

const SpinningDisc = ({ small }) => {
  const discSize = small ? 'disc-small' : 'disc-large';
  return (
    <div className={`disc ${discSize}`}>
      <div className="disc_cover"></div>
    </div>
  );
};

export default SpinningDisc;
