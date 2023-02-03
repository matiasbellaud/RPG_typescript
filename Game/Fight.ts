import { Character } from "../Character/Character.ts"
import { Zombie,Skeleton,Slime,Orc,Arachnea} from "../Character/mob.ts";
import { Dragon,Gryphon,Minotaur,Basilisk } from "../Character/boss.ts";
import { Menu } from "./Menu.ts";
import { Objects } from "../Item/Object.ts";
import { GameManager } from "./gamemanager.ts";

export class Fight {

    private allyTeam  : Character[] = [];
    private ennemiTeam : Character[] = [];
    private characters : Character[] = [];

    constructor(pHeroTab : Character[]){
        this.allyTeam = pHeroTab;
    }

    initialize(objects: Objects[],ennemie? : Character, ): boolean | undefined {

        if (ennemie === undefined){
            const mob1 = this.mobClass();
            const mob2 = this.mobClass();
            const mob3 = this.mobClass();

            this.ennemiTeam = [mob1, mob2, mob3];
            this.characters.push(this.ennemiTeam[0]);
            this.characters.push(this.ennemiTeam[1]);
            this.characters.push(this.ennemiTeam[2]);
        }else {
            this.ennemiTeam = [ennemie];
            this.characters.push(this.ennemiTeam[0]);
        }

        this.characters.push(this.allyTeam[0]);
        this.characters.push(this.allyTeam[1]);
        this.characters.push(this.allyTeam[2]);
        
        this.roundList(this.characters);
        let order = ""
        for (let i = 0; i < this.characters.length-1; i++) {
            
            order += `${this.characters[i].name} ==> `
        }
        order += `${this.characters[this.characters.length-1].name}`
        console.log(order)
        GameManager.instance.sleep()
        const areAllyTeamDead = this.loopFight(objects)
        return areAllyTeamDead	
    }

    bossFight(objects: Objects[]) : boolean | undefined{
        const boss = this.bossClass();

        this.characters.push(this.allyTeam[0]);
        this.characters.push(this.allyTeam[1]);
        this.characters.push(this.allyTeam[2]);

        this.ennemiTeam = [boss];
        this.characters.push(this.ennemiTeam[0]);

        this.roundList(this.characters);
        let order = ""
        for (let i = 0; i < this.characters.length-1; i++) {
            
            order += `${this.characters[i].name} ==> `
        }
        order += `${this.characters[this.characters.length-1].name}`
        console.log(order)
        GameManager.instance.sleep()
        const areAllyTeamDead = this.loopFight(objects)
        return areAllyTeamDead

    }

    loopFight(object :Objects[]): boolean | undefined{
        const menu = new Menu(this.ennemiTeam, this.allyTeam, object);

        while(this.allyTeamDead() === undefined && this.ennemieTeamDead() === undefined){
            console.clear()
            console.log("New Turn")
            
            for(let iChar = 0; iChar < this.characters.length; iChar++) {
                if (this.allyTeamDead() === undefined && this.ennemieTeamDead() === undefined) {
                   
                    if (this.characters[iChar].status ==="alive" && this.characters[iChar] !== this.ennemiTeam[0] && this.characters[iChar] !== this.ennemiTeam[1] && this.characters[iChar] !== this.ennemiTeam[2]) {
                        menu.AskToPlayerAction(this.characters[iChar]);
                    
                    } else if(this.characters[iChar].status ==="alive")  {
                        const iq = Math.floor(Math.random() * 100)
    
                        if (iq > 80){
    
                            this.characters[iChar].hpHud(this.allyTeam,100)
    
                            this.characters[iChar].specialAttack(this.allyTeam[0],this.allyTeam)
                            
                        }else{
                            const heroNb =  Math.floor(Math.random() * 3)
                            this.characters[iChar].hpHud(this.allyTeam,100)
    
                            this.characters[iChar].specialAttack(this.allyTeam[heroNb],this.allyTeam)
                            
                        }
    
                    } else {
                        console.log(`${this.characters[iChar].name} is dead`);
                        GameManager.instance.sleep()
                    }
                    if (this.characters[iChar].poisoned === true && this.characters[iChar].status === "alive"){
                        this.characters[iChar].poisonDmg(3)
                    }
                    if (this.characters[iChar].ignited === true && this.characters[iChar].status === "alive"){
                        this.characters[iChar].fireDmg(10)
                    }
                } else if (this.allyTeamDead() === true){
                    console.log("All your team is dead ...")
                    return true
                } else {
                    console.log ("All the ennemies are dead !")
                    break
                }
            } 
        }
    }



    mobClass(): Character{
       
        let mob : Character = new Slime()//initalization de la variable
        const classNb =  Math.floor(Math.random() * 5)
        switch (classNb){
            case 0:
                mob = new Zombie();
                break
            case 1:
                mob = new Skeleton();
                break
            case 2:
                mob = new Slime();
                break
            case 3:
                mob = new Orc();
                break
            case 4:
                mob = new Arachnea();
                break

        }
    
        return mob                           
    }

    bossClass() : Character {
        let boss : Character = new Dragon()//initalization de la variable
        const classNb =  Math.floor(Math.random() * 4)
        
        
        switch (classNb){
            case 0:
                boss = new Dragon();
                break
            case 1:
                boss = new Gryphon();
                break
            case 2:
                boss = new Minotaur();
                break
            case 3:
                boss = new Basilisk();
                break
        }
        return boss                           
    }


    private roundList(pCharacters : Character[]){

        pCharacters.sort((a : Character, b : Character) => b.speed - a.speed);
        return pCharacters;
        
    }

    private hpList(pCharacters : Character[]){

        pCharacters.sort((a : Character, b : Character) => a.currentHp - b.currentHp);
        return pCharacters;
        
    }

    private allyTeamDead() : boolean | undefined {

        let allyDead = 0;
        for(let iAlly = 0; iAlly < this.allyTeam.length; iAlly++){

            if(this.allyTeam[iAlly].status === "dead"){
                allyDead++;

                if(allyDead === this.allyTeam.length){

                    return true;
                }
            }
        }
    }

    private ennemieTeamDead() : boolean | undefined {
        let enemiesDead = 0;
        for(let iEnemy = 0; iEnemy < this.ennemiTeam.length; iEnemy++){

            if(this.ennemiTeam[iEnemy].status === "dead"){
                enemiesDead++;


                if(enemiesDead === this.ennemiTeam.length){

                    return false;
                }
            }
        }
    }
}
