const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdown-form");
const title = document.getElementById("title");
const dateEl = document.getElementById("date-picker");

const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.querySelector("#countdown .main-title");
// array of span in countdown
const countdownList = document.querySelectorAll(".countdown__list span");
const resetBtn = document.querySelector("#countdown .btn");

const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

// Add minimum date of today
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute("min", today);

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

function updateTime() {
    const now = new Date().getTime();
    // 7 hour because of standardisation of indonesia
    const duration = countdownValue - now - 7 * hour;

    const days = Math.floor(duration / day);
    const hours = Math.floor((duration % day) / hour);
    const minutes = Math.floor((duration % hour) / minute);
    const seconds = Math.floor((duration % minute) / second);

    //set countdown__items to the right value
    countdownElTitle.textContent = countdownTitle;
    countdownList[0].textContent = days;
    countdownList[1].textContent = hours;
    countdownList[2].textContent = minutes;
    countdownList[3].textContent = seconds;
}

function updateDom() {
    // run initially so it didn't wait for 1 second
    updateTime();
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        // 7 hour because of standardisation of indonesia
        const duration = countdownValue - now - 7 * hour;

        const days = Math.floor(duration / day);
        const hours = Math.floor((duration % day) / hour);
        const minutes = Math.floor((duration % hour) / minute);
        const seconds = Math.floor((duration % minute) / second);

        inputContainer.hidden = true;

        if (duration < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            //set countdown__items to the right value
            countdownElTitle.textContent = countdownTitle;
            countdownList[0].textContent = days;
            countdownList[1].textContent = hours;
            countdownList[2].textContent = minutes;
            countdownList[3].textContent = seconds;

            inputContainer.hidden = true;
            countdownEl.hidden = false;
        }
    }, 1000);
}

function reset() {
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;

    // Stop the countdown
    clearInterval(countdownActive);
    // Reset the values
    countdownTitle = "";
    countdownDate = "";
    localStorage.removeItem("countdown");
}

// Take values from input
function updateCountdown(e) {
    e.preventDefault();

    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;

    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem("countdown", JSON.stringify(savedCountdown));

    if (!countdownDate) {
        alert("Please input the date");
    } else {
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }
}

function loadSavedCountdown() {
    // Get from local storage if available
    if (localStorage.getItem("countdown")) {
        inputContainer.hidden = true;

        savedCountdown = JSON.parse(localStorage.getItem("countdown"));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;

        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }
}

// Event Listeners
countdownForm.addEventListener("submit", updateCountdown);
resetBtn.addEventListener("click", reset);
completeBtn.addEventListener("click", reset);

// on load, check local
loadSavedCountdown();
