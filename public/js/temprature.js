
function findMax(arr) {
  var max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    max = (arr[i] > max ? arr[i] : max);
  }
  return max;
}
function findMin(arr) {
  var min = arr[0];
  for (let i = 0; i < arr.length; i++) {
    min = (arr[i] < min ? arr[i] : min);
  }
  return min;
}

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

setInterval(async () => {
  await fetch("http://localhost:3000/device/getDeviceInfo", request)
    .then((response) => {
      return response.json();
    })
    .then((data) => {

      var temp = data.device.stateHistory;
      var index = [];
      for (let i = 0; i < temp.length; i++) {
        index.push(temp[i].temperature);
      }

      var arr_temp = [[], [], [], [], [], [], [], [], [], [], [], []];
      for (let i = 0; i < 11; i++) {
        for (let j = index.length - 1 - 4 * i; j > index.length - 5 - 4 * i; j--) {
          arr_temp[i].push(index[j]);
        }
      }

      Highcharts.chart('chart3', {
        chart: {
          type: 'columnrange',
          inverted: true
        },
        accessibility: {
          description: ''
        },
        title: {
          text: 'Nhiệt độ qua thời gian '
        },
        subtitle: {
          text: '12 phút gần nhât'
        },
        xAxis: {
          categories: ['12 mins ago', '11 mins ago', '10 mins ago', '9 mins ago', '8 mins ago', '7 mins ago',
            '6 mins ago', '5 mins ago', '4 mins ago', '3 mins ago', '2 mins ago', '1 mins ago']
        },
        yAxis: {
          title: {
            text: 'Temperature ( °C )'
          }
        },
        tooltip: {
          valueSuffix: '°C'
        },
        plotOptions: {
          columnrange: {
            dataLabels: {
              enabled: true,
              format: '{y}°C'
            }
          }
        },
        legend: {
          enabled: false
        },
        series: [{
          name: 'Temperatures',
          data: [
            [findMin(arr_temp[11]), findMax(arr_temp[11])],
            [findMin(arr_temp[10]), findMax(arr_temp[10])],
            [findMin(arr_temp[9]), findMax(arr_temp[9])],
            [findMin(arr_temp[8]), findMax(arr_temp[8])],
            [findMin(arr_temp[7]), findMax(arr_temp[7])],
            [findMin(arr_temp[6]), findMax(arr_temp[6])],
            [findMin(arr_temp[5]), findMax(arr_temp[5])],
            [findMin(arr_temp[4]), findMax(arr_temp[4])],
            [findMin(arr_temp[3]), findMax(arr_temp[3])],
            [findMin(arr_temp[2]), findMax(arr_temp[2])],
            [findMin(arr_temp[1]), findMax(arr_temp[1])],
            [findMin(arr_temp[0]), findMax(arr_temp[0])],
          ]
        }]
      });
      return data.device.stateHistory[data.device.stateHistory.length - 1].temperature;
    })
  // .then((data)=>{
  //   var cusor='_';
  //   var count=0;
  //   var mess = data > 30 ? "thiet bi dang hoat dong o nhiet do binh thuong" : "thiet bi dang qua nong";

  //   function type(){
  //     if(cusor=='_') {
  //       cusor=' ';
  //     } 
  //     else {
  //       cusor='_';
  //     }
  //     document.getElementById('text_temp').innerHTML=mess.substring(0,count++)+cusor;
  //     if(count<=mess.length) {
  //       setTimeout("type()",50);
  //     }
  //   }
  //   type();
  //    cusor='_';
  //    count=0;
  // })
}, 10000);

Highcharts.chart('pie_chart', {
  chart: {
    type: 'gauge',
    plotBackgroundColor: null,
    plotBackgroundImage: null,
    plotBorderWidth: 0,
    plotShadow: false
  },
  title: {
    text: 'Temperature'
  },
  pane: {
    startAngle: -150,
    endAngle: 150,
    background: [{
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, '#FFF'],
          [1, '#333']
        ]
      },
      borderWidth: 0,
      outerRadius: '109%'
    }, {
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, '#333'],
          [1, '#FFF']
        ]
      },
      borderWidth: 1,
      outerRadius: '107%'
    }, {
      // default background
    }, {
      backgroundColor: '#DDD',
      borderWidth: 0,
      outerRadius: '105%',
      innerRadius: '103%'
    }]
  },
  // the value axis
  yAxis: {
    min: 0,
    max: 55,

    minorTickInterval: 'auto',
    minorTickWidth: 1,
    minorTickLength: 10,
    minorTickPosition: 'inside',
    minorTickColor: '#666',

    tickPixelInterval: 30,
    tickWidth: 2,
    tickPosition: 'inside',
    tickLength: 10,
    tickColor: '#666',
    labels: {
      step: 2,
      rotation: 'auto'
    },
    title: {
      text: '°C'
    },
    plotBands: [{
      from: 0,
      to: 28,
      color: '#55BF3B' // green
    }, {
      from: 28,
      to: 38,
      color: '#DDDF0D' // yellow
    }, {
      from: 38,
      to: 55,
      color: '#DF5353' // red
    }]
  },

  series: [{
    name: 'Temperature',
    data: [0],
    tooltip: {
      valueSuffix: '°C'
    }
  }]

},



  function (chart) {
    if (!chart.renderer.forExport) {
      setInterval(function () {
        var point = chart.series[0].points[0], newVal;
        // var inc = Math.round((Math.random() - 0.5) * (200/55));

        fetch("http://localhost:3000/device/getDeviceInfo", request)
          .then((response) => {
            return response.json();
          })
          .then((test) => {
            var inc = test.device.stateHistory[test.device.stateHistory.length - 1].temperature;
            newVal = inc;
            console.log(newVal.toFixed(3));
            if (newVal < 0 || newVal > 55) {
              newVal = point.y - inc;
            }
            point.update(newVal);
            console.log(point.y.toFixed(3));
            document.getElementById("current_temp").innerHTML = point.y + " C";
          })
      }, 1000);
    }
  });


var target_date = new Date().getTime() + 10000; // set the countdown 
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

  // format countdown string + set tag value
  countdown.innerHTML = "<span>" + minutes + "</span><span>" + seconds + "</span><span>" + miniseconds + "</span>";
}
function pad(n) {
  return (n < 1000 ? '0' : '') + n;
}

var cusor = '_';
var count = 0;
var mess = "Dưới đây là đồ thị phổ nhiệt độ của thiết bị </br> </br> (căn cứ theo số liệu từng khoảng thời gian)";

function type() {
  if (cusor == '_') {
    cusor = ' ';
  }
  else {
    cusor = '_';
  }
  document.getElementById('cd_title').style.display = "none";
  document.getElementById('countdown').style.width = "800px";
  document.getElementById('countdown').innerHTML = "<p>" + mess.substring(0, count++) + cusor + "</p>";
  if (count <= mess.length) {
    setTimeout("type()", 20);
  } else { cusor = '_'; }
}

setTimeout("type()", 10000);