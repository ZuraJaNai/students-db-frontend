import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import PageButton from './PageButton.jsx';


const BASE_SHIFT  = 0;
const TITLE_SHIFT = 1;

class PageController extends React.Component {
    constructor(props){
        super(props);

        this.handlePreviousPage = this.handlePreviousPage.bind(this);
		this.handleNextPage = this.handleNextPage.bind(this);
    }
    calcBlocks() {
		const props = this.props;
		const total = props.totalPages;
		const blockSize = props.visiblePages;
		const current = props.currentPage;
		const blocks = Math.ceil(total / blockSize);
		const currBlock = Math.ceil(current / blockSize) - TITLE_SHIFT;

		return {
			total:    blocks,
			current:  currBlock,
			size:     blockSize,
		};
    }
    isPrevDisabled() {
		return !(this.props.currentPage > 1);
	}

	isNextDisabled() {
		return !(this.props.currentPage < this.props.totalPages);
    }
    visibleRange() {
		const blocks = this.calcBlocks();
		const start = blocks.current * blocks.size;
		const delta = this.props.totalPages - start;
		const end = start + ((delta > blocks.size) ? blocks.size : delta);
        //console.log([start + TITLE_SHIFT, end + TITLE_SHIFT]);
		return [start + TITLE_SHIFT, end + TITLE_SHIFT];
    }
    
    handlePreviousPage() {
		if (!this.isPrevDisabled()) {
			this.handlePageChanged(this.props.currentPage - TITLE_SHIFT);
		}
	}
	handleNextPage() {
		if (!this.isNextDisabled()) {
			this.handlePageChanged(this.props.currentPage + TITLE_SHIFT);
		}
    }
    handlePageChanged(num) {
		const handler = this.props.returnToUserList;
		if (handler) handler(num);
    }
    range(start, end) {
        const res = [];
        for (let i = start; i < end; i++) {
            res.push(i);
        }
    
        return res;
    }
    renderPages(pair) {
		return this.range(pair[0], pair[1]).map((num, idx) => {
			const isActive = (this.props.currentPage === num);

			return (
				<PageButton
					key={idx}
					index={idx}
					isActive={isActive}
					className="btn-numbered-page"
                    returnToPageController={this.handlePageChanged.bind(this, num)}
				>{num}</PageButton>
			);
		});
	}
    render() {
        return (
            <div className="col-sm-offset-10 col-sm-2.5">
                <PageButton
                    className="btn-first-page "
                    key="btn-first-page"
                    isDisabled={false}
                    returnToPageController={this.handlePageChanged.bind(this, 1)}
                >{this.props.titles['first']}</PageButton> 

                <PageButton
                    className="btn-prev-page "
                    key="btn-prev-page"
                    isDisabled={this.isPrevDisabled()}
                    returnToPageController={this.handlePreviousPage.bind(this)}
                >{this.props.titles['prev']}</PageButton>  
                    
                {this.renderPages(this.visibleRange())}

                <PageButton
                    className="btn-next-page "
                    key="btn-next-page"
                    isDisabled={this.isNextDisabled()}
                    returnToPageController={this.handleNextPage.bind(this)}
                >{this.props.titles['next']}</PageButton>

                <PageButton
                    className="btn-last-page "
                    key="btn-last-page"
                    isDisabled={false}
                    returnToPageController={this.handlePageChanged.bind(this,  this.props.totalPages)}
                >{this.props.titles['last']}</PageButton> 
            </div>
        )
    }
}

export default PageController;