(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// var ajaxTime= new Date().getTime();
var url = sessionStorage.getItem("url");
var monitorTime = sessionStorage.getItem("monitorTime");
var interval = sessionStorage.getItem("interval");
var users = sessionStorage.getItem("users");
//console.log(users);

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


var FileSaver = require('file-saver');
document.getElementById ("download").addEventListener ("click", function(){downloadData()}, false);
document.getElementById ("chart").addEventListener ("click", function(){chartIt()}, false);
//console.log(url);
$('#monitorTime').append(JSON.stringify("Your test will run for "+ monitorTime +" hour(s)"))
var allData = []
for(i=0;i<users;i++)
  APIFetch();
chartIt();

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
  $('#time').html(JSON.stringify(days + "d " + hours + "h "
  + minutes + "m " + seconds + "s " ));
  // If the count down is finished, write some text

  if(new Date(timeToFetch).toString() == new Date(now).toString()){
    //console.log("Fetch time"+ allData);
    for(i=0;i<users;i++)
      APIFetch();
    //chartIt();
    timeToFetch = now + (interval*60*1000);
  }
  if (distance < 0) {
    clearInterval(x);
    //document.getElementById("demo").innerHTML = "EXPIRED";
    $('#time').append(JSON.stringify("EXPIRED"));
  }
}, 1000);

function APIFetch() {
  var ajaxTime= new Date().getTime();
  $.ajax({
    url: url,
    headers: {
    },
    error: function(xhr, status, error) {
      //console.log(xhr);
      var err_code = eval("(" + xhr.status + ")");
      $('#response').append(JSON.stringify("Status: "+ xhr.statusText ))
      $('#response_code').append(JSON.stringify("Code: "+ err_code ))
      var totalTime = new Date().getTime()-ajaxTime;
      var res = err_code + "," + xhr.statusText + "," + totalTime;
      allData.push(res);
      //console.log(allData);
    },
    complete: function(xhr, textStatus) {
      $('#response_code').html(JSON.stringify("Code: "+ xhr.status ))
        //console.log(xhr);
        if(xhr.status == 200) {
          var totalTime = new Date().getTime()-ajaxTime;
          var res = xhr.status + "," + textStatus + "," + totalTime;
          allData.push(res);
          //console.log(allData);
        }
    }
  }).done(function(data, response) {
    deepFetch(data);
    //console.log(response)
    //console.log(totalTime);
    //console.log(data);

    $('#response').html(JSON.stringify("Status: "+ response ))
    //$('#response_time').append(JSON.stringify("Time: "+ totalTime + "ms"))
  });
}
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
          var para = document.createElement("P");               // Create a <p> element
          para.innerText = stringData[i];               // Insert text
          //document.getElementById("monitor_data").appendChild(para);
          i++;
        }
      }
    }
  }
  else {
    var para = document.createElement("P");               // Create a <p> element
    para.innerText = data;            // Insert text
    document.getElementById("monitor_data").appendChild(para);
  }
};
function downloadData() {
  let csvContent = "data:text/csv;charset=utf-8,"
  csvContent += "Code,Status,time" + "\r\n";
  allData.forEach(function(rowArray) {
    let row = rowArray;
    csvContent += row + "\r\n";
  });

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "APIData.csv");
  link.click();
}
function chartIt() {
  const xlabels = [];
  const resTime = [];
  allData.forEach(function(col){
    let colData = col.split(',');
    resTime.push(colData[0]);
    xlabels.push(colData[1]);
  });
  console.log(xlabels, resTime);
  var ctx = document.getElementById('chart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: xlabels,
        datasets: [{
            label: 'Response',
            data: resTime,
            //fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
}

},{"file-saver":2}],2:[function(require,module,exports){
(function (global){
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d)},e.onerror=function(){console.error("could not download file")},e.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null},j.readAsDataURL(a)}else{var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l)},4E4)}});f.saveAs=a.saveAs=a,"undefined"!=typeof module&&(module.exports=a)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"file-saver":2}],2:[function(require,module,exports){
(function (global){
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d)},e.onerror=function(){console.error("could not download file")},e.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null},j.readAsDataURL(a)}else{var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l)},4E4)}});f.saveAs=a.saveAs=a,"undefined"!=typeof module&&(module.exports=a)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
