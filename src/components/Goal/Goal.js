import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { updateData } from '../../ducks/actions';
import getAllUserData from '../../common/getUtils';
import CalendarHeader from '../Calendar/Calendar';
import SubGoal from './SubGoal';
import './Goal.css';


class Goal extends Component {
    constructor(props){
        super(props)
        this.state = {
            editing: false,
            goals: [],
            sub_goal: [],
            name: [],
            date: [],
            input: '',
            complete: false,
            goalDate: '',
            subGoalName: ''
        }
    }

    handleInput(prop, val){
        this.setState({ [prop]: val })
    }

    handleNameInput(e, i){
        let name = this.state.name
        name[i] = e.target.value
        this.setState({ name })
    }
    handleDateInput(e, i){
        let date = this.state.date
        date[i] = e.target.value
        this.setState({ date })
    }

    setEdit = () => {
        this.setState({ editing: true })
    }

    handleCancel = () => {
        this.setState({ editing: false })
    }

    handleDelete = async (id, i) => {
        const {name, date} = this.state
        // console.log(this.props)
        if(id) {
            try{
                let res = await axios.delete(`/api/goal/${id}`, {name:name[i], date:date[i]});
                res = res.data;
                this.props.updateData({goals: res, subGoals: this.props.subGoals, tasks: this.props.tasks, subTasks: this.props.subTasks});
            } catch(err){
                console.log(err)
            }
        }
       
    }

    handleSave = async (id, i) => {
        const { name, date } = this.state;
        try {
            let allGoals = await axios.put(`/api/goal/${id}`, {name:name[i], date:date[i]});
            allGoals = allGoals.data
            this.props.updateData({goals: allGoals, subGoals: this.props.subGoals, tasks: this.props.tasks, subTasks: this.props.subTasks})
            this.setState({ editing: false })
        } catch(err) {
            console.log(err)
        }
    }

    addGoal = async () => {
        // const {name, date} = this.props.goals;
        const { input, goalDate } = this.state;
        try {
            let allGoals = await axios.post('/api/goal', {name: input, date: goalDate});
            allGoals = allGoals.data
            this.props.updateData({goals: allGoals, subGoals: this.props.subGoals, tasks: this.props.tasks, subTasks: this.props.subTasks})
            this.setState({ input: '', goalDate: '' })
            const allUserData = await getAllUserData()
            this.props.setUserData(allUserData)
        } catch(err) {
            console.log(err)
        }
    }

    addSubGoal = async (id) => {
        // const {name, date} = this.props.goals;
        // console.log(this.props.goals)
        const { subGoalName, complete } = this.state;
        // const { id } = this.props.goals[i];
        // console.log(id) 
        try{
        let allSubGoals = await axios.post('/api/s_goal', {name: subGoalName, complete, g_id: id});
            allSubGoals = allSubGoals.data
            this.props.updateData({goals: this.props.goals, subGoals: allSubGoals, tasks: this.props.tasks, subTasks: this.props.subTasks})
            // this.props.subGoals()
            this.setState({ subGoalName: '', complete: false })
            const allUserData = await getAllUserData()
            this.props.updateData(allUserData)
        } catch(err) {
            console.log(err)
        }
    }

    render() {
// console.log(this.props)
// console.log('subGoalName:', this.state.subGoalName)

        const { goals } = this.props;
        console.log('Goals:', this.props )
        
        // console.log(goals)
        let goalArr = goals.map((goal, i) => {
            if(this.state.name[i] === undefined){
                this.state.name[i] = goal.name
                this.state.date[i] = goal.date
            }

            // console.log(goal.sub_goal)  
            let mappedSubGoals;
            if(goal.sub_goal) {
                console.log(this.props)
                // const {subGoals} = this.props;
                mappedSubGoals = goal.sub_goal.map((subGoal, i) => {
                    return (
                        <div key={i}>
                            <SubGoal 
                                subGoal={subGoal}
                                key={i}
                            />
                        </div>
                            
                    )
                })
            }
            
            const { id, name, date } = goal;
            // console.log(goal)
            return(
                <div key={id}>
                    { this.state.editing ? 
                        <div className="col-xs-4">
                            <input 
                                key={id}
                                value={this.state.name[i]}
                                onChange={ (e) => this.handleNameInput(e, i) }
                            />
                            <input 
                                key={goal[i]}
                                value={this.state.date[i]} 
                                onChange={ (e) => this.handleDateInput(e, i) }
                            />
                            <button onClick={ () => this.handleSave(id, i) }>Save</button>
                            <button onClick={ this.handleCancel }>Cancel</button>
                        </div>
                        : 
                        <div className="col-xs-4">
                                {name}<br/>
                                {date}<br/>
                                <button className="goalEdit" onClick={ this.setEdit }>Edit</button>
                                <button className="goalDelete" onClick={() => this.handleDelete(id) }>Delete</button><br/>
                                <input 
                                    className="add-subGoal" 
                                    key={id.toString()} 
                                    placeholder="Add a step to your goal" 
                                    onChange={ e => this.handleInput('subGoalName', e.target.value) }
                                />
                                <button className="add-subGoal-button" onClick={() => this.addSubGoal(id)} >Add</button> 
                                <div id="subList">{mappedSubGoals}</div>
                        </div>
                    }
                </div>
            )
        })

        return (
            <div>
                <CalendarHeader />
                <input 
                    value={this.state.input}
                    onChange={ e => this.handleInput('input', e.target.value)}
                    placeholder="Add new Goal"
                />
                <input 
                    type="date"
                    value={this.state.goalDate}
                    onChange={ e => this.handleInput('goalDate', e.target.value)}
                    placeholder="Goal Deadline"
                />
                <button onClick={ this.addGoal }>Add Goal</button>
                <div className="goal">{goalArr}</div>
            </div>
        );
    }
}

const mapStateToProps = (reduxState) => {
    return {
        goals: reduxState.data.goals,
        subGoals: reduxState.data.subGoals,
        tasks: reduxState.data.tasks,
        subTasks: reduxState.data.subTasks,
        update: reduxState.data.subTasks
    }    
}

const mapDispatchToProps = {
    updateData
}

export default connect(mapStateToProps, mapDispatchToProps)(Goal);