const form = document.getElementById("myform");
const tableBody = document.getElementById("tablebody");
const url = "https://mock-api-template-rh6s.onrender.com/users";
const divPagination = document.getElementById("pagination-container");

const itemsPerPage = 10;
let currentPage = 1;
let data = [];
window.addEventListener("load", () => {
    fetchData();
});


function fetchData() {
    fetch(url)
        .then((res) => res.json())
        .then((fetchedData) => {
            data = fetchedData;
            renderTable(currentPage);
        })
        .catch((error) => console.error("Error fetching data: ", error));
}

function createPaginationButtons(totalPages) {
    divPagination.innerHTML = '';

    const prevButton = document.createElement("button");
    prevButton.innerText = "<";
    prevButton.style.width="40px"
    prevButton.style.height="38px"
    prevButton.style.backgroundColor="rgb(162, 215, 233)"
    prevButton.addEventListener("click", () => goToPage(currentPage - 1));
    divPagination.appendChild(prevButton);

    const numButtonsToShow = 4;  
    const halfNumButtons = Math.floor(numButtonsToShow / 2);

    for (let i = currentPage - halfNumButtons; i <= currentPage + halfNumButtons; i++) {
        if (i >= 1 && i <= totalPages) {
            const paginationButton = document.createElement("button");
            paginationButton.innerText = i;
            paginationButton.style.height="38px"
            paginationButton.style.width="38px"
            paginationButton.style.backgroundColor="#E6E5E5"
            paginationButton.addEventListener("click", () => goToPage(i));
            divPagination.appendChild(paginationButton);
        }
    }

    
    const nextButton = document.createElement("button");
    nextButton.innerText = ">";
    nextButton.style.backgroundColor="rgb(162, 215, 233)"
    nextButton.style.height="38px"
    nextButton.style.width="40px"
    nextButton.addEventListener("click", () => goToPage(currentPage + 1));
    divPagination.appendChild(nextButton);
}

function goToPage(page) {
    if (page >= 1 && page <= Math.ceil(data.length / itemsPerPage)) {
        currentPage = page;
        renderTable(currentPage);
    }
}

function calculateTotalPages() {
    return Math.ceil(data.length / itemsPerPage);
}

function renderTable(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);

    tableBody.innerHTML = '';

    pageData.forEach((element) => {
        const newRow = document.createElement("tr");
        const cellUserId = document.createElement("td");
        const cellid = document.createElement("td");
        const celltitle = document.createElement("td");
        const cellCompleted = document.createElement("td");
        const cellDel=document.createElement("td")
        const cellDeleted = document.createElement("button");
        cellDeleted.setAttribute("class","delete-btn")
        cellDeleted.innerText = "Delete";
        const cellUpdate = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.setAttribute("class","edit-btn")
        editButton.innerText = "Edit";
        // cellDeleted.style.margin="18px"
        // cellDeleted.style.width="70px";
        cellDeleted.style.borderRadius="10px"
        cellDeleted.style.backgroundColor="rgb(162, 215, 233)"
        // editButton.style.boxShadow=' rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px';
        editButton.style.backgroundColor ='rgb(123, 150, 174)';
        editButton.style.borderRadius="10px"
        editButton.style.width="65px"

        cellUserId.innerHTML = element.userid;
        cellid.innerHTML = element.id;
        celltitle.innerHTML = element.title;
        cellCompleted.innerHTML = element.completed;

        if (cellCompleted.innerText === "true") {
            cellCompleted.style.color = "green";
        } else {
            cellCompleted.style.color = "red";
        }

        cellDeleted.addEventListener("click", async function () {
            const confirmdel = confirm("Are you sure want to delete the entire row....?");
            if (confirmdel) {
                let response = await fetch(url + "/" + element.id, { method: "DELETE" });
                console.log(response);
                fetchData();
            }
            alert('Deleted successfully🥲🥲.....');
        });

        editButton.addEventListener("click", function () {
            enterEditMode(element.id, element);
        });
        cellUpdate.appendChild(editButton);
        cellDel.appendChild(cellDeleted);
        newRow.appendChild(cellUserId);
        newRow.appendChild(cellid);
        newRow.appendChild(celltitle);
        newRow.appendChild(cellCompleted);
        newRow.appendChild(cellDel);
        newRow.appendChild(cellUpdate);


        tableBody.appendChild(newRow);
    });

    createPaginationButtons(calculateTotalPages());

    // currentPageSpan.textContent = page;
}

function addNewRecord(data) {
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then((res) => {
            if (res.ok) {
                alert("User created successfully😍😍....");
                fetchData();
            } else {
                throw new Error("Network response was not ok");
            }
        })
        .catch((error) => {
            console.error("Error creating user: ", error);
        });
}

function updateExistingRecord(id, data) {
    fetch(url + `/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then((res) => {
            if (res.ok) {
                alert("Data updated successfully🥳🥳🥳.......");
                fetchData();
            } else {
                throw Error("Network response was not ok");
            }
        })
        .catch((error) => {
            console.error("Error updating data: ", error);
        });
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const recordId = document.getElementById("recordId").value;
    const UserId = document.getElementById("userid").value;
    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;
    const Completed = document.getElementById("completed").checked ? "true" : "false";
    const obj = {
        userid: UserId,
        id,
        title,
        completed: Completed,
    };

    if (recordId) {
        updateExistingRecord(recordId, obj);
    } else {
        addNewRecord(obj);
    }

    form.reset();
})

function enterEditMode(id, data) {
    document.getElementById("recordId").value = id;
    document.getElementById("userid").value = data.userid;
    document.getElementById("id").value = data.id;
    document.getElementById("title").value = data.title;
    document.getElementById("completed").checked = data.completed;
}
document.addEventListener("DOMContentLoaded", function () {
    let table=document.getElementById("datatable")
    let thead=document.getElementById("thead")
    
    var themeToggle = document.getElementById("theme-toggle");
    var body = document.body;
    var iconLight = document.getElementById("icon-light");
    var iconDark = document.getElementById("icon-dark");
    iconDark.classList.add("d-none");
    themeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-theme");
        if (body.classList.contains("dark-theme")) {
            iconLight.classList.remove("d-none");
            iconDark.classList.add("d-none");
            body.style.backgroundColor="black"
            document.querySelector("#myform").style.backgroundColor="gray";
            document.querySelector("#myform").style.color="white";
            table.className="table table-info  table-striped-columns table-hover  table-bordered caption-top"
            document.querySelector("table caption").style.color="white"
            thead.className="table-info"
        } else {
            iconLight.classList.add("d-none");
            iconDark.classList.remove("d-none");
            body.style.backgroundColor="white"
            document.querySelector("#myform").style.backgroundColor="rgb(123, 150, 174)";
            document.querySelector("#myform").style.color="black";
            table.className="table table-secondary  table-striped-columns table-hover  table-bordered caption-top"
            document.querySelector("table caption").style.color="black"
            thead.className="table-dark"

        }
    });
 });



