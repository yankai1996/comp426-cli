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
                <Replies id={this.props.tweet.id} replyCount={this.state.replyCount} newReply={this.props.newReply}/>
                }
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
