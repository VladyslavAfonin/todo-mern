const {Schema, model} = require("mongoose")

const TodoSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    }, 
    completedAt: {
        type: Date
    }
}, 
{
    timestamps: true
})

const Todo = model("Todo", TodoSchema)
module.exports = Todo;