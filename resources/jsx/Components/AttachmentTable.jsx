import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import { Link } from 'react-router-dom'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class AttachmentTable extends React.Component {
    constructor(props) {
        super(props);

        this.buttonAddClickHandler = this.buttonAddClickHandler.bind(this);
        this.attachmentPOST = this.attachmentPOST.bind(this);
        this.makeDownload = this.makeDownload.bind(this);
        this.makeDelete = this.makeDelete.bind(this)

        this.state = { 
            attachments: [],
            formData: new FormData(),
        };
    }
    attachmentPOST() {
        axios.post(`/restapi/person/${this.props.id}/attachments`, this.state.formData)
        .then(response => {
            console.log(response);
            this.props.returnToUserProfile();
        })
        .catch(function(error) {
            console.log(error);
        })
    }
    handleUploadFile(event) {
        let reader = new FileReader();
        let file = event.target.files[0];
        console.log(event.target.files[0]);
        
        if (file) {
            reader.readAsDataURL(file);
            this.state.formData.append("file", file, file.name);
            console.log(this.state.formData);
        } else {
            throw new Error("Invalid file");
        }
    }
    buttonAddClickHandler() {
        this.attachmentPOST();
    }
    render() {
        console.log(this.props.attachments);
        return (
            <div className="no-print">
                <div className="row col-sm-8">
                    <div className="col-sm-4">
                        <input type="file" ref="inputFile" onChange={(event)=>this.handleUploadFile(event)}/>
                        <button className="btn btn-success" onClick={this.buttonAddClickHandler}>Add</button>  
                    </div>
                </div>
                <BootstrapTable data={ this.props.attachments } hover options={ this.options }>
                    <TableHeaderColumn dataField='filename' isKey={true} dataSort={ true }>File name</TableHeaderColumn>
                    <TableHeaderColumn dataField='' dataFormat={ this.download.bind(this) }></TableHeaderColumn>
                    <TableHeaderColumn dataField='' dataFormat={ this.delete.bind(this) }></TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }

    download(cell,row){
        return (
            <button className="btn btn-info no-print" 
            onClick={ this.makeDownload.bind(this,row) }>Download</button>
        );
    }
    delete(cell,row){
        return (
            <button className="btn btn-warning no-print" 
            onClick={ this.makeDelete.bind(this,row) }>Delete</button>
        );
    }
    makeDownload(row) {
        var fileDownload = require('js-file-download');
        axios.get(`/restapi/person/${this.props.id}/attachments/${row.id}`,{responseType:'blob'})
        .then(response => {
            console.log(response);
            fileDownload(response.data, row.filename);
        })
        .catch(function(error) {
            console.log(error);
        })
    }
    makeDelete(row) {
        axios.delete(`/restapi/person/${this.props.id}/attachments/${row.id}`)
        .then(response => {
            console.log(response);
            this.props.returnToUserProfile();
        })
        .catch(function(error) {
            console.log(error);
        })
    }
}

export default AttachmentTable;
