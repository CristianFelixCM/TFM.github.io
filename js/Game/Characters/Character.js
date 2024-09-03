var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ModelController } from "../../WebGLController/Model.js";
import { Matematicas } from "../../WebGLController/Matematicas.js";
import { Clock } from "../Clock.js";
export class Character {
    constructor(id, name, animaciones, framesAnimaciones) {
        this.casillaActual = [0, 0];
        this.Hp = 100;
        this.HpActual = this.Hp;
        this.dañoGolpe = 50;
        this.expPorDerrota = 10;
        this.expActual = 0;
        this.expSubirNivel = 10;
        this.nivel = 1;
        this.model = name;
        this.matrix = new Float32Array([
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ]);
        this.orientacion = 0;
        this.gradosGiro = 0;
        this.animaciones = animaciones;
        this.framesAnimaciones = framesAnimaciones;
        this.tiempoTardaRealizarAnimacion = 1;
        this.animacionActual = 0;
        this.frameActual = 0;
        this.clock = new Clock();
        this.state = 0;
        this.stateAndar = 0;
        this.tiempoRecorrerCasilla = 1;
        this.identificador = id;
    }
    cargarModelo(gl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ModelController.cargarModelo(this.model, this.animaciones, this.framesAnimaciones, gl);
        });
    }
    setPosition(x, y, z) {
        this.matrix = Matematicas.setPosition(this.matrix, x, y, z);
    }
    translation(x, y, z) {
        this.matrix = Matematicas.translation(this.matrix, x, y, z);
    }
    getPosition() {
        return [this.matrix[12], this.matrix[13], this.matrix[14]];
    }
    setEscalar(Sx, Sy, Sz) {
        this.matrix = Matematicas.setEscalar(this.matrix, Sx, Sy, Sz);
    }
    setRotateZ(angulo) {
        this.matrix = Matematicas.setRotateZ(this.matrix, angulo);
    }
    setRotateX(angulo) {
        this.matrix = Matematicas.setRotateX(this.matrix, angulo);
    }
    setRotateY(angulo) {
        this.matrix = Matematicas.setRotateY(this.matrix, angulo);
    }
    actualizarFrame() {
        this.clock.actualizarDelta();
        this.frameActual = Math.floor((this.clock.getDelta() / (this.tiempoTardaRealizarAnimacion / this.framesAnimaciones[this.animacionActual])) % this.framesAnimaciones[this.animacionActual]);
    }
    setState(s) {
        this.state = s;
    }
    getState() {
        return this.state;
    }
    getCasilla() {
        return [this.casillaActual[0], this.casillaActual[1]];
    }
    setCasilla(y, x) {
        this.casillaActual[0] = y;
        this.casillaActual[1] = x;
    }
    cambiarOrientacion(orientacion) {
        this.gradosGiro = (this.orientacion - orientacion) * 90;
        this.setRotateY(this.gradosGiro);
        this.orientacion = orientacion;
    }
    cambiarCasilla() {
        switch (this.orientacion) {
            case 0:
                this.casillaActual[0] -= 1;
                break;
            case 1:
                this.casillaActual[1] += 1;
                break;
            case 2:
                this.casillaActual[0] += 1;
                break;
            case 3:
                this.casillaActual[1] -= 1;
                break;
        }
    }
    setHp(daño) {
        this.HpActual -= daño;
    }
    getOrientacion() { return this.orientacion; }
}
