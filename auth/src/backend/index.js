import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-body'
import mg from 'mongoose'
import convict from 'convict'
import fs from "fs"
import koaJwt from 'koa-jwt'
import jwt from 'jsonwebtoken'

import {addNote, listNotes} from './notes'
import {authenticate} from './user'
import {DB_URL, SIGN_SECRET} from './defaults'

const CONFIG_FILE = 'backend.conf.json'
const config = convict({
    db: {
        doc: 'the database to use',
        env: 'DB_URL',
        arg: 'db-url',
        format: '*',
        default: DB_URL,
    },
    signSecret: {
        doc: 'secret to sign web tokens',
        env: 'SIGN_SECRET',
        arg: 'sign-secret',
        format: '*',
        default: SIGN_SECRET,
    }
})

async function main() {
    if (fs.existsSync(CONFIG_FILE)) {
        config.loadFile(CONFIG_FILE)
    }
    config.validate({allow: 'warn'})

    await mg.connect(config.get('db'))

    const backend = new Koa()
    const router = new Router({prefix: '/api'})

    router.put('/login', async ctx => {
        const {email, password} = ctx.request.body
        const id = await authenticate(email, password)
        if (id) {
            const idToken = jwt.sign({email, id}, config.get('signSecret'), {expiresIn: '5 days'})
            ctx.body = {idToken}
            ctx.status = 200
        } else {
            ctx.status = 401
        }
    })

    router.get('/status', async ctx => {
        try {
            const tokenRegex = /^Bearer\s+(\S+)/
            const {authorization} = ctx.request.header
            const [_, token] = authorization.match(tokenRegex)
            const decoded = jwt.decode(token)
            if (!decoded) {
                throw 'bad token'
            }
            const {email} = decoded
            ctx.body = {email}
        } catch (e) {
            ctx.status = 401
        }
    })

    router.post('/note', async ctx => {
        const note = ctx.request.body
        ctx.body = await addNote(note)
    })

    router.get('/notes', async ctx => {
        ctx.body = await listNotes()
    })

    backend.use(koaJwt({
        secret: config.get('signSecret')
    }).unless({path: ['/api/login']}))
    backend.use(bodyParser())
    backend.use(router.routes())
    backend.listen(3000)
}

main()
