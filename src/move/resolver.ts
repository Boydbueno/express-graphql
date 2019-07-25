import * as request from 'request-promise'

export class Move {
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
        return request(options).then((body) => {
            return body.power
        });
    }
}
