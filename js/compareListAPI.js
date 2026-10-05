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
document.getElementById ("compareBtn").addEventListener ("click", function(){compareAPI()}, false);
var ref = firebase.database().ref('api');
var listData = []
getAPI();

function getAPI() {
    var i = 0;
    var container = document.getElementById("list");

    ref.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();

      console.log(childData.url);
      var row = document.createElement("tr");
      var checkboxCell = document.createElement("td");
      var labelCell = document.createElement("td");

      var list = document.createElement("input");
      var label= document.createElement("label");

      list.class = "APICheckBox";
      list.type = "checkbox";

      list.name = childData.url;
      list.id = childData.url;
      list.value = childData.url;
      listData.push(childData);

      checkboxCell.appendChild(list);
      label.appendChild(document.createTextNode(childData.url));
      labelCell.appendChild(label);

      row.appendChild(checkboxCell);
      row.appendChild(labelCell);

      container.appendChild(row);

      container.appendChild(document.createElement("br"));

      });
    });
  }
function compareAPI() {

  var count = 0;
  listData.forEach(function(data){
    var item = document.getElementById(data.url);
    console.log(count);

    if(item.checked) {
      sessionStorage.setItem("url"+count, data.url);
      sessionStorage.setItem("monitorTime"+count, data.monitorTime);
      sessionStorage.setItem("interval"+count, data.interval);
      sessionStorage.setItem("users"+count, data.numberOfUsers);
      count++;
    }
  });
  if(count>2) {
    alert("Only two APIs allowed");
  }
  else if(count<2) {
    alert("Select two APIs");
  }
  else {
    window.location.href = 'compareAPI.html';
  }

}
