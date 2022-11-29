"use strict";
import { todoListHTML, todoList, todoListComponents } from "./_todo-list.js"

document.addEventListener("DOMContentLoaded", () => {

  function activatePreloader() {
    let preloaderHTML = document.createElement("div")
    preloaderHTML.classList.add("preloader")
    preloaderHTML.innerHTML = `
    <div class="preloader__block animate">
      <div class="preloader__text-block _1 animate-text-block-1">
        <span class="preloader__text _1">Todo</span>
      </div>
      <div class="preloader__text-block _2">
        <p class="preloader__text _2">L</p>
        <p class="preloader__text _3">i</p>
        <p class="preloader__text _4">s</p>
        <p class="preloader__text _5">t</p>
      </div>
    </div>
    <div class="preloader__items-block">
      <div class="preloader__item _1"></div>
      <div class="preloader__item _2"></div>
      <div class="preloader__item _3"></div>
    </div>
  	`

    document.body.prepend(preloaderHTML)

    const preloader = {
      container: document.querySelector(".preloader"),
      block: document.querySelector(".preloader__block"),
      textBlock1: document.querySelector(".preloader__text-block"),
      textBlock2: document.querySelector(".preloader__text-block._2"),
      text3: document.querySelector(".preloader__text._3"),
      text4: document.querySelector(".preloader__text._4"),
      text5: document.querySelector(".preloader__text._5"),

      preloaderAnimation1(duration) {
        let start = performance.now();

        function makeEaseOut(timing, timeFraction) {
          return 1 - timing(1 - timeFraction);
        }

        function quad(timeFraction) {
          return Math.pow(timeFraction, 2)
        }

        function draw(timeFraction) {
          let x = timeFraction;
          let y = makeEaseOut(quad, timeFraction);

          preloader.textBlock1.style.transform = `translate(-${x * 25}px, -${y * 100}px)`
        }

        requestAnimationFrame(function animate(time) {
          let timeFraction = (time - start) / (duration / 2);

          if (timeFraction > 2) timeFraction = 2

          draw(timeFraction)

          if (timeFraction < 2) requestAnimationFrame(animate);
        })
      },
    }

    preloader.container.classList.add("animate")
    preloader.block.classList.add("animate")
    // todoListHTML.classList.add("animate")
    // date.block.classList.add("animate")
    document.querySelector(".page").classList.add("animate")

    setTimeout(() => {
      preloader.textBlock1.classList.remove("animate-text-block-1")
      preloader.preloaderAnimation1(600)
      preloader.textBlock2.classList.add("animate-text-block-2")
    }, 2700);

    setTimeout(() => {
      preloader.textBlock1.style.order = "1";
      preloader.textBlock2.style.order = "2";
      preloader.textBlock1.classList.add("animate-text-block-3");
      preloader.textBlock2.classList.add("animate-text-block-4");

    }, 3400)

    setTimeout(() => {
      preloader.text3.style.transform = "translateY(0)"
    }, 3800);

    setTimeout(() => {
      preloader.text4.style.transform = "translateY(0)"
    }, 4000);

    setTimeout(() => {
      preloader.text5.style.transform = "translateY(0)"
    }, 4200);

    setTimeout(() => {
      // date.block.classList.remove("animate")
      // todoListHTML.classList.remove("animate")
      document.querySelector(".page").classList.remove("animate")

      if (todoList.length == 0) todoListHTML.classList.add("animate-todo-list-2")

    }, 9300);

  }

  if (!sessionStorage.getItem("active")) {
    document.documentElement.style.background = "#fff"

    activatePreloader()

    document.body.classList.add("preloader-notopened")
    todoListHTML.classList.remove("_inactive")
  } else {
    document.body.classList.add("preloader-notopened")
    todoListHTML.classList.remove("_inactive")

    if (todoList.length == 0 && !todoListComponents.input.classList.contains("w-100")) todoListHTML.classList.add("animate-todo-list-2")
  }

  sessionStorage.setItem("active", true)
})

console.log("preloader")

export let preloaderState = "ready"
