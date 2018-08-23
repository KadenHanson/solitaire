import React, { Component } from 'react';

export class Card extends Component {
    constructor(props) {
        super(props);

        this.state = {
            suit: props.Suit,
            value: props.Value,
            image: props.Image,
            isFacing: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            image: nextProps.Image
        });
    }

    render() {
        return (
            <div style={{ width: 125, display: 'inline-block' }}>
                <img src={this.state.image} alt={`${this.state.value} of ${this.state.suit} card`} className="card" />
            </div>
        );
    }
}

export default Card;