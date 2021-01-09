import { createTestClient } from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server";
import Server from "../server";
import { GraphQLError } from "graphql";
import { context } from "../context"

jest.mock("../graphCms/schema");

let reqMock;
let resMock;
let query;
let mutate;
let contextMock = () => context({ req: reqMock, res: resMock });

beforeEach(async () => {
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
  describe("Post Query", () => {
    const postQuery = gql`
      query {
        posts {
          id
          title
          text
          voteResult
          author {
            id
            name
          }
        }
      }
    `;

    it("Lists all posts", async () => {
      let res = await query({ query: postQuery });
      
      expect(res.data).toEqual({
        posts: [
          {
            id: expect.any(String),
            title: "Post title",
            text: "Post text",
            voteResult: 12,
            author: {
              id: expect.any(String),
              name: "Günther",
            },
          },
          {
            id: expect.any(String),
            title: "Post title",
            text: "Post text",
            voteResult: 12,
            author: {
              id: expect.any(String),
              name: "Günther",
            },
          },
        ],
      });
    });

    describe("Post properties", () => {
      it("Returns all properties", async () => {
        let res = await query({ query: postQuery });

        // voteResult = 12 because votes returns 2 instances with value = 6 each
        expect(res.data).toEqual({
          posts: [
            {
              id: expect.any(String),
              title: "Post title",
              text: "Post text",
              voteResult: 12,
              author: {
                id: expect.any(String),
                name: "Günther",
              },
            },
            {
              id: expect.any(String),
              title: "Post title",
              text: "Post text",
              voteResult: 12,
              author: {
                id: expect.any(String),
                name: "Günther",
              },
            },
          ],
        });
      });

      it ("Does not return votes list", async () => {
        const postQueryLocal = gql`
          query {
            posts {
              id
              votes {
                value
              }
              author {
                id
                name
              }
            }
          }
        `;

        let res = await query({ query: postQueryLocal });

        // voteResult = 12 because votes returns 2 instances with value = 6 each
        expect(res.errors).toEqual([new GraphQLError("Cannot return null for non-nullable field Post.votes."),
          new GraphQLError("Cannot return null for non-nullable field Post.votes.")]);
      });
    });
  });

  describe("Person", () => {
    it("Return all properties of a person", async () => {
      const peopleQuery = gql`
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
      let res = await query({ query: peopleQuery });
      expect(res.data).toEqual({
        people: [
          {
            email: "günther.jauch@aol.de",
            name: "Günther",
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
            email: "günther.jauch@aol.de",
            name: "Günther",
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

  describe("Nested", () => {
    it("Returns name of author of posts of author of posts", async () => {
      const postQuery = gql`
        query {
          posts {
            id
            title
            author {
              id
              name
              posts {
                id
                title
                voteResult
                author {
                  id
                  name
                }
              }
            }
          }
        }
      `;

      let res = await query({ query: postQuery });
      expect(res.data).toEqual({
          posts: [
            {
              id: expect.any(String),
              title: "Post title",
              author: {
                id: expect.any(String),
                name: "Günther",
                posts: [
                  {
                    id: expect.any(String),
                    title: "Post title",
                    voteResult: 12,
                    author: {
                      id: expect.any(String),
                      name: "Günther",
                    }
                  },
                  {
                    id: expect.any(String),
                    title: "Post title",
                    voteResult: 12,
                    author: {
                      id: expect.any(String),
                      name: "Günther",
                    }
                  },
                ]
              },
            },
            {
              id: expect.any(String),
              title: "Post title",
              author: {
                id: expect.any(String),
                name: "Günther",
                posts: [
                  {
                    id: expect.any(String),
                    title: "Post title",
                    voteResult: 12,
                    author: {
                      id: expect.any(String),
                      name: "Günther",
                    }
                  },
                  {
                    id: expect.any(String),
                    title: "Post title",
                    voteResult: 12,
                    author: {
                      id: expect.any(String),
                      name: "Günther",
                    }
                  },
                ]
              },
            },
          ],
        });
    });

    it("Does not return votes", async () => {
      const personQuery = gql`
        query {
          people {
            id
            name
            posts {
              id
              title
              votes {
                id
                value
              }
            }
          }
        }
      `;

      let res = await query({ query: personQuery });
      expect(res.errors).toEqual([new GraphQLError("Cannot return null for non-nullable field Post.votes."),
      new GraphQLError("Cannot return null for non-nullable field Post.votes.")]);
    });
  });
});

describe("Mutations", () => {
  beforeEach(async () => {
    reqMock = { headers: {authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJQZXJzb25JZCIsImlhdCI6MTYxMDIzMzg2MH0.gVSO4ZeOnxTjZQoW1oaYJsoQHC21c9pH1kaQp516VU0"} };
    resMock = {};
  });
  describe("Write", () => {
    const writeMut = gql`
      mutation {
        write (data: {title: "Post title"}) {
          id
          title
          voteResult
          author {
            id
            name
            posts {
              id
            }
          }
        }
      }
    `;

    it("Creates a new post", async () => {
      let res = await mutate({ mutation: writeMut });

      console.log(res.errors)

      expect(res.data).toEqual({
        write: {
          id: expect.any(String),
          title: "Post title",
          voteResult: 12,
          author: {
            id: expect.any(String),
            name: "Günther",
            posts: [
              {
                id: expect.any(String),
              },
              {
                id: expect.any(String),
              },
            ],
          }
        }
      });
    })
  })

  describe("Delete", () => {
    const deleteMut = gql`
      mutation {
        delete (id: "ckjokcgf42fm50a49osudvspq"){
          id
          title
          voteResult
        }
      }
    `;

    it("Deletes a post", async () => {
      let res = await mutate({ mutation: deleteMut });
      expect(res.data).toEqual({
        delete: {
          id: expect.any(String),
          title: "Post title",
          voteResult: 12,
        }
      });
    })
  })

  describe("Signup", () => {
    it("Signs someone up successfully", async () => {
      const signupMut = gql`
        mutation {
          signup(name: "Peter", email: "mail@mail.de", password: "password")
        }
      `;
      let res = await mutate({ mutation: signupMut });
      expect(res.data).toEqual({signup: expect.any(String)});
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
