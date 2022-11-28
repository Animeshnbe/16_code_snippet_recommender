var username = document.getElementById('uname').value;
var password = document.getElementById('psw').value;
const BACKEND_URI = "http://localhost:3005"
sessionStorage.setItem("currentLoggedIn",username);

function Login()
{
 let a = new Array();
// localStorage.setItem('all_users',JSON.stringify(a));

// a=JSON.parse((localStorage.getItem("all_users")));
a.push({name: username, password: password});

localStorage.setItem('name',JSON.stringify(a));
for(let i=0; i<a.length; i++){
   let li = document.createElement("li");
   li.innerHTML=a[i]['name'];
   document.getElementById("listuser").appendChild(li);
}
}

const getCookie = name => {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i].trim().split('=')
      if (c[0] === name) {
        return decodeURIComponent(c[1])
      }
    }
    return ''
}

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();
        let pwd = document.getElementById('password').value
        let cpwd = document.getElementById('confirmp').value
        if (pwd!=cpwd){
            setFormMessage(createAccountForm, "error", "Password doesn't match");
            return
        }
        $.ajax({
            type: "POST",
            url: BACKEND_URI+'/api/register',
            data: JSON.stringify({email:document.getElementById('email').value,password:pwd}),
            success: (data) => {
                // console.log(textStatus + ": " + jqXHR.status);
                // console.log(response);
                document.cookie = `access=${data.token}; max-age=${60 * 60}`
                sessionStorage.setItem("access",data.token);
                document.getElementsByClassName('container')[0].style.display = 'none';
                document.getElementsByClassName('search-page')[0].style.display = 'block';
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert("User already exists!")
                console.log(textStatus + ": " + jqXHR.status + " " + errorThrown);
            },
            dataType: "json",
            contentType : "application/json"
        });
    
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });

    // document.querySelectorAll(".form__input").forEach(inputElement => {
    //     inputElement.addEventListener("blur", e => {
    //         if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 8) {
    //             setInputError(inputElement, "Username must be at least 8 characters in length");
    //         }
    //     });

    //     inputElement.addEventListener("input", e => {
    //         clearInputError(inputElement);
    //     });
    // });
});