const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo")
const requiresAuth = require("../middleware/permissions")
const validateTodoInput = require("../validation/todosValidation")

router.post("/new", requiresAuth, async (req, res) => {
    try {
        const {
            isValid,
            errors
        } = validateTodoInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors)
        }

        const newTodo = new Todo({
            user: req.user._id,
            content: req.body.content,
            complete: false
        })

        await newTodo.save();

        return res.json(newTodo)

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message)
    }
})

router.get("/current", requiresAuth, async (req, res) => {
    try {
        const completeTodos = await Todo.find({
            user: req.user._id,
            complete: true
        }).sort({
            completedAt: -1
        })

        const incompleteTodos = await Todo.find({
            user: req.user._id,
            complete: false
        }).sort({
            createdAt: -1
        })

        return res.json({
            incomplete: incompleteTodos,
            complete: completeTodos
        })
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message)
    }
})

router.put("/:todoId/complete", requiresAuth, async (req, res) => {
    try {
        const todo = await Todo.findOne({
            user: req.user._id,
            _id: req.params.todoId
        })

        if (!todo) {
            return res.status(404).json({
                error: "Couldn't find todo!"
            })
        }

        if (todo.complete) {
            return res.status(400).json({
                error: "Todo is already complete!"
            })
        }

        const updatedTodo = await Todo.findOneAndUpdate({
            user: req.user._id,
            _id: req.params.todoId
        }, {
            complete: true,
            completedAt: new Date()
        }, {
            new: true
        })

        return res.json(updatedTodo);

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message)
    }
})

router.put("/:todoId/incomplete", requiresAuth, async (req, res) => {
    try {
        const todo = await Todo.findOne({
            user: req.user._id,
            _id: req.params.todoId
        })

        if (!todo) {
            return res.status(404).json({
                error: "Couldn't find todo!"
            })
        }

        if (!todo.complete) {
            return res.status(400).json({
                error: "Todo is already incomplete!"
            })
        }

        const updatedTodo = await Todo.findOneAndUpdate({
            user: req.user._id,
            _id: req.params.todoId
        }, {
            complete: false,
            completedAt: null
        }, {
            new: true
        })

        return res.json(updatedTodo);

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message)
    }
})

router.put("/:todoId", requiresAuth, async (req, res) => {
    try {
        const todo = await Todo.findOne({
            user: req.user._id,
            _id: req.params.todoId
        })

        if (!todo) {
            return res.status(404).json({
                error: "Couldn't find todo!"
            })
        }

        const {isValid, errors} = validateTodoInput(req.body);

        if(!isValid) {
            return res.status(400).json(errors)
        }

        const updatedTodo = await Todo.findOneAndUpdate({
            user: req.user._id,
            _id: req.params.todoId
        }, {
            content: req.body.content
        }, {
            new: true
        })

        return res.json(updatedTodo);

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message)
    }
})

router.delete("/:todoId", requiresAuth, async (req, res) => {
    try {
        const todo = await Todo.findOne({
            user: req.user._id,
            _id: req.params.todoId
        })

        if (!todo) {
            return res.status(404).json({
                error: "Couldn't find todo!"
            })
        }

        await Todo.findOneAndRemove({
            user: req.user._id,
            _id: req.params.todoId
        })

        return res.json({success: true});

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message)
    }
})

module.exports = router;