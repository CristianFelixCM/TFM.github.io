import { Character } from "./Character.js";
export class Enemy extends Character {
    constructor() {
        super(...arguments);
        this.posPrevia = [0, 0, 0];
    }
    andar(map) {
        if (this.stateAndar == 0) {
            if (map.comprobarSiPuedeMoverse(this)) {
                this.clock.iniciar();
                this.stateAndar = 1;
                this.cambiarCasilla();
                this.posPrevia = this.getPosition();
            }
            else {
                this.state = 0;
                this.stateAndar = 0;
                return 0;
            }
        }
        else {
            let pixelesActualesMovidos = this.clock.delta / (this.tiempoRecorrerCasilla / 2);
            if (this.clock.delta <= this.tiempoRecorrerCasilla) {
                switch (this.orientacion) {
                    case 0:
                        this.setPosition(this.posPrevia[0], this.posPrevia[1], this.posPrevia[2] - pixelesActualesMovidos);
                        break;
                    case 1:
                        this.setPosition(this.posPrevia[0] + pixelesActualesMovidos, this.posPrevia[1], this.posPrevia[2]);
                        break;
                    case 2:
                        this.setPosition(this.posPrevia[0], this.posPrevia[1], this.posPrevia[2] + pixelesActualesMovidos);
                        break;
                    case 3:
                        this.setPosition(this.posPrevia[0] - pixelesActualesMovidos, this.posPrevia[1], this.posPrevia[2]);
                        break;
                }
            }
            else {
                this.setPosition(Math.round(this.getPosition()[0]), Math.round(this.getPosition()[1]), Math.round(this.getPosition()[2]));
                this.state = 0;
                this.stateAndar = 0;
                return 0;
            }
        }
        return 1;
    }
}
