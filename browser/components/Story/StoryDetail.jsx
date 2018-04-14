import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import ContentEditable from 'react-contenteditable';
import { updateStory, fetchStory } from '../../redux/stories';
import { Link } from 'react-router-dom';

/* -----------------    COMPONENT     ------------------ */

class StoryDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      story: props.story
    };

    this.onStoryUpdate = this.onStoryUpdate.bind(this);
    this.renderRawHTML = this.renderRawHTML.bind(this);
  }

  componentWillReceiveProps (newProps, oldProps) {
    if (newProps.story !== oldProps.story) {
      this.setState({
        story: newProps.story
      });
    }
  }

  render() {
    const { users, currentUser } = this.props;
    const story = this.state.story;
    if (!story) return <div />; // the story id is invalid or the data isnt loaded yet
    const authorized = currentUser && (currentUser.isAdmin || currentUser.id === story.author_id);
    return (
      <div className="container story-container">
        <ul className="list-inline large-font">
          <li>
            <input
              readOnly={ !authorized }
              className="form-like large-font"
              value={story.title}
              onChange={evt => this.onStoryUpdate({ title: evt.target.value })}
              contentEditable={ !!authorized }
            />
          </li>
          <li><span className="muted">by</span></li>
          <li>
            { currentUser.isAdmin ?
              <select
                value={story.author_id}
                onChange={evt => this.onStoryUpdate({ author_id: evt.target.value })}>
                {
                  users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))
                }
              </select>
              : <Link to={`/users/${story.author_id}`}>{story.author.name || story.author.email}</Link>
            }
          </li>
        </ul>
        <br />
        <ContentEditable
          disabled={ !authorized }
          placeholder="(text here)"
          html={this.renderRawHTML()}
          onChange={evt => this.onStoryUpdate({ paragraphs: evt.target.value })}
        />
      </div>
    );
  }

  renderRawHTML() {
    const { story } = this.state;

    let storyHTML = '';

    if (story && story.paragraphs && story.paragraphs.length) {
      storyHTML = story.paragraphs.join('<br>');
    }

    return storyHTML;
  }

  onStoryUpdate(storyUpdateObj) {
    const {debouncedUpdateStory} = this.props;
    const {story} = this.state;
    // this is probably pretty fragile
    if (storyUpdateObj.paragraphs) {
      storyUpdateObj.paragraphs = storyUpdateObj.paragraphs.split('<br>');
    }
    this.setState({
      story: Object.assign(story, storyUpdateObj)
    });
    debouncedUpdateStory(story.id, storyUpdateObj);
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapState = ({ users, stories, currentUser }, ownProps) => {
  const paramId = Number(ownProps.match.params.id);
  const story = stories.find(story => story.id === paramId);
  return { story, users, currentUser };
};

const mapDispatch = (dispatch, ownProps) => ({
  debouncedUpdateStory: _.debounce((...args) => {
    dispatch(updateStory(...args));
  }, 500) 
});

export default connect(mapState, mapDispatch)(StoryDetail);
