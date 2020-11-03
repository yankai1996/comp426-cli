class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tweets: props.tweets,
            creating: false,
            type: null,
            parentId: null,
            countHandler: null
        }
        this.openCreatingPanel = this.openCreatingPanel.bind(this);
        this.closeCreatingPanel = this.closeCreatingPanel.bind(this);
        this.removeTweet = this.removeTweet.bind(this);
        this.prependTweet = this.prependTweet.bind(this);
    }

    openCreatingPanel(params, countHandler) {
        this.setState({
            creating: true,
            type: params.type,
            parentId: params.parentId,
            countHandler: countHandler
        });
    }

    closeCreatingPanel() {
        this.setState({
            creating: false,
            type: null,
            parentId: null,
            countHandler: null
        });
    }

    removeTweet(id) {
        const tweets = this.state.tweets.filter(tweet => tweet.id != id);
        this.setState({tweets: tweets});
    }

    prependTweet(tweet) {
        this.setState({tweets: [tweet, ...this.state.tweets]});
    }

    render() {
        return (
            <div>
                <div className="content">
                    {this.state.tweets.map(tweet => <Tweet key={tweet.id} tweet={tweet} 
                        removeTweet={this.removeTweet} openCreatingPanel={this.openCreatingPanel}/>)}
                </div>
                <NewTweetButton openCreatingPanel={this.openCreatingPanel}/>
                {this.state.creating &&
                <CreatingPanel closeCreatingPanel={this.closeCreatingPanel} countHandler={this.state.countHandler}
                    prependTweet={this.prependTweet} type={this.state.type} parentId={this.state.parentId}/>
                }
            </div>
        );
    }
}

class Tweet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            body: props.tweet.body,
            value: props.tweet.body,
            updatedAt: props.tweet.updatedAt,
            replyCount: props.tweet.replyCount,
        };
        this.toggleEditing = this.toggleEditing.bind(this);
        this.deleteTweet = this.deleteTweet.bind(this);
        this.updateTweet = this.updateTweet.bind(this);
        this.handleTextareaChange = this.handleTextareaChange.bind(this);
        this.incrementReplyCount = this.incrementReplyCount.bind(this);
    }

    handleTextareaChange(event) {
        this.setState({value: event.target.value});
    }

    tweetBody() {
        if (!this.state.editing) {
            return <p>{this.state.body}</p>;
        }
        return (
            <textarea className="textarea" value={this.state.value}
                onChange={this.handleTextareaChange}>
            </textarea>
        );
    }

    toggleEditing() {
        this.setState({
            editing: !this.state.editing,
            value: this.state.body
        });
    }

    async updateTweet() {
        try {
            if (this.state.value == this.state.body) {
                return;
            }
            const result = await axios({
                method: 'put',
                url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${this.props.tweet.id}`,
                withCredentials: true,
                data: {
                    body: this.state.value
                },
            });
            this.setState({
                body: this.state.value,
                updatedAt: result.data.updatedAt,
            });
            this.toggleEditing();
        } catch (error) {
            console.log(error);
        }
    }

    async deleteTweet() {
        try {
            await axios({
                method: 'delete',
                url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${this.props.tweet.id}`,
                withCredentials: true,
            });
            this.props.removeTweet(this.props.tweet.id);
        } catch (error) {
            console.log(error);
        }
    }

    incrementReplyCount() {
        this.setState({replyCount: this.state.replyCount+1});
    }

    render() {
        return (
            <div className="tweet" id={this.props.tweet.id}>
                <div className="tweet-head">
                    <span className="author">{this.props.tweet.author}</span>
                    {this.props.tweet.isMine && 
                    <EditingButtons editing={this.state.editing} toggleEditing={this.toggleEditing}
                        deleteTweet={this.deleteTweet} updateTweet={this.updateTweet}/>}
                </div>
                <div className="tweet-body">
                    {this.tweetBody()}
                    {this.props.tweet.parent && 
                    <Retweet tweet={this.props.tweet.parent}/>}
                    <Timestamp time={this.state.updatedAt} createdAt={this.props.tweet.createdAt}/>
                </div>
                <div className="tweet-foot">
                    <ReplyButton replyCount={this.state.replyCount} incrementReplyCount={this.incrementReplyCount}
                        openCreatingPanel={this.props.openCreatingPanel} parentId={this.props.tweet.id}/>
                    <RetweetButton retweetCount={this.props.tweet.retweetCount} 
                        openCreatingPanel={this.props.openCreatingPanel} parentId={this.props.tweet.id}/>
                    <LikeButton isLiked={this.props.tweet.isLiked} likeCount={this.props.tweet.likeCount} id={this.props.tweet.id}/>
                </div>
                {this.state.replyCount > 0 &&
                <Replies id={this.props.tweet.id} replyCount={this.state.replyCount}/>
                }
            </div>
        );
    }
}

class EditingButtons extends React.Component {
    render() {
        if (!this.props.editing) {
            return (
                <div className="button-box">
                    <div className="button edit-button"  onClick={this.props.toggleEditing}><i className="fas fa-edit"></i></div>
                    <div className="button delete-button" onClick={this.props.deleteTweet}><i className="fas fa-trash-alt"></i></div>
                </div>
            );
        }
        return (
            <div className="button-box">
                <div className="button update-button" onClick={this.props.updateTweet}>Update</div>
                <div className="button cancel-button" onClick={this.props.toggleEditing}>Cancel</div>
            </div>
        );
    }
}

class Retweet extends React.Component {
    render() {
        return (
            <div className="retweet-content">
                <div className="tweet-head">
                    <span className="author">{this.props.tweet.author}</span>
                    <Timestamp time={this.props.tweet.updatedAt} createdAt={this.props.tweet.createdAt} inline={true}/>
                </div>
                <div className="tweet-body">
                    <p>{this.props.tweet.body}</p>
                </div>
            </div>
        );
    }
}

class Timestamp extends React.Component {
    render() {
        const time = new Date(this.props.time);
        return (
            <div className="timestamp">
                {this.props.inline && "at "}
                {time.getHours()}:{('0'+time.getMinutes()).slice(-2)} · {time.toDateString().slice(4,7)} {time.getDate()}, {time.getFullYear()}
                {this.props.time != this.props.createdAt && 
                " - Edited"}
            </div>
        );
    }
}

class ReplyButton extends React.Component {
    constructor(props) {
        super(props);
        this.params = {
            type: "reply",
            parentId: this.props.parentId
        };
        this.incrementCount = this.incrementCount.bind(this);
    }

    incrementCount() {
        this.props.incrementReplyCount();
    }

    render() {
        return (
            <div className="button commet" onClick={() => this.props.openCreatingPanel(this.params, this.incrementCount)}>
                <i className="far fa-comment"></i>
                {this.props.replyCount}
            </div>
        );
    }
}

class RetweetButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            retweetCount: props.retweetCount
        };
        this.params = {
            type: "retweet",
            parentId: this.props.parentId
        };
        this.incrementCount = this.incrementCount.bind(this);
    }

    incrementCount() {
        this.setState({retweetCount: this.state.retweetCount + 1})
    }

    render() {
        return (
            <div className="button retweet" onClick={() => this.props.openCreatingPanel(this.params, this.incrementCount)}>
                <i className="fas fa-retweet"></i>
                {this.state.retweetCount}
            </div>
        );
    }
}

class LikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: props.isLiked,
            likeCount: props.likeCount
        };
        this.unlike = this.unlike.bind(this);
        this.like = this.like.bind(this);
    }

    toggleLike() {
        let isLiked = this.state.isLiked;
        this.setState({
            isLiked: !isLiked,
            likeCount: this.state.likeCount + (isLiked ? -1 : 1)
        });
    }

    async like() {
        try {
            await axios({
                method: 'put',
                url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${this.props.id}/like`,
                withCredentials: true,
            });
            this.toggleLike();
        } catch (error) {
            console.log(error);
        }
    }

    async unlike() {
        try {
            await axios({
                method: 'put',
                url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${this.props.id}/unlike`,
                withCredentials: true,
            });
            this.toggleLike();
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        if (this.state.isLiked) {
            return <div className="button liked" onClick={this.unlike}><i className="fas fa-heart"></i>{this.state.likeCount}</div>;
        }
        return <div className="button like" onClick={this.like}><i className="far fa-heart"></i>{this.state.likeCount}</div>;
    }
}

class Replies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            replies: [],
            isVisible: false
        };
        this.buttonText = ["Show replies", "Hide replies"];
        this.toggleReplies = this.toggleReplies.bind(this);
    }

    async toggleReplies() {
        if (this.state.replies.length != this.props.replyCount) {
            try {
                const result = await axios({
                    method: 'get',
                    url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${this.props.id}`,
                    withCredentials: true,
                });
                this.setState({replies: result.data.replies});
            } catch (error) {
                console.log(error);
            }
        }
        this.setState({isVisible: !this.state.isVisible});
    }

    render() {
        return (
            <div className="tweet-replies">
                <div className="button" onClick={this.toggleReplies}>{this.buttonText[this.state.isVisible+0]}</div>
                {this.state.isVisible && 
                <div className="replies">
                    {this.state.replies.map(reply => <Retweet key={`${reply.id}-${this.props.id}`} tweet={reply} />)}
                </div>
                }
            </div>
        );
    }
}


class NewTweetButton extends React.Component {
    constructor(props) {
        super(props);
        this.params = {
            type: "tweet",
            parentId: null
        };
    }
    render() {
        return (
        <div className="new-tweet-button" onClick={() => this.props.openCreatingPanel(this.params)}>
            <i className="fas fa-pencil-alt fa-lg"></i>
        </div>
        );
    }
}

class CreatingPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
        this.buttonType = {
            "tweet": "Tweet",
            "retweet": "Retweet",
            "reply": "Reply"
        };
        this.placeholder = {
            "tweet": "What's happening?",
            "retweet": "Add a comment",
            "reply": "Tweet your reply"
        };
        this.handleChange = this.handleChange.bind(this);
        this.postTweet = this.postTweet.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value})
    }

    async postTweet() {
        try {
            let result = null;
            if (this.props.type == "tweet") {
                result = await axios({
                    method: 'post',
                    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
                    withCredentials: true,
                    data: {
                        body: this.state.value
                    },
                });
            } else {
                result = await axios({
                    method: 'post',
                    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
                    withCredentials: true,
                    data: {
                      type: this.props.type,
                      parent: this.props.parentId,
                      body: this.state.value
                    },
                });
                this.props.countHandler();
            }
            if (this.props.type != "reply") {
                this.props.prependTweet(result.data);
            }
            this.props.closeCreatingPanel();
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
        <div className="create">
            <div className="tweet">
                <textarea className="textarea" value={this.state.value} onChange={this.handleChange}
                    placeholder={this.placeholder[this.props.type]} autoFocus></textarea>
                <div className="button-box-2">
                    <div className="button post-tweet" onClick={this.postTweet}>
                        {this.buttonType[this.props.type]}
                    </div>
                    <div className="button cancel-tweet" onClick={this.props.closeCreatingPanel}>Cancel</div>
                </div>
            </div>
        </div>
        );
    }
}

const exampleTweets = [{
    "id": 11,
    "type": "retweet",
    "body": "The force is strong in my family.",
    "parent": {
      "id": 4,
      "type": "tweet",
      "body": "May the force be with you.",
      "author": "Obi-Wan K.",
      "isMine": false,
      "isLiked": false,
      "retweetCount": 1,
      "replyCount": 2,
      "likeCount": 3,
      "someLikes": ["Yoda", "Rey", "Mace W."],
      "createdAt": 1565457409819,
      "updatedAt": 1565457409819
    },
    "parentId": 4,
    "author": "Luke S.",
    "isMine": true,
    "isLiked": true,
    "retweetCount": 2,
    "replyCount": 9,
    "likeCount": 10,
    "someLikes": [],
    "createdAt": 1565457495114,
    "updatedAt": 1565457495114
}, {
    "id": 7,
    "type": "tweet",
    "body": "Now this is podracing",
    "author": "Anakin S.",
    "isMine": false,
    "isLiked": false,
    "retweetCount": 1,
    "replyCount": 0,
    "likeCount": 1,
    "someLikes": ["Mace W."],
    "createdAt": 1565457409819,
    "updatedAt": 1565457409819
}];

const renderTweets = (tweets) => {
    ReactDOM.render(
        <App tweets={tweets} />,
        document.getElementById('app')
    );
}

const main = async () => {
    try {
        const result = await axios({
            method: 'get',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
            withCredentials: true,
            params: {
               limit: 30 
            }
        });
        renderTweets(result.data);
    } catch (error) {
        console.log(error);
    }
}

main();
// renderTweets(exampleTweets);