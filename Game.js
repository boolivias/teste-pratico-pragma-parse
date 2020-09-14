import Player from "./Player.js"

export default class Game{
    constructor(idGame){
        this.id = idGame
        this.status = {
            totalKills : 0,
            players : []
        }
    }

    addKill(idPlayerKiller, idPlayerDead){
        this.status.totalKills++
        if (idPlayerKiller === 1022)
            this.status.players[ this.searchIndexPlayer(idPlayerDead) ].subKill()
        else
            this.status.players[ this.searchIndexPlayer(idPlayerKiller) ].addKill()
    }

    addPlayer(id, name){
        if( !this.indexPlayerExist(id) ){
            let p = new Player(id, name)
            this.status.players.push(p)
        }
    }

    changeNamePlayer(id, newName){
        let index = this.searchIndexPlayer(id)
        this.status.players[ index ].changeName(newName)
    }

    indexPlayerExist(id){
        return this.status.players.findIndex( i => i.id === id) !== -1
    }

    searchIndexPlayer(idPlayer){
        let index = 0
        for (const p of this.status.players) {
            if( p.id === idPlayer )
                return index

            index++
        }
    }
}