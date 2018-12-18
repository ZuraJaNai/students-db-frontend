import React from "react";
import ReactDOM from "react-dom";


class PageButton extends React.Component {
    constructor(props){
        super(props);
        
    }
    onClick(num) {
        switch(num) {
            case '<':
                this.props.returnToPageController(num - 1);
                break;
            case '>':
                this.props.returnToPageController(num + 1);
                break;
            default: 
            console.log(num);
                this.props.returnToPageController(num);
                break;
        }
    }
    render() {
        return (
            <button key={this.props.index} className={this.props.className + (this.props.isActive ? ' btn btn-primary' : ' btn btn-secondary')} 
                onClick={this.onClick.bind(this, this.props.children)}>{this.props.children}</button>
        );
    }
}
export default PageButton;