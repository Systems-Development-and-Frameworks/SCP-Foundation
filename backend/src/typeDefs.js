import { gql } from "apollo-server";


export const typeDefs = gql`
type Post {
  id: ID!
  title: String!
  votes: Int!
  author: User!
}

type User {
  id: ID!
  name: String!
  posts: [Post]
}

type Query {
  posts: [Post]
  users: [User]
}

type Mutation {
  write(post: PostInput!): Post
  delete(id: ID!): Post

  upvote(id: ID!, voter: UserInput!): Post

  # 🚀 OPTIONAL
  downvote(id: ID!, voter: UserInput!): Post
}

input PostInput {
  title: String!

  author: UserInput!
}

input UserInput {
  id: ID!
}
`;
