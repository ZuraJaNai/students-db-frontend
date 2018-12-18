import React from "react";
import ReactDOM from "react-dom";

class SearchPanel extends React.Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        return (
            <div className='row no-print'>
                <div className="col-sm-8">
                </div>
                <div className="col-sm-4">
                    <button className='btn btn-default' type='button' onClick={ this.props.extraSearch }>
                        Search
                    </button>
                    <button className='btn btn-default' type='button' onClick={ this.props.clear }>
                        Reset
                    </button>
                </div>
            </div>
      );
    }
  }

export default SearchPanel;