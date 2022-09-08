import React,{Component} from "react";
import "./App.css";
import "../generator";
import { exInput1, exInput2, prettyPrintTable, printIterations, solve } from "../generator";
import "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'  
let _ = require("lodash");

class Test extends Component {
  state = {
    prev_table: '',
    curr_table: '',
    totalStates:0,
    row : 0,
    col: 0,
    newValue : '',
    input:'',
    iterations:'',
    itn:0,
    totalItn : -1,
    reducedTable : '',
    done:false
  };

  componentDidMount(){
    this.setState({prev_table:this.createTable(this.state.totalStates)});
    this.setState({curr_table:this.createTable(this.state.totalStates)});
    alert("Please use desktop mode if using a handheld device.\nView in landscape for a better experience :)");
    // this.setState({input:exInput1});
    // console.log(exInput2);
  }

  createDivs(labels,n,lastRow) {
    var content = [];
    var type = "cell";
    content.push(<div className="label-hor"><p className="label-text-hor">{labels[n]}</p></div>);
    if(lastRow)
      type="last-row-cell";
    for(let i=0;i<n-1;i++)
      content.push(<div className={type}><p className="text"></p></div>);
    type = "last-column-cell";
    if(lastRow)
      type="last-cell"
    content.push(<div className={type}><p className="text"></p></div>);
    content.push(<br></br>);
    return content;
  }

  updateTable=(itn,prev)=>{
    let c = 'a';
    let labels = [];
    for(let i=0;i<this.state.totalStates;i++){
      labels.push(c);
      c = String.fromCharCode(c.codePointAt(0)+1);
    }
    let oldTable = this.state.curr_table;
    if(prev) oldTable = this.state.prev_table;
    var newTable = [];
    let currentState = this.getNiceTable(this.state.iterations[itn]);
    let N = this.state.totalStates-1;
    for(let i=0;i<N;i++){
      var currRow = [];
      currRow.push(oldTable.at(i).at(0));
      for(let j=1;j<=i+1;j++){
        var currDiv = oldTable.at(i).at(j);
        let divType = currDiv.props.className;
        let newValue = currentState.at(i).at(j-1);
        console.log(newValue);
        var newDiv = <div className={divType}><p className="text">{newValue}</p></div>
        currRow.push(newDiv);
      }
      currRow.push(<br></br>);
      newTable.push(currRow);
    }
    var lastRow = [];
    lastRow.push(<div className="label-ver"></div>);
    for(let i=0;i<N;i++){
      lastRow.push(<div className="label-ver"><p className="label-text-ver">{labels[i]}</p></div>);
    }
    newTable.push(lastRow);
    if(prev) this.setState({prev_table:newTable});
    else this.setState({curr_table:newTable});
  }

  updateCell=(row,col,newValue,highlight)=>{
    let c = 'a';
    let labels = [];
    for(let i=0;i<this.state.totalStates;i++){
      labels.push(c);
      c = String.fromCharCode(c.codePointAt(0)+1);
    }
    let oldTable = this.state.curr_table;
    var newTable = [];
    let N = this.state.totalStates-1;
    for(let i=0;i<N;i++){
      var currRow = [];
      currRow.push(oldTable.at(i).at(0));
      for(let j=0;j<=i;j++){
        var currDiv = oldTable.at(i).at(j+1);
        let divType = currDiv.props.className;
        let oldValue = currDiv.props.children;
        var newDiv = <div className={divType}  style={{backgroundColor:"var(--color1)"}}><p className="text">{oldValue}</p></div>
        if(i==row && j==col){
          if(highlight) newValue = oldValue;
          newDiv = <div className={divType}  style={{backgroundColor:"#a29cb8"}}><p className="text">{newValue}</p></div>
        }
        currRow.push(newDiv);
      }
      currRow.push(<br></br>);
      newTable.push(currRow);
    }
    var lastRow = [];
    lastRow.push(<div className="label-ver"></div>);
    for(let i=0;i<N;i++){
      lastRow.push(<div className="label-ver"><p className="label-text-ver">{labels[i]}</p></div>);
    }
    newTable.push(lastRow);
    this.setState({curr_table:newTable});
  }

  getNiceTable(table) {
    let N = this.state.totalStates;
    let newTable = [];
    for(let i=1;i<N;i++){
      let newRow = [];
      for(let j=0;j<i;j++){
        if(table[i][j].toString().length==0){
          j-=1;
        } else {
          newRow.push(table[i][j].toString());
        }
      }
      newTable.push(newRow);
    }
    console.log(newTable);
    return newTable;
  }

  iterate = ()=>{
    var delays = [];
    let N = this.state.totalStates;
    let delayStep = 800;
    for(let i=delayStep;i<=delayStep*((N*(N-1))/2);i+=delayStep)
      delays.push(i);
    console.log(delays);
    let currentState = this.getNiceTable(this.state.iterations[this.state.itn]);
    for(let i=0;i<N-1;i++){
      for(let j=0;j<=i;j++){
        let newValue = currentState.at(i).at(j);
        setTimeout(()=>{
          console.log(delays[(i*(i+1))/2+j]);
          this.updateCell(i,j,newValue,true);
          setTimeout(()=>{
            this.updateCell(i,j,newValue,false);
          },400);
        },delays[(i*(i+1))/2+j]);
      }
    }
    setTimeout(()=>{
      this.updateTable(this.state.itn,false);
    },delays[20]+500);
  }

  createTable = (n)=>{
    var table = [];
    let c = 'a';
    let labels = [];
    for(let i=0;i<this.state.totalStates;i++){
      labels.push(c);
      c = String.fromCharCode(c.codePointAt(0)+1);
    }
    for(let i=1;i<n-1;i++)
      table.push(this.createDivs(labels,i,false));
    table.push(this.createDivs(labels,n-1,true));
    var lastRow = [];
    lastRow.push(<div className="label-ver"></div>);
    for(let i=0;i<n-1;i++){
      lastRow.push(<div className="label-ver"><p className="label-text-ver">{labels[i]}</p></div>);
    }
    table.push(lastRow);
    return table;
  };

  

  printTable = (state)=> {
    if(state == "prev")
      return this.state.prev_table;
    return this.state.curr_table;
  }

  getInput = (event) => {
    event.preventDefault();
    const input = {
      'present-state':[],
      'next-state-x0':[],
      'next-state-x1':[],
      'output-x0':[],
      'output-x1':[]
    };
    let rowNum=0;
    while(rowNum<this.state.totalStates*6){
        input['present-state'].push(event.target[++rowNum].value);
        input['next-state-x0'].push(event.target[++rowNum].value);
        input['next-state-x1'].push(event.target[++rowNum].value);
        input['output-x0'].push(Number(event.target[++rowNum].value));
        input['output-x1'].push(Number(event.target[++rowNum].value));
        rowNum++;
    }
    this.setState({input});
    console.log(input);
  }

  getInputRows(n){
    let rows = [];
    let c = 'a';
    let labels = [];
    for(let i=0;i<this.state.totalStates;i++){
      labels.push(c);
      c = String.fromCharCode(c.codePointAt(0)+1);
    }
    for(let i=0;i<n;i++){
      rows.push(
        <tr>
          <td data-label="Serial No."><div style={{display:"flex",justifyContent:"center"}}><input className="input-cell" disabled="true" value={i+1}></input></div></td>
          <td data-label="Present State"><div style={{display:"flex",justifyContent:"center"}}><input className="input-cell" disabled="true" value={labels[i]}></input></div></td>
          <td data-label="Next State [X=0]"><div style={{display:"flex",justifyContent:"center"}}><input className="input-cell"></input></div></td>
          <td data-label="Next State [X=1]"><div style={{display:"flex",justifyContent:"center"}}><input className="input-cell"></input></div></td>
          <td data-label="Output [X=0]"><div style={{display:"flex",justifyContent:"center"}}><input className="input-cell"></input></div></td>
          <td data-label="Output [X=1]"><div style={{display:"flex",justifyContent:"center"}}><input className="input-cell"></input></div></td>
        </tr>
      );
    }
    return rows;
  }

  createInputTable = (event) =>{
    event.preventDefault();
    console.log(event.target[0].value);
    this.setState({totalStates:event.target[0].value});
    setTimeout(()=>{
      this.setState({prev_table:this.createTable(this.state.totalStates)});
      this.setState({curr_table:this.createTable(this.state.totalStates)});
    },500);
  }

  displayReducedStateTable = () => {
    if(this.state.totalItn>=0 && this.state.itn>=this.state.totalItn){
      if(!this.state.done){
        setTimeout(()=>{
          this.setState({done:true});
          return (this.state.reduceTable);
        },400*(this.state.totalStates)*(this.state.totalStates-1)+1000);
      }
      else
        return (this.state.reducedTable);
    } else {
      return <div><h3 style={{textAlign:"center"}}>Processing</h3></div>
    }
  }

  reduceTable=()=>{
    if(this.state.totalItn==-1){
      let iterations = solve(this.state.input);
      this.setState({iterations});
      printIterations(iterations);
      this.setState({totalItn:iterations.length-2});
      let solved = iterations[iterations.length-1];
        let reducedTable =( 
          <table className="ui celled inverted table">
          <thead>
            <tr><th style={{textAlign:"center",padding:"0px"}}>Serial No.</th>
            <th style={{textAlign:"center",padding:"0px"}}>Present State</th>
            <th style={{textAlign:"center",padding:"0px"}}>Next State [X=0]</th>
            <th style={{textAlign:"center",padding:"0px"}}>Next State [X=1]</th>
            <th style={{textAlign:"center"}}>Output [X=0]</th>
            <th style={{textAlign:"center"}}>Output [X=1]</th>
          </tr></thead>
          <tbody>
            {this.getOutputRows(solved)}
          </tbody>
        </table>)
        this.setState({reducedTable});
      }
    setTimeout(()=>{
      if(this.state.totalItn==0){
        this.updateTable(0,true);
        this.updateTable(0,false);
      }
      if(this.state.itn<this.state.totalItn){
        this.updateTable(this.state.itn,true);
        this.updateTable(this.state.itn,false);
        this.setState({itn:this.state.itn+1});
      }
    },500);
  }

  getOutputRows = (solved) => {
    let newTotalStates = solved.length;
    let rows = [];
    for(let i=0;i<newTotalStates;i++){
      rows.push(
        <tr>
          <td data-label="Serial No." ><div style={{display:"flex",justifyContent:"center"}}><input className="input-cell" disabled="true" value={i+1}></input></div></td>
          <td data-label="Present State" ><div style={{display:"flex",justifyContent:"center"}}><input className="input-cell" disabled="true" value={solved[i][0]}></input></div></td>
          <td data-label="Next State [X=0]"><div style={{display:"flex",justifyContent:"center"}}><input className="input-cell" disabled="true" value={solved[i][1]}></input></div></td>
          <td data-label="Next State [X=1]" ><div style={{display:"flex",justifyContent:"center"}}><input className="input-cell" disabled="true" value={solved[i][2]}></input></div></td>
          <td data-label="Output [X=0]" ><div style={{display:"flex",justifyContent:"center"}}><input className="input-cell" disabled="true" value={solved[i][3]}></input></div></td>
          <td data-label="Output [X=1]" ><div style={{display:"flex",justifyContent:"center"}}><input className="input-cell" disabled="true" value={solved[i][4]}></input></div></td>
        </tr>
      );
    }
    return rows;
  }
  render() {
    return (
      <div style={{  backgroundColor: "#cfc7ed"}}>
        <h1 className="top">STATE TABLE REDUCTION</h1><br></br>
        <h1 style={{textAlign:"center"}}>INITIAL STATE TABLE</h1>
      <div className="table-form">
      <form  style={{fontSize:"15px"}} onSubmit={this.createInputTable}>
        <div className="ui action labeled input"><div className="ui red label">Total States</div><input></input><button className="ui violet right labeled icon button"><i className="cloud upload icon"></i>Update</button></div>
      </form><br></br>
      <form onSubmit={this.getInput}>
      <table className="ui celled inverted table">
      <thead>
        <tr><th style={{textAlign:"center",padding:"0px"}}>Serial No.</th>
        <th style={{textAlign:"center",padding:"0px"}}>Present State</th>
        <th style={{textAlign:"center",padding:"0px"}}>Next State [X=0]</th>
        <th style={{textAlign:"center",padding:"0px"}}>Next State [X=1]</th>
        <th style={{textAlign:"center"}}>Output [X=0]</th>
        <th style={{textAlign:"center"}}>Output [X=1]</th>
      </tr></thead>
      <tbody>
        {this.getInputRows(this.state.totalStates)}
      </tbody>
    </table>
    <button className="ui green labeled icon button" style={{fontSize:"15px"}}><i className="check square icon"></i>Set Input</button>
    </form>
    </div>
    <h1 style={{textAlign:"center"}}>IMPLICATION TABLE SOLVER</h1>
      <div className="iter-snap">
      <div>
      <button onClick={this.reduceTable} className="ui olive labeled icon button"><i className="fast forward icon"></i>Next Iteration</button>
      <button onClick={this.iterate} className="ui purple labeled right floated icon button"><i className="play icon"></i>Start</button>
      </div>
      <br></br>
        <div className="prev">
          <p className="title">PREVIOUS ITERATION</p>
          <p>{this.printTable("prev")}</p>
        </div>
        <div className="curr">
          <p className="title">CURRENT ITERATION</p>
          <p>{this.printTable("curr")}</p>
        </div>
      </div>
      <br></br>
      <div className="table-form">
      <br></br>
        <h1 style={{textAlign:"center"}}>REDUCED STATE TABLE</h1>
      {this.displayReducedStateTable()}
      </div>
      </div>
    );
  }
}

export default Test;