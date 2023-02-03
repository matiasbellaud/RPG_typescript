import { Character } from "../Character/Character.ts";
import { GameManager } from "./gamemanager.ts";
import { Objects } from "../Item/Object.ts";


export class Menu {
    ennemiTeam : Character[];
    allyTeam : Character[];
    object : Objects[];


    constructor(ennemiTeam: Character[], allyTeam : Character[], object: Objects[]){
        this.ennemiTeam = ennemiTeam;
        this.allyTeam = allyTeam;
        this.object = object;
    }

    // méthode pour attaquer en fonction de l'attaque choisit
    whichAttack(hero : Character, ennemi : Character, attack : string){
        if (attack === "Basic attack"){
            hero.basicAttack(ennemi)
        } else if (attack === "Special attack"){
            hero.specialAttack(ennemi,this.ennemiTeam,this.allyTeam,this.object)
        }
        hero.sprite(hero,ennemi)
    }

    // affiche et permet de choisir les attaques du perso
    attackList(hero : Character){
        hero.hpHud(this.allyTeam,100)
        console.log(`Action possible for ${hero.name}:`)

        //affiche le moveset
        for (let i=1; i<=hero.moveset.length;i++){
            console.log(`${i} - ${hero.moveset[i-1]}`);
        }
        
        // choix du joueur
        const action = prompt("Which one do you want to do ? : " );
        if (action != null) {
            let attack = parseInt(action, 10)
            if (attack < 1 || attack > hero.moveset.length) {
                console.error("Your input is wrong, please retry !\n");
                GameManager.instance.sleep()
                this.attackList(hero);
            } else {
                attack -= 1
                if (hero.name === "Priest" && attack === 1) {
                    this.whichAttack(hero,this.ennemiTeam[0],hero.moveset[attack])
                } else {
                    this.AskToPlayerEnnemi(hero,hero.moveset[attack]) 
                }     
            }
        } else {
            console.error("Your input is wrong, please retry !\n" );
            GameManager.instance.sleep()
            this.AskToPlayerAction(hero);
        }
    }

    // choix de l'action
    AskToPlayerAction(hero : Character) {
        hero.hpHud(this.allyTeam,100)
        console.log(`It's ${hero.name} turn :`)
        const action = prompt(" 1- Attack\n 2- Use object\nWhat action do you want to do ? --> " );
        
        if (action != null) {
            if (action !== "1" && action !== "2") {
                console.error("Your input is wrong, please retry !\n");
                this.AskToPlayerAction(hero);
            }
        } else {
            console.error("Your input is wrong, please retry !\n" );
            this.AskToPlayerAction(hero);
        }
        if (action === "1"){
            this.attackList(hero);
        } else if (action === "2"){
            this.AskToPlayerObject(hero,this.object)
        }
        
    }


    AskToPlayerEnnemi(hero : Character, attack : string) {
        hero.hpHud(this.allyTeam,100)

        // pour l'attaque de zone ... pas de choix a faire
        if (attack === "Zone attack") {
            this.whichAttack(hero,this.ennemiTeam[0],attack)
        } else {
            // fait apparaitre la liste des ennemies vivant et leur hp bar
            console.log(`Ennemi possible to attack :`)
            const listEnnemiAlive = [];
            for (let i = 0; i < this.ennemiTeam.length; i++) {
                if (this.ennemiTeam[i].status === "alive"){
                    listEnnemiAlive.push(this.ennemiTeam[i].name)
                    console.log(`${listEnnemiAlive.length} - ${this.ennemiTeam[i].name} ${this.ennemiTeam[i].hpBar(20)}`)
                }
            }

            // choix de l'ennemie
            const ennemi = prompt("What ennemi do you want to attaque ? --> " );
            if (ennemi != null) {
                const ennemiN = parseInt(ennemi, 10)
                // vérification si le choix est bon
                if (ennemiN >= 1  && ennemiN <= listEnnemiAlive.length) { 
                    let ennemiAttacked = false
                    // boucle pour taper un ennemie qui est vivant et non un mort
                    for (let i = ennemiN; i <= this.ennemiTeam.length; i++){
                        if (this.ennemiTeam[i-1].status === "alive" && ennemiAttacked === false){
                            this.whichAttack(hero,this.ennemiTeam[i-1],attack)
                            ennemiAttacked = true
                        }
                    }   
                } else {
                    console.error("Your input is wrong, please retry !\n");
                    this.AskToPlayerEnnemi(hero,attack);
                }
            } else {
                console.error("Your input is wrong, please retry !\n");
                this.AskToPlayerEnnemi(hero,attack);
            }
        }
    }

    useItem(heroWhoPlay : Character, heroToHeal : Character, object : Objects){
        heroWhoPlay.hpHud(this.allyTeam,100)
        
        // si ce n'est pas l'ether
        if (object.magicPoint === 0) {
            // si le héro est vivant et pas avec son max hp
            if (heroToHeal.status === "alive" && heroToHeal.currentHp < heroToHeal.hpMax ) {
                heroToHeal.heal(heroToHeal,object.heal)
                object.amount--
            // si le héro est mort et que l'object pour revive
            } else if (heroToHeal.status !== "alive" && object.revive === true){
                heroToHeal.revive(heroToHeal)
                heroToHeal.heal(heroToHeal,object.healIfDead)
                object.amount--
            // si il est au max hp et vivant
            } else {
                console.log(`You can't heal ${heroToHeal.name}`)
                GameManager.instance.sleep()
                this.AskToPlayerAction(heroWhoPlay);
            }
        // si c'est l'ether
        } else {
            if (heroToHeal.manaMax === heroToHeal.currentMana || heroToHeal.manaMax === 0){
                console.log(`You can't restore mana of ${heroToHeal.name}`)
                GameManager.instance.sleep()
                this.AskToPlayerAction(heroWhoPlay);
            } else {
                heroToHeal.heal(heroToHeal,object.magicPoint)
                object.amount--
            }
        }
    }

    askToPLayerAlly(hero : Character): Character{
        hero.hpHud(this.allyTeam,100)
        console.log(`Ally available:`)

        // affiche la liste des héros
        for (let i=0; i<this.allyTeam.length ;i++){
            console.log(`${i+1} - ${this.allyTeam[i].name}`)
        }
        //choix du héros
        const ally = prompt("Which hero do you choose ? --> " );
        if (ally != null) {
            const allyN = parseInt(ally, 10)-1
            if (allyN >= 0  && allyN <= this.allyTeam.length) {
                return this.allyTeam[allyN]
            } else {
                console.error("Your input is wrong, please retry !\n");
                return this.askToPLayerAlly(hero);
            }
        }else {
            console.error("Your input is wrong, please retry !\n");
            return this.askToPLayerAlly(hero);
        }
    }

    AskToPlayerObject(hero: Character, objects : Objects[]){
        console.clear()
        console.log(`Object avaible in your bag :`)
        const listObjectAvaible = [];
        const emoji = ["🧪","✨","⭐","💊"]
        let nbrAllyFullHeal = 0
        let nbrAllyAlive = 0
        let nbrAllyFullMana = 0
        
        // compte le nombre de héro dans chaque état
        for (let i = 0; i < this.allyTeam.length; i++){
            if (this.allyTeam[i].currentHp === this.allyTeam[i].hpMax){
                nbrAllyFullHeal ++
            }
            if (this.allyTeam[i].status === "alive"){
                nbrAllyAlive ++
            }
            if (this.allyTeam[i].currentMana === this.allyTeam[i].manaMax){
                nbrAllyFullMana ++
            }
        }
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].amount > 0){
                // si l'object est un biteOfStar ou halfStar et minimum 1 héro mort
                if (i === 1 && nbrAllyFullHeal < 3 && nbrAllyAlive < 3 || i === 2 && nbrAllyFullHeal < 3 && nbrAllyAlive < 3){
                    listObjectAvaible.push(`${objects[i].name}`)
                    console.log(`${listObjectAvaible.length} - ${emoji[i]} ${objects[i].name}`)
                    
                // si l'objet est une potion, biteOfStar ou halfStar et 1 ennemie pas max hp
                } else if (i === 0 && nbrAllyFullHeal < 3 || i === 1 && nbrAllyFullHeal < 3 || i === 2 && nbrAllyFullHeal < 3){
                    listObjectAvaible.push(`${objects[i].name}`)
                    console.log(`${listObjectAvaible.length} - ${emoji[i]} ${objects[i].name}`)
                }
                
                 
                // si l'objet est ether et 1 héro pas max mana
                if (i === 3 && nbrAllyFullMana < 3){
                    listObjectAvaible.push(`${objects[i].name}`)
                    console.log(`${listObjectAvaible.length} - ${emoji[i]} ${objects[i].name}`)
                }
                // si rien a été possible alors 
                if (listObjectAvaible.length === 0){
                    console.log("No object useable !")
                    GameManager.instance.sleep()
                    return this.AskToPlayerAction(hero)
                }
            }
        }

        // choix de l'objet
        const object = prompt("What object do you want to use ? --> " );
        if (object != null) {
            const objectN : number = parseInt(object, 10);
            let objectUsed = false
            if (objectN >= 1  && objectN <= listObjectAvaible.length) {
                for (let i = objectN; i <= objects.length; i++){
                    if (objects[i-1].amount > 0 && objectUsed === false){
                        console.log(objects[i-1].heal)
                        this.useItem(hero, this.askToPLayerAlly(hero,),objects[i-1])
                        objectUsed = true
                    }
                }   
            } else {
                console.error("Your input is wrong, please retry !\n");
                this.AskToPlayerObject(hero,objects);
            }
        } else {
            console.error("Your input is wrong, please retry !\n");
            this.AskToPlayerObject(hero,objects);
        }
    }
}