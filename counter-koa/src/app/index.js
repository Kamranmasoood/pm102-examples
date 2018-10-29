import $ from 'jquery'
import axios from 'axios'

class Api {
    constructor(listeners) {
        this.listeners = listeners

        this._value = 0
        axios.get('/api/count')
            .then(({data: {count}}) => {
                this._value = Number(count)
                this.updateListeners()
            })
            .catch(() => console.warn('initial fetch failed'))
    }

    async setValue(value) {
        try {
            const {data: {count}} = await axios.put('/api/count', {count: value})
            this._value = Number(count)
            this.updateListeners()
        } catch (e) {
            console.warn('set value failed')
        }
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
        api.setValue(value + 1)
    },
    decrement: function () {
        const {value} = api
        api.setValue(value - 1)
    },
    reset: function () {
        api.setValue(0)
    },
    setValue: function (e) {
        api.setValue(e.target.value)
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
