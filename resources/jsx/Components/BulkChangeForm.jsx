import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, withRouter } from 'react-router-dom';
import axios from 'axios';

class BulkChangeForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "internshipBegin": "",
            "internshipEnd": "",
            "jobBegin": "",
            "jobEnd": "",
            "practiceBegin": "",
            "practiceEnd": "",
            "yearOfStudy": "",
            "personsId":this.props.location.state.selectedPersons
        }
        this.bulkChangeData = this.bulkChangeData.bind(this);
        this.redirectToMainPage = this.redirectToMainPage.bind(this);
    }
    componentWillReceiveProps(){
        this.refs["yearOfStudyCB"].checked = false;
        this.refs["internshipBeginCB"].checked = false;
        this.refs["practiceBeginCB"].checked = false;
        this.refs["jobBeginCB"].checked = false;
        this.refs["internshipEndCB"].checked = false;
        this.refs["practiceEndCB"].checked = false;
        this.refs["jobEndCB"].checked = false;
    }
    bulkChangeData(){
        return axios.put(`/restapi/person`, this.state)
        .then(response => {
            console.log(response);
            this.redirectToMainPage();
        })        
        .catch(function (error) {
            console.log(error);
        });
    }
    handleCancelClick() {
        this.props.history.goBack();
    }                 
    handleInputChange(name, event) {
        if (!event.target.value)
            this.setState({[name]: null});
        else this.setState({[name]: event.target.value});
    }
    handleCheckBoxChange(name, event) {
        let inputField = [name.slice(0,-2)];
        if (!this.refs[name].checked) {
            this.setState((prevState, props) => ({
                [name]: false,
                [inputField]:""
            }));
            this.refs[inputField].disabled = true;
            this.refs[inputField].value = "";
        }
        else {
            this.setState((prevState, props) => ({
                [name]: true,
                [inputField]: null
            }));
            this.refs[inputField].disabled = false;
        }

    }
    handleSubmit(event) {
        event.stopPropagation();
        event.preventDefault();
        this.bulkChangeData();
    }
    redirectToMainPage(){
        console.log("redirecting");
        this.props.history.push("/");
    }
    render() {
        return(
            <div id="BulkChangeForm" className="">
                <form className="form-group col-sm-12" encType="multipart/form-data" onSubmit={this.handleSubmit.bind(this)} ref="form">
                    <div className="mb-3 col-sm-10">
                        <div className="row">
                            <div className="mb-3 col-sm-5">
                                <label className="col-form-label" htmlFor="yearOfStudy">Year of study &nbsp;</label>
                                <input id="yearOfStudyCB" ref="yearOfStudyCB" type="checkbox" onChange={this.handleCheckBoxChange.bind(this, 'yearOfStudyCB')}/>
                                <input type="text" className="form-control" id="yearOfStudyValue" ref="yearOfStudy" value={this.state.yearOfStudy} onChange={this.handleInputChange.bind(this, 'yearOfStudy')} disabled/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-sm-5 ">
                                <label className="col-form-label" htmlFor="internshipBegin">Internship begin &nbsp;</label>
                                <input id="internshipBeginCB" ref="internshipBeginCB" type="checkbox" onChange={this.handleCheckBoxChange.bind(this, 'internshipBeginCB')}/>
                                <input type="text" className="form-control" id="internshipBegin" ref="internshipBegin" placeholder="MM.YYYY" value={this.state.internshipBegin} onChange={this.handleInputChange.bind(this, 'internshipBegin')} disabled/>
                            </div> 
                            <div className="mb-3 col-sm-5 ">
                                <label className="col-form-label" htmlFor="internshipEnd">Internship end &nbsp;</label>
                                <input id="internshipEndCB" ref="internshipEndCB" type="checkbox" onChange={this.handleCheckBoxChange.bind(this, 'internshipEndCB')}/>
                                <input type="text" className="form-control" id="internshipEnd" ref="internshipEnd" placeholder="MM.YYYY" value={this.state.internshipEnd} onChange={this.handleInputChange.bind(this, 'internshipEnd')} disabled/>
                            </div> 
                        </div>
                        <div className="row">
                            <div className="mb-3 col-sm-5 ">
                                <label className="col-form-label" htmlFor="practiceBegin">Practice begin &nbsp;</label>
                                <input id="practiceBeginCB" ref="practiceBeginCB" type="checkbox" onChange={this.handleCheckBoxChange.bind(this, 'practiceBeginCB')}/>
                                <input type="text" className="form-control" id="practiceBegin" ref="practiceBegin" placeholder="MM.YYYY" value={this.state.practiceBegin} onChange={this.handleInputChange.bind(this, 'practiceBegin')} disabled/>
                            </div> 
                            <div className="mb-3 col-sm-5 ">
                                <label className="col-form-label" htmlFor="practiceEnd">Practice end &nbsp;</label>
                                <input id="practiceEndCB" ref="practiceEndCB" type="checkbox" onChange={this.handleCheckBoxChange.bind(this, 'practiceEndCB')}/>
                                <input type="text" className="form-control" id="practiceEnd" ref="practiceEnd" placeholder="MM.YYYY" value={this.state.practiceEnd} onChange={this.handleInputChange.bind(this, 'practiceEnd')} disabled/>
                            </div> 
                        </div>
                        <div className="row">
                            <div className="mb-3 col-sm-5 ">
                                <label className="col-form-label" htmlFor="jobBegin">Job begin &nbsp;</label>
                                <input id="jobBeginCB" ref="jobBeginCB" type="checkbox" onChange={this.handleCheckBoxChange.bind(this, 'jobBeginCB')}/>
                                <input type="text" className="form-control" id="jobBegin" ref="jobBegin" placeholder="MM.YYYY" value={this.state.jobBegin} onChange={this.handleInputChange.bind(this, 'jobBegin')} disabled/>
                            </div> 
                            <div className="mb-3 col-sm-5" >
                                <label className="col-form-label" htmlFor="jobEnd">Job end &nbsp;</label>
                                <input id="jobEndCB" ref="jobEndCB" type="checkbox" onChange={this.handleCheckBoxChange.bind(this, 'jobEndCB')}/>
                                <input type="text" className="form-control" id="jobEnd" ref="jobEnd" placeholder="MM.YYYY" value={this.state.jobEnd} onChange={this.handleInputChange.bind(this, 'jobEnd')} disabled/>
                            </div> 
                        </div>
                        <div className="row">
                            <div className="mb-3 col-sm-5">
                                <button className="btn btn-primary no-print" type="submit">Update all</button>  
                                <button className="btn btn-outline-dark no-print" type="reset" onClick={this.handleCancelClick.bind(this)}>Cancel</button>                    
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(BulkChangeForm);