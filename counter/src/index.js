let counterValue = 0

const changeListener = function () {
    const view = document.getElementById('counterValue')
    view.innerText = counterValue
    const range = document.getElementById('counterRange')
    range.value = counterValue
}

const handlers = {
    increment: function () {
        if (counterValue < 10) {
            counterValue += 1
            changeListener()
        }
    },
    decrement: function () {
        if (counterValue > -10) {
            counterValue -= 1
            changeListener()
        }
    },
    reset: function () {
        counterValue = 0
        changeListener()
    }
}

global.App = handlers

console.log('app initialized')
