import { createTestClient } from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server";
import Server from "../server";

jest.mock("../graphCms/schema");

let reqMock;
let resMock;
let query;
let mutate;
let contextMock = () => context({ req: reqMock, res: resMock });

beforeEach(async () => {
  let contextMock = () => {};
  const server = await Server({ context: () => contextMock });
  const response = createTestClient(server);
  query = response.query;
  mutate = response.mutate;
});

describe("Testing queries on GraphCMS", () => {
  beforeEach(async () => {
    reqMock = { headers: {} };
    resMock = {};
  });
  describe("Post", () => {
    describe("Returns all properties of a Post", () => {
      const postQuery = gql`
        query {
          posts {
            title
            id
            voteResult
            author {
              id
              name
            }
          }
        }
      `;

      it("returns array of posts", async () => {
        let res = await query({ query: postQuery });
        console.log(res.data)
        expect(res.data).toEqual({
          posts: [
            {
              id: expect.any(String),
              title: expect.any(String),
              voteResult: expect.any(Number),
              author: {
                id: expect.any(String),
                name: expect.any(String),
              },
            },
            {
              id: expect.any(String),
              title: expect.any(String),
              voteResult: expect.any(Number),
              author: {
                id: expect.any(String),
                name: expect.any(String),
              },
            },
          ],
        });
      });
    });
  });
});

describe("Mutations", () => {
    //TODO: NOT functional yet
  describe("Signup", () => {
    const signupMut = gql`
      mutation {
        signup(name: "Peter", email: "mail@mail.de", password: "password")
      }
    `;
    it("signs someone up", async () => {
        let res = await mutate({ mutation: signupMut });
        console.log(res);
        expect(res.data).toEqual({})
    });
  });
  //TODO: NOT functional yet
  describe("Login", () => {
    const loginMut = gql`
    mutation login {login(email: "günther.jauch@aol.de" password: "password")}
    `;
    it("signs someone up", async () => {
        let res = await mutate({ mutation: loginMut });
        console.log(res);
        expect(res.data).toEqual({})
    });
  });
});
