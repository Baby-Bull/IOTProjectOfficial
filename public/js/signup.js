

var login = document.getElementById("loginForm");
login.addEventListener("submit", e => {
    e.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var passwordAgain = document.getElementById("passwordAgain").value;

    if (password === passwordAgain) {
        var requestOptions = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        };
        fetch("http://localhost:3000/auth/signup", requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.success == false) {
                    alert(data.error);
                } else {
                    document.cookie = "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    alert("Welcome " + data.username + " !");
                    location.href = "http://localhost:3000/login.html"
                }
            })
    }else{
        alert("The password confirmation does not match.")
    }
})
