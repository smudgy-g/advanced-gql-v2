const {ApolloServer, AuthenticationError} = require('apollo-server')
const typeDefs = require('./typedefs')
const resolvers = require('./resolvers')
const {FormatDateDirective, AuthenticationDirective, AuthorizationDirective} = require('./directives')
const {createToken, getUserFromToken} = require('./auth')
const db = require('./db')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    formatDate: FormatDateDirective,
    authenticated: AuthenticationDirective, 
    authorized: AuthorizationDirective
  },
  formatError(error) {
    // ability to format errors or create owwn error classes
    if (error instanceof AuthenticationError) {
      return error.message
    }
  },
  context({req, connection}) {
    const context = {...db}
    if (connection) {
      // connection.context is whatever is return from the onConnect in the subscription
      return {...context, ...connection.context} 
    }
    const token = req.headers.authorization
    const user = getUserFromToken(token)
    return {...db, user, createToken}
  },
  subscriptions: {
    onConnect(connectionParams) {
      const token = connectionParams.authToken
      const user = getUserFromToken(token)
      if (!user) throw new Error('Nope')
      return {user}
    }
  }
})

server.listen(4000).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`)
})
