import { Fight } from "./Fight.ts"

import { Mimic } from "../Character/mob.ts"
import { Objects } from "../Item/Object.ts"
import { Character } from "../Character/Character.ts"
import { GameManager } from "./gamemanager.ts";



export abstract class Room {

    allyTeam : Character[] = []

    DisplayRoom(index : number){
        console.clear()
        const asciiRoom = Deno.readTextFileSync("./Ascii/Map/floor 1.txt")
        const RRRoom = asciiRoom.split("ùù")
        
        const splitHero = RRRoom[index].split("\n")


            for (let i = 0; i < splitHero.length; i++) {
                const replaceHero = splitHero[i].replace("\r",""); 

            
                console.log(replaceHero)
                
            }
            
        GameManager.instance.sleep()
    }

    //demander si on veut ouvir le coffre
    static AskOpenChest():boolean{
        const openChest = prompt("Do you want to open this chest ? \n1 : Yes\n2 : No\nChoose --> " );
        if (openChest != null) {
            if (openChest === "1"  ){
                return true
            } else if (openChest === "2") {
                return false
            } else {
                console.error("Your input is wrong, please retry !\n");
                return this.AskOpenChest();
            }
        } else {
            console.error("Your input is wrong, please retry !\n");
            return this.AskOpenChest();
        }
    }
}

export class HostilRoom extends Room {

    constructor(allyTeam : Character[]){
        super();
        this.allyTeam = allyTeam
    }

    hostilRoom(objects : Objects[]): boolean|undefined{
        console.clear()
        console.log("Welcome to a hostile room, 3 ennemis attack you")
        GameManager.instance.sleep()
        const fight = new Fight(this.allyTeam)
        const areAllyTeamDead = fight.initialize(objects)  
        return areAllyTeamDead 
    }
}

export class TreasureRoom extends Room {

    constructor(allyTeam : Character[]){
        super();
        this.allyTeam = allyTeam
    }

    tresureRoom(objects : Objects[]): boolean|undefined{
        console.log("Welcome to a treasure room !")
        // demande si on veut l'ouvrir
        const playerChestChoice = Room.AskOpenChest()
        if (playerChestChoice === true ){
            // choisit un nombre entre 0 et 20
            const chanceOfChest =  Math.floor(Math.random() * 20)
            // 25% de chance d'avoir une mimic
            if (chanceOfChest <= 4){
                console.log("You have a bad luck today, a mimic wake up !")          
                const mimic = new Mimic()
                const fight = new Fight(this.allyTeam)
                const areAllyTeamDead = fight.initialize(objects, mimic)  
                return areAllyTeamDead
            // 75% de chance d'avoir un object
            } else {
                const indexObject =  Math.floor(Math.random() * 4)
                console.log(`you find a lost treasure in the chest, it's a ${objects[indexObject].name}.`)
                objects[indexObject].amount ++
                GameManager.instance.sleep()
            }
        }
    }
}

export class BossRoom extends Room {

    constructor(allyTeam : Character[]){
        super();
        this.allyTeam = allyTeam
    }

    bossRoom(objects : Objects[]){
        console.clear()
        console.log("Welcome to the boss room, good luck !")
        
        
        GameManager.instance.sleep()
        const fight = new Fight(this.allyTeam)
        const boss = fight.bossClass();
        const areAllyTeamDead = fight.initialize(objects,boss)  
        return areAllyTeamDead
    }
}