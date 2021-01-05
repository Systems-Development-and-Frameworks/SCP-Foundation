import { createTestClient } from 'apollo-server-testing'
import { ApolloServer, gql } from 'apollo-server'
import Server from './server'

jest.mock('./graphCms/schema')

//let query
//let contextMock = () => context({ req: { headers: {} }, res: {} })

// beforeEach(async () => {
    
//     const server = await Server(ApolloServer, { context: () => contextMock })
//     const { query, mutate } = createTestClient(server)
// })

describe('queries', () => {

    const PEOPLE = gql`
    {
        person (where: {}){
            id
            name
        }
    }
    `

    it('returns array of users', async () => {
        let contextMock = () => {}
        const server = await Server({ context: () => contextMock })
        const { query, mutate } = createTestClient(server)

        let res = await query({ query: PEOPLE })

        expect(res.data).toEqual({
            person: { id : expect.any(String), name: "Hello World" },
        })
    }
    )}
)
