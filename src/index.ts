import * as express from 'express'
import { buildSchema } from 'graphql'
const graphqlHTTP = require('express-graphql')

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type RandomDie {
    roll(numRolls: Int!): [Int],
    rollOnce: Int,
  }
  
  type Query {
    getDie(numSides: Int): RandomDie,
    hello: String,
    random: Float!,
  }
`);

// The root provides a resolver function for each API endpoint
class RandomDie {
    private readonly numSides: number;

    constructor(numSides: number) {
        this.numSides = numSides
    }

    rollOnce = () => 1 + Math.floor(Math.random() * this.numSides)

    roll({numRolls}) {
        let rolls = []
        while (numRolls--) {
            rolls.push(this.rollOnce())
        }
        return rolls
    }
}

const root = {
    getDie({numSides}) {
        return new RandomDie(numSides)
    },
    hello() {
        return 'Hello world!'
    },
    random() {
        return Math.random()
    },
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