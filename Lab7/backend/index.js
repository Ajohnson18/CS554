const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");

const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

const md5 = require("blueimp-md5");
const publickey = "6b3f436d9d8ec1a1a85bb491e5b87307";
const privatekey = "985d0f8fde921244891bcc58def81a4ba96dc802";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const typeDefs = gql`
  type Response {
    data: String!
  }

  type Query {
    getCharactersList(pageNum: Int!): Response
    getCharacter(id: String!): Response
    getSeriesList(pageNum: Int!): Response
    getSerie(id: String!): Response
    getComicsList(pageNum: Int!): Response
    getComic(id: String!): Response
  }
`;

const resolvers = {
  Query: {
    getCharactersList: async (_, args) => {
      let storageKey = "characters" + args.pageNum;
      let exists = await client.existsAsync(storageKey);

      if (exists == 1) {
        let data = await client.getAsync(storageKey);
        return { data: data };
      }

      const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";
      const url =
        baseUrl +
        "?ts=" +
        ts +
        "&apikey=" +
        publickey +
        "&hash=" +
        hash +
        "&offset=";
      let res = await axios.get(url + parseInt(args.pageNum) * 20);
      let obj = { data: JSON.stringify(res.data.data) };
      await client.setAsync(storageKey, JSON.stringify(res.data.data));
      return obj;
    },
    getCharacter: async (_, args) => {
      let storageKey = "character" + args.id;
      let exists = await client.existsAsync(storageKey);

      if (exists == 1) {
        let data = await client.getAsync(storageKey);
        return { data: data };
      }

      const baseUrl = "https://gateway.marvel.com:443/v1/public/characters/";
      const url =
        baseUrl +
        args.id +
        "?ts=" +
        ts +
        "&apikey=" +
        publickey +
        "&hash=" +
        hash;
      let res = await axios.get(url);
      let obj = { data: JSON.stringify(res.data.data) };
      await client.setAsync(storageKey, JSON.stringify(res.data.data));
      return obj;
    },
    getSeriesList: async (_, args) => {
      let storageKey = "series" + args.pageNum;
      let exists = await client.existsAsync(storageKey);

      if (exists == 1) {
        let data = await client.getAsync(storageKey);
        return { data: data };
      }

      const baseUrl = "https://gateway.marvel.com:443/v1/public/series";
      const url =
        baseUrl +
        "?ts=" +
        ts +
        "&apikey=" +
        publickey +
        "&hash=" +
        hash +
        "&offset=";
      let res = await axios.get(url + parseInt(args.pageNum) * 20);
      let obj = { data: JSON.stringify(res.data.data) };
      await client.setAsync(storageKey, JSON.stringify(res.data.data));
      return obj;
    },
    getSerie: async (_, args) => {
      let storageKey = "serie" + args.id;
      let exists = await client.existsAsync(storageKey);

      if (exists == 1) {
        let data = await client.getAsync(storageKey);
        return { data: data };
      }

      const baseUrl = "https://gateway.marvel.com:443/v1/public/series/";
      const url =
        baseUrl +
        args.id +
        "?ts=" +
        ts +
        "&apikey=" +
        publickey +
        "&hash=" +
        hash;
      let res = await axios.get(url);
      let obj = { data: JSON.stringify(res.data.data) };
      await client.setAsync(storageKey, JSON.stringify(res.data.data));
      return obj;
    },
    getComicsList: async (_, args) => {
      let storageKey = "comics" + args.pageNum;
      let exists = await client.existsAsync(storageKey);

      if (exists == 1) {
        let data = await client.getAsync(storageKey);
        return { data: data };
      }

      const baseUrl = "https://gateway.marvel.com:443/v1/public/comics";
      const url =
        baseUrl +
        "?ts=" +
        ts +
        "&apikey=" +
        publickey +
        "&hash=" +
        hash +
        "&offset=";
      let res = await axios.get(url + parseInt(args.pageNum) * 20);
      let obj = { data: JSON.stringify(res.data.data) };
      await client.setAsync(storageKey, JSON.stringify(res.data.data));
      return obj;
    },
    getComic: async (_, args) => {
      let storageKey = "serie" + args.id;
      let exists = await client.existsAsync(storageKey);

      if (exists == 1) {
        let data = await client.getAsync(storageKey);
        return { data: data };
      }

      const baseUrl = "https://gateway.marvel.com:443/v1/public/comics/";
      const url =
        baseUrl +
        args.id +
        "?ts=" +
        ts +
        "&apikey=" +
        publickey +
        "&hash=" +
        hash;
      let res = await axios.get(url);
      let obj = { data: JSON.stringify(res.data.data) };
      await client.setAsync(storageKey, JSON.stringify(res.data.data));
      return obj;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`Apollo server ready at ${url}`);
});
