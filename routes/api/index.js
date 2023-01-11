const { Router } = require('express')
const { jsonBodyParser } = require('app-middlewares')
const authCheck = require('../../session/auth-check');

const {
    handleRegisterUser,
    handleAuthenticateUser,
    handleRetrieveUser,
    handleSavePokemon,
    handleRetrievePokemon,
    handleRetrievePokemons,
    handleFindPokemons,
    handleAddToPokedex,
    handleDeletePokemonFromPokedex
} = require('./handlers')

const withErrorHandling = require('./helpers/with-error-handling')

const router = new Router()

// Users & Authentication
router.get('/api/users', [jsonBodyParser, authCheck], withErrorHandling(handleRetrieveUser))
router.post('/api/users', [jsonBodyParser], withErrorHandling(handleRegisterUser))
router.post('/api/sessions', jsonBodyParser, withErrorHandling(handleAuthenticateUser))

router.get('/api/users/:userId/pokemons', [jsonBodyParser, authCheck], withErrorHandling(handleRetrievePokemons))
router.post('/api/users/:userId/pokemons', [jsonBodyParser, authCheck], withErrorHandling(handleAddToPokedex))
router.delete('/api/users/:userId/pokemons', [jsonBodyParser, authCheck], withErrorHandling(handleDeletePokemonFromPokedex))

// Pokemons' realted endpoints
router.post('/api/pokemons', jsonBodyParser, withErrorHandling(handleSavePokemon))
router.get('/api/pokemons/:id', jsonBodyParser, withErrorHandling(handleRetrievePokemon))
router.get('/api/pokemons', jsonBodyParser, withErrorHandling(handleFindPokemons))

module.exports = router