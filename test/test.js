const path = require('path');
const pagePath = 'file://' + path.resolve(__dirname, '../src/index.html');
const {StageTest, correct, wrong} = require('hs-test-web');

class TodoTest extends StageTest {

    page = this.getPage(pagePath)

    tests = [
        this.page.execute(() => {
            if (document.title !== 'To-Do List') {
                return wrong("The title of the page should be 'To-Do List'")
            }
            return correct();
        }),
        this.page.execute(() => {
            const inputField = document.getElementById("input-task")
            if (inputField === null || inputField.tagName !== 'INPUT')
                return wrong("Can't find input field with id '#input-task'")

            const addButton = document.getElementById("add-task-button")
            if (addButton === null || addButton.tagName !== 'BUTTON')
                return wrong("Can't find button with id '#add-task-button'")

            this.taskList = document.getElementById("task-list")
            if (this.taskList === null || this.taskList.tagName !== 'UL')
                return wrong("Can't find <ul> tag with id '#task-list'")

            return correct();
        }),
        this.page.execute(() => {

            const tasks = this.taskList.getElementsByTagName("li")
            if (tasks.length !== 3)
                return wrong("Inside the <ul> tag should be 3 <li> elements!")

            for (let task of tasks) {
                const checkbox = task.querySelector("input[type=checkbox]")
                if (checkbox === null)
                    return wrong("Inside each <li> tag should one <input> tag with 'checkbox' type")

                const taskName = task.querySelector("span.task")
                if (taskName === null)
                    return wrong("Inside each <li> tag should one <spane> tag with 'task' class")

                const deleteButton = task.querySelector("button.delete-btn")
                if (deleteButton === null)
                    return wrong("Inside each <li> tag should one <button> tag with 'delete-btn' class")
            }

            return correct();
        }),
        this.page.execute(() => {

            const inputField = document.getElementById("input-task")
            if (inputField.tagName !== 'INPUT')
                return wrong("Can't find input field with id '#input-task'")

            inputField.value = "New task for the test purpose"

            const addButton = document.getElementById("add-task-button")
            if (addButton.tagName !== 'BUTTON')
                return wrong("Can't find button with id '#add-task-button'")

            addButton.click()

            const tasks = this.taskList.getElementsByTagName("li")
            if (tasks.length !== 4)
                return wrong("After adding a new task to the To-Do list, there should be 4 <li> tags inside the <ul> list")

            for (let task of tasks) {

                const taskName = task.querySelector("span.task")
                if (taskName === null)
                    return wrong("Inside each <li> tag should one <spane> tag with 'task' class")

                if (taskName.textContent === "New task for the test purpose") {
                    return correct()
                }
            }

            return wrong("Can't find task with name 'New task for the test purpose'.\n" +
                "The task name should be placed in <span> tag with class 'task'!")
        }),
        this.page.execute(() => {

            let tasks = this.taskList.getElementsByTagName("li")

            for (let task of tasks) {
                const taskName = task.querySelector("span.task")
                if (taskName === null)
                    return wrong("Inside each <li> tag should one <spane> tag with 'task' class")

                if (taskName.textContent === "New task for the test purpose") {
                    const deleteButton = task.querySelector("button.delete-btn")
                    if (deleteButton === null)
                        return wrong("Inside each <li> tag should one <button> tag with 'delete-btn' class")
                    deleteButton.click()
                    break
                }
            }

            tasks = this.taskList.getElementsByTagName("li")

            for (let task of tasks) {
                const taskName = task.querySelector("span.task")
                if (taskName === null)
                    return wrong("Inside each <li> tag should one <spane> tag with 'task' class")

                if (taskName.textContent === "New task for the test purpose") {
                    return wrong("After deleting a task with name 'New task for the test purpose' it is still in the task list!")
                }
            }

            return correct()
        })
    ]
}

it('Test stage', async function () {
    try {
        this.timeout(30000)
    } catch (ignored) {
    }
    await new TodoTest().runTests()
}, 30000)
