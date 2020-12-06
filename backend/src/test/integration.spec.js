import { gql } from "apollo-server";
import { createTestClient } from "apollo-server-testing";
import Server from "../server";
import { GraphQLError } from "graphql";
import { UserDatasource } from "../datasource/user-datasource";
import { PostDatasource } from "../datasource/post-datasource";
import { Post, Vote } from "../classes/post";
import { context } from "../context";

const udb = new UserDatasource();
const pdb = new PostDatasource(udb);
let reqMock;
let resMock;
const contextPipeline = () => context({ req: reqMock, res: resMock });
const server = new Server({
  dataSources: () => ({ udb, pdb }),
  context: contextPipeline,
});
const { query, mutate } = createTestClient(server);

describe("Queries", () => {
  beforeEach(() => {
    reqMock = { headers: {} };
    resMock = {};
    pdb.posts = [new Post(1, "Post 1", 1), new Post(2, "Post 2", 2)];

    pdb.posts[1].votes.push(new Vote(1, 1));
  });

  it("Lists all posts", async () => {
    const ALL_POSTS = gql`
      query {
        posts {
          id
          title
          author {
            id
            name
          }
        }
      }
    `;

    const res = await query({ query: ALL_POSTS });

    expect(res.data).toEqual({
      posts: [
        {
          id: "1",
          title: "Post 1",
          author: {
            id: "1",
            name: "Robert",
          },
        },
        {
          id: "2",
          title: "Post 2",
          author: {
            id: "2",
            name: "Youri",
          },
        },
      ],
    });
  });

  it("Lists all users", async () => {
    const ALL_USERS = gql`
      query {
        users {
          id
          name
          posts {
            id
            title
          }
        }
      }
    `;

    const res = await query({ query: ALL_USERS });

    expect(res.data).toEqual({
      users: [
        {
          id: "1",
          name: "Robert",
          posts: [
            {
              id: "1",
              title: "Post 1",
            },
          ],
        },
        {
          id: "2",
          name: "Youri",
          posts: [
            {
              id: "2",
              title: "Post 2",
            },
          ],
        },
      ],
    });
  });
});

describe("Mutations", () => {
  beforeEach(() => {
    pdb.posts = [new Post(1, "Post 1", 1), new Post(2, "Post 2", 2)];
    pdb.votePost(2, 1, 1);
    resMock = {};
  });

  describe("write", () => {
    const WRITE_MUT = gql`
      mutation {
        write(post: { title: "abc" }) {
          id
          title
          votes
          author {
            id
            name
            posts {
              title
            }
          }
        }
      }
    `;

    describe("unauthenticated", () => {
      beforeEach(() => {
        reqMock = { headers: {} };
      });

      it("Throws an authorization error", async () => {
        const res = await mutate({ mutation: WRITE_MUT });
        expect(res).toMatchObject({
          data: { write: null },
          errors: [new GraphQLError("Not Authorised!")],
        });
      });

      it("Does not add a post to the list", async () => {
        await mutate({ mutation: WRITE_MUT });
        expect(pdb.posts.length).toEqual(2);
      });
    });

    describe("authenticated", () => {
      beforeEach(() => {
        reqMock = {
          headers: {
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYwNzI3MTc5M30.Ua0NeHxqN6VUNU4ybRTHHbOQZGa_zw1nJdwDWhDa0TE",
          },
        };
      });

      it("Creates a post", async () => {
        const res = await mutate({ mutation: WRITE_MUT });
        expect(res.data).toEqual({
          write: {
            id: "3",
            title: "abc",
            votes: 0,
            author: {
              id: "1",
              name: "Robert",
              posts: [
                {
                  title: "Post 1",
                },
                {
                  title: "abc",
                },
              ],
            },
          },
        });
      });

      it("Adds a post to the list", async () => {
        await mutate({ mutation: WRITE_MUT });
        expect(pdb.posts.length).toEqual(3);
      });
    });
  });

  describe("delete", () => {
    const DELETE_MUT = gql`
      mutation {
        delete(id: 1) {
          id
          title
        }
      }
    `;

    describe("unauthenticated", () => {
      beforeEach(() => {
        reqMock = { headers: {} };
      });

      it("Throws an authorization error", async () => {
        const res = await mutate({ mutation: DELETE_MUT });
        expect(res).toMatchObject({
          data: { delete: null },
          errors: [new GraphQLError("Not Authorised!")],
        });
      });

      it("Does not delete a post to the list", async () => {
        await mutate({ mutation: DELETE_MUT });
        expect(pdb.posts.length).toEqual(2);
      });
    });
    describe("authenticated", () => {
      beforeEach(() => {
        reqMock = {
          headers: {
            authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYwNzI3MTc5M30.Ua0NeHxqN6VUNU4ybRTHHbOQZGa_zw1nJdwDWhDa0TE",
          },
        };
      });

      it("Deletes a post", async () => {
        const res = await mutate({ mutation: DELETE_MUT });
        expect(res.data).toEqual({
          delete: {
            id: "1",
            title: "Post 1",
          },
        });
      });

      it("Deletes a post from the list", async () => {
        await mutate({ mutation: DELETE_MUT });
        expect(pdb.posts.length).toEqual(1);
      });
    });
  });

  describe("upvote", () => {
    const UPVOTE_MUT = gql`
      mutation {
        upvote(id: 1) {
          id
          title
          votes
        }
      }
    `;
    describe("unauthenticated", () => {
      beforeEach(() => {
        reqMock = { headers: {} };
      });

      it("Throws an authorization error", async () => {
        const res = await mutate({ mutation: UPVOTE_MUT });
        expect(res).toMatchObject({
          data: { upvote: null },
          errors: [new GraphQLError("Not Authorised!")],
        });
      });
    });
    describe("authenticated", () => {
      beforeEach(() => {
        reqMock = {
          headers: {
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYwNzI3MTc5M30.Ua0NeHxqN6VUNU4ybRTHHbOQZGa_zw1nJdwDWhDa0TE",
          },
        };
      });

      it("Upvotes a post", async () => {
        const res = await mutate({ mutation: UPVOTE_MUT });
        expect(res.data).toEqual({
          upvote: {
            id: "1",
            title: "Post 1",
            votes: 1,
          },
        });
      });

      it("Upvotes a post only once per user", async () => {
        await query({ query: UPVOTE_MUT });
        const res = await mutate({ mutation: UPVOTE_MUT });
        expect(res.data).toEqual({
          upvote: {
            id: "1",
            title: "Post 1",
            votes: 1,
          },
        });
      });

      it("Upvotes twice with two different users", async () => {
        await mutate({ mutation: UPVOTE_MUT });
        reqMock = {
          headers: {
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTYwNzI3MTg2OH0.2gXaXBcWK_5s-_GeBazEX0BWKufVwx0AqVUb5Na42mw",
          },
        };
        const res = await mutate({ mutation: UPVOTE_MUT });
        expect(res.data).toEqual({
          upvote: {
            id: "1",
            title: "Post 1",
            votes: 2,
          },
        });
      });
    });
  });

  describe("downvote", () => {
    const DOWNVOTE_MUT = gql`
      mutation {
        downvote(id: 1) {
          id
          title
          votes
        }
      }
    `;

    describe("unauthenticated", () => {
      beforeEach(() => {
        reqMock = { headers: {} };
      });
    });
    describe("authenticated", () => {
      beforeEach(() => {
        reqMock = {
          headers: {
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYwNzI3MTc5M30.Ua0NeHxqN6VUNU4ybRTHHbOQZGa_zw1nJdwDWhDa0TE",
          },
        };
      });

      it("Downvotes a post", async () => {
        const res = await mutate({ mutation: DOWNVOTE_MUT });
        expect(res.data).toEqual({
          downvote: {
            id: "1",
            title: "Post 1",
            votes: -1,
          },
        });
      });

      it("Downvotes a post only once per user", async () => {
        await query({ query: DOWNVOTE_MUT });
        const res = await mutate({ mutation: DOWNVOTE_MUT });
        expect(res.data).toEqual({
          downvote: {
            id: "1",
            title: "Post 1",
            votes: -1,
          },
        });
      });

      it("Downvotes twice with two different users", async () => {
        await mutate({ mutation: DOWNVOTE_MUT });
        reqMock = {
          headers: {
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTYwNzI3MTg2OH0.2gXaXBcWK_5s-_GeBazEX0BWKufVwx0AqVUb5Na42mw",
          },
        };
        const res = await mutate({ mutation: DOWNVOTE_MUT });
        expect(res.data).toEqual({
          downvote: {
            id: "1",
            title: "Post 1",
            votes: -2,
          },
        });
      });
    });
  });

  describe("signup", () => {
    const SIGNUP_MUT =
      'mutation {signup(name:"Peter" email:"mail@mail.de" password:"password")}';
    it("Signs a new user up and returns JWT Token", async () => {
      const res = await mutate({ mutation: SIGNUP_MUT });
      expect(res.data).toMatchObject({
        signup: expect.any(String),
      });
    });

    it("Tries to sign up an existing user", async () => {
      await mutate({ mutation: SIGNUP_MUT });
      const res = await mutate({ mutation: SIGNUP_MUT });
      expect(res.data).toMatchObject({
        signup: "Email already exists. User not added.",
      });
    });
  });

  describe("login", () => {
    const CORRECT_LOGIN_MUT =
      'mutation login {login(email: "Robert@hTw.de" password: "password")}';
    const FALSE_LOGIN_MUT =
      'mutation login {login(email: "Robert@hTw.de" password: "garbage")}';

    it("Logs a user in and returns a JWT Token", async () => {
      await mutate({ mutation: CORRECT_LOGIN_MUT });
      const res = await mutate({ mutation: CORRECT_LOGIN_MUT });
      expect(res.data).toMatchObject({
        login: expect.any(String),
      });
    });

    it("Tries to sign up an existing user", async () => {
      await mutate({ mutation: FALSE_LOGIN_MUT });
      const res = await mutate({ mutation: FALSE_LOGIN_MUT });
      expect(res.data).toMatchObject({
        login: "User or Password incorrect",
      });
    });
  });
});

describe("Nested", () => {
  it("Requests nested queries", async () => {
    const ALL_POSTS_NESTED = gql`
      query {
        posts {
          title
          author {
            name
            posts {
              title
              author {
                name
                posts {
                  title
                  author {
                    name
                    # and so on
                  }
                }
                # and so on
              }
            }
          }
        }
      }
    `;
    const res = await query({ query: ALL_POSTS_NESTED });
    expect(res.data).toEqual({
      posts: [
        {
          title: "Post 1",
          author: {
            name: "Robert",
            posts: [
              {
                title: "Post 1",
                author: {
                  name: "Robert",
                  posts: [
                    {
                      title: "Post 1",
                      author: {
                        name: "Robert",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          title: "Post 2",
          author: {
            name: "Youri",
            posts: [
              {
                title: "Post 2",
                author: {
                  name: "Youri",
                  posts: [
                    {
                      title: "Post 2",
                      author: {
                        name: "Youri",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });
});
