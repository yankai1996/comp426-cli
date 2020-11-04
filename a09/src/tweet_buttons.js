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
