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
        const data = this.props.type == "tweet" ? {
            body: this.state.value
        } : {
            type: this.props.type,
            parent: this.props.parentId,
            body: this.state.value
        };

        try {
            const result = await axios({
                method: 'post',
                url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
                withCredentials: true,
                data: data
            });
            if (this.props.type != "tweet") {
                this.props.countHandler();
            }
            this.props.newTweetHandler(result.data);
            this.props.closeCreatingPanel();
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div className="create curtain">
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
