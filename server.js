import { ApolloServer, gql } from "apollo-server";

let tweets = [
  { id: "1", text: "Sucks!", userId: "1" },
  { id: "2", text: "Fuck!", userId: "1" },
  { id: "3", text: "Shit!", userId: "2" },
];

let users = [
  {
    id: "1",
    firstName: "Sean",
    lastName: "Park",
  },
  { id: "2", firstName: "Elon", lastName: "Musk" },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Fullname is the sum of FirstName and LastName
    """
    fullName: String!
  }

  """
  Tweet Object represents a resource of a tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      if (users.find((user) => user.id === userId)) {
        const newTweet = {
          id: tweets.length + 1,
          text,
          userId,
        };

        tweets.push(newTweet);
        return newTweet;
      }

      throw new Error("userId must exist");
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) {
        return false;
      }
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`✅ Running on ${url} 🚀`);
});
