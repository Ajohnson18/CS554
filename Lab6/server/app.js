const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");
const {
  upload,
  getCachedBinned,
  getCachedPosted,
  update,
  deleteImage,
} = require("./cache");

let unsplash_access_key = "znCiDLLAoWsSnjC-D7Pi1IpeH6G5urdi7ZsPO7bhEpk";
let unsplash_secret_key = "8JxkqTYCb5kA3bHhRjN9e4vT8YHMBvNZ-fGMmYnY6E0";

const typeDefs = gql`
  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }

  type Query {
    unsplashImages(pageNum: Int!): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }

  type Mutation {
    uploadImage(
      url: String!
      description: String
      posterName: String
    ): ImagePost
    updateImage(
      id: ID!
      url: String
      posterName: String
      description: String
      userPosted: Boolean
      binned: Boolean
    ): ImagePost
    deleteImage(id: ID!): ImagePost
  }
`;

const resolvers = {
  Query: {
    unsplashImages: async (_, args) => {
      let data = [];
      let finalRes = [];
      let res = await axios.get(
        `https://api.unsplash.com/photos/?client_id=${unsplash_access_key}&page=${args.pageNum}`
      );
      data = res.data;
      for (let i = 0; i < data.length; i++) {
        let d = await data[i];
        let newImagePost = {
          id: d.id,
          url: d.urls.regular,
          posterName: d.user.name,
          description: d.description ? d.description : d.alt_description,
          userPosted: false,
          binned: false,
        };
        finalRes.push(newImagePost);
      }
      return finalRes;
    },
    binnedImages: async () => {
      let res = await getCachedBinned();
      let data = [];
      if (!res) return [];
      for (let i = 0; i < res.length; i++) {
        let d = await res[i];
        let imagePost = {
          id: d.id,
          url: d.url,
          posterName: d.posterName,
          description: d.description,
          userPosted: d.userPosted,
          binned: d.binned,
        };
        data.push(imagePost);
      }
      return data;
    },
    userPostedImages: async () => {
      let res = await getCachedPosted();
      let data = [];
      if (!res) return [];
      for (let i = 0; i < res.length; i++) {
        let d = await res[i];
        let imagePost = {
          id: d.id,
          url: d.url,
          posterName: d.posterName,
          description: d.description,
          userPosted: d.userPosted,
          binned: d.binned,
        };
        data.push(imagePost);
      }
      return data;
    },
  },
  Mutation: {
    uploadImage: async (_, args) => {
      if (!args.description) args.description = null;
      if (!args.posterName) args.posterName = "";

      return await upload(args.url, args.description, args.posterName);
    },
    updateImage: async (_, args) => {
      if (!args.url) args.url = null;
      if (!args.description) args.description = null;
      if (!args.posterName) args.posterName = null;
      return await update(
        args.id,
        args.url,
        args.description,
        args.posterName,
        args.userPosted,
        args.binned
      );
    },
    deleteImage: async (_, args) => {
      return await deleteImage(args.id);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`Apollo server ready at ${url}`);
});
