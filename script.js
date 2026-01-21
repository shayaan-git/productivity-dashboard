// Opens New Page
function openFeatures() {
  var allElems = document.querySelectorAll(".elem");
  var fullElemPage = document.querySelectorAll(".fullElem");
  var fullElemPageBackbtn = document.querySelectorAll(".fullElem .back");

  allElems.forEach(function (elem, idx) {
    elem.addEventListener("click", function () {
      fullElemPage[idx].style.display = "block";
    });
  });

  fullElemPageBackbtn.forEach(function (back, idx) {
    back.addEventListener("click", function () {
      fullElemPage[idx].style.display = "none";
    });
  });
}

openFeatures();

// To-Do List 👇🏻
function todoList() {
  // localStorage <- Current-Task
  // localStorage.clear()
  var currentTask = [];
  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  } else {
    console.log("Task list is Empty");
  }

  // All Task
  function renderTask() {
    let allTask = document.querySelector(".allTask"); // in HTML line 68

    let sum = "";

    currentTask.forEach(function (elem, idx) {
      sum += `<div class="task">
    <h5>${elem.task} <span class=${elem.imp}>imp</span></h5>
    <button id=${idx}>Mark as Done</button>
    </div>`;
    });

    allTask.innerHTML = sum;

    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    // mark as completed effect
    document.querySelectorAll(".task button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentTask.splice(btn.id, 1);
        renderTask();
      });
    });
  }
  renderTask();

  // Form elements selection
  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector(".addTask form #task-input");
  let taskDetailsInput = document.querySelector(".addTask form textarea");
  let taskCheckbox = document.querySelector(".addTask form #check");

  // Submit Button Action to push every task
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    currentTask.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      imp: taskCheckbox.checked,
    });
    renderTask();

    taskCheckbox.ckecked = false;
    taskInput.value = "";
    taskDetailsInput.value = "";
  });
}

todoList();

// Daily-Planner 👇🏻
function dailyPlanner() {
  var dayPlanner = document.querySelector(".day-planner");

  var dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {}; //an object

  var hours = Array.from(
    { length: 18 },
    (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`,
  );

  // Fetching Hour's data in the Daily-Planner
  var wholeDaySum = "";
  hours.forEach(function (elem, idx) {
    var savedData = dayPlanData[idx] || "";

    wholeDaySum =
      wholeDaySum +
      `<div class="day-planner-time">
                    <p>${elem}</p>
                    <input id=${idx} type="text" placeholder="..." value='${savedData}'>
                </div>`;
  });

  dayPlanner.innerHTML = wholeDaySum;

  var dayPlannerInput = document.querySelectorAll(".day-planner input");

  dayPlannerInput.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;

      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}

dailyPlanner();

// Motivational 👇🏻

function dailyQuotes() {
  function motivationalBoost() {
    var motivationQuote = document.querySelector(".motivation_2 h1");
    var motivationAuthor = document.querySelector(".motivation_3 h2");

    async function fetchQuote() {
      let response = await fetch("https://dummyjson.com/quotes/random");
      let data = await response.json();
      console.log(data);

      motivationQuote.innerHTML = `“ ${data.quote} ”`;
      motivationAuthor.innerHTML = `◈ ${data.author}`;
    }

    fetchQuote();
  }

  var refreshBtn = document.querySelector(".allElems .motiv");
  refreshBtn.addEventListener("click", motivationalBoost);
}

dailyQuotes();

// Pomodoro Timer 👇🏻

function pomodoroTimer() {
  let timer = document.querySelector(".pomo_timer h1");

  let startBtn = document.querySelector(".pomo_timer .start_timer");
  let pauseBtn = document.querySelector(".pomo_timer .pause_timer");
  let resetBtn = document.querySelector(".pomo_timer .reset_timer");

  let session = document.querySelector(".pomo_timer .session");

  let isWorkSession = true;
  let totalSeconds = 1500;
  let cycleCount = 0;

  let timerInterval = null; //running or stopping status clean (not the time value)

  function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    timer.innerHTML = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function handleCycleEnd() {
    // Case 1: Work complete → start break
    if (cycleCount === 1) {
      isWorkSession = false;
      totalSeconds = 300;

      session.innerHTML = "Take a Break";
      session.style.backgroundColor = "royalblue";
      startBtn.style.backgroundColor = "royalblue";

      updateTimer();
    }

    // Case 2: Break complete → show 00:00 for 2 sec
    else if (cycleCount === 2) {
      totalSeconds = 0;
      updateTimer();

      setTimeout(() => {
        resetBtn.style.backgroundColor = "black";
        startBtn.style.backgroundColor = "var(--tri1)";
        resetBtn.style.color = "var(--tri1)";
        resetToWorkState();
      }, 2000);
    }
  }

  function resetToWorkState() {
    isWorkSession = true;
    totalSeconds = 1500;
    cycleCount = 0;

    session.innerHTML = "Work Session";
    session.style.backgroundColor = "lightgreen";

    updateTimer();
  }

  function startTimer() {
    if (timerInterval !== null) return; //STOP Here! if timer is already started

    timerInterval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        updateTimer();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;

        cycleCount++;

        handleCycleEnd();
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval); //stops repeating task
    timerInterval = null; // marks empty slot for next value OR SAY "chal raha hai?" ka answer = NO
  }

  function resetTimer() {
    clearInterval(timerInterval); // timer rok do
    timerInterval = null; // flag kardo ki timer nahi chal rha

    setTimeout(() => {
      session.style.backgroundColor = "transparent";
      session.style.color = "teal";
      resetBtn.style.backgroundColor = "var(--tri1)";
      resetBtn.style.color = "var(--pri)";
    }, 1000);

    resetToWorkState();
  }

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
}

pomodoroTimer();

// Daily Goals 👇🏻

// Main UI

function weatherUI() {
  const apiKey = "5e649a9f44f046c9b4a50759262001";
  let city = "Lucknow";

  let header1Time = document.querySelector(".header_1 h1");
  let header1Date = document.querySelector(".header_1 h2");
  let header2Temp = document.querySelector(".header_2 h2");
  let header2Condition = document.querySelector(".header_2 .condition");
  let header2Humidity = document.querySelector(".header_2 .humidity");
  let header2Wind = document.querySelector(".header_2 .wind");
  let header2Precip = document.querySelector(".header_2 .precip");

  let data = null;

  async function weatherAPICall() {
    let response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`,
    );

    let data = await response.json();
    // console.log(data.current);

    header2Temp.innerHTML = `${data.current.temp_c}<sup>°C</sup>`;
    header2Condition.innerHTML = `${data.current.condition.text}`;
    header2Humidity.innerHTML = `Humidity: ${data.current.humidity}%`;
    header2Wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`;
    header2Precip.innerHTML = `Precipitaion: ${data.current.precip_in}%`;
  }
  weatherAPICall();

  function timeDate() {
    const totalDaysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let currentDate = new Date();
    let dayOfWeek = totalDaysOfWeek[currentDate.getDay()];
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let date = currentDate.getDate();
    let month = monthNames[currentDate.getMonth()];
    let year = currentDate.getFullYear();

    header1Date.innerHTML = `${date} ${month}, ${year}`;

    if (hours >= 12) {
      header1Time.innerHTML = `${dayOfWeek}, ${String(hours % 12 || 12).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} PM`;
    } else {
      header1Time.innerHTML = `${dayOfWeek}, ${String(hours % 12 || 12).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} AM`;
    }
  }

  setInterval(() => {
    timeDate();
  }, 1000);
}

weatherUI();

// Mode Change 👇🏻

function changeTheme() {
  var theme = document.querySelector(".theme");
  var rootElement = document.documentElement;

  var flag = 0;
  theme.addEventListener("click", function () {
    if (flag == 0) {
      rootElement.style.setProperty("--pri", "#070F2B");
      rootElement.style.setProperty("--sec", "#03346E");
      rootElement.style.setProperty("--sec2", "#6EACDA");
      rootElement.style.setProperty("--tri1", "#E2E2B6;");
      rootElement.style.setProperty("--tri2", "#F4F6FF");
      flag = 1;
    } else if (flag == 1) {
      rootElement.style.setProperty("--pri", "#040D12");
      rootElement.style.setProperty("--sec", "#183D3D");
      rootElement.style.setProperty("--sec2", "#5C8374");
      rootElement.style.setProperty("--tri1", "#b6b09f");
      rootElement.style.setProperty("--tri2", "#A5C9CA");
      flag = 2;
    } else if (flag == 2) {
      rootElement.style.setProperty("--pri", "#1A120B");
      rootElement.style.setProperty("--sec", "#3C2A21");
      rootElement.style.setProperty("--sec2", "#776B5D");
      rootElement.style.setProperty("--tri1", "#D5CEA3");
      rootElement.style.setProperty("--tri2", "#E5E5CB");
      flag = 0;
    }
  });
}

changeTheme();


document.getElementById('new-year').textContent = new Date().getFullYear();