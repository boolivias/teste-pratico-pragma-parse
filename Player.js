export default class Player{
    constructor(id, name){
        this.id = id;
        this.name = name
        this.kill = 0
        this.oldNames = []
    }

    addKill(){
        this.kill++
    }

    subKill(){
        this.kill--
    }

    changeName(newName){
        this.oldNames.push(this.name)
        this.name = newName
        if (this.oldNameExist(newName))
            this.oldNames.splice(this.oldNames.indexOf(newName), 1)
    }

    oldNameExist(name){
        return this.oldNames.indexOf(name) !== -1
    }
}