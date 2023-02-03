import { Character} from "./Character.ts";
import { GameManager } from "../Game/gamemanager.ts";

export class Dragon extends Character {


    constructor(){
        super();
        this.name = "Dragon";
        this.physicalAttValue = 30;
        this.shieldValue = 9;
        this.magicalAttValue = 0;
        this.manaMax = 0;
        this.speed = 12;
        this.hpMax = 170;
        this.currentHp = this.hpMax;
    }

    specialAttack(foe: Character): void {
        if (!this.cooldown) {
            this.cooldown = true
            foe.ignited = true
            foe.fireDmg(25)
        } else {
            this.cooldown = false
            this.basicAttack(foe)
        }
    }
}

export class Gryphon extends Character{


    constructor(){
        super();
        this.name = "Gryphon";
        this.physicalAttValue = 30;
        this.shieldValue = 5;
        this.magicalAttValue = 0;
        this.manaMax = 0;
        this.speed = 18;
        this.hpMax = 150;
        this.currentHp = this.hpMax;
    }

    specialAttack(foe: Character): void {
        if (!this.cooldown){
            this.cooldown = true
            this.shieldValue = 100
            console.log("The gryphon fly up in the sky and is now untouchable");
            GameManager.instance.sleep()
        } else {
            this.cooldown = false
            console.log("The gryphon swoop down");
            this.shieldValue = 5
            if (foe.shieldValue < this.physicalAttValue) {
                const dmg = (this.physicalAttValue - foe.shieldValue)*1.3
                this.currentHp -= this.currentHp*0.1
                this.doDmg(foe,Math.round(dmg))
            } else {
                console.log(`${foe.name}'s shield is to high for this attack`)
                GameManager.instance.sleep()
            }
           }
        }
        
}

export class Minotaur extends Character{


    constructor(){
        super();
        this.name = "Minotaur";
        this.physicalAttValue = 50;
        this.shieldValue = 5;
        this.magicalAttValue = 0;
        this.manaMax = 0;
        this.speed = 10;
        this.hpMax = 130;
        this.currentHp = this.hpMax;
    }

    specialAttack(foe: Character): void { //Modifier zone attaque
        this.basicAttack(foe)
    }
}

export class Basilisk extends Character {


    constructor(){
        super();
        this.name = "Basilisk";
        this.physicalAttValue = 10;
        this.shieldValue = 10;
        this.magicalAttValue = 0;
        this.manaMax = 0;
        this.speed = 14;
        this.hpMax = 130;
        this.poisonous = true
        this.currentHp = this.hpMax;
    }

    specialAttack(foe: Character): void {
        foe.poisoned = true
        this.basicAttack(foe)
        foe.poisonDmg(13)

    }
}
