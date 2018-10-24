import React, { Component } from 'react';
import { TagView, Thing, TodoList, FinishThing, PerspectiveList} from './Stateless'
import { Attribute, InputThing } from './Forms'

//constants
let API_URL = "http://localhost:5000/api"; //change this

//utils
let formatParams = params => (
    "?"+Object.keys(params).map(key=>key+"="+params[key]).join("&")
)

//components
class TodoListApp extends Component {
    constructor(props){
      super(props);

      //init the state
      this.state = {
        things: [],
        viewing: "Choose a thing from left",
        perspType: "inbox",
        perspTypeRepr: "inbox",
        perspValue: "",
        perspectives: [],
      };
  
      this.fetchThings = this.fetchThings.bind(this);
      this.handleFinish = this.handleFinish.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.viewThing = this.viewThing.bind(this);
      this.putThing = this.putThing.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.searchThing = this.searchThing.bind(this);
      this.handleTagChange = this.handleTagChange.bind(this);
      this.changeTag = this.changeTag.bind(this);
      this.handleTagAddition = this.handleTagAddition.bind(this);
      this.addTag = this.addTag.bind(this);
      this.changePerspMenu = this.changePerspMenu.bind(this);
      this.changePersp = this.changePersp.bind(this);
      this.fetchPerspectives = this.fetchPerspectives.bind(this);
      //plenty of binders
  
      this.fetchThings();
    }
  
    handleFinish(finish_data){
      let _this = this; //https://javascriptplayground.com/javascript-variable-scope-this/
      return function(e){
        fetch(API_URL, 
          {
            method: "DELETE",
            body: JSON.stringify({data: finish_data}),
          }
        ).then(res => res.json())
        .then(console.log)
        .then(data => _this.fetchThings())
        ;
        ;
      };
    }
  
    fetchThings(persp=""){
      return fetch(
          API_URL+formatParams({
              content: "things",
              persp_type: this.state.perspType,
              persp_value: persp?persp:this.state.perspValue,
          })
      )  
      .then(res => res.json())
      .then(data => this.setState({things: data.things}))
      .then(data => console.log("Refreshed!"))
      .then(_ => this.fetchPerspectives())
      ;
    }
  
    handleSubmit(input){
      let _this = this;
      return function(e){
        e.preventDefault();
        console.log("start posting");
        let post_content = Object.assign({}, input.state);
        if (_this.state.perspTypeRepr == "project"){
            post_content.project = _this.state.perspValue;
        }
        else if (_this.state.perspTypeRepr == "tags"){
            post_content.tags = [_this.state.perspValue,];
        }
        _this.postThing(post_content, _this.fetchThings);
        input.setState({data:""}); //clear the input
        //EH: Merge the states into this component.
      };
    }
      
    handleChange(input){
      let _this = this;
      let refresher = function(){
        _this.fetchThings().then(
        function(_){input.setState({
          mode: "VIEW",
          data: "",
        });
        input.props.dick = "Dick";
      
      });
      };
      return function(e){
        e.preventDefault();
        console.log("start putting");
        _this.putThing(input, refresher);
      }
    }
  
    putThing(input, refresher){
      let put_data = {};
      put_data[input.props.type] = input.state.data;
      put_data.data = input.props.thing.data;
      fetch(API_URL, 
        {
          method: "PUT",
          body: JSON.stringify(put_data),
        }
      ).then(res => res.json())
      .then(console.log)
      .then(_ => refresher());
      ;
    }
  
    postThing(input_state, refresher){
      fetch(API_URL, 
        {
          method: "POST",
          body: JSON.stringify(input_state),
        }
      ).then(res => res.json())
      .then(console.log)
      .then(_ => refresher());
      ;
    }
  
    searchThing(data){
      //TODO: change it all to ID
      let target_thing = {data: data};
      for(let i=0; i<this.state.things.length;i++){
        if (this.state.things[i].data == data){
          target_thing = this.state.things[i];
          break;
        }
      }
      return target_thing;
    }
  
    viewThing(view_data){
      let _this = this;
      
      return function(e){
        _this.setState({viewing: view_data}); 
      };
    }

    handleTagChange(input){
        let _this = this;

        return function(e){
            e.preventDefault();
            _this.changeTag(input.props.thing.data, input.props.thing.tag, input.state.data)
            .then(_ => input.setState({
            mode: "VIEW",
            data: "",
            }));
        }

    }

    handleTagAddition(input){
        let _this = this;

        return function(e){
            e.preventDefault();
            _this.addTag(input.props.thing.data, input.state.data)
            .then(_ => input.setState({
                mode: "VIEW",
                data: "", 
            })); //EH: Combine this with the previews one for less code? May not, because it receives 'this' and returns a function
        }
    }

    changeTag(data, old_tag, new_tag){
        let _this = this;
        let thing = _this.searchThing(data);
        thing.tags.splice(thing.tags.indexOf(old_tag), 1, new_tag);

        return fetch(
            API_URL,
            {
                method:"PUT",
                body:JSON.stringify({data:data, tags:thing.tags}),
            }
        )
        .then(res => res.json())
        .then(console.log)
        .then(_ => _this.fetchThings())
        ;
    }

    addTag(data, new_tag){
        let _this = this;
        let thing = _this.searchThing(data);
        if ("tags" in thing){
            thing.tags.push(new_tag);
        }
        else{
            thing.tags = [new_tag];
        }

        return fetch(
            API_URL,
            {
                method:"PUT",
                body:JSON.stringify({data: data, tags:thing.tags})
            }
        )
        .then(_ => _this.fetchThings());
    }

    fetchPerspectives(perspType=""){
        let _this = this;
        let fetch_url = API_URL+formatParams({content:perspType?perspType:this.state.perspType});
        console.log("Start fetching perspective list!");
        return fetch(fetch_url)
        .then(res => res.json())
        .then(data => data.perspectives)
        .then(perspectives => this.setState({perspectives, perspectives}))
        ;
    }

    changePerspMenu(e){
        let perspType = e.target.value;
        this.fetchPerspectives(perspType)
        .then(_=>this.setState({perspType: perspType}))
        .then(function(_){
            document.getElementById("select-persp").value = null;
        });

        /*
        .then(_=>this.state.perspectives?this.state.perspectives[0]:"")
        .then(function(persp){
            if(persp){
                console.log("Menu changed! The first perspective is:");
                console.log(persp);
                this.fetchThings(persp)
                .then(_ => this.setState({perspValue:persp, perspTypeRepr:this.state.perspType}))
                .then(_ => console.log("Current value of persp is:"))
                .then(_ => console.log(document.getElementById("select-persp").value))
                .then(_ => document.getElementById("select-persp").value=persp)
                ;
            }
        })//Sorry for updating pers for 2 times
        ;
        */

    }

    changePersp(e){
        let persp = e.target.value;
        this.fetchThings(persp).then(this.setState({perspValue:persp, perspTypeRepr:this.state.perspType})); //Because setState is asych and fetch list may appear earlier than setState, so fetch the list at first then set the state
    }

  
    render(){
      return (
      <div>
        <PerspectiveList 
          changePerspMenu={this.changePerspMenu}
          changePersp={this.changePersp}
          perspectives={this.state.perspectives}
        />
        <div className="list">
          <TodoList 
          items={this.state.things} 
          handleFinish={this.handleFinish} 
          handleView={this.viewThing}
          perspType={this.state.perspTypeRepr}
          perspValue={this.state.perspValue}
          />
          <InputThing handleSubmit={this.handleSubmit} />
         </div>
         <div className="thing">
           <Thing 
            thing={this.searchThing(this.state.viewing)} 
            handleProjectChange={this.handleChange} 
            handleTagChange={this.handleTagChange}
            handleTagAddition={this.handleTagAddition}
          />
         </div>
      </div>
      );
    }
  }

  export { TodoListApp };