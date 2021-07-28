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

var request = {
  method: 'POST',
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    deviceId: getCookie("deviceId")
  })
}

setInterval(function () {
  fetch("http://localhost:3000/device/getDeviceInfo", request)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var temp = data.device.stateHistory;
      console.log(temp[temp.length - 1].humidity);

      Highcharts.chart('chart1', {
        title: {
          text: 'Biểu đồ độ ẩm trong không khí',
        },
        xAxis: {
          categories: ['1min', '55s', '50s', '45s', '40s', '35s',
            '30s', '25s', '20s', '15s', '10s', '5s']
        },
        yAxis: {
          title: {
            text: 'Chỉ số độ ẩm (%)'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        tooltip: {
          valueSuffix: '°C'
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: [{
          data: [temp[temp.length - 1].humidity, temp[temp.length - 2].humidity, temp[temp.length - 3].humidity, temp[temp.length - 4].humidity, temp[temp.length - 5].humidity, temp[temp.length - 6].humidity, temp[temp.length - 7].humidity, temp[temp.length - 8].humidity, temp[temp.length - 9].humidity, temp[temp.length - 10].humidity, temp[temp.length - 11].humidity, temp[temp.length - 12].humidity]
        }]
      });
    })
}, 15000);


var target_date = new Date().getTime() + 15000; // set the countdown date
var miniseconds, minutes, seconds; // variables for time units
var countdown = document.getElementById("tiles"); // get tag element
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

var cusor = '_';
var count = 0;
var mess = "</br> Dưới đây là đồ thị độ ẩm của thiết bị</br>";

function type() {
  if (cusor == '_') {
    cusor = ' ';
  }
  else {
    cusor = '_';
  }
  document.getElementById('cd_title').style.display = "none";
  document.getElementById('countdown').style.width = "800px";
  document.getElementById('countdown').style.margin = "-190px 0 0 17%";
  document.getElementById('countdown').innerHTML = "<p>" + mess.substring(0, count++) + cusor + "</p>";
  if (count <= mess.length) {
    setTimeout("type()", 60);
  } else { cusor = '_'; }
}

setTimeout("type()", 15000);