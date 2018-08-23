import React, { Component } from 'react';
import { Card } from '../components/Card';
import { DragSource } from 'react-dnd';

const images = {
    spades: {
        2: require('../images/card_images/2_of_spades.png'),
        3: require('../images/card_images/3_of_spades.png'),
        4: require('../images/card_images/4_of_spades.png'),
        5: require('../images/card_images/5_of_spades.png'),
        6: require('../images/card_images/6_of_spades.png'),
        7: require('../images/card_images/7_of_spades.png'),
        8: require('../images/card_images/8_of_spades.png'),
        9: require('../images/card_images/9_of_spades.png'),
        10: require('../images/card_images/10_of_spades.png'),
        'jack': require('../images/card_images/jack_of_spades.png'),
        'queen': require('../images/card_images/queen_of_spades.png'),
        'king': require('../images/card_images/king_of_spades.png'),
        'ace': require('../images/card_images/ace_of_spades.png'),
    },
    clubs: {
        2: require('../images/card_images/2_of_clubs.png'),
        3: require('../images/card_images/3_of_clubs.png'),
        4: require('../images/card_images/4_of_clubs.png'),
        5: require('../images/card_images/5_of_clubs.png'),
        6: require('../images/card_images/6_of_clubs.png'),
        7: require('../images/card_images/7_of_clubs.png'),
        8: require('../images/card_images/8_of_clubs.png'),
        9: require('../images/card_images/9_of_clubs.png'),
        10: require('../images/card_images/10_of_clubs.png'),
        'jack': require('../images/card_images/jack_of_clubs.png'),
        'queen': require('../images/card_images/queen_of_clubs.png'),
        'king': require('../images/card_images/king_of_clubs.png'),
        'ace': require('../images/card_images/ace_of_clubs.png'),
    },
    diamonds: {
        2: require('../images/card_images/2_of_diamonds.png'),
        3: require('../images/card_images/3_of_diamonds.png'),
        4: require('../images/card_images/4_of_diamonds.png'),
        5: require('../images/card_images/5_of_diamonds.png'),
        6: require('../images/card_images/6_of_diamonds.png'),
        7: require('../images/card_images/7_of_diamonds.png'),
        8: require('../images/card_images/8_of_diamonds.png'),
        9: require('../images/card_images/9_of_diamonds.png'),
        10: require('../images/card_images/10_of_diamonds.png'),
        'jack': require('../images/card_images/jack_of_diamonds.png'),
        'queen': require('../images/card_images/queen_of_diamonds.png'),
        'king': require('../images/card_images/king_of_diamonds.png'),
        'ace': require('../images/card_images/ace_of_diamonds.png'),
    },
    hearts: {
        2: require('../images/card_images/2_of_hearts.png'),
        3: require('../images/card_images/3_of_hearts.png'),
        4: require('../images/card_images/4_of_hearts.png'),
        5: require('../images/card_images/5_of_hearts.png'),
        6: require('../images/card_images/6_of_hearts.png'),
        7: require('../images/card_images/7_of_hearts.png'),
        8: require('../images/card_images/8_of_hearts.png'),
        9: require('../images/card_images/9_of_hearts.png'),
        10: require('../images/card_images/10_of_hearts.png'),
        'jack': require('../images/card_images/jack_of_hearts.png'),
        'queen': require('../images/card_images/queen_of_hearts.png'),
        'king': require('../images/card_images/king_of_hearts.png'),
        'ace': require('../images/card_images/ace_of_hearts.png'),
    }
}

const Types = {
    ITEM: 'CardContainer'
}

const itemSource = {
    beginDrag(props) {
        return {
            suit: props.Suit,
            value: props.Value,
            index: props.Index
        };
    },
    canDrag(props, monitor) {
        return props.CanDrag ? true : false
    },
    endDrag(props, monitor) {
        var result = monitor.getDropResult();

        return result === null ? props.MoveItem({ suit: props.Suit, value: props.value }) : props.MoveItem(result);
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

class CardContainer extends Component {
    constructor(props) {
        super(props);
        this.getImageName = this.getImageName.bind(this);
        this.handleTopCardClick = this.handleTopCardClick.bind(this);

        this.state = {
            suit: props.Suit,
            value: props.Value,
            image: '',
            showBack: props.ShowBack,
            zIndex: props.ZIndex,
            Index: props.Index,
            extraTop: props.ExtraTop,
            arrayLength: props.ArrayLength,
            drawCard: props.DrawCard,
            topDrawCard: props.TopDrawCard,
            upperCard: props.UpperCard,
            usedDrawCard: props.UsedDrawCard
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            showBack: nextProps.ShowBack,
            image: this.getImageName(this.state.suit, this.state.value, nextProps.ShowBack),
            extraTop: nextProps.ExtraTop,
            zIndex: nextProps.ZIndex,
            Index: nextProps.Index,
            drawCard: nextProps.DrawCard,
            topDrawCard: nextProps.TopDrawCard,
            upperCard: nextProps.UpperCard,
            usedDrawCard: nextProps.UsedDrawCard
        });
    }

    componentWillMount() {
        this.setState({ image: this.getImageName(this.state.suit, this.state.value, this.state.showBack) });
    }

    getImageName(suit, value, showBack) {
        return showBack ? require('../images/card_images/back@2x.png') : images[suit][value];
    }

    handleTopCardClick() {
        return this.state.topDrawCard ? this.props.MoveDrawCards() : null;
    }

    render() {
        const { connectDragSource, isDragging } = this.props;
        
        return connectDragSource(
            <div
                style={{
                    display: 'inline-block',
                    cursor: this.state.showBack ? (this.state.topDrawCard ? 'pointer' : 'default') : 'grab',
                    position: 'absolute',
                    top: this.state.drawCard || this.state.upperCard ? 0 : (this.state.Index * 15) + this.state.extraTop,
                    zIndex: !this.state.usedDrawCard ? this.state.zIndex : 0,
                    minWidth: '137px',
                    left: this.state.drawCard && !this.state.usedDrawCard ? (this.state.showBack ? this.state.Index * 2 : this.state.Index * 25) : 0
                }}
                onClick={this.handleTopCardClick}
            >
                <Card Image={this.state.image} Suit={this.state.suit} Value={this.state.value} />
                {isDragging ? this.props.ShowDropSpots(this.state.suit, this.state.value) : null}
            </div>
        );
    }
}

export default DragSource(Types.ITEM, itemSource, collect)(CardContainer);