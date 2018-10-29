import $ from 'jquery'

class Api {
    constructor(listeners) {
        this.listeners = listeners

        const initialRequest = new XMLHttpRequest()
        initialRequest.onreadystatechange = () => {
            if (initialRequest.readyState === XMLHttpRequest.DONE) {
                if (initialRequest.status !== 200) {
                    console.warn('initial fetch failed')
                    return
                }
                const body = JSON.parse(initialRequest.responseText)
                if (!body || body.count == undefined || isNaN(body.count)) {
                    console.warn('bad response to initial fetch')
                    return
                }
                this._value = body.count
                this.updateListeners()
            }
        }
        initialRequest.open('GET', '/api/count')
        initialRequest.send()
    }

    set value(value) {
        const setRequest = new XMLHttpRequest()
        setRequest.onreadystatechange = () => {
            if (setRequest.readyState === XMLHttpRequest.DONE) {
                if (setRequest.status !== 200) {
                    console.warn('set request failed')
                    return
                }
                const body = JSON.parse(setRequest.responseText)
                if (!body || body.count === undefined || isNaN(body.count)) {
                    console.warn('bad response to set request')
                    return
                }
                this._value = body.count
                this.updateListeners()
            }
        }
        setRequest.open('PUT', `/api/count/${value}`)
        setRequest.send()
    }

    /**
     * get cached value
     */
    get value() {
        return this._value
    }

    updateListeners() {
        for (let listener of this.listeners) {
            listener(this._value)
        }
    }
}

const changeListener = function (value) {
    $('#counter-label').text(value)
    $('#counter-range').val(value)
}

const api = new Api([changeListener])


const handlers = {
    increment: function () {
        const {value} = api
        api.value = value + 1
    },
    decrement: function () {
        const {value} = api
        api.value = value -1
    },
    reset: function () {
        api.value = 0
    },
    setValue: function (e) {
        api.value = e.target.value
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
