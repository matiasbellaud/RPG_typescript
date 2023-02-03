import { GameManager } from "../Game/gamemanager.ts"
import { Objects } from "../Item/Object.ts";

export abstract class Character {
    name = "Character"
    physicalAttValue = 1
    shieldValue = 1
    magicalAttValue = 0
    speed = 1
    hpMax = 1
    currentHp = this.hpMax
    manaMax = 0
    currentMana = this.manaMax
    status = "alive"
    poisonous = false
    poisoned = false
    ignited = false
    cooldown = false //used for the boss attack
    moveset = ["Basic attack"]
    
    constructor(){}
    
    basicAttack(foe: Character){ //Define the dmg and call the doDmg method
    if (foe.shieldValue < this.physicalAttValue) {
        const dmg = this.physicalAttValue - foe.shieldValue
        if (foe.poisonous){
            this.poisoned = true
        }
        this.doDmg(foe,Math.round(dmg))
    } else {
        console.log(`${foe.name}'s shield is to high for this attack`)
        GameManager.instance.sleep()
    }
    
   }

   abstract specialAttack(foe: Character, ennemiTeam : Character[], allyTeam : Character[], object : Objects[]):void

   doDmg(foe: Character, incommeDmg : number){ //is called when an attack does dmg
    const red = "\x1b[91m"
    const green = "\x1b[92m"
    const reset = "\x1b[0m"
    if (foe.status === "dead"){
        console.log(`${foe.name} is already ${red}dead${reset}\n`)
    } else {
        foe.currentHp = Math.max(0, foe.currentHp-incommeDmg)
        if (foe.currentHp <= 0){
            foe.status = "dead"
            this.poisoned = false
            this.ignited = false
            console.log(`${foe.name} take ${red}${incommeDmg}${reset} fatal damage from ${this.name}, he now has ${red}0${reset} hp\n`)
            console.log(`${red}${foe.name} hp reach 0, he's now dead${reset} \n`)
            foe.poisoned = false
        } else {
            console.log(`${foe.name} take ${red}${incommeDmg}${reset} damage from ${this.name}, he now has ${green}${foe.currentHp}${reset} hp\n`)
        }
    }
    GameManager.instance.sleep()
   }

   heal(hero: Character, incommeHealPourcentage : number){
    const green = "\x1b[92m"
    const reset = "\x1b[0m"
    let heal = hero.hpMax*incommeHealPourcentage

    if (hero.currentHp+heal > hero.hpMax){
        heal = hero.hpMax - hero.currentHp
        hero.currentHp = hero.hpMax
    }else{
        hero.currentHp += heal
    }
    hero.currentHp = Math.min(hero.hpMax, hero.currentHp+heal)
    console.log(`${hero.name} heal ${green}${heal}${reset} hp, he now has ${green}${hero.currentHp}${reset} hp\n`)
    GameManager.instance.sleep()
   }

   revive(hero: Character){
    if(hero.status !== "alive"){
        hero.status = "alive"
        console.log(`${hero.name} has revive`)
    }
   }

   healingSpell(hero:Character) {
    if (this.currentMana <= 0) {
        console.log(`${this.name} no longer have mana`)
    } else {
        if (this.currentMana-15 >= 0){
            this.currentMana -= 15
            this.heal(hero,0.25)
            console.log(`${this.currentMana} mana remaining`)
        } else {
            console.log(`Not enough mana remaining`)

        }
    }
    GameManager.instance.sleep()
    }

    poisonDmg(poison : number){
        
        const red = "\x1b[91m"
        const reset = "\x1b[0m"
        const green = "\x1b[32m"
        this.currentHp -= poison
        console.log(`${this.name} take ${green}${poison}${reset} damage from  ${green}poison${reset}`)
        if (this.currentHp <= 0){
            this.currentHp = 0
            this.status = "dead"
            console.log(`${red}${this.name} hp reach 0, he's now dead${reset} \n`)
            
        }
        GameManager.instance.sleep()
    }

    fireDmg(fire : number){
        
        const red = "\x1b[91m"
        const reset = "\x1b[0m"
        this.currentHp -= fire-this.shieldValue*0.5
        console.log(`${this.name} take ${red}${fire}${reset} damage from  ${red}fire${reset}`)
        if (this.currentHp <= 0){
            this.currentHp = 0
            this.status = "dead"
            console.log(`${red}${this.name} hp reach 0, he's now dead${reset} \n`)
            
        }
        GameManager.instance.sleep()
    }

    
   manaRestore(hero: Character, incommeManaPourcentage : number){
    const blue = "\x1b[96m"
    const reset = "\x1b[0m"
    let mana = hero.manaMax*incommeManaPourcentage
    if (hero.currentMana+mana > hero.manaMax){
        mana = hero.manaMax - hero.currentMana
        hero.currentMana = hero.manaMax
    }else{
        hero.currentMana += mana
    }
    
    hero.currentMana = Math.min(hero.manaMax, hero.currentMana+mana)
    if (hero.manaMax === 0 ){
        console.log(`${hero.name} can't use mana`)
    } else {
        console.log(`${hero.name} restore ${blue}${mana}${reset} mana, he now has ${blue}${hero.currentHp}${reset} mana\n`)
    }
    GameManager.instance.sleep()
   }

    hpBar(lenght : number) : string{ //define the look of the bar
    const green = "\x1b[102m"
    const red = "\x1b[101m"
    const reset = "\x1b[0m"
    let bar = ""
    let lostBar =""
    const pvPourcent = (this.currentHp/this.hpMax)*lenght
    const lostPv = lenght - pvPourcent
    for (let i = 0; i < pvPourcent; i++) {
        bar = bar + " "

    }
    for (let i = 0; i < lostPv; i++) {
        lostBar = lostBar + " "

    }
    bar = (`${green}${bar}${reset}${red}${lostBar}${reset}\n`)
    return bar
   }

   hpHud(heroTeam : Character[],lenght :number){ //Print the hpbar of all character
    console.clear()
    
    console.log(heroTeam[0].name)
    console.log(heroTeam[0].hpBar(lenght))
    
    console.log(heroTeam[1].name)
    console.log(heroTeam[1].hpBar(lenght))
    
    console.log(heroTeam[2].name)
    console.log(heroTeam[2].hpBar(lenght))
    }

    sprite(hero : Character, ennemi : Character){
        const AsciiHero = Deno.readTextFileSync("./Ascii/"+hero.name+".txt")
        const AsciiEnnemi = Deno.readTextFileSync("./Ascii/"+ennemi.name+".txt")

        const splitHero = AsciiHero.split("\n")
        const splitEnnemi = AsciiEnnemi.split("\n")
        
        const blank = "             "

            for (let i = 0; i < splitHero.length; i++) {
                const replaceHero = splitHero[i].replace("\r",""); 
                const replaceEnnemi = splitEnnemi[i].replace("\r",""); 
            
                console.log(replaceHero+blank+replaceEnnemi)
                
            }
            
            GameManager.instance.sleep()
    }
}