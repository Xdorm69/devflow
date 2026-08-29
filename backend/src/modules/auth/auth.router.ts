import express from 'express'

const authRouter = express.Router()

authRouter.post('/register', (req, res) => {
    res.send('Register')
})

authRouter.post('/login', (req, res) => {
    res.send('Login')
})

authRouter.post('/logout', (req, res) => {
    res.send('Logout')
})

authRouter.get('/:id', (req, res) => {
    res.send('Me')
})

authRouter.patch('/:id', (req, res) => {
    res.send('Update')
})

authRouter.delete('/:id', (req, res) => {
    res.send('Delete')
})

export default authRouter