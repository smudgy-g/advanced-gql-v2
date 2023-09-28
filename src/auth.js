const jwt = require('jsonwebtoken')
const {models} = require('./db')
const secret = 'catpack'

/**
 * AUTHORISATION
 * Should not be coupled to a resolver,
 * Can provide fieldd level custom rules,
 * Can authorise some or your schema and not at all
 * 
 * AUTHENTICATION
 * Provides the user to resolvers,
 * Can protect some of your Schema and not all of it,
 * Can provide field level protection
 */

/**
 * Best way to auth is the when creating the context when creating the apollo server. 
 * Can access the context from within the resolver easily with out locking down the
 * whole server and setting up middleware to attach the auth token to request body.
 */

/**
 * takes a user object and creates  jwt out of it
 * using user.id and user.role
 * @param {Object} user the user to create a jwt for
 */
const createToken = ({id, role}) => jwt.sign({id, role }, secret)

/**
 * will attemp to verify a jwt and find a user in the
 * db associated with it. Catches any error and returns
 * a null user
 * @param {String} token jwt from client
 */
const getUserFromToken = token => {
  try {
    const user = jwt.verify(token, secret)
    return models.User.findOne({id: user.id})
  } catch (e) {
    return null
  }

}

/**
 * checks if the user is on the context object
 * continues to the next resolver if true
 * @param {Function} next next resolver function ro run
 */
const authenticated = next => (root, args, context, info) => {
  
}

/**
 * checks if the user on the context has the specified role.
 * continues to the next resolver if true
 * @param {String} role enum role to check for
 * @param {Function} next next resolver function to run
 */
const authorized = (role, next) => (root, args, context, info) => {
  
}

module.exports = {
  getUserFromToken,
  authenticated,
  authorized,
  createToken
}
