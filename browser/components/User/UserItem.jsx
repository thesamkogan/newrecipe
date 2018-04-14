import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeUser } from '../../redux/users';

/* -----------------    COMPONENT     ------------------ */

class UserItem extends Component {

  constructor (props) {
    super(props);
    this.removeUserCallback = this.removeUserCallback.bind(this);
  }

  render () {
    const { user, currentUser } = this.props;
    return (
      <div className="list-group-item min-content user-item">
        <div className="media">
          <div className="media-left media-middle icon-container">
            <img className="media-object img-circle" src={user.photo} />
          </div>
          <NavLink
            className="media-body"
            activeClassName="active"
            to={`/users/${user.id}`}>
            <h4 className="media-heading tucked">
              <span placeholder="Jean Doe">{user.name}</span>
            </h4>
            <h5 className="tucked">
              <span>{user.email}</span>
            </h5>
            <h5 className="tucked">
              <span>{user.phone}</span>
            </h5>
          </NavLink>
          { currentUser.isAdmin &&
            <div className="media-right media-middle">
              <button className="btn btn-default" onClick={this.removeUserCallback}>
                <span className="glyphicon glyphicon-remove" />
              </button>
            </div>
          }
        </div>
      </div>
    );
  }

  removeUserCallback (event) {
    const { removeUser, user } = this.props;
    removeUser(user.id);
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapState = ({currentUser}) => ({ currentUser });

// When given just an object, react-redux wraps the functions in dispatch, so when `removeUser` is invoked off of props in the component, it will call `dispatch(removeUser(params))`
const mapDispatch = { removeUser };

// The above is a shorthand for what is below
//    Note: if you want to use the implicit return of an arrow function to return an object, wrap that object in parens
// const mapDispatch = (dispatch) => ({
//   removeUser: (userId) => dispatch(removeUser(userId))
// })

export default connect(mapState, mapDispatch)(UserItem);
