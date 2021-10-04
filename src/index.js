// index.js
// This is the main entry point of our application
const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
require('dotenv').config();

const db = require('./db');
const models = require('./models');

// .env 파일에 명시된 포트 또는 포트 4000에서 서버를 실행
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

// 그래프QL 스키마 언어로 스키마를 구성
const typeDefs = gql`
    type Note{
        id: ID!
        content: String!
        author: String!
    }
    
    type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
    }
    
    type Mutation {
        newNote(content: String!): Note!
    }
`;

// 스키마 필드를 위한 리졸버 함수 제공
const resolvers = {
  Query: {
    hello: () => 'Hello world',
    notes: async () => {
      return await models.Note.find();
    },
    note: async (parent, args) => {
      return await models.Note.findById(args.id);
    }
  },
  Mutation: {
    newNote: async (parent, args) => {
     return await models.Note.create({
       content: args.content,
       author: 'Adam Scott'
     })
    }
  }

};

const app = express();

db.connect(DB_HOST);

// 아폴로 서버 설정
const server = new ApolloServer({typeDefs, resolvers});

// 아폴로 그래프QL 미들웨어를 적용하고 경로를 /api로 설정
server.applyMiddleware({app, path: '/api'});

app.listen(port, () => console.log(`Graphql Server running at http://localhost:${port}${server.graphqlPath}`))