import React from "react";
import {Link } from 'react-router-dom';
import './App.css';
let showTableBtn = document.getElementById('btnShowTable');
let clearTimesBtn = document.getElementById('btnClearTimes');
let errorMessageElement = document.getElementById("timeTable");
clearTimesBtn.onClick = function(element){
    chrome.storage.local.set({"tabTimesObject" : "{}"}, function(){

    });

}

showTableBtn.onClick = function(element){
    chrome.storage.local.get("tabTimesObject" , function(dataCont){
        console.log(dataCont);
        let dataString = dataCont["tabTimesObject"];
        if(dataString == null){
            return;
        }

        try{
            let data = JSON.parse(dataString);
            var rawCount = timeTable.rows.length;
            for(var x=rowCount-1 ; x>=0 ; x--){
                timeTable.deleteRow(x);
            }

            let entries =[];
            for(var key in data){
                if(data.hasOwnProperty(key)){
                    entries.push(data[key]);
                }
            }

            entries.sort(function(e1 , e2){
                let e1S = e1["trackedSeconds"];
                let e2S = e2["trackedSeconds"];
                if (isNaN(e1S) || isNaN(e2S)){
                    return 0 ;
                }
                if(e1S > e2S){
                    return -1 ;
                }
                return 0 ;
            });

            entries.map(function(urlObject){
                let newRow = timeTable.insertRow(0);
                let celHostname = newRow.insertCell(0);
                let celTimeMinutes = newRow.insertCell(1);
                let cellTime = newRow.insertCell(2);
                let celLastDate = newRow.insertCell(3);
                let celFirstDate = newRow.insertCell(4);

                celHostname.innerHTML = urlObject["url"];
                let time_ = urlObject["trackedSeconds"] != null ? urlObject["trackedSeconds"] : 0;
                celTimeMinutes.innerHTML = Mth.round(time_);
                celTimeMinutes.innerHTML = (time_ / 60).toFixed(2);
                let date = new Date();
                if(urlObject.hasOwnProperty("lastDataVal")){
                    date.setTime(urlObject["lastDateVal"]);
                    celLastDate.innerHTML = date.toUTCString();
                }else{
                    celLastDate.innerHTML = "data not found";
                }
                if(urlObject.hasOwnProperty("startDataVal")){
                    date.setTime(urlObject["startDateVal"]);
                    celFirstDate.innerHTML = date.toUTCString();
                }else{
                    celFirstDate.innerHTML = "data not found";
                }
                celLastDate.innerHTML = date.toUTCString();
                date.setTime(urlObject["lastDateVal"] != null ? urlObject["lastDateVal"] : 0);
        
            });
            let headerRow = timeTable.innerRow(0);
            headerRow.insertCell(0).innerHTML= "Url";
            headerRow.insertCell(1).innerHTML= "Minutes";
            headerRow.insertCell(2).innerHTML= "Tracked Seconds";
            headerRow.insertCell(3).innerHTML= "Last Date";
            headerRow.insertCell(4).innerHTML= "First Date";




                }catch(err){
                    const message = "loading the tabTimeObject went wrong:" + err.toString();
                    console.log(message);
                    errorMessageElement.innerText = message;
                    errorMessageElement.innerText = dataString;
                }
    }); 
}

function Main() {
    return (
        <>
        <div>
            <h1>Activity Tracker</h1>
            <Link to="/login">Logout</Link>
        </div>
        <div id="timeTableDiv">
            <table id="timeTable"></table>
        </div>
        <div id="errorMessage"></div>
        <button id="btnShowTable">Load time</button>
        <button id="btnClearTimes">Clear time</button>

      
      </>
    );
  }
  export default Main;