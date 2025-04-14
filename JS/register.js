let usernameInputElement = document.querySelector("#usernameInput");
let passwordInputElement = document.querySelector("#passwordInput");
let confirmPasswordInputElement = document.querySelector("#confirmPasswordInput");
let registerButtonElement = document.querySelector("#registerButton");

let errorElement = document.querySelectorAll(".error");
let errorUsernameElement = errorElement[0];
let errorPasswordElement = errorElement[1];
let errorConfirmPasswordElement = errorElement[2];

let errorEmptyElement = document.querySelectorAll(".errorEmpty");
let errorUsernameEmpty = errorEmptyElement[0];
let errorPasswordEmpty = errorEmptyElement[1];
let errorConfirmPasswordEmpty = errorEmptyElement[2];

let userLocals = JSON.parse(localStorage.getItem("users")) || [];

if (userLocals.length > 0) {
    userLocals[userLocals.length - 1].rememberLogin = 0;
}

function validateUsername(usernameValue) {
    let usernameRegex = /^[^\s@]+@[^\s@]+\.com$/;
    return usernameRegex.test(usernameValue);
}

function validatePassword(passwordValue) {
    return passwordValue.length >= 6;
}

registerButtonElement.addEventListener("click", function(event) {
    event.preventDefault();
    errorDisable();

    let usernameValue = usernameInputElement.value;
    let passwordValue = passwordInputElement.value;
    let confirmPasswordValue = confirmPasswordInputElement.value;

    let hasError = false;

    // Kiểm tra username
    if (usernameValue.length === 0) {
        errorUsernameEmpty.style.display = "block";
        usernameInputElement.style.border = "1px solid red";
        errorUsernameEmpty.textContent = "Tên tài khoản không được để trống";
        hasError = true;
    } else if (!validateUsername(usernameValue)) {
        errorUsernameElement.style.display = "block";
        usernameInputElement.style.border = "1px solid red";
        errorUsernameElement.textContent = "Tên tài khoản không hợp lệ (cần có @ và .com)";
        hasError = true;
    }

    // Kiểm tra password
    if (passwordValue.length === 0) {
        errorPasswordEmpty.style.display = "block";
        passwordInputElement.style.border = "1px solid red";
        errorPasswordEmpty.textContent = "Mật khẩu không được để trống";
        hasError = true;
    } else if (!validatePassword(passwordValue)) {
        errorPasswordElement.style.display = "block";
        passwordInputElement.style.border = "1px solid red";
        errorPasswordElement.textContent = "Mật khẩu phải có ít nhất 6 ký tự";
        hasError = true;
    }

    // Kiểm tra confirm password
    if (confirmPasswordValue.length === 0) {
        errorConfirmPasswordEmpty.style.display = "block";
        confirmPasswordInputElement.style.border = "1px solid red";
        errorConfirmPasswordEmpty.textContent = "Xác nhận mật khẩu không được để trống";
        hasError = true;
    } else if (passwordValue !== confirmPasswordValue) {
        errorConfirmPasswordElement.style.display = "block";
        confirmPasswordInputElement.style.border = "1px solid red";
        errorConfirmPasswordElement.textContent = "Mật khẩu và xác nhận mật khẩu không khớp";
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // Kiểm tra trùng tài khoản
    let userExists = userLocals.find(function(user) {
        return user.username === usernameValue;
    });

    if (userExists) {
        errorUsernameElement.style.display = "block";
        usernameInputElement.style.border = "1px solid red";
        errorUsernameElement.textContent = "Tài khoản đã tồn tại";
        return;
    }

    // Tạo tài khoản mới
    let newUser = {
        id: Math.floor(Math.random() * 99),
        username: usernameValue,
        password: passwordValue,
        rememberLogin: 0
    };

    userLocals.push(newUser);
    localStorage.setItem("users", JSON.stringify(userLocals));

    Swal.fire({
        title: "Đăng ký thành công!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6"
    }).then(function () {
        window.location = "login.html";
    });
});

function errorDisable() {
    usernameInputElement.style.border = "1px solid #E5E7EB";
    passwordInputElement.style.border = "1px solid #E5E7EB";
    confirmPasswordInputElement.style.border = "1px solid #E5E7EB";

    errorEmptyElement.forEach(function(element) {
        element.style.display = "none";
    });

    errorElement.forEach(function(element) {
        element.style.display = "none";
        element.textContent = "";
    });
}
