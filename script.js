const stopWatchContainer = document.getElementById("display-time");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const lapButton = document.getElementById("lap-button");
const removeLapTimesButton = document.getElementById("remove-set-times-button");
const resetButton = document.getElementById("reset-button");
const lapTimesDiv = document.getElementById("lap-times");

let currentTimeStamp = null;
let elapsedTimeBeforeStop = null;
let lastLapTime = null;
let stopWatchSetInterval = null;
let started = false;
let setTimes = [];

startButton.addEventListener("click", () => {
  if (!started) {
    currentTimeStamp = Date.now() - elapsedTimeBeforeStop;

    stopWatchSetInterval = setInterval(() => {
      const currentTime = Date.now();

      const elapsedTime = currentTime - currentTimeStamp;

      const timeData = extractTimeValues(elapsedTime);

      displayCurrentTime(timeData);
    }, 10);

    started = true;
  }
});

stopButton.addEventListener("click", () => {
  if (started) {
    started = false;
    elapsedTimeBeforeStop = Date.now() - currentTimeStamp;
    clearInterval(stopWatchSetInterval);
  }
});

lapButton.addEventListener("click", () => {
  if (!currentTimeStamp || !started) return;

  const currentTime = Date.now();
  const elapsedTime = currentTime - currentTimeStamp - lastLapTime;
  lastLapTime += elapsedTime;

  const timeData = extractTimeValues(elapsedTime);
  insertSetTimeHTML(timeData);
  setTimes.push(elapsedTime);

  const stringifySetTimes = JSON.stringify(setTimes);

  localStorage.setItem("set-times", stringifySetTimes);
});

resetButton.addEventListener("click", () => {
  started = false;
  currentTimeStamp = null;
  lastLapTime = null;
  elapsedTimeBeforeStop = null;
  resetCurrentTime();
  clearInterval(stopWatchSetInterval);
});

removeLapTimesButton.addEventListener("click", () => {
  localStorage.removeItem("set-times");
  setTimes = [];
  lapTimesDiv.innerHTML = "";
});

const extractTimeValues = (remainder) => {
  const hours = Math.floor(remainder / 3600000);
  remainder %= 3600000;
  const minutes = Math.floor(remainder / 60000);
  remainder %= 60000;
  const seconds = Math.floor(remainder / 1000);
  remainder %= 1000;
  const centiSeconds = Math.floor(remainder / 10);
  remainder %= 10;

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    centiSeconds: centiSeconds,
  };
};

const resetCurrentTime = () => {
  stopWatchContainer.innerText = `${"0".toString().padStart(2, "0")}.${"0"
    .toString()
    .padStart(2, "0")}.${"0".toString().padStart(2, "0")}.${"0"
    .toString()
    .padStart(2, "0")}`;
};

const displayCurrentTime = (timeData) => {
  stopWatchContainer.innerText = `${timeData.hours
    .toString()
    .padStart(2, "0")}.${timeData.minutes
    .toString()
    .padStart(2, "0")}.${timeData.seconds
    .toString()
    .padStart(2, "0")}.${timeData.centiSeconds.toString().padStart(2, "0")}`;
};

const insertSetTimeHTML = (timeData) => {
  return lapTimesDiv.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="lap-time">${timeData.hours
      .toString()
      .padStart(2, "0")}.${timeData.minutes
      .toString()
      .padStart(2, "0")}.${timeData.seconds
      .toString()
      .padStart(2, "0")}.${timeData.centiSeconds
      .toString()
      .padStart(2, "0")}</div>
    `
  );
};

const getSetTimes = () => {
  const getItemSetTimes = localStorage.getItem("set-times");
  if (!getItemSetTimes) return;
  const parseSetTimes = JSON.parse(getItemSetTimes);
  setTimes = parseSetTimes;

  setTimes.forEach((time) => {
    const timeData = extractTimeValues(time);
    insertSetTimeHTML(timeData);
  });
};

resetCurrentTime();
getSetTimes();
