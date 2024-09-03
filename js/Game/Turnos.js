import { Matematicas } from "./../WebGLController/Matematicas.js";
export class Turnos {
    constructor() {
        this.turnos = [0];
        this.turnoActual = 0;
    }
    añadirEnTurnos(id) {
        this.turnos.push(id);
    }
    actualizarTurnos() {
        for (let idx = 0; idx < this.turnos.length; idx++) {
            if (this.turnos[idx] == this.turnoActual) {
                this.turnoActual = this.turnos[Matematicas.modulo(idx + 1, this.turnos.length)];
                console.log("turno actual " + this.turnoActual);
                break;
            }
        }
    }
    borrarEnTurnos(id) {
        console.log(this.turnos);
        for (let idx = 0; idx < this.turnos.length; idx++) {
            if (this.turnos[idx] == id) {
                if (id == this.turnoActual) {
                    this.turnoActual = this.turnos[Matematicas.modulo(idx + 1, this.turnos.length)];
                }
                this.turnos.splice(idx, 1);
                break;
            }
        }
    }
}
