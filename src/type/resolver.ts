import * as request from 'request-promise'
import {Move} from "../move/resolver";

export class Type {
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
        return request(options).then((body) => {
            return body.moves.map(move => new Move(move.name))
        })
    }
}
