// index.js
// This is the main entry point of our application
const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');

const port = process.env.PORT || 4000;

const typeDefs = gql`
    type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
    }
    type Mutation {
        newNote(content: String!): Note!
    }
    type Note{
        id: ID!
        content: String!
        author: String!
    }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world',
    notes: () => notes,
    note: (parent, args) => {
      return notes.find(note => note.id === args.id);
    }
  },
  Mutation: {
    newNote: (parent, args) => {
      let noteValue = {
        id: String(notes.length + 1),
        content: args.content,
        author: 'Adam scott'
      };
      notes.push(noteValue);
      return noteValue;
    }
  }

};

let notes = [
  {id: '1', content: 'This is a note', author: 'Adam Scott'},
  {id: '2', content: 'This is another note', author: 'Harlow Everly'},
  {id: '3', content: 'Oh hey look, another note', author: 'Riley Harrison'}
]

const app = express();

const server = new ApolloServer({typeDefs, resolvers});

server.applyMiddleware({app, path: '/api'});

app.listen(port, () => console.log(`Graphql Server running at http://localhost:${port}${server.graphqlPath}`))