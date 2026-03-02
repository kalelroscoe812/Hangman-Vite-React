import React from 'react';

class LetterBox extends React.Component {
  render() {
    const { letter, isVisible, boxStyle, letterStyle } = this.props;

    const defaultBoxStyle = {
      border: '1px solid black',
      width: '50px',
      height: '50px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '0 4px',
      background: '#fff',
      borderRadius: '6px',
    };

    const defaultLetterStyle = {
      visibility: 'visible',
    };

    const combinedBoxStyle = { ...defaultBoxStyle, ...boxStyle };
    const combinedLetterStyle = { ...defaultLetterStyle, ...letterStyle };

    return (
      <div className="letter-box" style={combinedBoxStyle} aria-hidden={!isVisible}>
        <span style={combinedLetterStyle}>{letter}</span>
      </div>
    );
  }
}

export default LetterBox;
