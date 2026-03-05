import React from 'react';
import noose from '../assets/noose.png';
import upperbody from '../assets/upperbody.png';
import oneArm from '../assets/1arm.png';
import bothArms from '../assets/botharms.png';
import oneLeg from '../assets/1leg.png';
import dead from '../assets/Dead.png';

const HangmanFigure = ({ wrongGuesses }) => {

  const getImageSrc = () => {
    switch (wrongGuesses) {
      case 0:
        return null;
      case 1:
        return noose;
      case 2:
        return upperbody;
      case 3:
        return oneArm;
      case 4:
        return bothArms;
      case 5:
        return oneLeg;
      case 6:
      default:
        return dead;
    }
  };

  const imageSrc = getImageSrc();

  return (
    <div className="hangman-figure">
      {imageSrc && <img src={imageSrc} alt={`Hangman state ${wrongGuesses}`} />}
    </div>
  );
};

export default HangmanFigure;
