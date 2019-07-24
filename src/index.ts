import * as express from 'express'
import { buildSchema } from 'graphql'
import * as graphqlHTTP from 'express-graphql'
import * as request from 'request-promise'
import * as requestDebug from 'request-debug'
import * as morgan from 'morgan'

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type RandomDie {
    roll(numRolls: Int!): [Int],
    rollOnce: Int,
  }
  
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
    getDie(numSides: Int): RandomDie,
    getPokemon(id: Int): Pokemon,
  }
`);

class Pokemon {
    private readonly id: number

    constructor(id: number) {
        this.id = id
    }

    async name() {
        const options = {
            uri: `https://pokeapi.co/api/v2/pokemon/${this.id}/`,
            json: true,
        }
        return await request(options).then((body) => {
            return body.name
        })
    }

    async weight() {
        const options = {
            method: 'GET',
            uri: `https://pokeapi.co/api/v2/pokemon/${this.id}/`,
            json: true,
        }
        return await request(options).then((body) => {
            return body.weight
        })
    }

    async types() {
        const options = {
            method: 'GET',
            uri: `https://pokeapi.co/api/v2/pokemon/${this.id}/`,
            json: true,
        }
        return await request(options).then((body) => {
            return body.types.map(type => new Type(type.type.name, type.slot))
        })
    }
}

class Type {
    private readonly name: string
    private readonly slot: number

    constructor(name: string, slot: number) {
        this.name = name
        this.slot = slot
    }

    async moves() {
        const options = {
            method: 'GET',
            uri: `https://pokeapi.co/api/v2/type/${this.name}/`,
            json: true,
        }
        return await request(options).then((body) => {
            return body.moves.map(move => new Move(move.name))
        })
    }
}

class Move {
    private readonly name: string

    constructor(name: string) {
        this.name = name
    }

    async power() {
        const options = {
            method: 'GET',
            uri: `https://pokeapi.co/api/v2/move/${this.name}/`,
            json: true,
        }
        return await request(options).then((body) => {
            return body.power
        })
    }
}

class RandomDie {
    private readonly numSides: number

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
    hello() {
        return 'Hello world!'
    },
    getDie({numSides}) {
        return new RandomDie(numSides)
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