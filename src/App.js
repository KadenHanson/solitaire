import React, { Component } from 'react';
import './App.css';
import CardContainer from './containers/CardContainer';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import DropSpot from './components/DropSpot';
import { CardOutline } from './components/CardOutline';

class App extends Component {
    constructor(props) {
        super(props);
        this.generateCards = this.generateCards.bind(this);
        this.shuffleCards = this.shuffleCards.bind(this);
        this.splitCards = this.splitCards.bind(this);
        this.mapCards = this.mapCards.bind(this);
        this.showDropSpots = this.showDropSpots.bind(this);
        this.checkIfExists = this.checkIfExists.bind(this);
        this.moveItem = this.moveItem.bind(this);
        this.validMove = this.validMove.bind(this);
        this.mapDrawCards = this.mapDrawCards.bind(this);
        this.moveDrawCards = this.moveDrawCards.bind(this);
        this.resetDrawCards = this.resetDrawCards.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.formatTime = this.formatTime.bind(this);
        this.findSpot = this.findSpot.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.finishWinningGame = this.finishWinningGame.bind(this);
        this.setBestScore = this.setBestScore.bind(this);

        this.state = {
            deck: [],
            drawCards: [],
            col_1: [],
            col_2: [],
            col_3: [],
            col_4: [],
            col_5: [],
            col_6: [],
            col_7: [],
            up_1: [],
            up_2: [],
            up_3: [],
            up_4: [],
            upDrawCards: [],
            usedDrawCards: [],
            showUpperDrops: false,
            time: 0,
            timeStarted: false
        };
    }

    componentWillMount() {
        var _deck = this.generateCards();

        this.setState({
            deck: _deck,
            col_1: this.splitCards(1, _deck),
            col_2: this.splitCards(2, _deck),
            col_3: this.splitCards(3, _deck),
            col_4: this.splitCards(4, _deck),
            col_5: this.splitCards(5, _deck),
            col_6: this.splitCards(6, _deck),
            col_7: this.splitCards(7, _deck),
            drawCards: this.splitCards(0, _deck),
            upDrawCards: []
        });

        document.body.addEventListener('click', this.startTimer);
    }

    resetGame() {
        this.stopTimer();
        var _deck = this.generateCards();

        this.setState({
            deck: _deck,
            col_1: this.splitCards(1, _deck),
            col_2: this.splitCards(2, _deck),
            col_3: this.splitCards(3, _deck),
            col_4: this.splitCards(4, _deck),
            col_5: this.splitCards(5, _deck),
            col_6: this.splitCards(6, _deck),
            col_7: this.splitCards(7, _deck),
            up_1: [],
            up_2: [],
            up_3: [],
            up_4: [],
            drawCards: this.splitCards(0, _deck),
            upDrawCards: [],
            usedDrawCards: [],
            showUpperDrops: false,
            time: 0,
            timeStarted: false
        });
    }

    // Starts timer for the game
    startTimer() {
        if (!this.state.timeStarted) {
            this.timer = setInterval(() => this.setState({
                time: this.state.time + 1
            }), 1000);
            this.setState({ timeStarted: true });
        }
    }

    // Stops timer for the game
    stopTimer() {
        clearInterval(this.timer);
    }

    // Validates the move trying to be made.
    validMove(item) {
        if (item.drawCard && item.findSpotCheck) {
            if (this.checkIfExists(this.state.upDrawCards, item.suit, item.value)) {
                if (this.state.upDrawCards.length !== (item.index + 1)) {
                    return false;
                }
            }
        }

        // This if statement checks if you are dropping the card in one of the 4 dropzones at the top where the stack of each suit lies
        if (item.upperDrop) {
            // Boolean variables that are true if the dragged card is in that collumn
            var inCol_1 = this.checkIfExists(this.state.col_1, item.suit, item.value);
            var inCol_2 = this.checkIfExists(this.state.col_2, item.suit, item.value);
            var inCol_3 = this.checkIfExists(this.state.col_3, item.suit, item.value);
            var inCol_4 = this.checkIfExists(this.state.col_4, item.suit, item.value);
            var inCol_5 = this.checkIfExists(this.state.col_5, item.suit, item.value);
            var inCol_6 = this.checkIfExists(this.state.col_6, item.suit, item.value);
            var inCol_7 = this.checkIfExists(this.state.col_7, item.suit, item.value);

            if (item.findSpotCheck) {
                if (inCol_1) {
                    if (this.state.col_1.length !== (item.index + 1)) {
                        return false;
                    }
                } else if (inCol_2) {
                    if (this.state.col_2.length !== (item.index + 1)) {
                        return false;
                    }
                } else if (inCol_3) {
                    if (this.state.col_3.length !== (item.index + 1)) {
                        return false;
                    }
                } else if (inCol_4) {
                    if (this.state.col_4.length !== (item.index + 1)) {
                        return false;
                    }
                } else if (inCol_5) {
                    if (this.state.col_5.length !== (item.index + 1)) {
                        return false;
                    }
                } else if (inCol_6) {
                    if (this.state.col_6.length !== (item.index + 1)) {
                        return false;
                    }
                } else if (inCol_7) {
                    if (this.state.col_7.length !== (item.index + 1)) {
                        return false;
                    }
                }
            }

            var upColumns = {
                up_1: this.state.up_1,
                up_2: this.state.up_2,
                up_3: this.state.up_3,
                up_4: this.state.up_4
            };
            var upValue = item.value;
            var upSuit = item.suit;
            var upColumn = item.column;
            // Sets up the card that is being landed on
            var upLandingCard = upColumns[upColumn][upColumns[upColumn].length - 1];

            // Converts card value to numerical value for the sake of comparison
            if (upValue === 'jack') { upValue = 11 }
            if (upValue === 'queen') { upValue = 12 }
            if (upValue === 'king') { upValue = 13 }
            if (upValue === 'ace') { upValue = 1 }

            // If there's no cards in the stack the card must be an ace
            if (upLandingCard === undefined) {
                if (upValue !== 1) {
                    return false;
                }

                return true;
            } else {
                var upLandingCardValue = upLandingCard.value;
                var upLandingCardSuit = upLandingCard.suit;

                // Converts card value to numerical value for the sake of comparison
                if (upLandingCardValue === 'jack') { upLandingCardValue = 11 }
                if (upLandingCardValue === 'queen') { upLandingCardValue = 12 }
                if (upLandingCardValue === 'king') { upLandingCardValue = 13 }
                if (upLandingCardValue === 'ace') { upLandingCardValue = 1 }

                // eslint-disable-next-line
                upValue = parseInt(upValue);
                // eslint-disable-next-line
                upLandingCardValue = parseInt(upLandingCardValue);

                // If the suits don't match return false
                if (upSuit !== upLandingCardSuit) {
                    return false;
                }
                // If the dragged card's value isn't 1 more than the landing card return false
                if (upValue !== (upLandingCardValue + 1)) {
                    return false;
                }

                return true;
            }
        }

        // Sets up local variables for the arrays for all the cards on the board
        var columns = [
            this.state.col_1,
            this.state.col_2,
            this.state.col_3,
            this.state.col_4,
            this.state.col_5,
            this.state.col_6,
            this.state.col_7
        ];
        var suit = item.suit;
        var value = item.value;
        var column = columns[item.column - 1];
        // Sets up the card that is being landed on
        var landingCard;
        if (!item.findSpotCheck || item.findSpotCheck === undefined) {
            landingCard = column[column.length - 2];
        } else {
            landingCard = column[column.length - 1];
        }

        // Checks to make sure that there's actually a landing card
        if (landingCard !== undefined) {
            var landingSuit = landingCard.suit;
            var landingValue = landingCard.value;

            // Converts card value to numerical value for the sake of comparison
            if (landingValue === 'jack') { landingValue = 11 }
            if (landingValue === 'queen') { landingValue = 12 }
            if (landingValue === 'king') { landingValue = 13 }
            if (landingValue === 'ace') { landingValue = 1 }

            // eslint-disable-next-line
            landingValue = parseInt(landingValue);
        }

        // Converts card value to numerical value for the sake of comparison
        if (value === 'jack') { value = 11 }
        if (value === 'queen') { value = 12 }
        if (value === 'king') { value = 13 }
        if (value === 'ace') { value = 1 }

        // eslint-disable-next-line
        value = parseInt(value);

        // Regular move onto any of the 7 columns
        if (landingCard !== undefined) {
            // Switch statement that ensures that the landing card suit is of the opposite color
            switch (suit) {
                case 'spades':
                    if (landingSuit === 'spades' || landingSuit === 'clubs') {
                        return false;
                    }
                    break;
                case 'clubs':
                    if (landingSuit === 'spades' || landingSuit === 'clubs') {
                        return false;
                    }
                    break;
                case 'hearts':
                    if (landingSuit === 'hearts' || landingSuit === 'diamonds') {
                        return false;
                    }
                    break;
                case 'diamonds':
                    if (landingSuit === 'hearts' || landingSuit === 'diamonds') {
                        return false;
                    }
                    break;
                default:
                    break;
            }

            // Returns false if the landing value is less than or equal to the dragged card's value
            if (landingValue <= value) {
                return false;
            }
            // Returns false if the dragged card's value is not 1 less than the landing card
            if ((landingValue - 1) !== value) {
                return false;
            }
        } else {
            // If there's no landing card, then dragged card must be a king
            if (value < 13) {
                return false;
            }
        }

        return true;
    }

    // Handles logic for moving the dragged card to it's new pile, as well as ensuring it's removed from it's original pile
    moveItem(item) {
        var suit = item.suit;
        var value = item.value;
        var column;

        // Sets up local variables for the arrays for all the cards on the board
        var columns = [
            this.state.col_1,
            this.state.col_2,
            this.state.col_3,
            this.state.col_4,
            this.state.col_5,
            this.state.col_6,
            this.state.col_7
        ];
        // Sets up local variables for the arrays for all the cards on the upper dropzones
        var upColumns = {
            up_1: this.state.up_1,
            up_2: this.state.up_2,
            up_3: this.state.up_3,
            up_4: this.state.up_4
        };
        // Local variables for cards in the draw pile
        var upDrawCards = this.state.upDrawCards;
        var usedDrawCards = this.state.usedDrawCards;

        // Boolean variables that are true if the dragged card is in that collumn
        var inCol_1 = this.checkIfExists(columns[0], suit, value);
        var inCol_2 = this.checkIfExists(columns[1], suit, value);
        var inCol_3 = this.checkIfExists(columns[2], suit, value);
        var inCol_4 = this.checkIfExists(columns[3], suit, value);
        var inCol_5 = this.checkIfExists(columns[4], suit, value);
        var inCol_6 = this.checkIfExists(columns[5], suit, value);
        var inCol_7 = this.checkIfExists(columns[6], suit, value);

        // Boolean variables that are true if the dragged card is in that collumn of the upper dropzones
        var inUp_1 = this.checkIfExists(upColumns['up_1'], suit, value);
        var inUp_2 = this.checkIfExists(upColumns['up_2'], suit, value);
        var inUp_3 = this.checkIfExists(upColumns['up_3'], suit, value);
        var inUp_4 = this.checkIfExists(upColumns['up_4'], suit, value);

        // Boolean variable that are true if the dragged card is in the draw pile
        var inUsedDrawCards = this.checkIfExists(usedDrawCards, suit, value);

        // Checks that the move is valid
        if (item.column !== undefined && this.validMove(item)) {
            var index = item.index;
            column = item.column;
            var itemsToMove;

            // Removes the dropzones from all the stacks
            columns.map((_column, _index) => {
                return _column.map((item) => {
                    return item.column !== undefined ? _column.length = (_column.length - 1) : null;
                });
            });

            // Standard move from one of the 7 columns on the main board
            if (!item.upperDrop && !inUp_1 && !inUp_2 && !inUp_3 && !inUp_4 && !inUsedDrawCards) {
                // Checks which column the dragged card came from
                if (inCol_1) {
                    // Removes the card(s) from the column
                    itemsToMove = columns[0].slice(index);
                    columns[0].length = index;
                    // If there's a card under the dragged card flips it over to be used
                    if (columns[0][columns[0].length - 1] !== undefined) {
                        columns[0][columns[0].length - 1].showBack = false;
                    }
                    // Follows same pattern as above    
                } else if (inCol_2) {
                    itemsToMove = columns[1].slice(index);
                    columns[1].length = index;
                    if (columns[1][columns[1].length - 1] !== undefined) {
                        columns[1][columns[1].length - 1].showBack = false;
                    }
                } else if (inCol_3) {
                    itemsToMove = columns[2].slice(index);
                    columns[2].length = index;
                    if (columns[2][columns[2].length - 1] !== undefined) {
                        columns[2][columns[2].length - 1].showBack = false;
                    }
                } else if (inCol_4) {
                    itemsToMove = columns[3].slice(index);
                    columns[3].length = index;
                    if (columns[3][columns[3].length - 1] !== undefined) {
                        columns[3][columns[3].length - 1].showBack = false;
                    }
                } else if (inCol_5) {
                    itemsToMove = columns[4].slice(index);
                    columns[4].length = index;
                    if (columns[4][columns[4].length - 1] !== undefined) {
                        columns[4][columns[4].length - 1].showBack = false;
                    }
                } else if (inCol_6) {
                    itemsToMove = columns[5].slice(index);
                    columns[5].length = index;
                    if (columns[5][columns[5].length - 1] !== undefined) {
                        columns[5][columns[5].length - 1].showBack = false;
                    }
                } else if (inCol_7) {
                    itemsToMove = columns[6].slice(index);
                    columns[6].length = index;
                    if (columns[6][columns[6].length - 1] !== undefined) {
                        columns[6][columns[6].length - 1].showBack = false;
                    }
                } else {
                    // If dragged card came from the draw pile instead of a standard pile
                    itemsToMove = upDrawCards.slice(upDrawCards.length - 1);
                    upDrawCards.length = upDrawCards.length - 1;
                }

                // Puts the dragged card into the new column to be rendered
                itemsToMove.map((_item) => {
                    return columns[column - 1].push(_item);
                });
                // If dragged card came from one of the upper dropzones
            } else if (inUp_1 || inUp_2 || inUp_3 || inUp_4) {
                // Follows same logic pattern as above, just with a different set of columns
                if (inUp_1) {
                    itemsToMove = upColumns['up_1'].slice(index);
                    upColumns['up_1'].length = index;
                } else if (inUp_2) {
                    itemsToMove = upColumns['up_2'].slice(index);
                    upColumns['up_2'].length = index;
                } else if (inUp_3) {
                    itemsToMove = upColumns['up_3'].slice(index);
                    upColumns['up_3'].length = index;
                } else if (inUp_4) {
                    itemsToMove = upColumns['up_4'].slice(index);
                    upColumns['up_4'].length = index;
                }

                // Puts the dragged card into the new column to be rendered 
                if (item.upperDrop) {
                    itemsToMove.map((_item) => {
                        _item.upperCard = false;
                        return upColumns[column].push(_item);
                    });
                } else {
                    itemsToMove.map((_item) => {
                        _item.upperCard = false;
                        return columns[column - 1].push(_item);
                    });
                }
                // If the card came from the pile of already overturned draw cards when depleting the 3 flipped cards
            } else if (inUsedDrawCards) {
                // Again, follows same logic as above just with different columns
                itemsToMove = usedDrawCards.slice(index);
                usedDrawCards.length = index;

                // If card is being dropped in upper dropzones
                if (item.upperDrop) {
                    // Puts the dragged card into the new column to be rendered
                    itemsToMove.map((_item) => {
                        _item.usedDrawCard = false;
                        _item.drawCard = false;
                        _item.upperCard = true;
                        return upColumns[column].push(_item);
                    });
                    // If card is going to 1 of the 7 standard columns
                } else {
                    // Puts the dragged card into the new column to be rendered
                    itemsToMove.map((_item) => {
                        _item.usedDrawCard = false;
                        _item.drawCard = false;
                        return columns[column - 1].push(_item);
                    });
                }
                // If the card is being dropped into one of the upper dropzones
            } else {
                // Follows same logic pattern as above, just with different columns
                if (inCol_1 && columns[0].slice(index).length === 1) {
                    itemsToMove = columns[0].slice(index);
                    columns[0].length = index;
                    if (columns[0][columns[0].length - 1] !== undefined) {
                        columns[0][columns[0].length - 1].showBack = false;
                    }
                } else if (inCol_2 && columns[1].slice(index).length === 1) {
                    itemsToMove = columns[1].slice(index);
                    columns[1].length = index;
                    if (columns[1][columns[1].length - 1] !== undefined) {
                        columns[1][columns[1].length - 1].showBack = false;
                    }
                } else if (inCol_3 && columns[2].slice(index).length === 1) {
                    itemsToMove = columns[2].slice(index);
                    columns[2].length = index;
                    if (columns[2][columns[2].length - 1] !== undefined) {
                        columns[2][columns[2].length - 1].showBack = false;
                    }
                } else if (inCol_4 && columns[3].slice(index).length === 1) {
                    itemsToMove = columns[3].slice(index);
                    columns[3].length = index;
                    if (columns[3][columns[3].length - 1] !== undefined) {
                        columns[3][columns[3].length - 1].showBack = false;
                    }
                } else if (inCol_5 && columns[4].slice(index).length === 1) {
                    itemsToMove = columns[4].slice(index);
                    columns[4].length = index;
                    if (columns[4][columns[4].length - 1] !== undefined) {
                        columns[4][columns[4].length - 1].showBack = false;
                    }
                } else if (inCol_6 && columns[5].slice(index).length === 1) {
                    itemsToMove = columns[5].slice(index);
                    columns[5].length = index;
                    if (columns[5][columns[5].length - 1] !== undefined) {
                        columns[5][columns[5].length - 1].showBack = false;
                    }
                } else if (inCol_7 && columns[6].slice(index).length === 1) {
                    itemsToMove = columns[6].slice(index);
                    columns[6].length = index;
                    if (columns[6][columns[6].length - 1] !== undefined) {
                        columns[6][columns[6].length - 1].showBack = false;
                    }
                } else {
                    // If it came from the draw cards
                    if (upDrawCards.slice(upDrawCards.length - 1).length === 1) {
                        itemsToMove = upDrawCards.slice(upDrawCards.length - 1);
                        upDrawCards.length = upDrawCards.length - 1;
                    }
                }

                // Puts the dragged card into the new column to be rendered
                itemsToMove.map((_item) => {
                    _item.upperCard = true;
                    return upColumns[column].push(_item);
                });
            }
            // If the move isn't valid
        } else {
            // Checks if there's a dropzone in that column
            if (inCol_1) { column = 1 }
            if (inCol_2) { column = 2 }
            if (inCol_3) { column = 3 }
            if (inCol_4) { column = 4 }
            if (inCol_5) { column = 5 }
            if (inCol_6) { column = 6 }
            if (inCol_7) { column = 7 }

            // Removes all dropzones
            columns.map((_column, _index) => {
                return _column.map((item) => {
                    return item.column !== undefined ? _column.length = (_column.length - 1) : null;
                });
            });
        }

        this.setState({
            col_1: columns[0],
            col_2: columns[1],
            col_3: columns[2],
            col_4: columns[3],
            col_5: columns[4],
            col_6: columns[5],
            col_7: columns[6],
            up_1: upColumns['up_1'],
            up_2: upColumns['up_2'],
            up_3: upColumns['up_3'],
            up_4: upColumns['up_4'],
            usedDrawCards: usedDrawCards,
            showUpperDrops: false
        });

        if (this.state.up_1.length === 13 && this.state.up_2.length === 13 && this.state.up_3.length === 13 && this.state.up_4.length === 13) {
            this.finishWinningGame();
        }
    }

    finishWinningGame() {
        alert('You Win!');
        this.stopTimer();
        this.setBestScore();
    }

    setBestScore() {
        if (localStorage.getItem('best-time') == null) {
            localStorage.setItem('best-time', this.state.time);
        } else {
            if (parseInt(localStorage.getItem('best-time'), 10) > this.state.time) {
                localStorage.setItem('best-time', this.state.time);
            }
        }
    }

    // Renders drop zones when a card starts dragging
    showDropSpots(suit, value) {
        // Set up local variables for the columns to be used here
        var col_1 = this.state.col_1;
        var col_2 = this.state.col_2;
        var col_3 = this.state.col_3;
        var col_4 = this.state.col_4;
        var col_5 = this.state.col_5;
        var col_6 = this.state.col_6;
        var col_7 = this.state.col_7;

        // Checks which columns need a dropzone rendered
        var inCol_1 = this.checkIfExists(col_1, suit, value);
        var inCol_2 = this.checkIfExists(col_2, suit, value);
        var inCol_3 = this.checkIfExists(col_3, suit, value);
        var inCol_4 = this.checkIfExists(col_4, suit, value);
        var inCol_5 = this.checkIfExists(col_5, suit, value);
        var inCol_6 = this.checkIfExists(col_6, suit, value);
        var inCol_7 = this.checkIfExists(col_7, suit, value);

        // Adds the dropzone to all columns that need it
        if (!inCol_1 && (col_1.length !== 0 ? !col_1[(col_1.length - 1)].showBack : true)) { col_1.push({ column: 1 }) }
        if (!inCol_2 && (col_2.length !== 0 ? !col_2[(col_2.length - 1)].showBack : true)) { col_2.push({ column: 2 }) }
        if (!inCol_3 && (col_3.length !== 0 ? !col_3[(col_3.length - 1)].showBack : true)) { col_3.push({ column: 3 }) }
        if (!inCol_4 && (col_4.length !== 0 ? !col_4[(col_4.length - 1)].showBack : true)) { col_4.push({ column: 4 }) }
        if (!inCol_5 && (col_5.length !== 0 ? !col_5[(col_5.length - 1)].showBack : true)) { col_5.push({ column: 5 }) }
        if (!inCol_6 && (col_6.length !== 0 ? !col_6[(col_6.length - 1)].showBack : true)) { col_6.push({ column: 6 }) }
        if (!inCol_7 && (col_7.length !== 0 ? !col_7[(col_7.length - 1)].showBack : true)) { col_7.push({ column: 7 }) }

        this.setState({
            col_1: col_1,
            col_2: col_2,
            col_3: col_3,
            col_4: col_4,
            col_5: col_5,
            col_6: col_6,
            col_7: col_7,
            showUpperDrops: true
        });
    }

    // The function that takes in an columns array, and the cards suit and value and checks if it exists within that array/column
    checkIfExists(array, suit, value) {
        var result = false;

        array.map((card) => {
            // If the card is in this arary return true
            if (card.suit === suit && card.value === value) {
                return result = true;
            }

            return false;
        });

        return result;
    }

    // Maps cards and dropzones to be rendered in standard piles
    mapCards(cards) {
        var upCardIndex = 1;
        var extraTop = 0;

        var mappedCards = cards.map((card, index) => {
            // If it's a card
            if (card.column === undefined) {
                // Logic to determine where the card is placed in the stack. ex.(If the card below it has it's back showing only be 15px below it, if not be more)
                if (index !== 0) {
                    if (cards[(index - 1)].showBack) {
                        extraTop = 0
                    } else {
                        if (extraTop === 0 || !card.showBack) {
                            upCardIndex += 1;
                        }
                        extraTop = (30 * upCardIndex)
                    }
                } else {
                    extraTop = 0;
                    upCardIndex = 0;
                }

                return (
                    // Renders card and sets it's props
                    <CardContainer
                        key={`${card.value}_${card.suit}`}
                        Suit={card.suit}
                        Value={card.value}
                        ShowBack={card.showBack}
                        ZIndex={index}
                        Index={index}
                        ExtraTop={extraTop}
                        CanDrag={!card.showBack}
                        ShowDropSpots={this.showDropSpots}
                        MoveItem={this.moveItem}
                        DrawCard={false}
                        UpperCard={card.upperCard}
                        FindSpot={this.findSpot}
                        ArrayLength={cards.length}
                        StartTimer={this.startTimer}
                    />
                );
                // If it's a dropzone
            } else {
                var upCards = cards.filter(card => card.showBack === false);

                return (
                    // Renders dropzone and sets it's props
                    <DropSpot
                        key={cards.length}
                        Index={cards.length}
                        Column={card.column}
                        ExtraTop={upCards.length * 30}
                        Position={'absolute'}
                        UpperDrop={false}
                    />
                );
            }
        });

        return mappedCards;
    }

    // Maps the cards in the draw pile as they have slightly different props
    mapDrawCards(cards) {
        var mappedCards = cards.map((card, index) => {
            return (
                <CardContainer
                    key={`${card.value}_${card.suit}`}
                    Suit={card.suit}
                    Value={card.value}
                    ShowBack={card.showBack}
                    ZIndex={index}
                    Index={index}
                    CanDrag={!card.showBack && index === (cards.length - 1) ? true : false}
                    ShowDropSpots={this.showDropSpots}
                    MoveItem={this.moveItem}
                    DrawCard={true}
                    TopDrawCard={index === (cards.length - 1) ? (!card.showBack ? false : true) : false}
                    MoveDrawCards={this.moveDrawCards}
                    UsedDrawCard={card.usedDrawCard}
                    FindSpot={this.findSpot}
                    ArrayLength={cards.length}
                    StartTimer={this.startTimer}
                />
            );
        });

        return mappedCards;
    }

    // Flips draw cards and puts them in the area to be drawn from
    moveDrawCards() {
        var drawCards = this.state.drawCards;
        var upDrawCards = this.state.upDrawCards;
        var usedDrawCards = this.state.usedDrawCards;
        var overturnCards;

        // Logic to ensure it doesn't try to flip too many cards if there's not enough to flip 3
        if (drawCards.length < 3) {
            if (drawCards.length === 2) {
                overturnCards = drawCards.slice(drawCards.length - 2).reverse();
                drawCards.length = drawCards.length - 2;
            }
            if (drawCards.length === 1) {
                overturnCards = drawCards.slice(drawCards.length - 1).reverse();
                drawCards.length = drawCards.length - 1;
            }
        } else {
            overturnCards = drawCards.slice(drawCards.length - 3).reverse();
            drawCards.length = drawCards.length - 3;
        }

        // Puts cards in the overturned pile below the 3 newly turned over cards
        upDrawCards.map((card) => {
            card.usedDrawCard = true;
            return usedDrawCards.push(card);
        });

        // Changes cards properties to be rendered correctly in overturned draw cards pile
        var result = overturnCards.map((card) => {
            card.showBack = false;
            return card;
        });

        this.setState({
            drawCards: drawCards,
            upDrawCards: result,
            usedDrawCards: usedDrawCards
        });
    }

    // Resets the draw pile and ensures that it's in the correct order
    resetDrawCards() {
        var drawCards = [];
        var upDrawCards = this.state.upDrawCards;
        var usedDrawCards = this.state.usedDrawCards;

        // Puts the unused overturn pile cards back into draw pile
        usedDrawCards.map((card) => {
            card.showBack = true;
            card.usedDrawCard = false;
            return drawCards.push(card);
        });
        // Puts the most recently flipped over cards back into the draw pile
        upDrawCards.map((card) => {
            card.showBack = true;
            return drawCards.push(card);
        });

        this.setState({
            // Reverses the drawcards array so that it ends up in the correct order
            drawCards: drawCards.reverse(),
            upDrawCards: [],
            usedDrawCards: []
        });
    }

    // Initial splitting up of cards into each column and the draw pile, takes in the column and the deck
    splitCards(column, deck) {
        var upCard;

        // Checks which column was passed in and splits cards accordingly
        switch (column) {
            case 1:
                upCard = deck[0];
                upCard.showBack = false;
                return [upCard];
            case 2:
                upCard = deck[7];
                upCard.showBack = false;
                return [deck[1], upCard];
            case 3:
                upCard = deck[13];
                upCard.showBack = false;
                return [deck[2], deck[8], upCard];
            case 4:
                upCard = deck[18];
                upCard.showBack = false;
                return [deck[3], deck[9], deck[14], upCard];
            case 5:
                upCard = deck[22];
                upCard.showBack = false;
                return [deck[4], deck[10], deck[15], deck[19], upCard];
            case 6:
                upCard = deck[25];
                upCard.showBack = false;
                return [deck[5], deck[11], deck[16], deck[20], deck[23], upCard];
            case 7:
                upCard = deck[27];
                upCard.showBack = false;
                return [deck[6], deck[12], deck[17], deck[21], deck[24], deck[26], upCard];
            default:
                return deck.slice(28);
        }
    }

    // Creates the deck of cards
    generateCards() {
        var cards = [];
        var suits = ['spades', 'clubs', 'diamonds', 'hearts'];
        var values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

        // Maps out the objects for each card
        suits.map((_suit) => {
            return values.map((_value) => {
                return cards.push({ suit: _suit, value: _value, showBack: true });
            });
        });

        // Returns the newly created and shuffled deck
        return this.shuffleCards(cards);
    }

    // Takes in a deck and shuffles it then returns it
    shuffleCards(cards) {
        var currentIndex = cards.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = cards[currentIndex];
            cards[currentIndex] = cards[randomIndex];
            cards[randomIndex] = temporaryValue;
        }

        return cards;
    }

    // Formats the timer into hh:mm:ss format
    formatTime(time) {
        var sec_num = parseInt(time, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return (hours < 1 ? '' : hours + ':') + (minutes < 1 ? '0:' : minutes + ':') + seconds;
    }

    // Handles finding a location for the card to automatically go to on double click
    findSpot(suit, value, _index, drawCard) {
        var hasMoved = false;
        // Sets up local variables for the arrays for all the cards on the board
        var columns = [
            this.state.col_1,
            this.state.col_2,
            this.state.col_3,
            this.state.col_4,
            this.state.col_5,
            this.state.col_6,
            this.state.col_7
        ];
        // Sets up local variables for the arrays for all the cards on the upper dropzones
        var upColumns = [
            'up_1',
            'up_2',
            'up_3',
            'up_4'
        ];
        upColumns.map((item, index) => {
            if (this.validMove({ suit: suit, value: value, column: upColumns[index], findSpotCheck: true, upperDrop: true, drawCard: drawCard, index: _index }) && !hasMoved) {
                this.showDropSpots({ suit: suit, value: value, index: _index, upperDrop: true });
                hasMoved = true;
                this.moveItem({ suit: suit, value: value, column: upColumns[index], index: _index, upperDrop: true });
                return false;
            }
            return true;
        });
        if (!hasMoved) {
            columns.map((item, index) => {
                if (this.validMove({ suit: suit, value: value, column: index + 1, findSpotCheck: true, drawCard: drawCard, index: _index }) && !hasMoved) {
                    this.showDropSpots({ suit: suit, value: value, index: _index });
                    hasMoved = true;
                    this.moveItem({ suit: suit, value: value, column: index + 1, index: _index });
                    return false;
                }
                return true;
            });
        }
    }

    render() {
        return (
            <div className="App">
                <div className="newGame">
                    <button onClick={this.resetGame}>New Game</button>
                </div>
                <div id="currentTime" className="timer">
                    Time: {this.formatTime(this.state.time)}
                </div>
                <div id="bestTime" className="timer">
                    Best Time:
                    {
                        localStorage.getItem('best-time') != null ? (
                            this.formatTime(localStorage.getItem('best-time'))
                        ) : null
                    }
                </div>
                <div style={{ position: 'relative', top: 10 }}>
                    {this.mapDrawCards(this.state.drawCards)}
                    {
                        this.state.drawCards.length === 0 ? (
                            <div
                                style={{
                                    width: '127px',
                                    borderRadius: '5px',
                                    height: '181px',
                                    border: '2px solid black',
                                    position: 'absolute',
                                    padding: '5px',
                                    fontSize: 60,
                                    cursor: 'pointer'
                                }}
                                onClick={this.resetDrawCards}
                            >
                                <span style={{ top: '50px', left: '35px', position: 'absolute' }}>&#9711;</span>
                            </div>
                        ) : null
                    }
                </div>
                <div style={{ left: 200, position: 'relative', top: 10 }}>
                    <div style={{ zIndex: 0 }}>{this.mapDrawCards(this.state.usedDrawCards)}</div>
                    <div style={{ zIndex: 10 }}>{this.mapDrawCards(this.state.upDrawCards)}</div>
                </div>
                <div style={{ position: 'absolute', right: 122, top: 10 }}>
                    <table style={{ maxWidth: 700, position: 'relative', float: 'right' }}>
                        <tbody>
                            <tr>
                                <td style={{ position: 'relative', width: 175 }}>
                                    {this.state.up_1.length === 0 ? (<CardOutline />) : null}
                                    {this.mapCards(this.state.up_1)}
                                    <div style={{ display: this.state.showUpperDrops ? 'block' : 'none' }}>
                                        <DropSpot Position={'relative'} UpperDrop={true} Column={'up_1'} Index={1000} />
                                    </div>
                                </td>
                                <td style={{ position: 'relative', width: 175 }}>
                                    {this.state.up_2.length === 0 ? (<CardOutline />) : null}
                                    {this.mapCards(this.state.up_2)}
                                    <div style={{ display: this.state.showUpperDrops ? 'block' : 'none' }}>
                                        <DropSpot Position={'relative'} UpperDrop={true} Column={'up_2'} Index={1000} />
                                    </div>
                                </td>
                                <td style={{ position: 'relative', width: 175 }}>
                                    {this.state.up_3.length === 0 ? (<CardOutline />) : null}
                                    {this.mapCards(this.state.up_3)}
                                    <div style={{ display: this.state.showUpperDrops ? 'block' : 'none' }}>
                                        <DropSpot Position={'relative'} UpperDrop={true} Column={'up_3'} Index={1000} />
                                    </div>
                                </td>
                                <td style={{ position: 'relative', width: 175 }}>
                                    {this.state.up_4.length === 0 ? (<CardOutline />) : null}
                                    {this.mapCards(this.state.up_4)}
                                    <div style={{ display: this.state.showUpperDrops ? 'block' : 'none' }}>
                                        <DropSpot Position={'relative'} UpperDrop={true} Column={'up_4'} Index={1000} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <table style={{ width: '100%', position: 'relative', top: '225px', maxWidth: '1375px', float: 'right' }}>
                    <tbody>
                        <tr>
                            <td style={{ position: 'relative' }}>
                                {this.state.col_1.length === 0 ? (<CardOutline />) : null}
                                {this.mapCards(this.state.col_1)}
                            </td>
                            <td style={{ position: 'relative' }}>
                                {this.state.col_2.length === 0 ? (<CardOutline />) : null}
                                {this.mapCards(this.state.col_2)}
                            </td>
                            <td style={{ position: 'relative' }}>
                                {this.state.col_3.length === 0 ? (<CardOutline />) : null}
                                {this.mapCards(this.state.col_3)}
                            </td>
                            <td style={{ position: 'relative' }}>
                                {this.state.col_4.length === 0 ? (<CardOutline />) : null}
                                {this.mapCards(this.state.col_4)}
                            </td>
                            <td style={{ position: 'relative' }}>
                                {this.state.col_5.length === 0 ? (<CardOutline />) : null}
                                {this.mapCards(this.state.col_5)}
                            </td>
                            <td style={{ position: 'relative' }}>
                                {this.state.col_6.length === 0 ? (<CardOutline />) : null}
                                {this.mapCards(this.state.col_6)}
                            </td>
                            <td style={{ position: 'relative' }}>
                                {this.state.col_7.length === 0 ? (<CardOutline />) : null}
                                {this.mapCards(this.state.col_7)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(App);