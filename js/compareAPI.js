(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// var ajaxTime= new Date().getTime();
var url1 = sessionStorage.getItem("url0");
var monitorTime1 = sessionStorage.getItem("monitorTime0");
var interval1 = sessionStorage.getItem("interval0");
var users1 = sessionStorage.getItem("users0");

var url2 = sessionStorage.getItem("url1");
var monitorTime2 = sessionStorage.getItem("monitorTime1");
var interval2 = sessionStorage.getItem("interval1");
var users2 = sessionStorage.getItem("users1");


var monitorTime = Math.max(monitorTime1,monitorTime2);
var users = Math.max(users1,users2);
var interval = Math.max(interval1,interval2);

var firebaseConfig = {
  apiKey: "AIzaSyBMpbWneTIHKksbO6sWHopoUfE62jsZMZA",
  authDomain: "monitorapi-3d096.firebaseapp.com",
  databaseURL: "https://monitorapi-3d096.firebaseio.com",
  projectId: "monitorapi-3d096",
  storageBucket: "monitorapi-3d096.appspot.com",
  messagingSenderId: "786388724856",
  appId: "1:786388724856:web:41393478dbeba7f4a0d18d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var status_code = {
    200: "Successful",
    201: "Created",
    400: "Bad Request",
    403: "Forbidden",
    404: "Resource not found",
    405: "The resource doesn't support the specified HTTP verb",
    409: "Conflict",
    411: "The Content-Length header was not specified",
    412: "Precondition failed",
    429: "Too many request for rate limiting",
    500: "Servers are not working as expected. The request is probably valid but needs to be requested again later",
    503: "Service Unavailable",
  };
var flagFirst = 1;
var rawData = {};
var FileSaver = require('file-saver');
document.getElementById ("download").addEventListener ("click", function(){downloadData()}, false);
document.getElementById ("chartbtn").addEventListener ("click", function(){chartIt()}, false);
//document.getElementById ("response_text").addEventListener ("click", function(){showData()}, false);

//Download Chart Image
document.getElementById("downloadGraph").addEventListener('click', function(){
  /*Get image of canvas element*/
  var url_base64jp = document.getElementById("chart").toDataURL("image/jpg");
  /*get download button (tag: <a></a>) */
  var a =  document.getElementById("downloadGraph");
  /*insert chart image url to download button (tag: <a></a>) */
  a.href = url_base64jp;
});
//console.log(url);

var allData1 = [];
var allData2 = [];
var numOfErrorsAPI1 = 0;
var numOfErrorsAPI2 = 0;
var sucessAPI1 = 0;
var sucessAPI2 = 0;
var averageTime1 = 0.0;
var averageTime2 = 0.0;
for(i=0;i<users;i++)
  APIFetch(url1);

//chartIt();

var countDownDate = new Date().getTime() + (monitorTime*60*60*1000);
var timeToFetch = new Date().getTime() + (interval*60*1000);

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result
  $('#time').html(JSON.stringify(hours + "h "
  + minutes + "m " + seconds + "s " ));
  // If the count down is finished, write some text

  if(new Date(timeToFetch).toString() == new Date(now).toString()) {
    //console.log("Fetch time"+ allData);
    for(i=0;i<users;i++)
      APIFetch(url1);
    timeToFetch = now + (interval*60*1000);
  }

  if(new Date((timeToFetch-(interval*60*1000)) + 3*1000).toString()== new Date(now).toString()){
    for(i=0;i<users;i++)
      APIFetch(url2);
  }

  if(new Date((timeToFetch-(interval*60*1000)) + 6*1000).toString()== new Date(now).toString()){
      chartIt();
  }
  // if(new Date(timeToFetch+(2*1000)).toString() == new Date(now).toString()) {
  //   chartIt();
  // }
  if (distance < 0) {
    clearInterval(x);
    //document.getElementById("demo").innerHTML = "EXPIRED";
    $('#time').append(JSON.stringify("EXPIRED"));
  }
}, 1000);

async function APIFetch(url) {
  // jQuery AJAX function for API
  var ajaxTime= new Date().getTime();
  $.ajax({
    url: url,
    headers: {
    },
    error: function(xhr, status, error) {
      //console.log(xhr);
      var err_code = eval("(" + xhr.status + ")");
      var totalTime = new Date().getTime()-ajaxTime;

      if(url==url1) {
        numOfErrorsAPI1 = numOfErrorsAPI1 + 1;
        $('#response_code1').html(JSON.stringify(""+ numOfErrorsAPI1 ));
        var res = err_code + "," + xhr.statusText + "," + totalTime;
        averageTime1 += totalTime;
        $('#avg_response1').html(JSON.stringify(""+ ((averageTime1/(numOfErrorsAPI1+sucessAPI1))/1000).toFixed(3)));
        allData1.push(res);

        // if(document.getElementById("tableItem")!=null)
          // showList(err_code,totalTime);
      }
      else {
        numOfErrorsAPI2 = numOfErrorsAPI2 + 1;
        $('#response_code2').html(JSON.stringify(""+ numOfErrorsAPI2 ));
        var res = err_code + "," + xhr.statusText + "," + totalTime;
        averageTime2 += totalTime;
        $('#avg_response2').html(JSON.stringify(""+ ((averageTime2/(numOfErrorsAPI2+sucessAPI2))/1000).toFixed(3)));
        allData2.push(res);

        // if(document.getElementById("tableItem")!=null)
          // showList(err_code,totalTime);
      }
      //console.log(allData);
    },
    complete: function(xhr, textStatus) {
        //console.log(xhr);
        if(url==url1) {
          if(xhr.status == 200) {
            sucessAPI1 = sucessAPI1 + 1;

            $('#response1').html(JSON.stringify(""+ sucessAPI1 ));
            var totalTime = new Date().getTime()-ajaxTime;
            var res = xhr.status + "," + textStatus + "," + totalTime;
            averageTime1 += totalTime;
            $('#avg_response1').html(JSON.stringify(""+ ((averageTime1/(numOfErrorsAPI1+sucessAPI1))/1000).toFixed(3)));

            allData1.push(res);
            //console.log(allData);
          }
        }
        if(url==url2) {
          if(xhr.status == 200) {
            sucessAPI2 = sucessAPI2 + 1;

            $('#response2').html(JSON.stringify(""+ sucessAPI2 ));
            var totalTime = new Date().getTime()-ajaxTime;
            var res = xhr.status + "," + textStatus + "," + totalTime;
            averageTime2 += totalTime;
            $('#avg_response2').html(JSON.stringify(""+ ((averageTime2/(numOfErrorsAPI2+sucessAPI2))/1000).toFixed(3)));
            allData2.push(res);

            //console.log(allData);
          }
        }
    }
  }).done(function(data, response) {
    rawData = data;
  });
}

// Fynctions for parsing response data
function hasProperty(obj){
  if (typeof obj === 'object' && typeof obj != null ) {

        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                return true;
            }
        }
    }
    return false;
};
async function deepFetch(data){
  var stringData = {};
  var i = 0;
  if(typeof data === 'object'  && typeof obj != null ) {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if(hasProperty(data[key])){
          //console.log("in data");
          deepFetch(data[key]);
          //console.log("exit");
        }
        else{
          stringData[i] = key+" : "+data[key];
          var para = document.createElement("P");
          para.innerText = stringData[i];
          document.getElementById("monitor_data").appendChild(para);
          i++;
        }
      }
    }
  }
  else {
    var para = document.createElement("P");
    para.innerText = data;
    document.getElementById("monitor_data").appendChild(para);
  }
};

// Function to download gathered test data
function downloadData() {
  let csvContent = "data:text/csv;charset=utf-8,"
  csvContent += "API" + url1 + "\r\n";
  csvContent += "Code,Status,time" + "\r\n";
  allData1.forEach(function(rowArray) {
    let row = rowArray;
    csvContent += row + "\r\n";
  });
  csvContent += "API" + url2 + "\r\n";
  csvContent += "Code,Status,time" + "\r\n";
  allData2.forEach(function(rowArray) {
    let row = rowArray;
    csvContent += row + "\r\n";
  });

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "APIData.csv");
  link.click();
}

// Function to draw a graph
function chartIt() {
  var count = 0;
  const xlabels = [];
  const resTime1 = [];
  const colors1 = [];

  const resTime2 = [];
  const colors2 = [];

  allData1.forEach(function(col){
    let colData = col.split(',');
    resTime1.push(colData[2]/1000);
    count += 1;
    xlabels.push(count);
    if(colData[0]==200){
      colors1.push('rgb(43, 236, 43, 1)');
    }
    else {
      colors1.push('rgb(246, 8, 8, 1)')
    }
  });

  allData2.forEach(function(col){
    let colData = col.split(',');
    resTime2.push(colData[2]/1000);
    //xlabels.push(colData[0]);
    if(colData[0]==200){
      colors2.push('rgb(43, 236, 43, 1)');
    }
    else {
      colors2.push('rgb(246, 8, 8, 1)')
    }
  });
  //console.log(xlabels, resTime);

  var ctx = document.getElementById("chart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: xlabels,
        xAxisID: 'Response time',
        datasets: [{
            type:'line',
            label: 'Response time for API 1',
            data: resTime1,
            pointBackgroundColor: colors1,
            pointRadius: 7,
            pointHoverRadius: 10,
            fill: false,
            borderColor: 'rgba(236, 69, 255, 1)',
            backgroundColor: 'rgba(254, 194, 194, 1)',
            borderWidth: 3
        },{
            type:'line',
            label: 'Response time for API 2',
            data: resTime2,
            pointBackgroundColor: colors2,
            pointRadius: 7,
            pointHoverRadius: 5,
            fill: false,
            borderColor: 'rgba(255, 126, 41, 1)',
            backgroundColor: 'rgba(254, 194, 194, 1)',
            borderWidth: 3
        }]
    },
    options: {
        responsive:true,
        title: {
           display: true,
           text: 'Response time comparison for both the APIs'
          },
        tooltips: {
          mode: 'nearest',
          intersect: true,
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min:0,
                    callback: function(value, index, values) {
                        return value + 's';
                    }
                }
                //stacked:true
            }]
        },
        annotation: {
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 1,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 4,
            label: {
              enabled: true,
              content: 'Test label'
            }
          }]
        }
    }
});
}
// To display the response data to the user
function showData() {
  console.log(rawData);
  deepFetch(rawData)
  document.getElementById("dataField").style.display = "flex";
}

},{"file-saver":2}],2:[function(require,module,exports){
(function (global){
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d)},e.onerror=function(){console.error("could not download file")},e.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null},j.readAsDataURL(a)}else{var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l)},4E4)}});f.saveAs=a.saveAs=a,"undefined"!=typeof module&&(module.exports=a)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
