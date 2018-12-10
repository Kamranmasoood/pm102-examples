import {createUser} from './user'
import convict from 'convict'
import fs from 'fs'
import mg from 'mongoose'
import {DB_URL} from './defaults'


const CONFIG_FILE = 'create-user.conf.json'

const config = convict({
    db: {
        doc: 'the database to use',
        env: 'DB_URL',
        arg: 'db-url',
        format: '*',
        default: DB_URL,
    }
})

async function main() {
    if (fs.existsSync(CONFIG_FILE)) {
        config.loadFile(CONFIG_FILE)
    }
    config.validate({allow: 'warn'})

    const args = process.argv.slice(2)
    if (args.length < 2) {
        console.log('USAGE: create-user.sh <email> <password>')
        process.exit(1)
    }
    const [email, password] = args

    await mg.connect(config.get('db'))
    try {
        const id = await createUser(email, password)
        console.log(`id: ${id}`)
    } catch (e) {
        console.log(e)
    }
    await mg.disconnect()
}

main()





