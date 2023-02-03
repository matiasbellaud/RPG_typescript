import { Character } from "../Character/Character.ts";
import { Objects,Potion,BiteStar,HalfStar,Ether } from "../Item/Object.ts";
import { Knight,Mage,Paladin,Barbarian,Priest,Thief } from "../Character/hero.ts";
import { HostilRoom, TreasureRoom, BossRoom } from "./room.ts";



export class GameManager {
    private allyTeam : Character[]
    private objectList : Objects[]
    private static _instance : GameManager;
    public static get instance(){
        if(!GameManager._instance){
            GameManager._instance = new GameManager()
        }
        return GameManager._instance;
        }

    private constructor(){
        
        const hero1 = this.heroesClass()
        const hero2 = this.heroesClass()
        const hero3 = this.heroesClass()

        this.allyTeam = [hero1,hero2,hero3]

        const potion = new Potion()
        const biteStar = new BiteStar()
        const halfStar = new HalfStar()
        const ether = new Ether()

        this.objectList = [potion,biteStar,halfStar,ether]  
    }    

    initialize(){

        const hostileRoom = new HostilRoom(this.allyTeam)
        const tresureRoom = new TreasureRoom(this.allyTeam)
        const bossRoom = new BossRoom(this.allyTeam)

        // boucle des salles 
        
        let areAllyTeamDead : boolean | undefined
        hostileRoom.DisplayRoom(0)
        areAllyTeamDead = hostileRoom.hostilRoom(this.objectList)
        if (areAllyTeamDead !== true ){
            hostileRoom.DisplayRoom(1)
            areAllyTeamDead = tresureRoom.tresureRoom(this.objectList)
        }
        if (areAllyTeamDead !== true ){
            hostileRoom.DisplayRoom(2)
            areAllyTeamDead = hostileRoom.hostilRoom(this.objectList)
        }
        if (areAllyTeamDead !== true ){
            hostileRoom.DisplayRoom(3)
            areAllyTeamDead = tresureRoom.tresureRoom(this.objectList)
        }
        if (areAllyTeamDead !== true ){
            hostileRoom.DisplayRoom(4)
            areAllyTeamDead = bossRoom.bossRoom(this.objectList)
        }

        if (areAllyTeamDead === true){
            console.log("You loose, please retry ...")
            this.sleep()
        } else {
            console.log("\nYOU WIN !\nIt's the end of your journey ...")
            this.sleep()
        }
        //room.DisplayRoom()
    }

    heroesClass(): Character {
        console.clear()

        
        let classNb = 0
        let hero : Character = new Knight()//initalization de la variable

        console.log(" 1-Knight\n 2-Mage\n 3-Paladin\n 4-Barbarian\n 5-Priest\n 6-Thief\n")
        const classChoice = prompt("Choose a class --> " );
        if (classChoice != null) {
            if (classChoice >= "1" && classChoice <= "6") {
                classNb = parseInt(classChoice, 10);
                switch (classNb){
                    case 1:
                        hero = new Knight();
                        break
                    case 2:
                        hero = new Mage();
                        break
                    case 3:
                        hero = new Paladin();
                        break
                    case 4:
                        hero = new Barbarian();
                        break
                    case 5:
                        hero = new Priest();
                        break
                    case 6:
                        hero = new Thief();    
                        break
                }

            } else {
                console.error("Your input is wrong, please retry !");
                this.heroesClass();
            }
        } else {
            console.error("Your input is wrong, please retry !");
            this.heroesClass();
        }


        return hero;
    }

    sleep(){  
        const grey = "\x1b[90m"
        const reset = "\x1b[0m"
        const _past = prompt(`${grey}Press enter to continue...${reset}`)
    }   
}


GameManager.instance.initialize()
