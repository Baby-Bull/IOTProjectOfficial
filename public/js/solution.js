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

var requestOptions = {
  method: 'POST',
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ deviceId: getCookie("deviceId") })
};

setInterval(() => {
  fetch("http://localhost:3000/device/getDeviceInfo", requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var modalDanger = document.getElementById('id02');
      if (data.device.stateHistory[49].temperature > 35) {
        modalDanger.style.display = "block";
      } else {
        modalDanger.style.display = "none";
      }
    })
}, 1000);


var timeToStop = 0;
document.getElementById("formSetTime").addEventListener("submit", (e) => {
  e.preventDefault();
  var temp = document.getElementById("timeToStop").value;
  timeToStop = (temp.slice(-1) === "s") ? temp.slice(0, -1) : temp.slice(0, -1) * 60;

  if (timeToStop != 0) {
    console.log(timeToStop);
    document.getElementById("but_start").style.display = "block";
    document.getElementById("startSystemButton").addEventListener("click", () => {
      document.getElementById("id03").style.display = "block";
      var target_date = new Date().getTime() + timeToStop * 1000;
      var miniseconds, minutes, seconds; // variables for time units
      var countdown = document.getElementById("countTiles"); // get tag element
      getCountdown();
      setInterval(function () { getCountdown(); }, 1);

      function getCountdown() {
        var current_date = new Date().getTime();
        var miniseconds_left = (target_date - current_date) / 1;

        minutes = pad(parseInt(miniseconds_left / 60000));
        miniseconds_left = miniseconds_left % 60000;

        seconds = pad(parseInt(miniseconds_left / 1000));
        miniseconds = miniseconds_left % 1000

        countdown.innerHTML = "<span>" + minutes + "</span><span>" + seconds + "</span><span>" + miniseconds + "</span>";
      }
      function pad(n) {
        return (n < 1000 ? '0' : '') + n;
      }
      var requestUser1 = {
        method: 'PUT',
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: getCookie("userId"), action: "ON", keepTo: target_date })
      };
      fetch("http://localhost:3000/device/editByUser/" + getCookie("deviceId"), requestUser1)
        .then((response1) => {
          return response1.json();
        })
        .then((data) => {
          console.log(data);
        }) //stopp

      setTimeout(() => {
        var requestUser2 = {
          method: 'PUT',
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ userId: getCookie("userId"), action: "OFF" })
        };
        fetch("http://localhost:3000/device/editByUser/" + getCookie("deviceId"), requestUser2)
          .then((response2) => {
            return response2.json();
          })
          .then((data) => {
            console.log(data);
          })
        document.getElementById("id03").style.display = "none";
        location.href = "http://localhost:3000/solution.html"
      }, timeToStop * 1000);
    })
  }
})











var modal = document.getElementById('id01');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}