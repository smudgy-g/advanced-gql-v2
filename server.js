const gql = require('graphql-tag');
const {ApolloServer} = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    username: String!
    createdAt: Int!
  }

  type Settings {
    user: User
    theme: String!
  }

  input NewSettingsInput {
    user: ID!
    theme: String!
  }

  type Query {
    me: User!
    settings(user: ID!): Settings!
  }

  type Mutation {
    settings(input: NewSettingsInput): Settings!
  }
`

const resolvers = {
  Query: {
    me() {
      return {
        id: '123486',
        username: 'smudgy',
        email: 's@mudgy.com',
        createdAt: '33185497531188'
      }
    },
    settings(_, {user}) {
      return {
        user,
        theme: 'Light'
      }
    }
  },
  Mutation: {
    settings(_, {input}) {
      return input
    }
  },
  // Resolver for relationship between Settigns and user
  Settings: {
    user(settings) {
      return {
        id: '123486',
        username: 'smudgy',
        createdAt: '33185497531188'
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({url}) => console.log(`Server live on ${url}`));