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

    async fetchReplies() {
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

    async toggleReplies() {
        if (this.state.replies.length != this.props.replyCount) {
            await this.fetchReplies();
        }
        this.setState({
            isVisible: !this.state.isVisible
        });
    }

    render() {
        return (
            <div className="tweet-replies">
                <div className="button" onClick={this.toggleReplies}>{this.buttonText[this.state.isVisible+0]}</div>
                {this.state.isVisible && 
                <div className="replies">
                    {this.state.replies.length != this.props.replyCount && 
                    <Retweet key={`${this.props.newReply.id}-${this.props.id}`} tweet={this.props.newReply}/>}
                    {this.state.replies.map(reply => <Retweet key={`${reply.id}-${this.props.id}`} tweet={reply} />)}
                </div>
                }
            </div>
        );
    }
}
