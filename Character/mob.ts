import { Character} from "./Character.ts";
import { GameManager } from "../Game/gamemanager.ts";

export class Zombie extends Character{


    constructor(){
        super()
        this.name = "Zombie"
        this.physicalAttValue = 21
        this.shieldValue = 2
        this.speed = 8
        this.hpMax = 75
        this.currentHp = this.hpMax
    }

    specialAttack(foe: Character): void {
        this.basicAttack(foe)
    }
}

export class Skeleton extends Character{

    constructor(){
        super()
        this.name = "Skeleton"
        this.physicalAttValue = 20
        this.shieldValue = 1
        this.speed = 10
        this.hpMax = 65
        this.currentHp = this.hpMax
    }
    specialAttack(foe: Character): void {
        
        this.basicAttack(foe)
    }

}

export class Slime extends Character{


    constructor(){
        super()
        this.name = "Slime"
        this.physicalAttValue = 13
        this.shieldValue = 1
        this.speed = 2
        this.hpMax = 50
        this.poisonous = true
        this.currentHp = this.hpMax
    }
    specialAttack(foe: Character): void {
        foe.poisoned = true
        this.basicAttack(foe)
    }

}

export class Orc extends Character{

    constructor(){
        super()
        this.name = "Orc"
        this.physicalAttValue = 21
        this.shieldValue = 6
        this.speed = 4
        this.hpMax = 100
        this.currentHp = this.hpMax
    }
    specialAttack(_foe: Character,ennemiTeam : Character[]): void {
        for (let i = 0; i < ennemiTeam.length; i++) {
            if (ennemiTeam[i].shieldValue < this.physicalAttValue*0.4) {
                const dmg = (this.physicalAttValue - ennemiTeam[i].shieldValue)*0.4
                this.doDmg(ennemiTeam[i],Math.round(dmg))
            } else {
                console.log(`${ennemiTeam[i].name}'s shield is to high for this attack`)
            }
        }
        GameManager.instance.sleep()
    }
}

export class Arachnea extends Character{


    constructor(){
        super()
        this.name = "Arachnea"
        this.physicalAttValue = 18
        this.shieldValue = 3
        this.speed = 10
        this.hpMax = 60
        this.poisonous = true
        this.currentHp = this.hpMax
    }   

    specialAttack(foe: Character): void {
        foe.poisoned = true
        this.basicAttack(foe)
    }
}

export class Mimic extends Character{
    constructor(){
        super()
        this.name = "Mimic"
        this.physicalAttValue = 13
        this.shieldValue = 1
        this.speed = 15
        this.hpMax = 55
        this.currentHp = this.hpMax
    }  
    specialAttack(foe: Character): void {
        this.basicAttack(foe)
    } 
}