import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import StoryItem from './StoryItem';
import { addStory } from '../../redux/stories';

/* -----------------    COMPONENT     ------------------ */

class StoryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      name: ''
    };

    this.filterStory = this.filterStory.bind(this);
    this.renderStorySearch = this.renderStorySearch.bind(this);
    this.renderNewStoryWidget = this.renderNewStoryWidget.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    const { currentUser } = this.props;
    return (
      <div className="container">
        { this.renderStorySearch() }
        <br />

        <ul className="list-group">
        { currentUser.id && this.renderNewStoryWidget() }
        { this.props.stories
          .filter(this.filterStory)
          .map(story => <StoryItem story={story} key={story.id} />)
        }
        </ul>
      </div>
    );
  }

  renderStorySearch() {
    return (
      <div className="list-group-item story-item">
        <ul className="list-inline">
          <li>
            <input
              type="text"
              placeholder="Story Title"
              className="form-like large-font"
              onChange={evt => this.setState({ title: evt.target.value })}
            />
          </li>
          <li>
            <span>by</span>
          </li>
          <li>
            <input
              className="form-like"
              type="text"
              placeholder="Jean Doe"
              onChange={evt => this.setState({ name: evt.target.value })}
            />
          </li>
        </ul>
        <span className="glyphicon glyphicon-search" />
      </div>
    );
  }

  renderNewStoryWidget() {
    const { currentUser } = this.props;
    return (
      <form onSubmit={this.onSubmit} className="list-group-item story-item">
        <ul className="list-inline">
          <li>
            <input
              name="title"
              type="text"
              className="form-like large-font"
              placeholder="Story Title"
            />
          </li>
          <li>
            <span>by</span>
          </li>
          <li>
            { currentUser.isAdmin ?
              <select name="author_id" defaultValue="" required>
                <option value="" disabled>(select an author)</option>
                {
                  this.props.users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))
                }
              </select>
              : <Link to={`/users/${currentUser.id}`}>{currentUser.name || currentUser.email}</Link>
            }
          </li>
        </ul>
        <button
            type="submit"
            className="btn btn-warning btn-xs pull-right">
            <span className="glyphicon glyphicon-plus" />
         </button>
      </form>
    );
  }

  filterStory(story) {
    // this is necessary as a user can be deleted and his stories are orphaned
    const authorName = (story && story.author) ? story.author.name : '';
    const titleMatch = new RegExp(this.state.title, 'i');
    const nameMatch = new RegExp(this.state.name, 'i');

    return titleMatch.test(story.title)
        && nameMatch.test(authorName);
  }

  onSubmit(event) {
    event.preventDefault();
    const { addStory, currentUser} = this.props;
    const { author_id, title } = event.target;
    const story = {
      author_id: author_id ? author_id.value : currentUser.id,
      title: title.value
    };
    addStory(story);
    if (author_id) event.target.author_id.value = '';
    event.target.title.value = '';
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapState = ({ users, stories, currentUser }) => ({ users, stories, currentUser });

const mapDispatch = { addStory };

export default connect(mapState, mapDispatch)(StoryList);
