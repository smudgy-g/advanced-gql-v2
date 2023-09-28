const { SchemaDirectiveVisitor } = require('apollo-server')
const { defaultFieldResolver, GraphQLString } = require('graphql')
const {formatDate} = require('./utils')

class FormatDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver
    const {format: defaultFormat} = this.args

    field.args.push({
      type: GraphQLString,
      name: 'format'
    })
    field.resolve = async (root, {format, ...rest}, context, info) => {
      const result = await resolver.call(this, root, rest, context, info)
      return formatDate(result, format || defaultFormat)
    }

    field.type = GraphQLString
  }
}

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver
    
    field.resolve = async (root, args, context, info) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      return resolver(root, args, context, info);
    }
  }
}


class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver
    const {role} = this.args
    field.resolve = async (root, args, context, info) => {
      if (!context.user.role !== role) {
        throw new AuthenticationError(`Incorrect role. Must be a ${role}.`)
      }
      return resolver(root, args, context, info)
    }
  }
}

module.exports = {FormatDateDirective, AuthorizationDirective, AuthenticationDirective}