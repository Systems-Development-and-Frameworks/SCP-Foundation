import { createTestClient } from 'apollo-server-testing'
import { ApolloServer, gql } from 'apollo-server'
import Server from './server'

jest.mock('./graphCms/schema')

const mocks = {
    Int: () => 6,
    Float: () => 22.1,
    String: () => 'Hello',
    Post: () => ({
      id: "post id",
      title: "title"
    }),
    Person: () => ({
      name:'Günther',
      id: "",
      email:"günther.jauch@aol.de"
    })
    };

let query
let contextMock = () => context({ req: { headers: {} }, res: {} })

beforeEach(async () => {
    let contextMock = () => {}
    const server = await Server({ context: () => contextMock, mocks })
    const response = createTestClient(server)
    query = response.query
    console.log(query)
})

describe('Testing queries on GraphCMS', () => {

    describe('query: people', () => {

        const PEOPLE = gql`
        query{
            posts {
                id
                title
                author{
                    id
                    name
                }
            }
        }
        `
    
        it('returns array of people', async () => {
            let res = await query({ query: PEOPLE })
            console.log(res)
    
            expect(res.data).toEqual({
                person: { id : expect.any(String), name: "Hello World" },
            })
        }
        )
    })}
)
