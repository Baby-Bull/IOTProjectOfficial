function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var timeToStop;
document.getElementById("formSetTime").addEventListener("submit", (e) => {
  e.preventDefault();
  var temp = document.getElementById("timeToStop").value;
  timeToStop = (temp.slice(-1) === "s") ? temp.slice(0, -1) : temp.slice(0, -1) * 60;

})

var requestOptions = {
  method: 'POST',
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ deviceId: getCookie("deviceId") })
};

fetch("http://localhost:3000/device/getDeviceInfo", requestOptions)
  .then((response) => {
    return response.json();
  })
  .then((data)=>{
    var modalDanger = document.getElementById('id02');
    console.log(data.device.stateHistory[49].temperature);
    if(data.device.stateHistory[49].temperature > 35){
      modalDanger.style.display = "block";
    }else{
      modalDanger.style.display = "none";
    }
  })












var modal = document.getElementById('id01');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}