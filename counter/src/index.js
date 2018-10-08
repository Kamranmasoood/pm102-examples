import $ from 'jquery'

let counterValue = 0

const changeListener = function () {
    $('#counter-label').text(counterValue)
    $('#counter-range').val(counterValue)
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
    },
    setValue: function (e) {
        counterValue = e.target.value
        changeListener()
    }
}

function init() {
    $('#counter-range').change(handlers.setValue)
    $('#decrement-button').click(handlers.decrement)
    $('#reset-button').click(handlers.reset)
    $('#increment-button').click(handlers.increment)
}

init()

console.log('app initialized')
