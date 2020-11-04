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
