import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, withRouter } from 'react-router-dom';
import axios from 'axios';

class BulkChangeForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            totalNumberOfPersons: null,
            numberOfPersonsByYear: [],
            numberOfPersonsWithInternshipNow: null,
            numberOfPersonsWithInternship: null,
            numberOfPersonsWithPracticeNow: null,
            numberOfPersonsWithPractice: null,
            numberOfPersonsWithJobNow: null,
            numberOfPersonsWithJob: null,
            numberOfPersonsWithInternshipNowHover: false,
            numberOfPersonsWithInternshipHover: false,
            numberOfPersonsWithPracticeNowHover: false,
            numberOfPersonsWithPracticeHover: false,
            numberOfPersonsWithJobNowHover: false,
            numberOfPersonsWithJobHover: false
        }
        this.createYearsMap = this.createYearsMap.bind(this);
        this.getCurrentDate = this.getCurrentDate.bind(this);
        this.stringifyQuery = this.stringifyQuery.bind(this);
    }
    componentDidMount() {
        this.getData(`/restapi/statistic`);
    }
    getData(pathname){
        axios.get(pathname).then(
            response =>{
                console.log(response);
                this.setState({
                    totalNumberOfPersons: response.data.totalNumberOfPersons,
                    numberOfPersonsByYear: response.data.numberOfPersonsByYear,
                    numberOfPersonsWithInternshipNow: response.data.numberOfPersonsWithInternshipNow,
                    numberOfPersonsWithInternship: response.data.numberOfPersonsWithInternship,
                    numberOfPersonsWithPracticeNow: response.data.numberOfPersonsWithPracticeNow,
                    numberOfPersonsWithPractice: response.data.numberOfPersonsWithPractice,
                    numberOfPersonsWithJobNow: response.data.numberOfPersonsWithJobNow,
                    numberOfPersonsWithJob: response.data.numberOfPersonsWithJob
                });
            }
        )
    }
    handleGoBackClick() {
        this.props.history.push('/');
    }    
    createYearsMap(){
        var data = [];
        var map = this.state.numberOfPersonsByYear;
        var value;
        Object.keys(map).forEach(function(key) {
            data.push({
                key: key,
                value: map[key]
            });
        });
        return data;
    }
    onRowClick(element){
        console.log(element.key);
    }
    hoverOn(e){
        var id = e.currentTarget.id;
        var name = id+"Hover";
        this.setState({[name]: true});  
    }
    hoverOff(e){ 
        var id = e.currentTarget.id;
        var name = id+"Hover";
        this.setState({[name]: false});  
    }
    getCurrentDate(){
        var today = new Date();
        var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        var currentMonth = today.getMonth().toString();
        var currentYear = today.getFullYear().toString();
        return months[currentMonth] + "." + currentYear;
    }
    handleSearch(e) {
        var parameter = e.currentTarget.id;
        var currentDate = this.getCurrentDate();
        console.log(currentDate);
        switch(parameter){
            case 'numberOfPersonsWithInternshipNow':{
                this.searchData({"internshipDate": currentDate})
                break;
            }
            case 'numberOfPersonsWithPracticeNow':{
                this.searchData({"practiceDate": currentDate})
                break;
            }
            case 'numberOfPersonsWithJobNow':{
                this.searchData({"jobDate": currentDate})
                break;
            }
            case 'numberOfPersonsWithInternship':{
                this.searchData({"internship": "true"})
                break;
            }
            case 'numberOfPersonsWithPractice':{
                this.searchData({"practice": "true"})
                break;
            }
            case 'numberOfPersonsWithJob':{
                this.searchData({"job": "true"})
                break;
            }
            default: break;
        }
    }  
    searchData(searchData){
        var query = this.stringifyQuery(searchData);
        this.props.history.push('/search?' + query);
    }
    stringifyQuery(searchData){
        var result = "";
        for(var param in searchData){
            result += param + "=" + searchData[param] + "&"
        }
        return result.slice(0,-1);
    }
    render() {
        const options = {
            onRowClick: this.onRowClick
        };

        return(
            <div id="" className="">
                <button className="btn btn-info" type="reset" onClick={this.handleGoBackClick.bind(this)}>Go Back</button>
                <div className="row">
                    <div className="col-sm-7 h3">
                        <div id="totalNumberOfPersons" className="row mb-sm-4 text-success" onClick={this.handleSearch.bind(this)}>
                            <p className="col-sm-8">Total number of students</p>
                            <p className="col-sm-4">{this.state.totalNumberOfPersons}</p>
                        </div>
                        <br/>
                        <div id="numberOfPersonsWithInternshipNow" className={this.state.numberOfPersonsWithInternshipNowHover ? "row mb-sm-4 text-danger" : "row mb-sm-4 text-primary"} 
                            onMouseEnter={this.hoverOn.bind(this)} onMouseLeave={this.hoverOff.bind(this)} onClick={this.handleSearch.bind(this)}>
                            <p className="col-sm-8">Number of students on internship now</p>
                            <p className="col-sm-4">{this.state.numberOfPersonsWithInternshipNow}</p>
                        </div>
                        <br/>
                        <div id="numberOfPersonsWithInternship" className={this.state.numberOfPersonsWithInternshipHover ? "row mb-sm-4 text-danger" : "row mb-sm-4 text-success"} 
                            onMouseEnter={this.hoverOn.bind(this)} onMouseLeave={this.hoverOff.bind(this)} onClick={this.handleSearch.bind(this)}>
                            <p className="col-sm-8">Number of students on internship during all time</p>
                            <p className="col-sm-4">{this.state.numberOfPersonsWithInternship}</p>
                        </div>
                        <br/>
                        <div id="numberOfPersonsWithPracticeNow" className={this.state.numberOfPersonsWithPracticeNowHover ? "row mb-sm-4 text-danger" : "row mb-sm-4 text-primary"} 
                            onMouseEnter={this.hoverOn.bind(this)} onMouseLeave={this.hoverOff.bind(this)} onClick={this.handleSearch.bind(this)}>
                            <p className="col-sm-8">Number of students on practice now</p>
                            <p className="col-sm-4">{this.state.numberOfPersonsWithPracticeNow}</p>
                        </div>
                        <br/>
                        <div id="numberOfPersonsWithPractice" className={this.state.numberOfPersonsWithPracticeHover ? "row mb-sm-4 text-danger" : "row mb-sm-4 text-success"} 
                            onMouseEnter={this.hoverOn.bind(this)} onMouseLeave={this.hoverOff.bind(this)} onClick={this.handleSearch.bind(this)}>
                            <p className="col-sm-8">Number of students on practice during all time</p>
                            <p className="col-sm-4">{this.state.numberOfPersonsWithPractice}</p>
                        </div>
                        <br/>
                        <div id="numberOfPersonsWithJobNow" className={this.state.numberOfPersonsWithJobNowHover ? "row mb-sm-4 text-danger" : "row mb-sm-4 text-primary"} 
                            onMouseEnter={this.hoverOn.bind(this)} onMouseLeave={this.hoverOff.bind(this)} onClick={this.handleSearch.bind(this)}>
                            <p className="col-sm-8">Number of students on job now</p>
                            <p className="col-sm-4">{this.state.numberOfPersonsWithJobNow}</p>
                        </div>
                        <br/>
                        <div id="numberOfPersonsWithJob" className={this.state.numberOfPersonsWithJobHover ? "row mb-sm-4 text-danger" : "row mb-sm-4 text-success"} 
                            onMouseEnter={this.hoverOn.bind(this)} onMouseLeave={this.hoverOff.bind(this)} onClick={this.handleSearch.bind(this)}>
                            <p className="col-sm-8">Number of students on job during all time</p>
                            <p className="col-sm-4">{this.state.numberOfPersonsWithJob}</p>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <BootstrapTable data={ this.createYearsMap()} hover options={ options }>
                            <TableHeaderColumn dataField='key' width='50' isKey>Year</TableHeaderColumn>
                            <TableHeaderColumn dataField='value' width='50'>Quantity</TableHeaderColumn>
                        </BootstrapTable>
                        <p></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(BulkChangeForm);