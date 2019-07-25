import * as request from 'request-promise'
import {Type} from "../type/resolver";

export class Pokemon {
    private readonly id: number

    constructor(id: number) {
        this.id = id
    }

    async name() {
        const options = {
            uri: `https://pokeapi.co/api/v2/pokemon/${this.id}/`,
            json: true,
        }
        return request(options).then((body) => {
            return body.name
        })
    }

    async weight() {
        const options = {
            method: 'GET',
            uri: `https://pokeapi.co/api/v2/pokemon/${this.id}/`,
            json: true,
        }
        return request(options).then((body) => {
            return body.weight
        })
    }

    async types() {
        const options = {
            method: 'GET',
            uri: `https://pokeapi.co/api/v2/pokemon/${this.id}/`,
            json: true,
        }
        return request(options).then((body) => {
            return body.types.map(type => new Type(type.type.name, type.slot))
        })
    }
}
