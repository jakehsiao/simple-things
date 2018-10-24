import React, { Component } from 'react';
import { Attribute, InputThing } from './Forms';

// utils
let capitalizeFirst = lower => lower.charAt(0).toUpperCase()+lower.substr(1);

// components
let PerspectiveList = props => (
    <div className="persp">
        <select size="1" onChange={props.changePerspMenu} className="persp-dropmenu">
            <option value="inbox">Inbox</option>
            <option value="project">Projects</option>
            <option value="tags">Tags</option>
            <option value="perspective">Perspectives</option>
        </select>
        <br/><br/>
        <select size="10" id="select-persp" onChange={props.changePersp} className="persp-listbox">
            {props.perspectives.map(persp => <option value={persp}>{persp}</option>)}
        </select>
    </div>
)

let TagView = props => (
    ("tags" in props.thing)?
    (
    <div>
      <ul>
      {
        props.thing.tags.map(
          item => 
          <li>
            <Attribute
              thing={{data:props.thing.data, tag: item}}
              type="tag" 
              handleSubmit={props.handleChange}
            />
          </li>)
      }
      </ul>
    </div>
    )
    :(
      <div>No Tags</div>
    )
  );

let Thing = function(props){
    return (
    <div>
      <h3>{props.thing.data}</h3>
      <b>Project: </b>
      <Attribute
        thing={props.thing}
        type="project" 
        handleSubmit={props.handleProjectChange}
      />
      <br />
      <b>Tags: </b>
      <TagView 
        thing={props.thing}
        handleChange={props.handleTagChange}
      />
      <Attribute 
        thing={props.thing}
        type="add-tag"
        handleSubmit={props.handleTagAddition}
      />
    </div>
    );
  }; 
  
let FinishThing = props => (
    <button style={{display:"none"}} onClick={props.handleClick}>√</button>
  ); //TODO: Change this in debugging and deploying mode


let TodoList = props => (
    <div>
    <h3>{capitalizeFirst(props.perspType)}: {props.perspValue}</h3>
    <ul className="list-view">
      {props.items.map(
        item => (
          <li>
            <FinishThing handleClick={props.handleFinish(item.data)} /> 
            <label onClick={props.handleView(item.data)}>
            {item.data}
            </label>
          </li>
        )
        )}
    </ul>
    </div>
  );

export { TagView, Thing, TodoList, FinishThing, PerspectiveList };