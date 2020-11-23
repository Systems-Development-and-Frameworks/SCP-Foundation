import { gql } from "apollo-server";
import { createTestClient } from "apollo-server-testing";
import Server from "../server";
import { UserDatasource } from "../datasource/user-datasource";
import { PostDatasource } from "../datasource/post-datasource";

const udb = new UserDatasource();
const pdb = new PostDatasource(udb);
const server = new Server({ dataSources: () => ({ udb, pdb }) });
const { query, mutate } = createTestClient(server);

// test("find user", async () => {
//   const FIND_USER = gql`
//     query {
//       findUser(id: "1") {
//         id
//         name
//       }
//     }
//   `;

//   const {
//     data: { findUser }
//   } = await query({ query: FIND_USER });

//   expect(findUser).toEqual({ id: "1", name: "Name1" });
// });

describe("Queries", () => {
  beforeEach(() => {
    pdb.posts = [
      {
        id: 1,
        title: "Post 1",
        votes: [],
        user_id: 1,
      },
      {
        id: 2,
        title: "Post 2",
        votes: [{ user_id: 1, value: 1 }],
        user_id: 2,
      },
    ];
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
    pdb.posts = [
      {
        id: 1,
        title: "Post 1",
        votes: [],
        user_id: 1,
      },
      {
        id: 2,
        title: "Post 2",
        votes: [{ user_id: 1, value: 1 }],
        user_id: 2,
      },
    ];
  });

  it("Creates a post", async () => {
    const WRITE_MUT = gql`
      mutation {
        write(post: { title: "abc", author: { id: 1 } }) {
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
    const WRITE_MUT = gql`
      mutation {
        write(post: { title: "abc", author: { id: 1 } }) {
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

    await mutate({ mutation: WRITE_MUT });
    expect(pdb.posts.length).toEqual(3);
  });

  it("Deletes a post", async () => {
    const DELETE_MUT = gql`
      mutation {
        delete(id: 1) {
          id
          title
        }
      }
    `;

    const res = await mutate({ mutation: DELETE_MUT });
    expect(res.data).toEqual({
      "delete": {
        "id": "1",
        "title": "Post 1"
      }
    });
  });

  it("Deletes a post from the list", async () => {
    const DELETE_MUT = gql`
      mutation {
        delete(id: 1) {
          id
          title
        }
      }
    `;

    await mutate({ mutation: DELETE_MUT });
    expect(pdb.posts.length).toEqual(1);
  });

  it("Upvotes a post", async () => {
    const UPVOTE_MUT = gql`
      mutation {
        upvote(id: 1, voter: { id: 1 }) {
          id
          title
          votes
        }
      }
    `;

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
    const UPVOTE_MUT = gql`
      mutation {
        upvote(id: 1, voter: { id: 1 }) {
          id
          title
          votes
        }
      }
    `;

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
    const UPVOTE_MUT1 = gql`
      mutation {
        upvote(id: 1, voter: { id: 1 }) {
          id
          title
          votes
        }
      }
    `;
    const UPVOTE_MUT2 = gql`
      mutation {
        upvote(id: 1, voter: { id: 2 }) {
          id
          title
          votes
        }
      }
    `;

    await mutate({ mutation: UPVOTE_MUT1 });
    const res = await mutate({ mutation: UPVOTE_MUT2 });
    expect(res.data).toEqual({
      upvote: {
        id: "1",
        title: "Post 1",
        votes: 2,
      },
    });
  });

  it("Downvotes a post", async () => {
    const DOWNVOTE_MUT = gql`
      mutation {
        downvote(id: 1, voter: { id: 1 }) {
          id
          title
          votes
        }
      }
    `;

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
    const DOWNVOTE_MUT = gql`
      mutation {
        downvote(id: 1, voter: { id: 1 }) {
          id
          title
          votes
        }
      }
    `;

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
    const DOWNVOTE_MUT1 = gql`
      mutation {
        downvote(id: 1, voter: { id: 1 }) {
          id
          title
          votes
        }
      }
    `;
    const DOWNVOTE_MUT2 = gql`
      mutation {
        downvote(id: 1, voter: { id: 2 }) {
          id
          title
          votes
        }
      }
    `;

    await mutate({ mutation: DOWNVOTE_MUT1 });
    const res = await mutate({ mutation: DOWNVOTE_MUT2 });
    expect(res.data).toEqual({
      downvote: {
        id: "1",
        title: "Post 1",
        votes: -2,
      },
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

// test("throw error if user is not found", async () => {
//   const FIND_USER = gql`
//     query {
//       findUser(id: "10") {
//         id
//         name
//       }
//     }
//   `;

//   const {
//     errors: [error]
//   } = await await query({ query: FIND_USER });

//   expect(error.message).toEqual("Not Found!");
// });

// test("delete user", async () => {
//   const DELETE_USER = gql`
//     mutation($id: ID!) {
//       deleteUser(id: $id)
//     }
//   `;

//   const {
//     data: { deleteUser }
//   } = await mutate({ mutation: DELETE_USER, variables: { id: "1" } });

//   expect(deleteUser).toBeTruthy();
// });

// test("can not delete user twice", async () => {
//   const DELETE_USER = gql`
//     mutation($id: ID!) {
//       deleteUser(id: $id)
//     }
//   `;

//   const {
//     data: { deleteUser }
//   } = await mutate({ mutation: DELETE_USER, variables: { id: "1" } });

//   expect(deleteUser).toBeFalsy();
// });
