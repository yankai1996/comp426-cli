class EditingButtons extends React.Component {
    render() {
        if (!this.props.editing) {
            return (
                <div className="button-box">
                    <div className="button edit-button"  onClick={this.props.toggleEditing}><i className="fas fa-edit"></i></div>
                    <DeleteButton deleteTweet={this.props.deleteTweet} />
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

class DeleteButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirming: false,
            style: {cursor: "pointer"}
        };
        this.showConfirmPanel = this.showConfirmPanel.bind(this);
        this.hideConfirmPanel = this.hideConfirmPanel.bind(this);
    }

    showConfirmPanel() {
        if (this.state.isConfirming) return;
        this.setState({
            isConfirming: true,
            style: {cursor: "auto"}
        });
    }

    hideConfirmPanel() {
        this.setState({
            isConfirming: false,
            style: {cursor: "pointer"}
        });
    }

    render() {
        return (
            <div className="button delete-button" onClick={this.showConfirmPanel} style={this.state.style}>
                <i className="fas fa-trash-alt"></i>
                {this.state.isConfirming && 
                <div className="curtain">
                    <div className="delete-panel">
                        <div><strong>Delete this tweet?</strong></div>
                        <div className="button-box-2">
                            <div className="button cancel-tweet" onClick={this.props.deleteTweet}>Delete</div>
                            <div className="button post-tweet" onClick={this.hideConfirmPanel}>Cancel</div>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}
