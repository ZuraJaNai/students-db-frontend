import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "comment": this.props.data.comment || "",
            "email": this.props.data.email || "",
            "firstName": this.props.data.firstName || "",
            "internship": this.props.data.internship || "",
            "internshipDate": this.props.data.internshipDate || "",
            "job": this.props.data.job || "",
            "jobDate": this.props.data.jobDate || "",
            "lastName": this.props.data.lastName || "",
            "practice": this.props.data.practice || "",
            "practiceDate": this.props.data.practiceDate || "",
            "yearOfStudy": this.props.data.yearOfStudy || ""
        }
    }
    componentDidMount(){
        if(this.state.internship == "true"){
            this.refs["internship"].checked = true;
        }
        if(this.state.practice == "true"){
            this.refs["practice"].checked = true;
        }
        if(this.state.job == "true"){
            this.refs["job"].checked = true;
        }
    }
    handleInputChange(name, event) {
        if (!event.target.value)
            this.setState({[name]: null});
        else this.setState({[name]: event.target.value});
    }
    handleCheckBoxChange(name, event) {
        if (!this.refs[name].checked) 
            this.setState((prevState, props) => ({
                [name]: "false"
            }));
        else this.setState((prevState, props) => ({
            [name]: "true"
        }));

    }
    handleSearch(event) {
        event.preventDefault();
        event.stopPropagation();  

        this.setState({
            clear: false
        })
        let data = {};   
        let entries = Object.entries(this.state);
        for (let field of entries) {
            if (field[1] && field[1] !== "false") {
                data[field[0]] = field[1];
            }
        }
        this.searchData(data);
    }
    clearSearchFields(){
        this.setState({
            "comment": "",
            "email": "",
            "firstName": "",
            "internship": "false",
            "internshipDate": "",
            "job": "false",
            "jobDate": "",
            "lastName": "",
            "practice": "false",
            "practiceDate": "",
            "yearOfStudy": ""
        },()=>{
            console.log(this.state.internship);
        });
        this.refs["internship"].checked = false;
        this.refs["practice"].checked = false;
        this.refs["job"].checked = false;
    }
    searchData(data) {
        console.log(data);
        this.props.returnToUserList(data);
    }
    determineValue(name){
        console.log(name);
    }
    render() {
        if (this.props.hide) return null;
        return(
            <div>
                <div className="needs-validation" noValidate>
                    <div className="mb-3 col-sm-10 form-inline">
                        <label className="col-form-label" id="lastName" htmlFor="lastName"> &nbsp; Last name &nbsp; </label>
                        <input type="text" className="form-control" id="lastName" ref="lastName" placeholder="Surname" value={this.state.lastName} onChange={this.handleInputChange.bind(this, 'lastName')}/>
                        
                        <label className="col-form-label" id="firstName" htmlFor="firstName"> &nbsp; First name &nbsp; </label>
                        <input type="text" className="form-control" id="firstName" ref="firstName" placeholder="Name" value={this.state.firstName} onChange={this.handleInputChange.bind(this, 'firstName')}/>
                    </div>
                    <div className="mb-3 col-sm-5">
                        <label className="col-form-label" htmlFor="email"> &nbsp; E-mail &nbsp; </label>
                        <input type="text" className="form-control" id="email" ref="email" value={this.state.email} onChange={this.handleInputChange.bind(this, 'email')}/>
                    </div> 
                    <div className="mb-3 col-sm-5">
                        <label className="col-form-label" htmlFor="yearOfStudy"> &nbsp; Year of study &nbsp; </label>
                        <input type="text" className="form-control" id="yearOfStudy" ref="yearOfStudy" placeholder="YYYY,YYYY,..." value={this.state.yearOfStudy} onChange={this.handleInputChange.bind(this, 'yearOfStudy')}/>
                    </div>
                    <div className="mb-3 col-sm-5">
                        <label className="col-form-label" htmlFor="internship"> &nbsp; Internship &nbsp; </label>
                        <input id="internship" ref="internship" type="checkbox" value={this.determineValue.bind(this)} onChange={this.handleCheckBoxChange.bind(this, 'internship')}/>
                    </div>
                    <div className="mb-3 col-sm-5">
                        <label className="col-form-label" htmlFor="internshipDate"> &nbsp; Internship date &nbsp; </label>
                        <input type="text" className="form-control" id="internshipDate" ref="internshipDate" placeholder="MM.YYYY or MM.YYYY-MM.YYYY" value={this.state.internshipDate} onChange={this.handleInputChange.bind(this, 'internshipDate')}/>
                    </div> 
                    <div className="mb-3 col-sm-5">
                        <label className="col-form-label" htmlFor="practice"> &nbsp; Practice &nbsp; </label>
                        <input id="practice" ref="practice" type="checkbox" onChange={this.handleCheckBoxChange.bind(this, 'practice')}/>
                    </div>
                    <div className="mb-3 col-sm-5">
                        <label className="col-form-label" htmlFor="practiceDate"> &nbsp; Practice date &nbsp; </label>
                        <input type="text" className="form-control" id="practiceDate" ref="practiceDate" placeholder="MM.YYYY or MM.YYYY-MM.YYYY" value={this.state.practiceDate} onChange={this.handleInputChange.bind(this, 'practiceDate')}/>
                    </div> 
                    <div className="mb-3 col-sm-5">
                        <label className="col-form-label" htmlFor="job"> &nbsp; Job &nbsp; </label>
                        <input id="job" ref="job" type="checkbox" onChange={this.handleCheckBoxChange.bind(this, 'job')}/>
                    </div>
                    <div className="mb-3 col-sm-5">
                        <label className="col-form-label" htmlFor="jobDate"> &nbsp; Job date &nbsp; </label>
                        <input type="text" className="form-control" id="jobDate" ref="jobDate" placeholder="MM.YYYY or MM.YYYY-MM.YYYY" value={this.state.jobDate} onChange={this.handleInputChange.bind(this, 'jobDate')}/>
                    </div> 
                    <div className="mb-3 col-sm-5">
                        <label className="col-form-label" htmlFor="comment">Comment &nbsp; </label>
                        <input type="text" className="form-control" id="comment" ref="comment" placeholder="Phone" value={this.state.comment} onChange={this.handleInputChange.bind(this, 'comment')}/>
                    </div>
                    <div className="mb-3 col-sm-5">
                        <button className="btn btn-primary col-sm" onClick={this.handleSearch.bind(this)}>Search</button>  
                        <button className="btn btn-basic col-sm" onClick={this.clearSearchFields.bind(this)}>Clear</button>  
                    </div>
                </div>
            </div>
        );
    }
}

export default Search;