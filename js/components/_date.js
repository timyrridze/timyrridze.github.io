"use strict";

const date = {
  block: document.querySelector(".date"),
  day: document.querySelector(".date__day"),
  time: document.querySelector(".date__time"),
}

function updateDate() {
  let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  let currentDate = new Date()

  let day = currentDate.getDay()
  day = weekdays[day - 1]

  let hours = `${currentDate.getHours()}`
  let minutes = `${currentDate.getMinutes()}`
  minutes = minutes.padStart(2, "0")
  let time = `${hours}:${minutes}`

  date.day.textContent = `${day}`
  date.time.textContent = `${time}`
}

updateDate()

setInterval(updateDate, 1000);

console.log("date")

export let dateState = "ready"