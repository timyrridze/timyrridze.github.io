"use strict"; 

import { bezier } from "../libraries/bezier-easing/bezier-easing.js"

let todoListHTML = document.querySelector(".todo-list")
let todoList = [];
let todoListCLone;


// localStorage
function putLocalStorage() {
	if (localStorage.getItem("todoListHtml")) {
		let todoListCLoneNew = localStorage.getItem("todoListCLone")
		todoListHTML.innerHTML = localStorage.getItem("todoListHtml")
		todoList = JSON.parse(todoListCLoneNew);
	}
}

putLocalStorage()

window.onbeforeunload = () => {
	todoListComponents.save()
}



// todoList
const todoListComponents = {
		content: document.querySelector(".todo-list__content"),
		block: document.querySelector(".block"),
		inputBtn: document.querySelector(".input-btn"),
		input: document.querySelector(".input"),
		list: document.querySelector(".list"),
		controlBlock: document.querySelector(".control-block"),
		allBtn: document.getElementById("all-btn"),
		uncompletedBtn: document.getElementById("uncompleted-btn"),

		overallCounterBlock: document.querySelector(".todos-overall-counter-block"),
		overallCounter: document.querySelector(".todos-overall-counter"),

		doneCounterBlock: document.querySelector(".todos-done-counter-block"),
		doneCounter: document.querySelector(".todos-done-counter"),

		listScrollPoint: null,
		lastTask: null,
		listHeight: 320,

		overallCounterState: null,
		overallCounterQueue: [],

		doneCounterState: null,
		doneCounterQueue: [],

		checkerForAddtodo: null,

		overall: todoList.length,
		done: countDoneTasks(),

		save() {
			localStorage.setItem("todoListHtml", todoListHTML.innerHTML)
			todoListCLone = JSON.stringify(todoList, null, 2);
			localStorage.setItem("todoListCLone", todoListCLone);

			console.log(localStorage.getItem("todoListHtml"))
		},

		checkValue(value) {
			let SpaceCounter = 0;

			for (let key of value) {
				if (key === " ") SpaceCounter++;
			}

			if (SpaceCounter === value.length) return false;
		},

		addTask(value) {
			if (todoListComponents.checkValue(value) === false) return;
			if (value == "") return;
			if (todoList.length === 20) return console.log("too many")

			let task = {
				text: value,
				done: false,
				id: Math.random(),
			}

			todoList.push(task);

			if (todoListComponents.content.classList.contains("_hide-display-n")) {
				todoListHTML.classList.add("_extend")
				todoListComponents.toggleContent()
			} 

			let HTMLTask = todoListComponents.createHTMLTask(value, task.id)

			todoListComponents.animateAddedTask(HTMLTask)

			todoListComponents.input.value = "";
			todoListComponents.input.focus()

			todoListComponents.toggleList()
			todoListComponents.updateCounter(todoList.length, "overall")

			todoListComponents.lastTask = todoListComponents.findLastTask()
		},

		async removeTask(targetClosest) {
			let visibleTasks = (() => {
				let counter = 0;

				for(let key of todoListComponents.list.children) {
					if (!key.classList.contains("_hide")) {
						counter += 1
					}
				}

				return counter;
			})()

			let taskIndex = todoList.findIndex(item => item.id == targetClosest.id)

			todoList.splice(taskIndex, 1)

			todoListComponents.lastTask = todoListComponents.findLastTask()

			if (todoList.length == 0) {
				
				new Promise(resolve => {
					todoListComponents.toggleContent()
					todoListHTML.classList.remove("_extend")
					todoListHTML.classList.add("_decrease")

					setTimeout(resolve, 500);
				}).then(() => {
					todoListComponents.activateAnimation()
				})
			
			}

			if (visibleTasks == 1 && todoList.length != 0) {	
				await todoListComponents.animateRemovedTask(targetClosest)

				todoListComponents.render("show")
				
				return;
			}

			todoListComponents.animateRemovedTask(targetClosest)

		},

		createHTMLTask(value, id) {
			let HTMLTask = document.createElement("li");
			HTMLTask.classList.add("list__item")
			HTMLTask.id = id
			HTMLTask.innerHTML = `<div class="list__item-wrapper"><div class="list__item-block"><div class="checkbox"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 17"> 
			<polyline class="tick" fill="none" stroke-width="2"  stroke-linecap="round" points="1 9, 5 13, 12 4" stroke-linecap="round"/></svg></div><div class="list__item-text-block"><div class="list__item-text-crossing _hide"></div> <div class="list__item-text">${value}</div> </div></div> <button class="remove-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="icon-cross"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" /></svg></button></div>`

			return HTMLTask
		},

		markAsDone(checkbox, listItem) {
			let tick = checkbox.querySelector(".tick")

			checkbox.hasAttribute("checked") ? checkbox.removeAttribute("checked") : checkbox.setAttribute("checked", "checked")

			todoList.forEach(task => {
				if (task.id == listItem.id) task.done = !task.done;
			})

			if (tick.classList.contains("show")) {
				tick.classList.remove("show")
				checkbox.querySelector(".tick").classList.add("hide")
			} else {
				tick.classList.remove("hide")
				tick.classList.add("show")
			}
			
		},

		findLastTask() {
			let task;
		
			for (let key of todoListComponents.list.children) {
				if (!key.classList.contains("_hide")) task = key
			}

			return task;
		},

		render(option) {

			switch (option) {

				case "remove":	
					if(countDoneTasks() === 0) return console.log("you don't have completed tasks")

					let components = todoListComponents;

					todoList = todoList.filter(task => task.done == false)

					for (let i = 0; i < components.list.children.length; i++) {
						if (components.list.children[i].querySelector(".checkbox").getAttribute("checked") == "checked") {
							components.animateRemovedTask(components.list.children[i])
						}
					}
				
					if (todoList.length == 0) {
						components.toggleContent()
					} 

					components.uncompletedBtn.classList.remove("_active")
					components.allBtn.classList.add("_active")

					components.lastTask = components.findLastTask();

					components.updateCounter(todoList.length, "overall")
					components.updateCounter(countDoneTasks(), "done")
					break;

				case "hide":
					let counter2 = 0;

					for (let key of todoList) {
						if (key.done == true) counter2++
					}

					if (counter2 === todoList.length) return console.log("all the tasks are completed")

					if (counter2 === 0) return console.log("you don't have completed tasks")

					todoListComponents.allBtn.classList.remove("_active")
					todoListComponents.uncompletedBtn.classList.add("_active")

					for (let i = 0; i < todoList.length; i++) {
						if (todoList[i].done == true) {
							todoListComponents.list.children[i].classList.add("_hide")
						} 
					}

					todoListComponents.lastTask = todoListComponents.findLastTask()
					break;

				case "show":
					let counter3 = 0;

					if (!todoListComponents.lastTask) todoListComponents.lastTask = todoListComponents.findLastTask()

					for (let i = 0; i < todoList.length; i++) {
						if (todoList[i].done == true) {
							todoListComponents.list.children[i].classList.remove("_hide");
							counter3++;
						}
					}

					if (counter3 == 0) return console.log("это все задачи")

					if (counter3 == todoListComponents.list.length) return console.log("все задачи выполнены")

					todoListComponents.uncompletedBtn.classList.remove("_active");
					todoListComponents.allBtn.classList.add("_active")
					
					break;
			}

			todoListComponents.checkerForAddtodo = true;
		},

		toggleList() {
			if (todoList.length == 0) {

				new Promise(resolve => {
					todoListComponents.list.classList.add("_hide-translate-y")
					setTimeout(resolve, 500)
				}).then(() => {
					todoListComponents.list.classList.add("_hide-display-n")
				})

				return;
			} 

			new Promise(resolve => {
				todoListComponents.list.classList.remove("_hide-display-n")
				setTimeout(resolve, 0)
			}).then(() => {
				todoListComponents.list.classList.remove("_hide-translate-y")
			})
		},

		toggleContent() {

			if (todoList.length == 0) {

				new Promise(resolve => {
					todoListComponents.content.classList.add("_hide-translate-y")
					setTimeout(resolve, 500)
				}).then(() => {
					todoListComponents.content.classList.add("_hide-display-n")
				})

				return;
			}

			new Promise(resolve => {
				todoListComponents.content.classList.remove("_hide-display-n")
				setTimeout(resolve, 0)
			}).then(() => {
				todoListComponents.content.classList.remove("_hide-translate-y")
			})
		},

		updateCounter(number, option) {

			function animation(number) {
				// console.log("animation")

				let counterClone = This[node].cloneNode();
				counterClone.textContent = `${number}`
				counterClone.classList.add("_clone")

				This[nodeParent].append(counterClone)

				setTimeout(() => {
					// console.log("timeOut")

					counterClone.classList.add("_show")
					This[node].classList.add("_hide");

					This[node].ontransitionend = onTransitionEnd
				}, 0);

				function onTransitionEnd() {
					// console.log("transitionend")
					This[node].remove()
					counterClone.classList.remove("_clone")
					counterClone.classList.remove("_show")
					This[node] = counterClone;

					// console.log(This[queue])

					if (This[queue].length > 0) {
						// console.log("queue")
						animation(This[queue].shift());
					} else {
						This[state] = true;
					}
				}
			}

			let This = todoListComponents; 

			let node = `${option}Counter`
			let nodeParent = `${node}Block`
			let state = `${node}State`
			let queue = `${node}Queue`

			This[option] = number;
			// console.log(This[state], This[nodeParent].children.length)
			if (This[state] == false && This[nodeParent].children.length != 2) {
				This[queue].push(number)
				return;
			}

			This[state] = false

			animation(number)
		},

		crossText(listItem) {
			let crossingItem = listItem.querySelector(".list__item-text-crossing");
			crossingItem.classList.toggle("_hide")
		},

		activateAnimation() {
			if (todoListComponents.controlBlock.classList.contains("_hide-display-n") && todoListComponents.checkValue(todoListComponents.input.value) === false) {
				todoListComponents.input.value = ""
				todoListHTML.classList.add("animate-todo-list-2")
			}
		},

		async animateRemovedTask(task) {
			let animateTask = () => new Promise(resolve => {
				task.classList.remove("_show")
				task.classList.add("_hide")
				setTimeout(() => {
					resolve();
				}, 500);
			})

			let removeTask = () => new Promise(resolve => {
				task.remove()
				resolve()
			})

			await animateTask().then(() => removeTask()) 

			return "ready"
		}, 

		animateAddedTask(task) {
			let This = todoListComponents;

			let taskWrapper = task.querySelector(".list__item-wrapper");
			let height = null;

			let insertTask = () => {
				return new Promise(resolve => {
					This.list.append(task)
					height = task.offsetHeight + "px"
					task.classList.add("h-0")
					setTimeout(() => resolve(), 0);
				})
			}

			let animateTask = () => {
				return new Promise(resolve => {
					if (This.listHeight <= This.list.offsetHeight) This.scrollListToBottom()
					task.classList.add("_show")
					task.style.setProperty("--height", height)
					taskWrapper.classList.add("h-custom")
					resolve()
				})
			}

			insertTask().then(() => animateTask())

			task.onanimationend = () => {
				task.classList.remove("h-0")
				task.classList.add("h-custom")
			} 
		},

		toggleInput() {
			if (!document.activeElement.tagName !== "INPUT" && todoList.length == 0 && todoListComponents.input.classList.contains("w-100"))  {
				todoListComponents.input.classList.remove("w-100")
				todoListComponents.inputBtn.classList.remove("translate-x")
				todoListHTML.classList.add("animate-todo-list-2")
			} else {
				todoListComponents.input.classList.add("w-100")
				todoListComponents.inputBtn.classList.add("translate-x")
				todoListHTML.classList.remove("animate-todo-list-2")
			}
		},

		scrollListToBottom() {
			todoListComponents.list.onscroll = () => {
				todoListComponents.listScrollPoint = todoListComponents.list.scrollTop;
			}

			function animateScrolling({ draw, duration }) {
				let start = performance.now()
				let timingFunction = bezier(0.075, 0.82, 0.165, 1)

				requestAnimationFrame(function animate(time) {
					let timeFraction = (time - start) / duration;

					if (timeFraction > 1) timeFraction = 1
					if (timeFraction < 0) timeFraction = 0

					draw(timingFunction(timeFraction))

					if (timeFraction < 1) requestAnimationFrame(animate)
				})
			}

			animateScrolling({
				draw(progress) {
					let range = (todoListComponents.list.scrollHeight - todoListComponents.list.offsetHeight) - todoListComponents.list.scrollTop;

					todoListComponents.list.scrollBy(0, progress * range)
				},

				duration: 500,
			})

			let setScrollPoint = () => new Promise(resolve => {
				if (!todoListComponents.listScrollPoint) resolve()

				todoListComponents.list.scrollTo(0, todoListComponents.listScrollPoint)

				setTimeout(resolve, 5)
			})

			let startScroll = () => new Promise(resolve => {
				animateScrolling({
					draw(progress) {
						let range = (todoListComponents.list.scrollHeight - todoListComponents.list.offsetHeight) - todoListComponents.list.scrollTop;

						todoListComponents.list.scrollBy(0, progress * range)
					},

					duration: 500,
				})

				setTimeout(() => {
					todoListComponents.listScrollPoint = todoListComponents.list.scrollTop;

					resolve()
				}, 500);
			})

			setScrollPoint().then(() => startScroll())
		}
	}


function countDoneTasks() {
	let counter = 0;

	todoList.forEach((task) => {
		if (task.done == true) ++counter
	})

	return counter;
}


todoListComponents.inputBtn.addEventListener("click", function() {
	let inputValue = todoListComponents.input.value

	todoListComponents.addTask(inputValue);
})


todoListComponents.input.onfocus = () => {
	todoListHTML.classList.remove("animate-todo-list-2")
}


todoListComponents.list.addEventListener("click", (event) => {

	if (!event.target.closest(".checkbox") && !event.target.closest(".remove-btn")) return;


	let target = event.target;
	let components = todoListComponents;
	let HTMLTask = target.closest(".list__item")
	let task = (() => todoList.find(task => HTMLTask.id == task.id))();

	if (target.closest(".remove-btn")) {

		components.removeTask(target.closest(".list__item"))
		components.updateCounter(todoList.length ,"overall")

		if (task.done == true) {
			components.updateCounter(countDoneTasks(), "done")
		} 
	
	} 

	if (target.closest(".checkbox") && target.closest(".checkbox").classList.contains("checkbox")) {

		components.markAsDone(target.closest(".checkbox"), target.closest(".list__item"));
		components.crossText(target.closest(".list__item"))
		components.updateCounter(countDoneTasks(), "done")

	}
})


todoListComponents.input.onkeypress = function (event) {
	let key = event.key

	if (key == "Enter") {
		todoListComponents.addTask(todoListComponents.input.value);
	}
}


todoListComponents.controlBlock.addEventListener("click", function(event) {
	let target = event.target

	switch(target.id) {
		case "clear-btn":
			todoListComponents.render("remove")
		break;

		case "all-btn":
			todoListComponents.render("show")
		break;

		case "uncompleted-btn":
			todoListComponents.render("hide")
		break;
	}
})

todoListComponents.input.oninput = todoListComponents.showAddingBtn;

todoListComponents.inputBtn.onclick = todoListComponents.toggleInput

console.log("todoList")


let todoListState = "ready"

export {todoListState, todoList, todoListHTML, todoListComponents}