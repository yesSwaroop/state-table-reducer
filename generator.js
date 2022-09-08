const _ = require("lodash");

export const exInput1 = {
  'present-state':['a','b','c','d','e','f','g'],
  'next-state-x0':['a','d','f','d','b','g','a'],
  'next-state-x1':['b','c','b','f','g','c','f'],
  'output-x0':[0,0,0,0,0,0,0],
  'output-x1':[0,1,0,0,0,1,0]
};

export const exInput2 = {
  'present-state':['a','b','c','d','e','f','g'],
  'next-state-x0':['b','d','f','a','a','a','a'],
  'next-state-x1':['c','e','g','a','a','a','a'],
  'output-x0':[0,0,0,0,1,0,1],
  'output-x1':[0,0,0,0,0,0,0]
}

export function printTable(table){
  for(let i=0;i<table.length;i++)
    console.log(table[i]);
}

export function prettyPrintTable(table){
  for(let i=0;i<table.length;i++){
    var row="";
    for(let j=0;j<table[0].length;j++){
      var cell="";
      var k;
      for(k=0;k<table[i][j].length-1;k++){
        cell+=table[i][j][k]+",";
      }
      cell+=table[i][j][k];
      if(cell!="undefined")
        row+=`[${cell}] `;
    }
    if(row!="")
      console.log(row);
  }
}

export function reverseString(str) {
  const arrayStrings = str.split("");
  const reverseArray = arrayStrings.reverse();
  const joinArray = reverseArray.join("");
  return joinArray;
}

export function compareArrays(array1,array2,s1,s2,n){
  var a1="",a2="";
  for(let i=0;i<n;i++){
    a1=a1+array1[s1+i]+":";
    a2=a2+array2[s2+i]+":"
  }
  if(a1==a2)
    return true;
  return false;
}

export function createTable(input){
  var stateTable = [];
  var totalStates = input['present-state'].length;
  for(let state=0;state<totalStates;state++){
    var row = [];
    row.push(input['present-state'][state]);
    row.push(input['next-state-x0'][state]);
    row.push(input['next-state-x1'][state]);
    row.push(input['output-x0'][state]);
    row.push(input['output-x1'][state]);
    stateTable.push(row);
  }
  return stateTable;
}

export function findAndReplaceFullyEquivalentRows(table){
  var output = [[],[],[],[]];
  var totalStates=table.length;
  var totalRowEntries = table[0].length;
  for(let i=0;i<totalStates;i++){
    for(let j=0;j<totalStates;j++){
      if(i!=j){
        if(compareArrays(table[i],table[j],1,1,totalRowEntries)){
          if(compareArrays(table[i],[0,0],3,0,2)&&!output[0].includes(table[i][0]))
            output[0].push(table[i][0]);
          else if(compareArrays(table[i],[0,1],3,0,2)&&!output[1].includes(table[i][0]))
            output[1].push(table[i][0]);
          else if(compareArrays(table[i],[1,0],3,0,2)&&!output[2].includes(table[i][0]))
            output[2].push(table[i][0]);
          else if(compareArrays(table[i],[1,1],3,0,2)&&!output[3].includes(table[i][0]))
            output[3].push(table[i][0]);
        }
      }
    }
  }
  
  for(let i=0;i<output.length;i++){
    output[i] = output[i].sort();
    if(output[i].length!=0){
      for(let j=0;j<table.length;j++){
        if(output[i].includes(table[j][1]))
          table[j][1]=output[i][0];
        if(output[i].includes(table[j][2]))
          table[j][2]=output[i][0];
      }
    }
  }
}
export function getEmptyImplicationTableFor(table){
  var  implicationTable=[];
  for(let i=0;i<table.length;i++){
    var row=[];
    for(let j=0;j<table.length;j++)
      row.push([]);
    implicationTable.push(row);
  }
  return implicationTable;
}

export function firstIteration(table,STable){
  var row=0,col=0;
  const tableLength = table.length;
  const rowSize = table[0].length;
  for(let i=0;i<tableLength;i++){
    for(let j=0;j<tableLength;j++){
      if(i<j&&row<tableLength){
        if(compareArrays(table[i],table[j],3,3,rowSize-3)&&!STable[row][col].includes('X')){
          if(table[i][1]==table[j][1]&&table[i][2]==table[j][2]&&table[i][1]==table[i][2])
            STable[row][col].push(table[i][1]+'='+table[j][1]);
          if(table[i][1]!=table[j][1] && (table[i][0]+table[j][0])!=(table[i][1]+table[j][1]) && (table[i][0]+table[j][0])!=(table[j][1]+table[i][1]))
            STable[row][col].push(table[i][1]+'='+table[j][1]);
          if(!(STable[row][col].includes(table[i][2]+'='+table[j][2])) && table[i][2]!=table[j][2] && (table[i][0]+table[j][0])!=(table[i][2]+table[j][2]) && (table[i][0]+table[j][0])!=(table[j][2]+table[i][2]))
            STable[row][col].push(table[i][2]+'='+table[j][2]);
        }
        else {
          STable[row][col].push('X');
        } 
        if(STable[row][col].length==0)
          STable[row][col].push('X');
      }
      row+=1;
    }
    col+=1;
    row=0;
  }

}

export function initializeUnequalStateList(list,STable){
  let row='b',col='a';
  for(let i=1;i<STable.length;i++){
    for(let j=0;j<i;j++){
      if(STable[i][j].includes('X'))
        list.push(`${row}=${col}`);
      col = String.fromCharCode(col.codePointAt(0)+1);
    }
    row = String.fromCharCode(row.codePointAt(0)+1);
    col='a';
  }
  return list;
}

export function implicationTableStep(STable,unequalStateList){
  let newUnequalStateList = _.cloneDeep(unequalStateList);
  let row='b';
  let col='a';
  for(let i=1;i<STable.length;i++){
    for(let j=0;j<i;j++){
      for(let k=0;k<STable[i][j].length;k++){
        let entry = STable[i][j][k];
        if(entry!='X'&& (unequalStateList.includes(entry) || unequalStateList.includes(reverseString(entry)))){
          newUnequalStateList.push(`${row}=${col}`);
          STable[i][j]=['X'];
        }
      }
      col = String.fromCharCode(col.codePointAt(0)+1);
    }
    row = String.fromCharCode(row.codePointAt(0)+1);
    col='a';
  }
  return newUnequalStateList;
}

export function repeatImplicationTable(iterations,STable,unequalStateList){
  var xCount=0,xCountNew=0;
    while(true){
      xCount=0;xCountNew=0;
      for(let k=1;k<STable.length;k++){
        for(let l=0;l<k;l++){
          if(STable[k][l]=='X')
            xCount+=1;
        }
      }
      unequalStateList = implicationTableStep(STable,unequalStateList);
      var clone = STable;
      for(let k=1;k<STable.length;k++){
        for(let l=0;l<k;l++){
          if(STable[k][l]=='X')
          xCountNew+=1;
        }
      }
      if(xCount==xCountNew || xCountNew==((STable.length-1)*(STable.length))/2)
        return;
      iterations.push(_.cloneDeep(STable));
    }
}

export function findEquivalentStates(STable,list){
  for(let i=1;i<STable.length;i++){
    for(let j=0;j<i;j++){
      if(STable[i][j]!='X')
        list.push(STable[i][j]);
    }
  }
  return list;
}

export function reduceStateTable(table,equivalentStates){
  for(let i=0;i<equivalentStates.length;i++){
    for(let j=0;j<table.length;j++){
      if(table[j][0]==equivalentStates[i][0][equivalentStates[i][0].length-1]){
        table.splice(j,1);
        break;
      }
    }
    for(let j=0;j<table.length;j++){
      for(let k=1;k<3;k++){
        if(table[j][k]==equivalentStates[i][0][equivalentStates[i][0].length-1])
          table[j][k]=equivalentStates[i][0][0];
      }
    }
  }
  for(let i=0;i<table.length;i++){
    for(let j=i+1;j<table.length;j++){
      if(table[i][1]+table[i][2]+table[i][3]+table[i][4] == table[j][1]+table[j][2]+table[j][3]+table[j][4]){
        table.splice(j,1);
      }
    }
  }
  return table;
}

export function solve(input) {
  var iterations = [];
  var stateTable = createTable(input);
  var implicationTable = getEmptyImplicationTableFor(stateTable);
  firstIteration(stateTable,implicationTable);
  var clone = implicationTable;
  iterations.push(_.cloneDeep(implicationTable));
  var unequalStateList = initializeUnequalStateList([],implicationTable);
  repeatImplicationTable(iterations,implicationTable,unequalStateList);
  var equivalentStates = findEquivalentStates(implicationTable,[]);
  stateTable = reduceStateTable(stateTable,equivalentStates);
  iterations.push(_.cloneDeep(stateTable));
  return iterations;
}

export function printIterations(iterations) {
  for(let i=0;i<iterations.length-1;i++){
    prettyPrintTable(iterations[i]);
    console.log();
  }
  console.log(iterations[iterations.length-1]);
}

// var test = createTable(input);
// console.log('\nInitial State Table :')
// printTable(test);

// var STable = getEmptyImplicationTableFor(test);
// firstIteration(test,STable);
// console.log('\nAfter 1st iteration :')
// prettyPrintTable(STable);

// let unequalStateList = initializeUnequalStateList([],STable);
// console.log(`\nunequalStateList :\n[${unequalStateList.toString()}]`);
// console.log('\nAfter all iterations :')
// repeatImplicationTable(STable,unequalStateList);
// prettyPrintTable(STable);

// let equivalentStates = findEquivalentStates(STable,[]);
// console.log(`\nequivalentStates :\n[${equivalentStates.toString()}]`);

// test = reduceStateTable(test,equivalentStates);
// console.log('\nReduced State Table :')
// printTable(test);

