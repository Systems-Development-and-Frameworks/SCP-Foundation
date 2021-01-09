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

  describe("Person", () => {
    it("Return all properties of a person", async () => {
      const postQuery = gql`
        query {
          people {
            name
            email
            posts {
              id
            }
          }
        }
      `;
      let res = await query({ query: postQuery });
      expect(res.data).toEqual({
        people: [
          {
            email: expect.any(String),
            name: expect.any(String),
            posts: [
              {
                id: expect.any(String),
              },
              {
                id: expect.any(String),
              },
            ],
          },
          {
            email: expect.any(String),
            name: expect.any(String),
            posts: [
              {
                id: expect.any(String),
              },
              {
                id: expect.any(String),
              },
            ],
          },
        ],
      });
    });
  });
});

describe("Mutations", () => {
  //TODO: NOT functional yet
  describe("Signup", () => {
    it("Signs someone up successfully", async () => {
      const signupMut = gql`
        mutation {
          signup(name: "Peter", email: "mail@mail.de", password: "password")
        }
      `;
      let res = await mutate({ mutation: signupMut });
      expect(res.data).toEqual({
        //signup: expect.any(String)
      });
    });

    it("tries to register existing user", async () => {
      const signupMut = gql`
        mutation {
          signup(
            name: "Peter"
            email: "günther.jauch@aol.de"
            password: "password"
          )
        }
      `;
      let res = await mutate({ mutation: signupMut });
      expect(res.data).toEqual({
        signup: "Email already signed up.",
      });
    });

    it("Provides invalid password error", async () => {
      const signupMut = gql`
        mutation {
          signup(name: "Peter", email: "mail@mail.de", password: "pass")
        }
      `;
      let res = await mutate({ mutation: signupMut });
      expect(res.data).toEqual({
        signup: "Password invalid. Choose another password.",
      });
    });
  });
  //TODO: NOT functional yet
  describe("Login", () => {
    it("Signs someone in successfully", async () => {
      const loginMut = gql`
        mutation login {
          login(email: "günther.jauch@aol.de", password: "password")
        }
      `;
      let res = await mutate({ mutation: loginMut });
      expect(res.data).toEqual({
        login: expect.any(String),
      });
    });
    it("fails to sign in", async () => {
      const loginMut = gql`
        mutation login {
          login(email: "günther.jauch@aol.de", password: "password123")
        }
      `;
      let res = await mutate({ mutation: loginMut });
      expect(res.data).toEqual({
        login: "User or Password incorrect",
      });
    });
  });
});
