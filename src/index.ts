import * as express from 'express'
import { buildSchema } from 'graphql'
const graphqlHTTP = require('express-graphql')

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String,
    random: Float!,
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
    hello() {
        return 'Hello world!'
    },
    random() {
        return Math.random()
    },
    rollDice({numDice, numSides}) {
        let rolls = []
        while (numDice--) {
            rolls.push(1 + Math.floor(Math.random() * numSides))
        }
        return rolls
    }
};

const app = express();
const {
    PORT = 3000,
} = process.env;

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(PORT, () => {
    console.log('Running a GraphQL API server at localhost:' + PORT + '/graphql');
});