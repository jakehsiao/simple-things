import React, { Component } from 'react';

class Attribute extends Component{

    constructor(props){
      super(props); //TODO: set type in props
  
      this.state = {
        mode: "VIEW",
        data: "",
      };
  
      this.handleTextChange = this.handleTextChange.bind(this);
    }
  
    handleTextChange(e){
      this.setState({ data: e.target.value });
    }
  
    render(){
    let _this = this;
    if (this.state.mode == "VIEW"){
      return(
        <div>
          {
            (this.props.type == "add-tag")?
            (<button onClick={e=>(_this.setState({mode:"CHANGE"}))}>AddTag</button>)
            :(
            <div>
                <label>
                {
                (this.props.type in this.props.thing)?this.props.thing[this.props.type]:"No ".concat(this.props.type)
                }
                </label>
                <button onClick={e=>(_this.setState({mode:"CHANGE"}))}>Change</button>
            </div>
            )
          } 
        </div>
  
      );
    }
    // In change mode
    else{
      return(
        <div>
        <form onSubmit={this.props.handleSubmit(this)}>
          <input
          className="put-change"
          onChange={this.handleTextChange}
          value={this.state.data} 
          autoFocus={true}
          />
          <button type="submit">Change</button>
          <button onClick={e=>_this.setState({"mode":"VIEW"})}>Cancel</button>
        </form>
        </div>
      )
  
    }
  
  
    }
  
  }
  
  
  
class InputThing extends Component {
    constructor(props){
      super(props);
      this.state = {data: ''}; //TODO: change this to fit the projects and tags
  
      this.handleTextChange = this.handleTextChange.bind(this);
    }
  
    handleTextChange(e){
      this.setState({ data: e.target.value });
    }
  
    render(){
      return(
        <form onSubmit={this.props.handleSubmit(this)}>
          <input
            id='new-todo'
            onChange={this.handleTextChange}
            value={this.state.data}
          />
          <button>Add</button>
        </form>
      )
  
    }
  
  }

  export { Attribute, InputThing };