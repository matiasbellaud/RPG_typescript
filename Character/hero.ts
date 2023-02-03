import { Character} from "./Character.ts";
import { GameManager } from "../Game/gamemanager.ts";
import { Menu } from "../Game/Menu.ts";
import { Objects } from "../Item/Object.ts";

export class Knight extends Character{

    constructor(){
        super()
        this.name = "Knight"
        this.physicalAttValue = 27
        this.shieldValue = 8
        this.speed = 10
        this.hpMax = 60
        this.currentHp = this.hpMax
        this.moveset = ["Basic attack"]
        
    }
    specialAttack(foe: Character): void {
        this.basicAttack(foe)
    }
}

export class Mage extends Character{

    constructor(){
        super()
        this.name = "Mage"
        this.physicalAttValue = 11
        this.shieldValue = 6
        this.magicalAttValue = 28
        this.speed = 8
        this.hpMax = 60
        this.currentHp = this.hpMax
        this.manaMax = 100
        this.currentMana = this.manaMax
        this.moveset = ["Basic attack","Special attack"]
        
    }

    specialAttack(foe: Character,_ennemieTeam : Character[]){
        const blue = "\x1b[96m"
        const reset = "\x1b[0m"
        if (this.currentMana <= 0) {
            console.log(`${this.name} no longer have mana`)
            return 0
        } else {
            if (this.currentMana-15 >= 0){
                this.currentMana -= 15
                this.doDmg(foe,Math.round(this.magicalAttValue))
                
                GameManager.instance.sleep()
                console.log(`${blue}${this.currentMana}${reset} mana remaining`)
            } else {
                console.log(`Not enough mana remaining`)
            }
        }
        GameManager.instance.sleep()
    }

}

export class Paladin extends Character{
    
    constructor(){
        super()
        this.name = "Paladin"
        this.physicalAttValue = 25
        this.shieldValue = 7
        this.speed = 9
        this.hpMax = 65
        this.currentHp = this.hpMax
        this.moveset = ["Basic attack","Special attack"]
        
    }

    specialAttack(_foe: Character,ennemiTeam : Character[]): void {
        for (let i = 0; i < ennemiTeam.length; i++) {
            if (ennemiTeam[i].shieldValue < this.physicalAttValue*0.4) {
                const dmg = (this.physicalAttValue - ennemiTeam[i].shieldValue)*0.4
                this.doDmg(ennemiTeam[i],Math.round(dmg))
            } else {
                console.log(`${ennemiTeam[i].name}'s shield is to high for this attack`)
                GameManager.instance.sleep()
            }
        }
    }

}

export class Barbarian extends Character {

    constructor(){
        super()
        this.name = "Barbarian"
        this.physicalAttValue = 30
        this.shieldValue = 5
        this.speed = 11
        this.hpMax = 50
        this.currentHp = this.hpMax
        this.moveset = ["Basic attack","Special attack"]
        
    }

    specialAttack(foe: Character,_ennemieTeam : Character[]): void {
        if (foe.shieldValue < this.physicalAttValue) {
            const dmg = (this.physicalAttValue - foe.shieldValue)*1.3
            this.currentHp -= this.currentHp*0.2
            this.doDmg(foe,Math.round(dmg))
        } else {
            console.log(`${foe.name}'s shield is to high for this attack`)
            GameManager.instance.sleep()
        }
        
    }

}

export class Priest extends Character{

    constructor(){
        super()
        this.name = "Priest"
        this.physicalAttValue = 11
        this.shieldValue = 4
        this.magicalAttValue = 20
        this.speed = 1
        this.hpMax = 60
        this.currentHp = this.hpMax
        this.manaMax = 150
        this.currentMana = this.manaMax
        this.moveset = ["Basic attack","Special attack"]
        
    }

    specialAttack(_foe: Character,ennemieTeam : Character[], allyTeam : Character[],object : Objects[]): void {
        if (this.currentMana <= 0) {
            console.log(`${this.name} no longer have mana`)
        } else {
            if (this.currentMana-15 >= 0){
                const menu = new Menu(ennemieTeam,allyTeam,object)
                const hero = menu.askToPLayerAlly(this)
                this.currentMana -= 15
                this.heal(hero,0.25)
                console.log(`${this.currentMana} mana remaining`)
            } else {
                console.log(`Not enough mana remaining`)
    
            }
        }
        GameManager.instance.sleep()
    }

}

export class Thief extends Character{

    constructor(){
        super()
        this.name = "Thief"
        this.physicalAttValue = 20
        this.shieldValue = 7
        this.speed = 13
        this.hpMax = 50
        this.currentHp = this.hpMax
        this.moveset = ["Basic attack","Special attack"]
        
    }

    specialAttack(_foe: Character,_ennemieTeam : Character[],_allyTeam : Character[] ,object : Objects[]): void {
        const indexObject =  Math.floor(Math.random() * 4)
        console.log(`You stole a ${object[indexObject].name} from the ennemie.`)
        object[indexObject].amount ++
        GameManager.instance.sleep()
    }
}