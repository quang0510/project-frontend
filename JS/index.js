// Chọn tháng và ngân sách
let monthInputElement = document.querySelector("#monthInput");
let budgetInputElement = document.querySelector("#budgetInput");
let saveButtonElement = document.querySelector("#saveButton");
let remainAmountElement = document.querySelector("#remainAmount");

// Quản lý danh mục
let editIndex = -1;
let editCategoryIndex = -1;
let categoryNameInputElement = document.querySelector("#categoryNameInput");
let limitInputElement = document.querySelector("#limitInput");
let addCategoryElement = document.querySelector("#addCategory");
let categoryListElement = document.querySelector("#categoryList");

// Chi tiêu
let spendingMoneyInputElement = document.querySelector("#spendingMoneyInput");
let spendingOptionElement = document.querySelector("#spendingOption");
let spendingNoteInputElement = document.querySelector("#spendingNoteInput");
let addSpendingElement = document.querySelector("#addSpending");

// Lịch sử chi tiêu
let historyListElement = document.querySelector("#historyList");
let searchHistoryInputElement = document.querySelector("#searchHistoryInput");
let submitHistoryButtonElement = document.querySelector("#submitHistoryButton");

// Đăng xuất
let logOutElement = document.querySelector("#logOut");

// Dữ liệu ban đầu
let monthlyCategories = [
    
    {
        month: "2025-04",
        budget: 999999999,
        categories: [
            { id: 1, name: "Tiền ăn", limit: 100000 },
            { id: 2, name: "Tiền điện nước", limit: 200000 },
            { id: 3, name: "Tiền du lịch", limit: 300000 }
        ]
    }
];

let transactions = [
    {
        month: "2025-04",
        transaction: [
            { id: 1, categoryId: 1, note: "ăn sáng", amount: 99999 },
            { id: 2, categoryId: 2, note: "điện nước tháng", amount: 888888 },
            { id: 3, categoryId: 3, note: "Phú Quốc", amount: 7777777 }
        ]
    }
   
];

// Hàm lưu dữ liệu vào localStorage
function saveToLocalStorage() {
    localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Hàm tải dữ liệu từ localStorage
function loadFromLocalStorage() {
    let storedCategories = localStorage.getItem("monthlyCategories");
    let storedTransactions = localStorage.getItem("transactions");

    if (storedCategories) {
        monthlyCategories = JSON.parse(storedCategories);
    }
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    }
}

//Hàm update ngân sách còn lại 

function updateRemainingAmount() {
    let monthValue = monthInputElement.value;
    let monthIndex = monthlyCategories.findIndex(element => element.month === monthValue);
    let transactionIndex = transactions.findIndex(element => element.month === monthValue);

    if (monthIndex !== -1) {
        let budget = monthlyCategories[monthIndex].budget;
        let totalSpent = 0;

        if (transactionIndex !== -1) {
            totalSpent = transactions[transactionIndex].transaction.reduce((sum, trans) => sum + trans.amount, 0);
        }

        let remaining = budget - totalSpent;
        remainAmountElement.textContent = `${remaining.toLocaleString()} VND`;
    } else {
        remainAmountElement.textContent = "0 VND";
    }
}


// Hàm kiểm tra và hiển thị cảnh báo vượt mức
function renderWarnings() {

    let monthValue = monthInputElement.value;
    let warningContainer = document.querySelector("#warning");
    let warningList = document.querySelector("#warning-list");

    warningList.innerHTML = ""; // Xóa các thông báo cũ trong ul

    // Tìm tháng hiện tại trong monthlyCategories và transactions
    let categoryIndex = monthlyCategories.findIndex(element => element.month === monthValue);
    let transactionIndex = transactions.findIndex(element => element.month === monthValue);

    if (categoryIndex === -1) {
        warningContainer.style.display = "none";
        return;
    }

    let categories = monthlyCategories[categoryIndex].categories;
    let transactionList = transactionIndex !== -1 ? transactions[transactionIndex].transaction : [];
    let flag = false;

    // Tính tổng chi tiêu cho từng danh mục và kiểm tra vượt mức
    categories.forEach(category => {
        let totalSpent = transactionList
            .filter(e => e.categoryId === category.id)
            .reduce((sum, e) => sum + e.amount, 0);

        if (totalSpent > category.limit) {
            let warningItem = `
                <li>
                    Danh mục <span>"${category.name}"</span> đã vượt quá giới hạn : 
                    ${totalSpent.toLocaleString()} / ${category.limit.toLocaleString()} VND
                </li>
            `;
            warningList.innerHTML += warningItem;
            flag = true;
        }
    });

    // Nếu không có danh mục nào vượt mức, hiển thị thông báo mặc định
    if (!flag) {
        warningList.innerHTML = `
            <li>Chưa có danh mục nào vượt mức </li>
        `;
    }

    // Luôn hiển thị warningContainer khi có tháng được chọn
    warningContainer.style.display = "block";
}


// Hàm thống kê chi tiêu các tháng
function renderStatistics() {
    let tbodyElement = document.querySelector(".statistical table tbody");
    tbodyElement.innerHTML = "";
    

    // Duyệt qua tất cả các tháng trong monthlyCategories
    monthlyCategories.forEach(function(monthData) {
        let month = monthData.month;
        let budget = monthData.budget;

        // Tìm tổng chi tiêu của tháng trong transactions
        let transactionIndex = transactions.findIndex(function(element) {
            return element.month === month;
        });
        let totalSpent = 0;
        if (transactionIndex !== -1) {
            totalSpent = transactions[transactionIndex].transaction.reduce(function(sum, trans) {
                return sum + trans.amount;
            }, 0);
        }

        // Xác định trạng thái
        let statusClass = totalSpent <= budget ? "reachTarget" : "excess";
        let statusText = totalSpent <= budget ? "✅ Đạt" : "❌ Vượt";

        // Tạo hàng HTML cho tháng
        let rowHtml = `
            <tr>
                <td>${month}</td>
                <td>${totalSpent.toLocaleString()} VND</td>
                <td>${budget.toLocaleString()} VND</td>
                <td class="${statusClass}">${statusText}</td>
            </tr>
        `;
        tbodyElement.innerHTML += rowHtml;
    });
}


// Tải dữ liệu khi trang được load
window.addEventListener("load", function() {
    loadFromLocalStorage();
    if (monthInputElement.value) {
        renderCategoriesData();
        renderOption();
        renderHistory();
        updateRemainingAmount(); 
        renderWarnings();
        renderStatistics();
    }
});

// Đăng xuất

let swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
});

logOutElement.addEventListener("click", function(event) {
    event.preventDefault();
    swalWithBootstrapButtons.fire({
        title: 'Đăng xuất ?',
        text: 'Bạn có thật sự muốn đăng xuất không ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Huỷ',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let userLocals = JSON.parse(localStorage.getItem("users")) || [];
            if (userLocals.length > 0) {
                userLocals[userLocals.length - 1].rememberLogin = 0;
                localStorage.setItem("users", JSON.stringify(userLocals));
            }
            

            swalWithBootstrapButtons.fire({
                title: 'Đăng xuất thành công ',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            setTimeout(() => {
                window.location.href = "../pages/login.html";
            }, 1600);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: 'Đã huỷ',
                text: 'Bạn vẫn đang đăng nhập',
                icon: 'info'
            });
        }
    });
});

// Hàm kiểm tra tháng đã nhập chưa

function validateMonth() {
    let monthValue = monthInputElement.value;
    if (monthValue.length === 0) {
        Swal.fire({
            title: "Chưa chọn tháng ",
            text: "Vui lòng chọn tháng trước khi tiếp tục",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#ec9b00"
        });
        return true;
    }
    return false;
}

// Hàm kiểm tra ngân sách đã nhập chưa

function validateBudget() {
    let budgetValue = budgetInputElement.value.trim();
    
    if (budgetValue.length === 0) {
        Swal.fire({
            title: "Thiếu ngân sách ",
            text: "Vui lòng nhập ngân sách trước khi tiếp tục",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#f27474"
        });
        return true;
    }
    
    if (budgetValue < 0) {
        Swal.fire({
            title: "Ngân sách không hợp lệ ",
            icon: "error",
            confirmButtonText: "Đã hiểu",
            confirmButtonColor: "#ec2f2f"
        });
        return true;
    }
    
    return false;
}


// Hàm Khi đổi tháng thì dữ liệu sẽ được render theo tháng đấy

monthInputElement.addEventListener("change", function(event) {
    event.preventDefault();
  

    let monthValue = monthInputElement.value;
    let index = monthlyCategories.findIndex(function(element) {
        return element.month === monthValue;
    });

    if (index !== -1) {
        // Tháng đã có ngân sách
        budgetInputElement.value = "";
        remainAmountElement.textContent = `${monthlyCategories[index].budget.toLocaleString()} VND`;
        updateRemainingAmount();
        renderCategoriesData();
        renderOption();
        renderHistory();
        renderWarnings(); 
        renderStatistics();
    } else {
        // Tháng chưa có ngân sách
        budgetInputElement.value = "";
        remainAmountElement.textContent = "Tháng này chưa có ngân sách";
        categoryListElement.innerHTML = "";
        historyListElement.innerHTML = "";
        renderPagination(0);
        renderWarnings(); 
        renderStatistics();
    }
});


// HÀM Lưu ngân sách và tháng

saveButtonElement.addEventListener("click", function(event) {
    event.preventDefault();
    let monthValue = monthInputElement.value;
    let budgetValue = budgetInputElement.value.trim();

    if (validateMonth() || validateBudget()) {
        return;
    }

    let index = monthlyCategories.findIndex(function(element) {
        return element.month === monthValue;
    });

    if (index !== -1) {
        monthlyCategories[index].budget = +budgetValue;
        remainAmountElement.textContent = `${monthlyCategories[index].budget.toLocaleString()} VND`;
    } else {
        let newCategories = {
            month: monthValue,
            budget: +budgetValue,
            categories: []
        };
        monthlyCategories.push(newCategories);
        remainAmountElement.textContent = `${newCategories.budget.toLocaleString()} VND`;
    }

    monthInputElement.value = monthValue;
    
    budgetInputElement.value = "";
    saveToLocalStorage();
    renderCategoriesData(); 
    renderOption(); 
    renderHistory(); 
    updateRemainingAmount();
    renderStatistics();
});


//// QUẢN LÝ DANH MỤC THEO THÁNG - categoryManagement

// Render dữ liệu của quản lý danh mục theo tháng

function renderCategoriesData() {
    let monthValue = monthInputElement.value;
    categoryListElement.innerHTML = "";
    let categoryIndex = monthlyCategories.findIndex(function(element) {
        return element.month === monthValue;
    });

    if (categoryIndex !== -1) { // Chỉ render nếu tháng tồn tại
        let htmls = monthlyCategories[categoryIndex].categories.map(function(category) {
            return `
                <li>
                    <p>${category.name} - Giới hạn: <span id="limit">${category.limit.toLocaleString()} VND</span></p>
                    <p class="function"><span class="editCategory">Sửa</span>  <span class="deleteCategory">Xoá</span></p>
                </li>`;
        });
        categoryListElement.innerHTML = htmls.join("");

        let deleteCategoryElements = document.querySelectorAll(".deleteCategory");
        let editCategoryElements = document.querySelectorAll(".editCategory");

        editCategoryElements.forEach(function(button, index) {
            button.addEventListener("click", function() {
                handleEditCategory(index, categoryIndex);
            });
        });

        deleteCategoryElements.forEach(function(button, index) {
            button.addEventListener("click", function() {
                Swal.fire({
                    title: 'Xoá mục này ?',
                    text: 'Bạn có chắc chắn muốn xoá mục này',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Xoá',
                    cancelButtonText: 'Huỷ',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleDeleteCategory(index, categoryIndex);
                        Swal.fire({
                            title: "Đã xoá ",
                            text: "Danh mục đã được xoá thành công",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                });
            });
        });
    }
}


// Thêm danh mục trong quản lý chi tiêu tháng

addCategoryElement.addEventListener("click", function(event) {
    event.preventDefault();
    if (validateMonth()) {
        return;
    }
    let monthValue = monthInputElement.value;
    let categoryNameValue = categoryNameInputElement.value.trim();
    let limitValue = limitInputElement.value.trim();

    if (categoryNameValue.length === 0) {
        Swal.fire({
            title: "Thiếu tên danh mục ",
            text: "Vui lòng nhập tên danh mục trước khi tiếp tục",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#ec9b00"
        });
        return;
    }
    
    if (limitValue.length === 0) {
        Swal.fire({
            title: "Thiếu giá tiền ",
            text: "Bạn chưa nhập hạn mức chi tiêu cho danh mục này",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#ec9b00"
        });
        return;
    }
    if (limitValue <= 0) {
        Swal.fire({
            title: "Giá tiền không hợp lệ",
            text: "Bạn vui lòng nhập lại giá tiền",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#ec9b00"
        });
        return;
    }
   
    
    // Kiểm tra trùng tên danh mục (chỉ khi thêm mới, không kiểm tra khi sửa)
    if (editIndex === -1) { // Chỉ kiểm tra khi thêm mới
        let categoryIndex = monthlyCategories.findIndex(function(element) {
            return element.month === monthValue;
        });

        if (categoryIndex !== -1) {
            let coincide = monthlyCategories[categoryIndex].categories.some(function(category) {
                return category.name.toLowerCase() === categoryNameValue.toLowerCase();
            });

            if (coincide) {
                Swal.fire({
                    title: "Lỗi ",
                    text: "Tên danh mục đã tồn tại trong tháng này ",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false
                });
                return;
            }
        }
    }

    // Nếu không trùng hoặc đang sửa, tiếp tục xử lý
    if (editIndex >= 0) {
        monthlyCategories[editCategoryIndex].categories[editIndex].name = categoryNameValue;
        monthlyCategories[editCategoryIndex].categories[editIndex].limit = +limitValue;
        editIndex = -1;
        editCategoryIndex = -1;
        addCategoryElement.textContent = "Thêm";
    } else {
        addCategory(monthValue, categoryNameValue, limitValue);
    }

    categoryNameInputElement.value = "";
    limitInputElement.value = "";
    renderCategoriesData();
    renderOption();
    saveToLocalStorage();
});

// Hàm xóa phần tử trong quản lý danh mục

function handleDeleteCategory(index, categoryIndex) {
    monthlyCategories[categoryIndex].categories.splice(index, 1);
    renderCategoriesData();
    renderOption();
    saveToLocalStorage(); 
}

// Hàm sửa phần tử trong quản lý danh mục

function handleEditCategory(index, categoryIndex) {
    addCategoryElement.textContent = "Lưu";
    editIndex = index;
    editCategoryIndex = categoryIndex;
    categoryNameInputElement.value = monthlyCategories[categoryIndex].categories[index].name;
    limitInputElement.value = monthlyCategories[categoryIndex].categories[index].limit;
}

// Hàm thêm phần tử vào mảng danh mục

function addCategory(monthValue, categoryNameValue, limitValue) {
    let index = monthlyCategories.findIndex(function(element) {
        return element.month === monthValue;
    });
    if (index !== -1) {
        let newCategories = {
            id: Math.floor(Math.random() * 99),
            name: categoryNameValue,
            limit: +limitValue
        };
        monthlyCategories[index].categories.push(newCategories);
    } else {
        let newCategories = {
            month: monthValue,
            budget: 0,
            categories: [{
                id: Math.floor(Math.random() * 99),
                name: categoryNameValue,
                limit: +limitValue
            }]
        };
        monthlyCategories.push(newCategories);
    }
    saveToLocalStorage();
}


// QUẢN LÝ CHI TIÊU ( addSpending)
// Thêm chi tiêu
function addSpending(monthValue, spendingMoneyValue, spendingOptionValue, spendingNoteValue, index) {
    let newTransaction = {
        id: Math.floor(Math.random() * 99),
        categoryId: +spendingOptionValue,
        note: spendingNoteValue,
        amount: +spendingMoneyValue
    };

    if (index === -1) {
        transactions.push({
            month: monthValue,
            transaction: [newTransaction]
        });
    } else {
        transactions[index].transaction.push(newTransaction);
    }
    saveToLocalStorage(); 
}



// Render dữ liệu của option trong phần thêm chi tiêu
// Hàm Lấy ra những danh mục đã nhập ở tháng đó để có value trong option

function renderOption() {
    let monthValue = monthInputElement.value;
    spendingOptionElement.innerHTML = "";
    let categoryIndex = monthlyCategories.findIndex(function(element) {
        return element.month === monthValue;
    });

    if (categoryIndex !== -1) {
        let htmls = monthlyCategories[categoryIndex].categories.map(function(category) {
            return `<option value="${category.id}">${category.name}</option>`;
        });
        spendingOptionElement.innerHTML = htmls.join("");
    } else {
        spendingOptionElement.innerHTML = "<option value=''>Chưa có danh mục</option>";
    }
}


// Lắng nghe sự kiện khi "click" thêm giao idjch

addSpendingElement.addEventListener("click", function(event) {
    event.preventDefault();
    
    if (validateMonth()) {
        return;
    }
    let monthValue = monthInputElement.value;
    let spendingMoneyValue = spendingMoneyInputElement.value.trim();
    let spendingOptionValue = spendingOptionElement.value;
    let spendingNoteValue = spendingNoteInputElement.value.trim();

    
    if (spendingMoneyValue.length === 0) {
        Swal.fire({
            title: "Thiếu giá tiền ",
            text: "Bạn chưa nhập số tiền chi tiêu",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#ec9b00"
        });
        return;
    }
    if (spendingMoneyValue <= 0) {
        Swal.fire({
            title: "Giá tiền không hợp lệ ",
            text: "Mời bạn nhập lại giá tiền",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#ec9b00"
        });
        return;
    }

    let index = transactions.findIndex(function(transaction) {
        return transaction.month === monthValue;
    });

    addSpending(monthValue, spendingMoneyValue, spendingOptionValue, spendingNoteValue, index);
    spendingMoneyInputElement.value = "";
    spendingNoteInputElement.value = "";
    renderHistory();
    saveToLocalStorage();
    updateRemainingAmount();
    renderWarnings();
    renderStatistics();

});


// LỊCH SỬ GIAO DỊCH 

// Tìm kiếm lịch sử giao dịch

submitHistoryButtonElement.addEventListener("click", function(event) {
    event.preventDefault();
   
    let searchHistoryValue = searchHistoryInputElement.value.trim();
    
   
    if (searchHistoryValue.length === 0) {
        renderHistory();
        return;
    }


    searchHistory(searchHistoryValue);
});

function searchHistory(searchValue) {

    let monthValue = monthInputElement.value;
    let historyIndex = transactions.findIndex(function(element) {
        return element.month === monthValue;
    });

    historyListElement.innerHTML = ""; // Xóa danh sách hiện tại

    if (historyIndex !== -1) {
        let filteredTransactions = transactions[historyIndex].transaction.filter(function(transaction) {
            let categoryIndex = monthlyCategories.findIndex(function(element) {
                return element.month === monthValue;
            });

            if (categoryIndex !== -1) {
                let category = monthlyCategories[categoryIndex].categories.find(function(category) {
                    return category.id === transaction.categoryId;
                });
                return category && category.name.toLowerCase().includes(searchValue.toLowerCase());
            }
            return false;
        });

        // Hiển thị toàn bộ kết quả tìm kiếm 
        if (filteredTransactions.length > 0) {
            let htmls = filteredTransactions.map(function(transaction) {
                let categoryIndex = monthlyCategories.findIndex(function(element) {
                    return element.month === monthValue;
                });
                let category = monthlyCategories[categoryIndex].categories.find(function(category) {
                    return category.id === transaction.categoryId;
                }) || { name: "Danh mục không xác định" };
                return `
                    <li>
                        <p>${category.name} - <span>${transaction.note || ""}</span> : <span>${transaction.amount.toLocaleString()} VND</span></p>
                        <p class="function"><span class="deleteHistory">Xoá</span></p>
                    </li>`;
            });
            historyListElement.innerHTML = htmls.join("");
            addDeleteEventForHistory();
            document.querySelector(".pagination").innerHTML = "";
        } else {
            historyListElement.innerHTML = "<li>Không có giao dịch phù hợp với tìm kiếm</li>";
            document.querySelector(".pagination").innerHTML = "";
        }
    } else {
        historyListElement.innerHTML = "<li>Không có giao dịch nào trong tháng này.</li>";
        document.querySelector(".pagination").innerHTML = "";
    }
}

//

function renderHistory(filteredTransactions, historyIndex) {
    historyListElement.innerHTML = "";

    if (filteredTransactions.length > 0) {
        let htmls = filteredTransactions.map(function(transaction) {
            let categoryIndex = monthlyCategories.findIndex(function(element) {
                return element.month === monthInputElement.value;
            });

            if (categoryIndex !== -1) {
                let category = monthlyCategories[categoryIndex].categories.find(function(category) {
                    return category.id === transaction.categoryId;
                }) || { name: "Danh mục không xác định" };
                return `
                    <li>
                        <p>${category.name} - <span>${transaction.note ? transaction.note : ""}</span> : <span>${transaction.amount.toLocaleString()} VND</span></p>
                        <p class="function"><span class="deleteHistory">Xoá</span></p>
                    </li>`;
            }
        });
        historyListElement.innerHTML = htmls.join("");
        addDeleteEventForHistory();
        document.querySelector(".pagination").innerHTML = ""; 
    } else {
        historyListElement.innerHTML = "<li>Không có giao dịch phù hợp với tìm kiếm</li>";
        document.querySelector(".pagination").innerHTML = "";
    }
}


// Sắp xếp lịch sử giao dịch theo giá tiền

let sortElement = document.querySelector("#sort");

sortElement.addEventListener("change", function() {
    let sortOption = sortElement.value;
    if (sortOption === "2") {
        sortHistoryByAmount("tang");
    } else if (sortOption === "3") {
        sortHistoryByAmount("giam");
    }
});

function sortHistoryByAmount(order) {
    let monthValue = monthInputElement.value;
    let historyIndex = transactions.findIndex(function(element) {
        return element.month === monthValue;
    });

    if (historyIndex !== -1) {
        transactions[historyIndex].transaction.sort(function(a, b) {
            if (order === "tang") {
                return a.amount - b.amount;
            } else if (order === "giam") {
                return b.amount - a.amount;
            }
        });
        renderHistory();
        saveToLocalStorage(); 
    }
}


// XÓA LỊCH SỬ GIAO DỊCH 

function addDeleteEventForHistory() {
    let deleteButtons = document.querySelectorAll(".deleteHistory");
    deleteButtons.forEach(function(btn, index) {
        btn.addEventListener("click", function() {
            Swal.fire({
                title: "Bạn có chắc chắn ?",
                text: "Giao dịch này sẽ bị xoá ",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#05bc52",
                cancelButtonColor: "#ec2f2f",
                confirmButtonText: "Xoá",
                cancelButtonText: "Huỷ",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    let monthValue = monthInputElement.value;
                    let historyIndex = transactions.findIndex(function(e) {
                        return e.month === monthValue;
                    });

                    if (historyIndex !== -1) {
                        let realIndex = (currentPage - 1) * itemsPerPage + index;
                        transactions[historyIndex].transaction.splice(realIndex, 1);
                        saveToLocalStorage();
                        renderPaginatedHistory();
                        updateRemainingAmount();
                        renderWarnings(); 
                        renderStatistics();
                        Swal.fire({
                            title: "Đã xoá ",
                            text: "Giao dịch đã được xoá thành công ",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                }
            });
        });
    });
}



// Render lịch sử giao dịch với phân trang

let currentPage = 1;
let itemsPerPage = 5;

function renderPaginatedHistory() {
    let monthValue = monthInputElement.value;
    historyListElement.innerHTML = "";

    let historyIndex = transactions.findIndex(function(element) {
        return element.month === monthValue;
    });

    let categoryIndex = monthlyCategories.findIndex(function(element) {
        return element.month === monthValue;
    });

    if (historyIndex !== -1 && categoryIndex !== -1) {
        let allTransactions = transactions[historyIndex].transaction;
        let totalPages = Math.ceil(allTransactions.length / itemsPerPage);

        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        let paginatedTransactions = allTransactions.slice(startIndex, endIndex);

        let htmls = paginatedTransactions.map(function(transaction) {
            let category = monthlyCategories[categoryIndex].categories.find(function(cat) {
                return cat.id === transaction.categoryId;
            }) || { name: "Danh mục không xác định" }; // Xử lý trường hợp không tìm thấy danh mục

            return `
                <li>
                    <p>${category.name} - <span>${transaction.note ? transaction.note : ""}</span> : <span>${transaction.amount.toLocaleString()} VND</span></p>
                    <p class="function"><span class="deleteHistory">Xoá</span></p>
                </li>`;
        });

        historyListElement.innerHTML = htmls.join("");
        renderPagination(totalPages);
        addDeleteEventForHistory();
    } else {
        historyListElement.innerHTML = "<li>Không có giao dịch nào trong tháng này</li>";
        document.querySelector(".pagination").innerHTML = "";
    }
}

function renderPagination(totalPages) {
    let paginationElement = document.querySelector(".pagination");
    let html = "";

    if (totalPages > 1) {
        html += `<li class="page-item"><a class="page-link" data-page="prev">Previous</a></li>`;
        for (let i = 1; i <= totalPages; i++) {
            html += `<li class="page-item" >
                        <a class="page-link" data-page="${i}">${i}</a>
                    </li>`;
        }
        html += `<li class="page-item"><a class="page-link" data-page="next">Next</a></li>`;
    }

    paginationElement.innerHTML = html;

    let pageLinks = paginationElement.querySelectorAll(".page-link");
    pageLinks.forEach(function(link) {
        link.addEventListener("click", function() {
            let value = link.getAttribute("data-page");
            let monthValue = monthInputElement.value;
            let historyIndex = transactions.findIndex(function(e) {
                return e.month === monthValue;
            });
            let totalTransactions = transactions[historyIndex]?.transaction.length || 0;
            let totalPages = Math.ceil(totalTransactions / itemsPerPage);

            if (value === "prev" && currentPage > 1) {
                currentPage--;
            } else if (value === "next" && currentPage < totalPages) {
                currentPage++;
            } else if (!isNaN(value)) {
                currentPage = +value;
            }

            renderPaginatedHistory();
        });
    });
}

function renderHistory() {
    currentPage = 1;
    renderPaginatedHistory();
}

