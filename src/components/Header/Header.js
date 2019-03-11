import React, { Component } from 'react';
import Nav from '../Nav/Nav';
import Weather from '../Weather/Weather';
import './Header.css';
import { updateUser, clearUser } from '../../ducks/actions';
import { connect } from 'react-redux';
import axios from 'axios';

class Header extends Component {
    constructor(props){
        super(props)

        this.state = {
            
        }
    }

    

    logout = async () => {
        await axios.post('/auth/logout');
        this.props.clearUser();
        this.props.auth.history.push('/')
    }

    render() {
        const { username } = this.props.auth;
        console.log(this.props)
        return (
                <div className="Header">
                    <Nav />
                    <h1>Hello {username}!</h1>
                    {/* <Weather /> */}
                    <button onClick={this.logout}>Logout</button>
                </div>
        
        );
    }
}

const mapStateToProps = (reduxState) => {
    return reduxState
}

const mapDispatchToProps = {
    updateUser,
    clearUser
}

export default connect (mapStateToProps, mapDispatchToProps)(Header);