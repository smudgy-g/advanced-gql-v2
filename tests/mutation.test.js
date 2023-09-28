const gql = require('graphql-tag')
const createTestServer = require('./helper')
const CREATE_POST = gql`
  mutation {
    createPost(input: {message: "testing"}) {
      message
    }
  }
`

describe('mutations', () => {
  test('create a post', async () => {
    const {mutate} = createTestServer({
      user: {id: 1},
      models: {
        Post: {
          createOne() {
            return {
              message: "testing"
            }
          }
        },
      }
    })

    const res = await mutate({query: CREATE_POST})
    expect(res).toMatchSnapshot()
  })
})
