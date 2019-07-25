import * as morgan from 'morgan'
import * as express from 'express'
import * as request from 'request-promise'
import * as requestDebug from 'request-debug'
import * as graphqlHTTP from 'express-graphql'

import { buildSchema } from 'graphql'

import {Pokemon} from "./pokemon/resolver";

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Type {
    name: String,
    slot: Int,
    moves: [Move]
  }
  
  type Move {
    name: String,
    power: Int
  }
  
  type Pokemon {
    name: String,
    weight: Int,
    types: [Type]
  }
  
  type Query {
    hello: String,
    getPokemon(id: Int): Pokemon,
  }
`);

const root = {
    hello() {
        return 'Hello world!'
    },
    getPokemon({id}) {
        return new Pokemon(id)
    },
};

const app = express();
const {
    PORT = 3000,
} = process.env;

app.use(morgan('tiny'));
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(PORT, () => {
    console.log('Running a GraphQL API server at localhost:' + PORT + '/graphql');
});

requestDebug(request, (type, data, r) => {
    if (type === 'request') {
        console.info(r.uri.href)
    }
})