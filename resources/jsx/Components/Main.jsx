import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route } from 'react-router-dom'
import UserList from './UserList.jsx';
import UserProfile from './UserProfile.jsx';
import BulkChangeForm from './BulkChangeForm.jsx';
import Search from './Search.jsx';
import Statistic from './Statistic.jsx';


class Main extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path='/'  component={UserList} refresh="true"/>
                <Route path='/search(.*)' refresh="true" render={(props) => (
                    <UserList {...props} searchMode={true}/>
                    )}/> />
                <Route path='/userProfile/:id' refresh="true" render={(props) => (
                    <UserProfile {...props} state={'edit'}/>
                    )}/> 
                <Route exact path='/userProfile' render={(props) => (
                    <UserProfile {...props} state={'add'}/>
                    )}/> 
                <Route exact path='/bulkChangeProfile' refresh="true" render={(props) => (
                    <BulkChangeForm {...props}/>
                    )}/> 
                <Route exact path='/statistic' render={(props) => (
                    <Statistic {...props}/>
                    )}/> 
            </Switch>
        );
    }
}
export default Main;