const gql = require('graphql-tag');
const {ApolloServer, PubSub} = require('apollo-server');

// publish subscribe protocol
const pubSub = new PubSub();
const NEW_ITEM_EVENT = 'NEW_ITEM';

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

  type Item {
    task: String!
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
    createItem(task: String!): Item!
  }

  type Subscription {
    newItem: Item!
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
    },
    createItem(_, {task}) {
      const item = {task};
      pubSub.publish(NEW_ITEM_EVENT, {newItem: item});
      return item;
    }
  },

  Subscription: {
    newItem: {
      subscribe: () => pubSub.asyncIterator(NEW_ITEM_EVENT)
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
  resolvers,
  context({connection}) {
    if (connection) {
      return {...connection.context}
    }
  },
  subscriptions: {
    onConnect(params) {
      
    }
  }
});

server.listen().then(({url}) => console.log(`Server live on ${url}`));