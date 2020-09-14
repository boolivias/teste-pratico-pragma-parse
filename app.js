const Game = require('./Game.js')
const fs = require('fs')


function endText(text){
    return text.search(/([A-Z]+)\w+:/) === -1
}

function getNextEventInfos(text){
    let indexStart = text.search(/([A-Z]+)\w+:/)
    let indexEnd = text.indexOf(':',indexStart)
    let event = text.slice(indexStart, indexEnd)
    text = text.slice(indexEnd+2) //indexEnd faz com que pule o ': ' após o nome do evento
    let obj = {
        indexEnd : indexEnd,
        event : event,
        date : {}
    };
    switch(event){
        case 'ClientConnect':
            let objPlayerInfos = getNextEventInfos(text) //Os dados do client esta na proxima linha ou "evento"
            obj.date = objPlayerInfos.date
            obj.indexEnd += objPlayerInfos.indexEnd
            break

        case 'ClientUserinfoChanged':
            let idPlayer = text.slice(0 , text.indexOf('n\\'))
            let namePlayer = text.slice(text.indexOf('\\')+1, text.indexOf('\\t'))
            obj.date = {
                idPlayer : parseInt(idPlayer),
                namePlayer : namePlayer
            }
            break
        
        case 'Kill':
            let idKiller = text.slice(0, text.indexOf(' '))
            text = text.slice(idKiller.length+1)
            let idDead = text.slice(0, text.indexOf(' '))
            obj.date = {
                idKiller : parseInt(idKiller),
                idDead : parseInt(idDead)
            };
            break

        default:
            break
    }
    return obj
}

function getTextFile(url){
    let textFile = fs.readFileSync(url, {encoding: 'utf-8', flag: 'r'})
    /* new XMLHttpRequest()
    requestFile.open('GET', url, false)
    requestFile.onreadystatechange = () => {
        if( requestFile.readyState ===  4 ){
            if( requestFile.status===200 )
            {
                text = requestFile.responseText
            }
        }
    }
    requestFile.send() */
    return textFile
}

//main
var totalGames = 0
var games = []

var response = getTextFile('./Quake.txt')
for(let index = 0; !endText(response.substr(index));){
    let object = getNextEventInfos(response.substr(index))
    index += object.indexEnd
    switch(object.event){
        case 'InitGame':
            games.push(new Game(totalGames+1))
            break
        
        case 'ClientConnect':
            games[totalGames].addPlayer(object.date.idPlayer, object.date.namePlayer)
            break

        case 'ClientUserinfoChanged':
            games[totalGames].changeNamePlayer(object.date.idPlayer, object.date.namePlayer)
            break
        
        case 'Kill':
            games[totalGames].addKill(object.date.idKiller, object.date.idDead)
            break
        
        case 'ShutdownGame':
            totalGames++
            break
    }
}

console.log( JSON.stringify(games, null, 4) )