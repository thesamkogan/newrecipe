import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeStory } from '../../redux/stories';


/* -----------------    COMPONENT     ------------------ */

class StoryItem extends Component {
  render() {
    const { story, removeStory, currentUser } = this.props;
    const authorized = currentUser && (currentUser.isAdmin || currentUser.id === story.author_id);
    return (
      <li className="list-group-item story-item">
        <ul className="list-inline">
          <li>
            <Link className="large-font" to={`/stories/${story.id}`}>{story.title}</Link>
          </li>
          <li>
            <span>by</span>
          </li>
          <li>
            <Link to={`/users/${story.author_id}`}>{story.author.name || story.author.email}</Link>
          </li>
        </ul>
        { authorized &&
          <button
            className="btn btn-default btn-xs"
            onClick={ () => removeStory(story.id) }>
            <span className="glyphicon glyphicon-remove" />
          </button>
        }
      </li>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapState = ({ currentUser }) => ({ currentUser });
// // equivalent to:
// const mapState = (state) => {
//   return {
//     currentUser: state.currentUser
//   };
// };

const mapDispatch = { removeStory };

export default connect(mapState, mapDispatch)(StoryItem);
