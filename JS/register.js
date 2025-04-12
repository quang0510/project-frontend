let usernameInputElement = document.querySelector("#usernameInput");
let passwordInputElement = document.querySelector("#passwordInput");
let confirmPasswordInputElement = document.querySelector("#confirmPasswordInput");
let registerButtonElement = document.querySelector("#registerButton");
let errorElement = document.querySelectorAll(".error");
let errorEmptyElement = document.querySelectorAll(".errorEmpty");
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
    
    let passwordValue = passwordInputElement.value;
    let usernameValue = usernameInputElement.value;
    let confirmPasswordValue = confirmPasswordInputElement.value;

    let hasError = false;

    // kiểm tra độ hợp lệ của thông tin
    if (usernameValue.length === 0) {
        errorEmptyElement[0].style.display = "block";
        usernameInputElement.style.border = "1px solid red";
        errorEmptyElement[0].textContent = "Tên tài khoản không được để trống";
        hasError = true;
    } else if (!validateUsername(usernameValue)) {
        // Kiểm tra tên tài khoản hợp lệ (có @ và kết thúc bằng .com)
        errorElement[0].style.display = "block";  // Tên tài khoản không hợp lệ
        usernameInputElement.style.border = "1px solid red";
        errorElement[0].textContent = "Tên tài khoản không hợp lệ (cần có @ và .com)";
        hasError = true;
    }

    if (passwordValue.length === 0) {
        errorEmptyElement[1].style.display = "block";
        passwordInputElement.style.border = "1px solid red";
        errorEmptyElement[1].textContent = "Mật khẩu không được để trống";
        hasError = true;
    } else if (!validatePassword(passwordValue)) {
        // Kiểm tra mật khẩu có ít nhất 6 ký tự
        errorElement[1].style.display = "block";
        passwordInputElement.style.border = "1px solid red";
        errorElement[1].textContent = "Mật khẩu phải có ít nhất 6 ký tự";
        hasError = true;
    }

    if (confirmPasswordValue.length === 0) {
        errorEmptyElement[2].style.display = "block";
        confirmPasswordInputElement.style.border = "1px solid red";
        errorEmptyElement[2].textContent = "Xác nhận mật khẩu không được để trống";
        hasError = true;
    } else if (passwordValue !== confirmPasswordValue) {
        // Kiểm tra mật khẩu và xác nhận mật khẩu phải trùng nhau
        errorElement[2].style.display = "block";
        confirmPasswordInputElement.style.border = "1px solid red";
        errorElement[2].textContent = "Mật khẩu và xác nhận mật khẩu không khớp";
        hasError = true;
    }

    // Nếu có lỗi thì dừng lại, không kiểm tra tài khoản tồn tại nữa
    if (hasError) {
        return;
    }

    // Kiểm tra sự tồn tại của tài khoản chỉ khi thông tin hợp lệ
    let userExists = userLocals.find(function(user) {
        return user.username === usernameValue;
    });

    if (userExists) {
        errorElement[0].style.display = "block";
        usernameInputElement.style.border = "1px solid red";
        errorElement[0].textContent = "Tài khoản đã tồn tại";
        return;
    }

    // Thêm tài khoản vào localStorage nếu không có lỗi
    let newUser = {
        "id": Math.floor(Math.random() * 99),
        "username": usernameValue,
        "password": passwordValue,
        "rememberLogin": 0
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
        element.textContent = ""; // Xóa nội dung thông báo lỗi
    });
}
