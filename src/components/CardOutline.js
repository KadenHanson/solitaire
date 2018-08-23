import React, { Component } from 'react';

export class CardOutline extends Component {
    render() {
        return (
            <div
                style={{
                    width: '127px',
                    borderRadius: '5px',
                    height: '182px',
                    border: '2px solid black',
                    position: 'absolute',
                    padding: '5px',
                    left: -1,
                    top: -1
                }}
            />
        );
    }
}

export default CardOutline;