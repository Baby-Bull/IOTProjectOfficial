
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
console.log(getCookie("userId"));

var requestOptions = {
  method: 'POST',
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ userId: getCookie("userId") })
};

fetch("http://localhost:3000/user/getUserInfo", requestOptions)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    document.getElementById("name_user").innerHTML = data.user.username;
    document.getElementById("device_count").innerHTML = data.user.devices.length;
    var htmls = data.user.devices.map((device, i, data) => {
      return `<li >
        <div class="item" >
          <i class="fa fa-cogs" aria-hidden="true"></i>
          <p>Thiết bị số ${i + 1}</p>
          <i id="but_modal" class="fa fa-list" aria-hidden="true"></i>
        </div>
      </li>`
    })
    document.getElementById("list_devices").innerHTML = htmls.join("");
    return data.user.devices;
  })
  .then((devices) => {
    var btn = document.querySelectorAll("#but_modal");
    for (let i = 0; i < btn.length; i++) {
      btn[i].onclick = () => {
        document.getElementById("myModal").innerHTML = `        
              <div class="modal-content">
              <span class="close">&times;</span>
              <p>Thông tin thiết bị</p>
              <div class="modalContentItem">
                <p>Tên thiết bị :</p> <strong>${devices[i].deviceName}</strong>
              </div>
              <div class="modalContentItem">
                <p>Vị trí </p> <strong>${devices[i].location}</strong>
              </div>
              <div class="modalContentItem">
                <p>Thời gian tạo: </p><strong>${devices[i].added}</strong>
              </div>
              <div class="modalContentItem">
                <p>Trạng thái hoạt động</p> <strong>${devices[i].connectState}</strong>
              </div>
              <div id="select_item" class="btn btn-primary">Select</div>
            </div>`;

        document.getElementById("myModal").style.display = "block";
        document.getElementById("select_item").onclick = () => {
          document.cookie = "deviceId=" + devices[i].deviceId;
          location.href = "http://localhost:3000/temprature.html";
        }
      }
    }
  })


var modal = document.getElementById("myModal");
var form2 = document.getElementById("form");
var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal || event.target == form2) {
    modal.style.display = "none";
    form2.style.display = "none";

  }
}

document.getElementById("but_form").onclick = () => {
  console.log("IN but_modal1")
  form2.style.display = "block";
}

var create_form = document.getElementById("but_create");
create_form.addEventListener('click', e => {
  e.preventDefault();
  var device_name = document.getElementById("device_name").value;
  var device_location = document.getElementById("device_location").value;

  var request_create = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      userId: getCookie("userId"),
      deviceName: device_name,
      location: device_location
    })
  };
  fetch("http://localhost:3000/device/createDevice", request_create)
    .then((response) => {
      return response.json();
    })
    .then((items) => {
      alert("bạn đã thêm thiết bị thành công!!!");
      location.href = "http://localhost:3000/user.html";
    })

})