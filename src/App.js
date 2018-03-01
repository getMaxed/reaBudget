import React, { Component } from 'react';
import './App.css';
import moment from 'moment';
import styled from 'styled-components';
import Expenses from './Expenses';
import Income from './Income';
import {findLastIndex} from 'lodash';

const DateButton = styled.button`
    color: white;
    border: 1px solid white;
    border-radius: 50%;
    background-color: transparent;
    width:32px;
    height: 32px;
    margin:3px;
    cursor: pointer;
    text-align: center;
`;

const DateLine = styled.div`
    display: flex;
    align-items: center;
`;

const Link = styled.span`
    font-family: 'Marmelad';
    cursor: pointer;
    color: white;
    margin: 0 8px;
    border-bottom: ${({selected}) => (selected ? '2px solid white' : 'none')};
`;

const Nav = styled.nav`
    display: flex;
    justify-content: center;
    font-size: 25px;
    padding: 40px 0 15px
`;

class App extends Component {
    constructor(props) {
        super(props);


        this.state = {
            date: moment(),
            navSelected: 'expenses',
            transactions: []
        };
    };

    handleAddDay = () => {
        this.setState({date: this.state.date.add(1, 'day')});
    };

    handleSubtractDay = () => {
        this.setState({date: this.state.date.subtract(1, 'day')});
    };

    handleNavClick = event => {
        this.setState({navSelected: event.target.getAttribute('name')});
    };

    handleSubmitTransaction = (sum, category) => {
        const {date: TodayDate, transactions} = this.state;

        const newTransaction = {
            date: TodayDate.format('MM.DD.YYYY'),
            category,
            sum
        };

        const index = findLastIndex(transactions, ({date}) => {
            const transactionDate = moment(date, 'MM.DD.YYYY');
            return (
                TodayDate.isBefore(transactionDate, 'day') ||
                TodayDate.isSame(transactionDate, 'day')
            );
        });

        const newTransactions = [...transactions];
        newTransactions.splice(
            index === -1 ? transactions.length : index,
            0,
            newTransaction
        );

        console.log(newTransactions);
        this.setState({transactions: newTransactions});
    };

    render() {
        const {date, navSelected} = this.state;

        return (
            <section>
                <header>
                    <h1>Reactive Budget</h1>
                    <DateLine>
                        <p>{date.format('MM.DD.YYYY')}</p>
                        <DateButton onClick={this.handleSubtractDay}>-</DateButton>
                        <DateButton onClick={this.handleAddDay}>+</DateButton>
                    </DateLine>
                </header>
                <main>
                    <Nav>
                        <Link name="expenses"
                              onClick={this.handleNavClick}
                              selected={navSelected === 'expenses'}
                        >
                            Today's Expenses
                        </Link>
                        <Link name="income"
                              onClick={this.handleNavClick}
                              selected={navSelected === 'income'}
                        >
                            Today's Income
                        </Link>
                    </Nav>

                    { navSelected === 'expenses' ? (
                        <Expenses onSubmit={this.handleSubmitTransaction} />
                    ) : (
                        <Income onSubmit={this.handleSubmitTransaction} />
                    )}

                </main>
            </section>
        );
    }
}

export default App;
