import Koa from 'koa'
import Router from 'koa-router'
import KoaBody from 'koa-body'

const PORT = 3000
let data = {count: -3}

const backend = new Koa()
const router = new Router({prefix: '/api'})

router.get('/count', ctx => {
    ctx.body = data
})

router.put('/count', ctx => {
    const {count} = ctx.request.body
    if (isNaN(count) || count < -10 || count > 10) {
        console.log('input out of range')
        ctx.body = data
        return
    }
    data = {...data, count}
    ctx.body = data
})

backend.use(KoaBody())
backend.use(router.routes())
backend.listen(PORT)
