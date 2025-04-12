let usernameInputElement = document.querySelector("#usernameInput");
let passwordInputElement = document.querySelector("#passwordInput");
let confirmPasswordInputElement = document.querySelector("#confirmPasswordInput");
let loginButtonElement = document.querySelector("#loginButton");
let errorIncorrectElement = document.querySelectorAll(".errorIncorrect");
let errorEmptyElement = document.querySelectorAll(".errorEmpty");
let userLocals = JSON.parse(localStorage.getItem("users")) || [];

// Kiểm tra nếu tài khoản đã đăng nhập trước đó
function checkRememberLogin() {
    if (userLocals.length > 0 && userLocals[userLocals.length - 1].rememberLogin) {
        window.location = "../index.html";
    }
}
checkRememberLogin();

loginButtonElement.addEventListener("click", function(event) {
    errorDisable();
    event.preventDefault();
    
    let passwordValue = passwordInputElement.value;
    let usernameValue = usernameInputElement.value;
    
    // Kiểm tra thông tin trống
    if (usernameValue.length === 0) {
        errorEmptyElement[0].style.display = "block";
        usernameInputElement.style.border = "1px solid red";
        if (passwordValue.length === 0) {
            errorEmptyElement[1].style.display = "block";
            passwordInputElement.style.border = "1px solid red";
        }
        return;
    }
    
    // Kiểm tra tài khoản có tồn tại không
    let index = userLocals.findIndex(function(user) {
        return user.username === usernameValue && user.password === passwordValue;
    });
    
    if (index === -1) {
        errorIncorrectElement.forEach(function(element) {
            element.style.display = "block";
            usernameInputElement.style.border = "1px solid red";
            passwordInputElement.style.border = "1px solid red";
        });
        return;
    }
    
    userLocals[index].rememberLogin = 1;
    localStorage.setItem("users", JSON.stringify(userLocals));

    //  Hiện thông báo toast và chuyển trang sau 1.5 giây
    showToast("✓  Đăng nhập thành công ");
    setTimeout(function () {
        window.location = "../index.html";
    }, 1500);
});

function errorDisable() {
    errorEmptyElement[0].style.display = "none";
    usernameInputElement.style.border = "1px solid #E5E7EB";
    errorEmptyElement[1].style.display = "none";
    passwordInputElement.style.border = "1px solid #E5E7EB";
    
    errorIncorrectElement.forEach(function(element) {
        element.style.display = "none";
    });
}

//  Hàm toast khi đăng nhập thành công
function showToast(message) {
    const toast = document.createElement("div");
   toast.style.fontSize = "13px"
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "#4BB543";
    toast.style.color = "white";
    toast.style.padding = "9px 18px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";

    document.body.appendChild(toast);
    setTimeout(function () {
        toast.style.opacity = "1";
    }, 100);

    setTimeout(function () {
        toast.style.opacity = "0";
        setTimeout(function () {
            toast.remove();
        }, 300);
    }, 2000);
}
