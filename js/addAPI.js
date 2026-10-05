
var numberOfInputs = 1;

// var firebase = require("../firebase/app");
// require("../firebase/database");
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

function getAPIURL() {
      console.time("timer");
      // Selecting the input element and get its value
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      var url = document.getElementById("url").value;
      var key = document.getElementById("key").value;
      var value = document.getElementById("value").value;
      console.log(key);
      if(key!='') {

        url = url + "?" + key + "=" +value;
        console.log(numberOfInputs);
        if(numberOfInputs > 0) {
          for(i=1;i<numberOfInputs;i++) {
            var tempKey = document.getElementById("key"+i).value
            var tempValue = document.getElementById("value"+i).value
            if(tempKey != '' || tempValue != '')
              url = url + "&" + tempKey + "=" + tempValue;
            console.log(url);
          }
        }
      }
      if(monitorTime!='' && interval!='') {
        var monitorTime = document.getElementById("monitorTime").value;
        var interval = document.getElementById("interval").value;
        var users = document.getElementById("users").value;
      }

      if(document.getElementById('publicAPI').checked) {
        var publicAPI = document.getElementById("publicAPI").value;
        sendData(url,monitorTime,interval,users, publicAPI);
      }
      else if(document.getElementById('privateAPI').checked) {
        var privateAPI = document.getElementById("privateAPI").value;
        sendData(url,monitorTime,interval,users, privateAPI);
      }
}

function sendData(url,monitorTime,interval,users,apiType) {

      database.ref('api').push({
        url: url,
        monitorTime: monitorTime,
        interval: interval,
        numberOfUsers: users,
        APIType: apiType
      });

      window.location.href = 'listAPI.html';

}
function addKeyValue() {

  var container = document.getElementById("keyvalue");
  var inputKey = document.createElement("input");
  var inputValue = document.createElement("input");

  inputKey.type = "text";
  inputValue.type = "text";
  inputKey.id = "key"+numberOfInputs;
  inputValue.id = "value"+numberOfInputs;
  inputKey.placeholder = "Key";
  inputValue.placeholder = "Value";
  console.log(inputKey.id);
  container.appendChild(inputKey);
  container.appendChild(inputValue);
  container.appendChild(document.createElement("br"));

  numberOfInputs = numberOfInputs + 1;
  console.log(numberOfInputs);
}
