import mg from 'mongoose'

const schema = new mg.Schema({
    title: {
        type: String,
        required: true,
        index: {unique: true},
    },
    body: {
        type: String,
        required: true,
    }
})

const model = mg.model('notes', schema)

export async function addNote(note) {
    const res = await model.create(note)
    return res._doc
}

export async function listNotes() {
    const res = await model.find({})
    return res.map(elem => elem._doc)
}