const { registerUser } = require('../../../logic')

module.exports = (req, res, handleError) => {
    const { body: { fullname, email, password } } = req

    try {
        registerUser(fullname, email, password)
            .then((user) => res.status(201).json(user))
            .catch(handleError)
    } catch (error) {
        handleError(error)
    }
}