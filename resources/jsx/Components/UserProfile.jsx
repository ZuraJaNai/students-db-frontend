import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, withRouter } from 'react-router-dom';
import axios from 'axios';
import AttachmentTable from "./AttachmentTable.jsx";

class UserProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "attachments": [],
            "comment": "",
            "email": "",
            "firstName": "",
            "id": 0,
            "internshipBegin": null,
            "internshipEnd": null,
            "jobBegin": null,
            "jobEnd": null,
            "lastName": "",
            "patronymic": "",
            "photo": {},
            "practiceBegin": null,
            "practiceEnd": null,
            "yearOfStudy": "",
            "formData": new FormData(),
            "fileChanged": false
        }
        this.handleUploadPhoto = this.handleUploadPhoto.bind(this);
        this.checkDate = this.checkDate.bind(this);
        this.checkPhoto = this.checkPhoto.bind(this);
        this.onfileChanged = this.onfileChanged.bind(this);
        this.getBase64Photo = this.getBase64Photo.bind(this);
    }
    componentDidMount() {
        switch(this.props.state) {
            case 'edit':
                this.getData(`/restapi/person/${this.props.match.params.id}`);
                break;
            default: console.log("add");
         }
    }
    getData(pathname) {
        axios.get(pathname)
        .then(response => {
            console.log(response);
            this.setState({
                "attachments": response.data.attachments,
                "comment": response.data.comment,
                "email": response.data.email,
                "firstName": response.data.firstName,
                "id": response.data.id,
                "internshipBegin": this.checkDate(response.data.internshipBegin),
                "internshipEnd": this.checkDate(response.data.internshipEnd), 
                "jobBegin": this.checkDate(response.data.jobBegin),
                "jobEnd": this.checkDate(response.data.jobEnd),
                "lastName": response.data.lastName,
                "patronymic": response.data.patronymic,
                "photo": this.checkPhoto(response.data.photo),
                "practiceBegin": this.checkDate(response.data.practiceBegin),
                "practiceEnd": this.checkDate(response.data.practiceEnd),
                "yearOfStudy": response.data.yearOfStudy
            });
            if (this.state.photo)                 
                this.getPhoto(this.state.photo.id);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    checkDate(date) {
        if (date)
            return date;
    }
    checkPhoto(photo) {
        if (photo) 
            return photo;
        return null;
    }
    getPhoto(id) {
        var axiosRequest = axios.create({
            method: "get",
            url: `/restapi/person/${this.props.match.params.id}/attachments/${id}`,
            responseType: "blob"
        });
        axiosRequest.request().then((response)=>{
            this.getBase64Photo(response.data).then((response)=>{
                this.refs.photo.src = response;
            });
        });
    }
    getBase64Photo(blob){
        const temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
          temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
          };
      
          temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
          };
          temporaryFileReader.readAsDataURL(blob);
        });
    }
    changeData() {
        var axiosRequest = axios.create({
            method: "put",
            url: `/restapi/person/${this.props.match.params.id}`,
            data: this.state
        });
        axiosRequest.request().then(response => {
            console.log(response);
            console.log(this.state.formData.get("file"));
            if (this.state.formData.get("file")){
                var axiosRequest = axios.create({
                    method: "post",
                    url: `/restapi/person/${this.props.match.params.id}/photo`, 
                    data: this.state.formData
                });
                axiosRequest.request();
            }
            return response;
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    addData() {
       return axios.post(`/restapi/person`, this.state)
        .then(response => {
            console.log(response);
            if (this.state.formData.get("file"))
                return axios.post(`/restapi/person/${response.headers.location.substring(response.headers.location.length - 4)}/photo`, this.state.formData);
            return response;
        })
        .catch(function(error) {
            console.log(error);
        });
    }
    handleUploadPhoto(event) {
        event.preventDefault();
        console.log(this.state.photo);
        let reader = new FileReader();
        let photo = this.refs.photo;
        let file = event.target.files[0];
        console.log(event.target.files[0]);
        
        if (file) {
            reader.readAsDataURL(file);
            this.state.formData.append("file", file, file.name);
            console.log(this.state.formData);
        } else {
            photo.src = "";
        }

        reader.onloadend = function () {
            photo.src = reader.result;
        }
    }
    onfileChanged() {
        this.setState((prevState, props) => ({
            fileChanged: !prevState.fileChanged
        }), () => {
            this.getData(`/restapi/person/${this.props.match.params.id}`);
        });
    }
    printHandler() {
        window.print();
    }
    handleCancelClick() {
        this.props.history.push('/');
    }               
    handleInputChange(name, event) {
        console.log(name);
        if (!event.target.value)
            this.setState({[name]: null});
        else this.setState({[name]: event.target.value});
    }
    handleSubmit(event) {
        const redirectCb = () => this.props.history.push("/");

        event.stopPropagation();
        event.preventDefault();
        if (!this.refs.form.checkValidity()) 
            return;        
        switch(this.props.state) {
            case 'add':
                this.addData().then(redirectCb);
                break;
            case 'edit':
                this.changeData().then(redirectCb);
                break;
            default: throw new Error("Invalid state");
        }
    }
    render() {
        return(
            <div id="userProfile" className="">
                <div className="col-sm-offset-10 col-sm-2">
                        <button className="btn btn-success no-print" type="button" onClick={ this.printHandler.bind(this) }>Print</button>
                    </div>
                <form className="form-group needs-validation col-sm-12" encType="multipart/form-data" onSubmit={this.handleSubmit.bind(this)} ref="form">
                <div className={"mb-3 col-sm-2 " + ((this.state.photo) == null ? "no-print":"")}>
                    <img className="border-secondary" height="250px" ref="photo" width="220px" id="photo"/>
                    <input className="col-sm-12 no-print" type="file" ref="inputPhoto" onChange={(event)=>this.handleUploadPhoto(event)}/>  
                </div>
                <div className="mb-3 col-sm-10">
                    <div className="mb-3 col-sm-10 form-inline">

                        <label className="col-form-label col-sm-1 text-right" id="lastName" htmlFor="lastName">Last name</label>
                        <input type="text" className="form-control col-sm-2" id="lastName" ref="lastName" placeholder="Surname" value={this.state.lastName} onChange={this.handleInputChange.bind(this, 'lastName')} required/>

                        <label className="col-form-label col-sm-1 text-right" id="firstName" htmlFor="firstName">First name</label>
                        <input type="text" className="form-control col-sm-2" id="firstName" ref="firstName" placeholder="Name" value={this.state.firstName} onChange={this.handleInputChange.bind(this, 'firstName')} required/>
                        
                        <div  className={" " + ((this.state.patronymic) == null ? "no-print":"")}>
                        <label className="col-form-label col-sm-2 text-right" id="patronymic" htmlFor="patronymic">Patronymic</label>
                        <input type="text" className="form-control col-sm-2" id="patronymic" ref="patronymic" value={this.state.patronymic} onChange={this.handleInputChange.bind(this, 'patronymic')}/>
                        </div>
                    </div>
                    <div className={"mb-3 col-sm-5 " + ((this.state.email) == null ? "no-print":"")}>
                        <label className="col-form-label" htmlFor="email">E-mail</label>
                        <input type="text" className="form-control" id="email" ref="email" value={this.state.email} onChange={this.handleInputChange.bind(this, 'email')}/>
                    </div> 
                    <div className="mb-3 col-sm-5">
                        <label className="col-form-label" htmlFor="yearOfStudy">Year of study</label>
                        <input type="text" className="form-control" id="yearOfStudy" ref="yearOfStudy" value={this.state.yearOfStudy} onChange={this.handleInputChange.bind(this, 'yearOfStudy')} required/>
                    </div>
                    <div className={"mb-3 col-sm-5 " + ((this.state.internshipBegin) == null ? "no-print":"")}>
                        <label className="col-form-label" htmlFor="internshipBegin">Internship begin</label>
                        <input type="text" className="form-control" id="internshipBegin" ref="internshipBegin" placeholder="MM.YYYY" value={this.state.internshipBegin} onChange={this.handleInputChange.bind(this, 'internshipBegin')}/>
                    </div> 
                    <div className={"mb-3 col-sm-5 " + ((this.state.internshipEnd) == null ? "no-print":"")}>
                        <label className="col-form-label" htmlFor="internshipEnd">Internship end</label>
                        <input type="text" className="form-control" id="internshipEnd" ref="internshipEnd" placeholder="MM.YYYY" value={this.state.internshipEnd} onChange={this.handleInputChange.bind(this, 'internshipEnd')}/>
                    </div> 
                    <div className={"mb-3 col-sm-5 " + ((this.state.practiceBegin) == null ? "no-print":"")}>
                        <label className="col-form-label" htmlFor="practiceBegin">Practice begin</label>
                        <input type="text" className="form-control" id="practiceBegin" ref="practiceBegin" placeholder="MM.YYYY" value={this.state.practiceBegin} onChange={this.handleInputChange.bind(this, 'practiceBegin')}/>
                    </div> 
                    <div className={"mb-3 col-sm-5 " + ((this.state.practiceEnd) == null ? "no-print":"")}>
                        <label className="col-form-label" htmlFor="practiceEnd">Practice end</label>
                        <input type="text" className="form-control" id="practiceEnd" ref="practiceEnd" placeholder="MM.YYYY" value={this.state.practiceEnd} onChange={this.handleInputChange.bind(this, 'practiceEnd')}/>
                    </div> 
                    <div className={"mb-3 col-sm-5 " + ((this.state.jobBegin) == null ? "no-print":"")}>
                        <label className="col-form-label" htmlFor="jobBegin">Job begin</label>
                        <input type="text" className="form-control" id="jobBegin" ref="jobBegin" placeholder="MM.YYYY" value={this.state.jobBegin} onChange={this.handleInputChange.bind(this, 'jobBegin')}/>
                    </div> 
                    <div className={"mb-3 col-sm-5 " + ((this.state.jobEnd) == null ? "no-print":"")}>
                        <label className="col-form-label" htmlFor="jobEnd">Job end</label>
                        <input type="text" className="form-control" id="jobEnd" ref="jobEnd" placeholder="MM.YYYY" value={this.state.jobEnd} onChange={this.handleInputChange.bind(this, 'jobEnd')}/>
                    </div> 
                    <div className={"mb-3 col-sm-5 " + ((this.state.comment) == null ? "no-print":"")}>
                        <label className="col-form-label" htmlFor="comment">Comment</label>
                        <textarea type="text" className="form-control col-sm-6" id="comment" ref="comment" value={this.state.comment} onChange={this.handleInputChange.bind(this, 'comment')}>
                        </textarea>
                    </div> 
                    <div className="mb-3 col-sm-5">
                        <button className="btn btn-primary no-print" type="submit">{this.props.state == 'add' ? 'Add' : 'Save'}</button>  
                        <button className="btn btn-outline-dark no-print" type="reset" onClick={this.handleCancelClick.bind(this)}>Cancel</button>                    
                    </div>
                    </div>
                </form>
                <AttachmentTable attachments={this.state.attachments} id={this.state.id} returnToUserProfile={this.onfileChanged.bind(this)}/>
            </div>
        );
    }
}

export default withRouter(UserProfile);