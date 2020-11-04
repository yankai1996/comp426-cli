class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tweets: props.tweets,
            creating: false,
            type: null,
            parentId: null,
            countHandler: null,
            newReply: {},
            isLoading: true
        };
        this.lastTweetId = props.tweets[props.tweets.length-1].id,
        this.openCreatingPanel = this.openCreatingPanel.bind(this);
        this.closeCreatingPanel = this.closeCreatingPanel.bind(this);
        this.removeTweet = this.removeTweet.bind(this);
        this.newTweetHandler = this.newTweetHandler.bind(this);
        this.infiniteScrollingHandler = this.infiniteScrollingHandler.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.infiniteScrollingHandler);
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

    newTweetHandler(tweet) {
        if (tweet.type == "reply") {
            this.setState({newReply: tweet});
        } else {
            this.setState({tweets: [tweet, ...this.state.tweets]});
        }
    }

    assignNewReply(parentId) {
        return parentId == this.state.newReply.parentId ? this.state.newReply : null;
    }

    infiniteScrollingHandler() {
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
            window.removeEventListener('scroll', this.infiniteScrollingHandler);
            setTimeout(async () => {
                if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
                    if (!await this.appendTweets()) {
                        return;
                    }
                }
                window.addEventListener('scroll', this.infiniteScrollingHandler);
            }, 2000);
        }
    }

    async appendTweets() {
        try {
            const result = await axios({
                method: 'get',
                url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
                withCredentials: true,
                params: {
                    limit: 30,
                    skip: this.state.tweets.length
                }
            });
            if (result.data.length == 0) {
                this.setState({isLoading: false});
                return false;
            }

            const additonalTweets = result.data.filter(tweet => tweet.id < this.lastTweetId);
            this.lastTweetId = result.data[result.data.length-1].id;
            if (additonalTweets.length) {
                this.setState({tweets: [...this.state.tweets, ...additonalTweets]});
                return true;
            }
            return await this.appendTweets();
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div>
                <div className="header">
                    <i className="fab fa-twitter fa-2x"></i>
                    <span>COMP 426 Twitter</span>
                </div>
                <div className="content">
                    {this.state.tweets.map(tweet => <Tweet key={tweet.id} tweet={tweet} newReply={this.assignNewReply(tweet.id)}
                        removeTweet={this.removeTweet} openCreatingPanel={this.openCreatingPanel}/>)}
                </div>
                <NewTweetButton openCreatingPanel={this.openCreatingPanel}/>
                {this.state.creating &&
                <CreatingPanel closeCreatingPanel={this.closeCreatingPanel} countHandler={this.state.countHandler}
                    newTweetHandler={this.newTweetHandler} type={this.state.type} parentId={this.state.parentId}/>
                }
                {this.state.isLoading && <Loader />}
            </div>
        );
    }
}
