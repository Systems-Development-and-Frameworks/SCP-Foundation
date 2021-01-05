import { createTestClient } from 'apollo-server-testing'
import { ApolloServer, gql } from 'apollo-server'
import Server from './server'

jest.mock('./graphCms/schema')

let query
let contextMock = () => context({ req: { headers: {} }, res: {} })

beforeEach(async () => {
    let contextMock = () => {}
    const server = await Server({ context: () => contextMock })
    const response = createTestClient(server)
    query = response.query
    console.log(query)
})

describe('Testing queries on GraphCMS', () => {

    describe('query: people', () => {

        const PEOPLE = gql`
        {
            person (where: {}){
                id
                name
            }
        }
        `
    
        it('returns array of people', async () => {
            let res = await query({ query: PEOPLE })
    
            expect(res.data).toEqual({
                person: { id : expect.any(String), name: "Hello World" },
            })
        }
        )
    })}
)
