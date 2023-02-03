import { Character } from "../Character/Character.ts";
import { GameManager } from "../Game/gamemanager.ts";
import { Menu } from "../Game/Menu.ts";

export class Objects {
    name = ""
    heal = 0;
    healIfDead = 0;
    revive = false;
    magicPoint = 0;
    amount = 0;

    initialize():Objects[] {
        const potion = new Potion()
        const biteStar = new BiteStar()
        const halfStar = new HalfStar()
        const ether = new Ether()

        const objects = [potion,biteStar,halfStar,ether]
        return objects
    }

    useItem(hero: Character, menu : Menu){
        if (this.magicPoint === 0) {
            if (hero.currentHp === hero.hpMax) {
                console.log(`You can't heal ${hero.name}`)
                GameManager.instance.sleep()
                menu.AskToPlayerAction(hero);
            } else {
                if (hero.status === "alive"){
                    hero.heal(hero,this.heal)
                } else {
                    hero.heal(hero,this.healIfDead)
                }
            }
        } else {
            if (hero.manaMax === hero.currentMana || hero.manaMax === 0){
                console.log(`You can't restore mana of ${hero.name}`)
                GameManager.instance.sleep()
                menu.AskToPlayerAction(hero);
            } else {
                hero.manaRestore(hero,this.magicPoint)
            }
            
        }
    }

}

export class Potion extends Objects {

    constructor(){
        super();
        this.name = "potion";
        this.heal = 0.3;
        this.amount = 2;

    }
    
}

export class BiteStar extends Objects {
    constructor(){
        super();
        this.name = "biteStar";
        this.heal = 0.5;
        this.healIfDead = 0.2;
        this.revive = true;
        this.amount = 1;
    }
}

export class HalfStar extends Objects {
    constructor(){
        super();
        this.name = "halfStar";
        this.heal = 1;
        this.healIfDead = 1;
        this.revive = true ;
        this.amount = 0;
    }
}

export class Ether extends Objects {
    constructor(){
        super();
        this.name = "ethers";
        this.magicPoint = 0.5;
        this.amount = 1
    }
}

