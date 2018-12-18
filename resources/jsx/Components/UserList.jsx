import React from "react";
import ReactDOM from "react-dom";
import { Modal, Body, Title, Header, Button} from 'react-bootstrap'
import { Link, Switch, Route, HashRouter } from 'react-router-dom'
import { BootstrapTable, TableHeaderColumn, PaginationList } from 'react-bootstrap-table';
import axios from 'axios';
import UserProfile from './UserProfile.jsx';
import Search from './Search.jsx';
import SearchPanel from './SearchPanel.jsx';
import PageController from './PageController.jsx';
import BulkChangeForm from './BulkChangeForm.jsx';
import Statistic from "./Statistic.jsx";

class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            count: 0, 
            currentPage: 0, 
            persons: [], 
            selectedPersons: [],
            totalPages: 0,
            visiblePages: 3,
            currentBlock: 1,
            searchHide: true,
            searchMode: this.props.searchMode || false,
            searchRequestData: {},
            formData: new FormData(),
            fileLoaded: false,
            pageLimit: localStorage.getItem("pageLimit"),
            showImport: false,
            selectedEmails: []
        };
        this.options = {
            clearSearchHandler: true,
            searchPanel: (props) => (<SearchPanel extraSearch={this.extraSearchHandler.bind(this)}
            clear={ this.clearSearchHandler.bind(this) }/>)
        }
        this.getData = this.getData.bind(this);
        this.getSearchData = this.getSearchData.bind(this);
        this.makeFullName = this.makeFullName.bind(this);
        this.makeInternshipDate = this.makeInternshipDate.bind(this);
        this.makePracticeDate = this.makePracticeDate.bind(this);
        this.makeJobDate = this.makeJobDate.bind(this);
        this.setBeginDate = this.setBeginDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.paginationHandler = this.paginationHandler.bind(this);
        this.indexesHandler = this.indexesHandler.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handlePageLimitChange = this.handlePageLimitChange.bind(this);
        this.handlePageLimitSubmit = this.handlePageLimitSubmit.bind(this);
        this.handleShowImport = this.handleShowImport.bind(this);
        this.handleCloseImport = this.handleCloseImport.bind(this);
        this.onRowSelect = this.onRowSelect.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.getMainPageData = this.getMainPageData.bind(this);
        this.countQueryParamsNumber = this.countQueryParamsNumber.bind(this);
        this.stringifyQuery = this.stringifyQuery.bind(this);
        this.parseQuery = this.parseQuery.bind(this);
    }
    componentDidMount() {
        if (!this.state.pageLimit) {
            this.setState((prevState,props) => ({
                pageLimit: "10"
            }),()=>{
                localStorage.setItem("pageLimit",this.state.pageLimit);
                this.getMainPageData();
            });
        }
        else{
            this.getMainPageData();
        }
    }
    getMainPageData(){
        var query = this.parseQuery(this.props.location.search);
        console.log(query);
        if(this.state.searchMode && (this.countQueryParamsNumber(query) > 0)){
            this.setState({
                searchRequestData : query
            },()=>{
                this.getSearchData(`/restapi/person/search`, query, 1, true);
                this.extraSearchHandler();
            });

        }
        else {
           this.getData('/restapi/person',1,true);
        }
    }
    countQueryParamsNumber(query){
        var count = 0;
        for(var param in query){
                count++;
        }
        return count;
    }
    stringifyQuery(data){
        var result = "";
        for(var param in data){
            result += param + "=" + data[param] + "&"
        }
        return result.slice(0,-1);
    }
    parseQuery(data){
        var result = {};
        console.log(data.startsWith("?"));
        console.log(data);
        if(data.startsWith("?")){
            var params = data.slice(1,data.length).split("&");
            console.log(params);
            for(var i = 0;i < params.length; i++){
                result[params[i].split("=")[0]] = params[i].split("=")[1];
            }
        }
        return result;
    }
    reload() {
        window.location.reload(true);
    }
    getData(pathname, currentPage, pageable) {
        return axios.get(pathname, {
            params: {
                page: currentPage,
                pagination: pageable,
                limit: parseInt(this.state.pageLimit)
            }
        })
        .then(response => {
            console.log(response);
            this.setState({
                count: response.data.count,
                currentPage: response.data.currentPage,
                persons: response.data.persons,
                totalPages: response.data.totalPages,
                pagination: pageable
            });
            this.indexesHandler();
            if (pageable) 
                this.paginationHandler();
            return response;
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    getSearchData(pathname, data, currentPage, pageable) {
        return axios({
            method: 'post',
            url: pathname, 
            data: data,
            params: {
                page: currentPage,
                pagination: pageable,
                limit: parseInt(this.state.pageLimit)
            },
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            console.log(response);
            this.setState({
                count: response.data.count,
                currentPage: response.data.currentPage,
                persons: response.data.persons,
                totalPages: response.data.totalPages,
                pagination: pageable,
                searchMode: true,
                clear:false
            });
            this.indexesHandler();
            if (pageable) 
                this.paginationHandler();
            return response;
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    importData(pathname, file) {
        axios.post(pathname, file)
        .then(response => {
            console.log(response);
            this.getData('/restapi/person', 1, true);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    indexesHandler() {
        let i = 1;
        if(this.state.currentPage > 0){
            for (let person of this.state.persons) {
                person.index = (this.state.currentPage - 1)*this.state.pageLimit + i++;
            }
        }
        else {
            for (let person of this.state.persons) {
                person.index = i++;
            }
        }
        this.setState({persons : this.state.persons});
    }
    paginationHandler() {
        console.log(this.state.currentBlock);
        if ((this.state.currentPage !== 1) && ((this.state.currentPage % this.state.visiblePages) === 1)) {
            this.setState((prevState, props) => ({
                currentBlock: prevState.currentBlock + 1
            }))
        }
    }
    onPageChange(num) {
        if (this.state.searchMode) 
            this.getSearchData(`/restapi/person/search`, this.state.searchRequestData, num, true);
        else this.getData('/restapi/person', num, true);
    }
    newHandler() {
        this.props.history.push('/userProfile');
    }
    handlePageLimitChange(event) {
        this.setState({pageLimit: event.target.value}, ()=>{
            this.handlePageLimitSubmit(event);
        });
        
    }
    handlePageLimitSubmit(event) {
        localStorage.setItem("pageLimit",this.state.pageLimit);
        //event.preventDefault();
        console.log(this.state.searchMode);
        if(this.state.searchMode) {
            this.getSearchData(`/restapi/person/search`, this.state.searchRequestData, 1, true);
        }
        else {
            this.getData('/restapi/person', 1, true);
        }
    }
    handleUploadFile(event) {
        event.preventDefault();
        let reader = new FileReader();
        let file = event.target.files[0];
        console.log(event.target.files[0]);
        
        if (file) {
            reader.readAsDataURL(file);
            this.state.formData.append("file", file, file.name);
            console.log(this.state.formData);
        } 

        reader.onloadend = () => {
            this.setState((prevState,props) => ({
                fileLoaded: true
            }));
        }
    }
    importHandler() {
        if (this.state.fileLoaded){
            this.importData('/restapi/person/import', this.state.formData)
            this.handleCloseImport();
        }
    }
    printHandler() {
        if (this.state.searchMode) 
            this.getSearchData(`/restapi/person/search`, this.state.searchRequestData, 0, false).then(window.print);
        else this.getData('/restapi/person', 0, false).then(window.print);
    }
    searchHandler(data, pageable) {
        console.log(data);
        this.setState({
            searchRequestData: data
        }, ()=>{
            var searchPath = '/search?' + this.stringifyQuery(this.state.searchRequestData);
            this.getSearchData(`/restapi/person/search`, data, 1, true);
            this.props.history.push(searchPath);
        });
    }
    extraSearchHandler() { 
        this.setState((prevState, props) => ({
            searchHide: !prevState.searchHide,
        }));
    }
    clearSearchHandler() {
        console.log(!this.state.searchHide);
        this.setState((prevState, props) => ({
            searchMode: false,
            searchHide: true,
            searchRequestData: {},
        }), () => {
            this.onPageChange(1);
        });
        this.props.history.push('/');
    }
    onRowSelect(row, isSelected) {
        if(isSelected){
           this.state.selectedPersons.push(row.id);
           this.state.selectedEmails.push(row.email);
           this.setState({
                selectedPersons: this.state.selectedPersons,
                selectedEmails: this.state.selectedEmails
            });
        }
        else{
            this.state.selectedPersons.splice(this.state.selectedPersons.indexOf(row.id),1);
            this.state.selectedEmails.splice(this.state.selectedEmails.indexOf(row.email),1);
            this.setState({
                selectedPersons: this.state.selectedPersons,
                selectedEmails: this.state.selectedEmails
            });
        }
    }
    onSelectAll(isSelected, rows) {
        for(let i = 0;i < rows.length; i++){
            this.onRowSelect(rows[i],isSelected);
        }
      }
    bulkChangeHandler(){
        this.props.history.push({
            pathname: '/bulkChangeProfile',
            state: {selectedPersons: this.state.selectedPersons}  
        })
    }
    handleInputChange(name, event) {
        console.log(name);
        if (!event.target.value)
            this.setState({[name]: null});
        else this.setState({[name]: event.target.value});
    }
    handleCloseImport() {
        this.setState({ showImport: false });
    }
    handleShowImport() {
        this.setState({ showImport: true });
    }
    emailHandler(){
        let mailto = "mailto:";
        let emails = this.state.selectedEmails;

        for(let i = 0; i < emails.length; i++){
           mailto = mailto + emails[i] + "; ";
        }
        window.location.href = mailto;
    }
    statisticsHandler(){
        this.props.history.push('/statistic');
    }

    render() {
        const selectRowProp = {
            mode: 'checkbox',
            bgColor: 'LightGreen',
            columnWidth: '30px',
            // hideSelectColumn: true,
            clickToSelect: true,
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll 
        };
        return (
            <div>
                <div className="no-print">
                    <div className="row">
                        <div className="col-sm-1">
                            <button className="btn btn-success" onClick={ this.newHandler.bind(this) }>New</button>
                        </div>
                        <div className="col-sm-1">
                            <button className="btn btn-success" onClick={ this.handleShowImport }>Import</button>
                            <Modal bsSize="small" show={this.state.showImport} onHide={this.handleCloseImport}>
                            <Modal.Header closeButton>
                                <Modal.Title>Import students from Excel</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <p>
                                        Choose .xls or .xlsx file:
                                    </p>
                                    <input type="file" ref="import" onChange={(event)=>this.handleUploadFile(event)}/> 
                                    <br/>
                                    <a target="_blank" href="https://iteracloud-my.sharepoint.com/:x:/g/personal/mykola_kovtun_itera_no/Ef71FgAhEphOgCUhpGG9LZ4BUzmy9G2waL-Y2YdV-GYpyw?e=GQ9Atq">
                                        Examples of students list
                                    </a>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-warning" onClick={ this.importHandler.bind(this) }>Import</button>
                                <button className="btn btn-alert" onClick={this.handleCloseImport}>Close</button>
                            </Modal.Footer>
                            </Modal>
                        </div>
                        <div className="col-sm-1">
                            {this.state.selectedPersons.length > 1 &&
                                <button className="btn btn-success" onClick={ this.bulkChangeHandler.bind(this) }>Change all</button>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1">
                            <button className="btn btn-info" onClick={ this.printHandler.bind(this) }>Print</button>
                        </div>
                        <div className="col-sm-1">
                            <button className="btn btn-info" onClick={ this.statisticsHandler.bind(this) }>Statistic</button>
                        </div>
                        <div className="col-sm-1">
                            {this.state.selectedPersons.length > 0 &&
                                <button className="btn btn-info" onClick={ this.emailHandler.bind(this) }>E-mail</button>
                            }
                        </div>
                    </div>
                    <div className="col-sm-12">
                        { this.state.searchHide==false && <Search data={this.state.searchRequestData} returnToUserList={ this.searchHandler.bind(this) }/>}
                    </div>
                    {/* <div className="float-sm-left col-sm-12 text-success"> */}
                </div>
        
            <BootstrapTable data={ this.state.persons } search hover options={this.options} selectRow={ selectRowProp }>
                <TableHeaderColumn dataField='id' width='25' isKey hidden>#</TableHeaderColumn>
                <TableHeaderColumn dataField='email' width='25' hidden>#</TableHeaderColumn>
                <TableHeaderColumn dataField='index' width='35'>#</TableHeaderColumn>
                <TableHeaderColumn dataField='' width='150' dataFormat={ this.makeFullName } 
                dataSort={ true } sortFunc={ this.sortFullName }>Full Name</TableHeaderColumn>
                <TableHeaderColumn dataField='yearOfStudy' width='75'>Year of study</TableHeaderColumn>
                <TableHeaderColumn dataField='' width='150' dataFormat={ this.makeInternshipDate }>Internship</TableHeaderColumn>
                <TableHeaderColumn dataField='' width='150' dataFormat={ this.makePracticeDate }>Practice</TableHeaderColumn>
                <TableHeaderColumn dataField='' width='150' dataFormat={ this.makeJobDate }>Job</TableHeaderColumn>
            </BootstrapTable>
            <div className="row no-print">
                <div className="col-sm-3 no-print">
                        <form>
                            <label>Students on page&nbsp; 
                                <select name="studentsOnPage"  value={this.state.pageLimit} onChange={this.handlePageLimitChange}>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </label>
                        </form>
                    </div>
                <div className="col-sm-1 text-success no-print">
                    {this.state.totalPages} pages
                </div>
                <div className="col-sm-2 text-success no-print">
                    {this.state.count} profiles found
                </div>
                    <PageController returnToUserList={this.onPageChange.bind(this)} currentPage={this.state.currentPage} totalPages={this.state.totalPages}
                    currentBlock={this.state.currentBlock} visiblePages={this.state.visiblePages} titles={{first:'<<', prev:'<', next: '>', last:'>>'}}/> 
                </div>
            </div>
        );
    }
    setBeginDate(begin) {
        if (!begin) {
            return "";
        }
        return begin;
    }
    setEndDate(begin, end) {
        if (!end && begin) {
            return "present";
        } else if (!end) {
            return "";
        }
        return end;
    }
    makeInternshipDate(cell, row) { 
        let begin = this.setBeginDate(row.internshipBegin);
        let end = this.setEndDate(row.internshipBegin,row.internshipEnd);
        if (!begin && !end) {
            return;
        }
        return `${begin} - ${end}`;
    }
    makePracticeDate(cell, row) {   
        let begin = this.setBeginDate(row.practiceBegin);
        let end = this.setEndDate(row.practiceBegin,row.practiceEnd);
        if (!begin && !end) {
            return;
        }     
        return `${begin} - ${end}`;
    }
    makeJobDate(cell, row) {
        let begin = this.setBeginDate(row.jobBegin);
        let end = this.setEndDate(row.jobBegin,row.jobEnd);
        if (!begin && !end) {
            return;
        }
        return `${begin} - ${end}`;
    }
    makeFullName(cell, row) {
        return <Link id={`_id_${row.id}`} to={{ pathname: `/userProfile/${row.id}`}}> {`${row.firstName} ${row.lastName}`} </Link>
    }
    sortFullName(a, b, order) {
        a = `${a.firstName} ${a.lastName}`;
        b = `${b.firstName} ${b.lastName}`;
        if (order === "desc") {
            return a.localeCompare(b);
        } else {
            return b.localeCompare(a);
        }
    }
}

export default UserList;