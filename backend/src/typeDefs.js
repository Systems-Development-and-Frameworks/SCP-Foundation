import { gql } from "apollo-server";

export const typeDefs = gql`
  extend type Post {
    voteResult: Int!
  }

   

  type Query {
    people: [Person]
    posts: [Post]
  }

  type Mutation {
    write(data: PostInput!): Post
    delete(id: ID!): Post
    vote(postId: ID!, voteValue: Int!): Post

    """
    returns a signed JWT or null
    """
    login(email: String!, password: String!): String

    """
    returns a signed JWT or null
    """
    signup(name: String!, email: String!, password: String!): String
  }

  input PostInput {
    title: String!
  }
`;
