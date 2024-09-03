var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebGLController } from "./WebGLController/WebGLController.js";
import { Matematicas } from "./WebGLController/Matematicas.js";
import { Interface } from "./Game/Interfaces/Interface.js";
import { Character } from "./Game/Characters/Character.js";
import { Protagonist } from "./Game/Characters/Protagonist.js";
import { Enemy } from "./Game/Characters/Enemy.js";
import { Mapa } from "./Game/Map/Map.js";
import { Clock } from "./Game/Clock.js";
import { Turnos } from "./Game/Turnos.js";
import { Screens } from "./Game/Screens.js";
const canvas = document.querySelector("#glcanvas");
if (canvas === null)
    throw new Error("Could not find canvas element");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext("webgl2");
if (gl === null)
    throw new Error("Could not get WebGL context");
const canvas2 = document.querySelector("#canvas2d");
if (canvas2 === null)
    throw new Error("Could not find canvas element");
const contexto2D = canvas2.getContext("2d");
if (contexto2D === null)
    throw new Error("Could not get WebGL context");
class Game {
    constructor() {
        this.Enemys = [];
        this.pociones = [];
        this.flechas = [];
        this.paredes = [];
        this.lamparas = [];
        this.MEDIDA_CASILLA = 2;
        this.tiempoScreenPiso = 0;
        this.stateAtacar = 0;
        this.enemigoDañado = -1;
        this.stateAtaqueEnemigo = 0;
        this.interface = new Interface(canvas2, contexto2D);
        this.screens = new Screens(canvas2, contexto2D);
        this.stateGamePlay = 0;
        this.map = new Mapa();
        this.protagonist = new Protagonist(0, "Protagonista1", ["Parado", "Andar", "Atacar", "Daño"], [30, 30, 30, 30]);
        this.arco = new Character(0, "Arco", ["Arco"], [30]);
        this.escaleras = new Character(4, "Escaleras", ["Parado"], [1]);
        this.numPiso = 1;
        this.numeroPersonajeAndando = 0;
        this.turnos = new Turnos();
    }
    init(gl) {
        return __awaiter(this, void 0, void 0, function* () {
            this.gl = gl;
            yield WebGLController.init(this.gl);
            this.renderScreenInit();
            game.logic();
        });
    }
    initScene(gl) {
        return __awaiter(this, void 0, void 0, function* () {
            this.numeroPersonajeAndando = 0;
            this.interface = new Interface(canvas2, contexto2D);
            this.turnos = new Turnos();
            this.map = new Mapa();
            let posHabitaciones = this.map.getPosicioneHabitaciones();
            for (let i = 0; i < posHabitaciones.length; i += 2) {
                this.lamparas.push(new Character(-1, "Lampara", ["Parado"], [1]));
                yield this.lamparas[this.lamparas.length - 1].cargarModelo(gl);
                this.lamparas[this.lamparas.length - 1].setPosition(posHabitaciones[i] * 2, 0.5, posHabitaciones[i + 1] * 2);
                WebGLController.getLights().addLight([posHabitaciones[i] * 2, 2.5, posHabitaciones[i + 1] * 2], [1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0, 1.0]);
            }
            this.protagonist.state = 0;
            let pos = this.map.getCasillaVacia();
            this.protagonist.setCasilla(pos[0], pos[1]);
            this.protagonist.setPosition(pos[1] * 2, 0, pos[0] * 2);
            WebGLController.getCamera().setPosition([pos[1] * 2, 0.40, pos[0] * 2]);
            yield this.protagonist.cargarModelo(gl);
            yield this.arco.cargarModelo(gl);
            this.Enemys = [];
            let randNumEnemigos = Matematicas.RandInteger(4, 6);
            for (let i = 1; i < randNumEnemigos; i++) {
                let randEnemigo = Matematicas.RandInteger(1, 3);
                let enemy = new Enemy(i, "Enemigo1", ["Parado", "Andar", "Atacar", "Daño"], [30, 30, 30, 30]);
                if (randEnemigo == 1)
                    enemy = new Enemy(i, "Enemigo1", ["Parado", "Andar", "Atacar", "Daño"], [30, 30, 30, 30]);
                if (randEnemigo == 2)
                    enemy = new Enemy(i, "Enemigo2", ["Parado", "Andar", "Atacar", "Daño"], [30, 30, 30, 30]);
                yield enemy.cargarModelo(gl);
                pos = this.map.getCasillaVacia();
                enemy.setCasilla(pos[0], pos[1]);
                enemy.setPosition(pos[1] * 2, 0, pos[0] * 2);
                if (randEnemigo == 1)
                    enemy.setRotateY(90);
                this.turnos.añadirEnTurnos(i);
                this.Enemys.push(enemy);
            }
            this.paredes = [];
            for (let y = 0; y < this.map.tamMapa; y++) {
                for (let x = 0; x < this.map.tamMapa; x++) {
                    if (this.map.comprobarCasillaEsPared(y, x)) {
                        this.paredes.push(new Character(-1, "Muro3", ["Parado"], [1]));
                        yield this.paredes[this.paredes.length - 1].cargarModelo(gl);
                        this.paredes[this.paredes.length - 1].setPosition(x * 2, 0, y * 2);
                        this.paredes[this.paredes.length - 1].setRotateY(Matematicas.RandInteger(0, 3) * 90);
                    }
                    if (this.map.comprobarCasillaVacia(y, x)) {
                        this.paredes.push(new Character(-1, "Suelo2", ["Parado"], [1]));
                        yield this.paredes[this.paredes.length - 1].cargarModelo(gl);
                        this.paredes[this.paredes.length - 1].setPosition(x * 2, 0, y * 2);
                    }
                    this.paredes.push(new Character(-1, "Techo", ["Parado"], [1]));
                    yield this.paredes[this.paredes.length - 1].cargarModelo(gl);
                    this.paredes[this.paredes.length - 1].setEscalar(2, 1, 2);
                    this.paredes[this.paredes.length - 1].setPosition(x * 4, 6, y * 4);
                }
            }
            this.pociones = [];
            for (let i = 0; i < 6; i++) {
                let potion = new Character(1, "Pocion", ["Parado"], [1]);
                yield potion.cargarModelo(gl);
                pos = this.map.getCasillaVacia();
                potion.setCasilla(pos[0], pos[1]);
                potion.setPosition(pos[1] * 2, 0, pos[0] * 2);
                this.pociones.push(potion);
            }
            this.flechas = [];
            for (let i = 0; i < 6; i++) {
                let flecha = new Character(1, "flecha", ["Parado"], [1]);
                yield flecha.cargarModelo(gl);
                pos = this.map.getCasillaVacia();
                flecha.setCasilla(pos[0], pos[1]);
                flecha.setPosition(pos[1] * 2, 0, pos[0] * 2);
                this.flechas.push(flecha);
            }
            this.escaleras = new Character(4, "Escaleras", ["Parado"], [1]);
            yield this.escaleras.cargarModelo(gl);
            let posEscalera = this.map.getPosParaEscaleras();
            this.escaleras.setCasilla(posEscalera[0], posEscalera[1]);
            this.escaleras.setPosition(posEscalera[1] * 2, 0, posEscalera[0] * 2);
            this.escaleras.setRotateY(-90 * posEscalera[2]);
        });
    }
    logic() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.stateGamePlay) {
                case 0:
                    if (comprobarAccionPulsada() != -1) {
                        this.stateGamePlay = 1;
                    }
                    break;
                case 1:
                    yield this.initScene(this.gl);
                    this.stateGamePlay = 2;
                    break;
                case 2:
                    if (this.turnos.turnoActual == 0)
                        this.actionsProtagonist();
                    else
                        this.actionsEnemy();
                    this.actualizarMovimientos();
                    break;
                case 3:
                    break;
                case 4:
                    if (comprobarAccionPulsada() == 4) {
                        this.stateGamePlay = 0;
                        this.protagonist = new Protagonist(0, "Protagonista1", ["Parado", "Andar", "Atacar", "Daño"], [30, 30, 30, 30]);
                    }
                    break;
                case 5:
                    if (comprobarAccionPulsada() == 4) {
                        this.stateGamePlay = 0;
                        this.protagonist = new Protagonist(0, "Protagonista1", ["Parado", "Andar", "Atacar", "Daño"], [30, 30, 30, 30]);
                    }
                    break;
            }
            console.log(this.stateGamePlay);
            setTimeout(this.logic.bind(this), 10);
        });
    }
    renderGame() {
        contadorFPS();
        WebGLController.initRender();
        this.Enemys.forEach(element => {
            element.actualizarFrame();
            WebGLController.drawModel(element.model, element.matrix, element.getState(), element.frameActual);
        });
        this.paredes.forEach(element => {
            WebGLController.drawModel(element.model, element.matrix, element.getState(), element.frameActual);
        });
        WebGLController.isLamp = 1;
        this.lamparas.forEach(element => {
            WebGLController.drawModel(element.model, element.matrix, element.getState(), element.frameActual);
        });
        WebGLController.isLamp = 0;
        WebGLController.drawModel(this.escaleras.model, this.escaleras.matrix, 0, 0);
        this.pociones.forEach(element => {
            WebGLController.drawModel(element.model, element.matrix, 0, 0);
        });
        this.flechas.forEach(element => {
            WebGLController.drawModel(element.model, element.matrix, 0, 0);
        });
        if (this.protagonist.getState() == 2 && this.stateAtacar == 1) {
            this.protagonist.actualizarFrame();
            WebGLController.drawModel(this.protagonist.model, this.protagonist.matrix, 0, this.protagonist.frameActual);
        }
        if (this.protagonist.getState() == 4 && this.stateAtacar == 1) {
            this.arco.actualizarFrame();
            WebGLController.drawModel(this.arco.model, this.protagonist.matrix, 0, this.arco.frameActual);
        }
        if (this.stateGamePlay == 2)
            setTimeout(this.renderGame.bind(this), 1);
        if (this.stateGamePlay == 3)
            this.renderScreenPiso();
        if (this.stateGamePlay == 4)
            this.renderScreenWin();
        if (this.stateGamePlay == 5)
            this.renderScreenLose();
    }
    renderInterface() {
        this.interface.drawInterfaceGamePlay(this.map, this.protagonist);
        if (this.stateGamePlay == 2)
            setTimeout(this.renderInterface.bind(this), 100);
    }
    renderScreenInit() {
        this.screens.drawPantallaInicio();
        if (this.stateGamePlay == 0)
            setTimeout(this.renderScreenInit.bind(this), 100);
        else
            this.renderScreenLoading();
    }
    renderScreenLoading() {
        this.screens.drawPantalla("CARGANDO");
        if (this.stateGamePlay == 1)
            setTimeout(this.renderScreenLoading.bind(this), 100);
        if (this.stateGamePlay == 2) {
            this.renderGame();
            this.renderInterface();
        }
    }
    renderScreenPiso() {
        if (this.tiempoScreenPiso < 10) {
            this.screens.drawPantalla("SUBIENDO A " + this.numPiso);
            this.tiempoScreenPiso++;
            setTimeout(this.renderScreenPiso.bind(this), 100);
        }
        else {
            this.tiempoScreenPiso = 0;
            this.stateGamePlay = 1;
            this.renderScreenLoading();
        }
    }
    renderScreenWin() {
        this.screens.drawPantalla("YOU WIN");
        if (this.stateGamePlay == 0)
            this.renderScreenInit();
        else
            setTimeout(this.renderScreenWin.bind(this), 100);
    }
    renderScreenLose() {
        this.screens.drawPantalla("YOU LOSE");
        if (this.stateGamePlay == 0)
            this.renderScreenInit();
        else
            setTimeout(this.renderScreenLose.bind(this), 100);
    }
    actionsProtagonist() {
        switch (this.protagonist.getState()) {
            case 0:
                let actionSelect = comprobarAccionPulsada();
                if (actionSelect == 0) {
                    this.protagonist.state = 1;
                    this.numeroPersonajeAndando++;
                    this.turnos.actualizarTurnos();
                    this.comprobarSiEscalera();
                }
                else if (actionSelect == 1) {
                    WebGLController.getCamera().changeAzimuth(90);
                    this.protagonist.cambiarOrientacion(Matematicas.modulo(this.protagonist.orientacion + 1, 4));
                }
                else if (actionSelect == 3) {
                    WebGLController.getCamera().changeAzimuth(-90);
                    this.protagonist.cambiarOrientacion(Matematicas.modulo(this.protagonist.orientacion - 1, 4));
                }
                else if (actionSelect == 2) {
                    WebGLController.getCamera().changeAzimuth(180);
                    this.protagonist.cambiarOrientacion(Matematicas.modulo(this.protagonist.orientacion + 2, 4));
                }
                else if (actionSelect == 4) {
                    this.protagonist.state = 2;
                }
                else if (actionSelect == 8) {
                    if (this.protagonist.numFlechas > 0) {
                        this.protagonist.numFlechas--;
                        this.protagonist.state = 4;
                    }
                }
                else if (actionSelect == 7) {
                    if (this.protagonist.usarPocion() == 1)
                        this.turnos.actualizarTurnos();
                }
                else if (actionSelect == 6) {
                    console.log("mostrar mapa");
                    this.interface.showMap();
                    console.log(this.interface.mapaActivo);
                }
                break;
            case 2:
                if (this.atacar() == 0)
                    this.turnos.actualizarTurnos();
                break;
            case 4:
                if (this.atacar() == 0)
                    this.turnos.actualizarTurnos();
                break;
        }
    }
    actionsEnemy() {
        let indice = -1;
        for (let idx = 0; idx < this.Enemys.length; idx++) {
            if (this.Enemys[idx].identificador == this.turnos.turnoActual)
                indice = idx;
        }
        switch (this.Enemys[indice].state) {
            case 0:
                if (Matematicas.distance(this.Enemys[indice].getCasilla(), this.protagonist.getCasilla()) == 1) {
                    this.Enemys[indice].state = 2;
                    if (this.Enemys[indice].getCasilla()[0] > this.protagonist.getCasilla()[0])
                        this.Enemys[indice].cambiarOrientacion(0);
                    if (this.Enemys[indice].getCasilla()[0] < this.protagonist.getCasilla()[0])
                        this.Enemys[indice].cambiarOrientacion(2);
                    if (this.Enemys[indice].getCasilla()[1] > this.protagonist.getCasilla()[1])
                        this.Enemys[indice].cambiarOrientacion(3);
                    if (this.Enemys[indice].getCasilla()[1] < this.protagonist.getCasilla()[1])
                        this.Enemys[indice].cambiarOrientacion(1);
                }
                else if (Matematicas.distance(this.Enemys[indice].getCasilla(), this.protagonist.getCasilla()) < 4) {
                    this.Enemys[indice].state = 1;
                    if (this.Enemys[indice].getCasilla()[0] > this.protagonist.getCasilla()[0])
                        this.Enemys[indice].cambiarOrientacion(0);
                    if (this.Enemys[indice].getCasilla()[0] < this.protagonist.getCasilla()[0])
                        this.Enemys[indice].cambiarOrientacion(2);
                    if (this.Enemys[indice].getCasilla()[1] > this.protagonist.getCasilla()[1])
                        this.Enemys[indice].cambiarOrientacion(3);
                    if (this.Enemys[indice].getCasilla()[1] < this.protagonist.getCasilla()[1])
                        this.Enemys[indice].cambiarOrientacion(1);
                    this.turnos.actualizarTurnos();
                    this.numeroPersonajeAndando++;
                }
                else {
                    this.Enemys[indice].state = 1;
                    this.Enemys[indice].cambiarOrientacion(Matematicas.RandInteger(0, 4));
                    this.turnos.actualizarTurnos();
                    this.numeroPersonajeAndando++;
                }
                break;
            case 2:
                if (this.ataqueEnemigo(indice) == 0) {
                    this.turnos.actualizarTurnos();
                }
                break;
        }
    }
    comprobarSiPuedeMoverse(c) {
        switch (c.orientacion) {
            case 0:
                return this.map.comprobarCasillaVacia(c.casillaActual[0] - 1, c.casillaActual[1]);
            case 1:
                return this.map.comprobarCasillaVacia(c.casillaActual[0], c.casillaActual[1] + 1);
            case 2:
                return this.map.comprobarCasillaVacia(c.casillaActual[0] + 1, c.casillaActual[1]);
            case 3:
                return this.map.comprobarCasillaVacia(c.casillaActual[0], c.casillaActual[1] - 1);
        }
    }
    comprobarSiCogerObjeto() {
        for (let i = 0; i < this.pociones.length; i++) {
            if (this.pociones[i].getCasilla()[0] == this.protagonist.getCasilla()[0] && this.pociones[i].getCasilla()[1] == this.protagonist.getCasilla()[1]) {
                if (this.protagonist.cogerPocion()) {
                    this.pociones.splice(i, 1);
                    this.interface.addTextLog("Poción cogida");
                }
                else
                    this.interface.addTextLog("No se puede coger más pociones");
            }
        }
        for (let i = 0; i < this.flechas.length; i++) {
            if (this.flechas[i].getCasilla()[0] == this.protagonist.getCasilla()[0] && this.flechas[i].getCasilla()[1] == this.protagonist.getCasilla()[1]) {
                if (this.protagonist.cogerFlecha()) {
                    this.flechas.splice(i, 1);
                    this.interface.addTextLog("Flecha cogida");
                }
                else
                    this.interface.addTextLog("No se puede coger más flechas");
            }
        }
    }
    comprobarSiEscalera() {
        let posSig = this.protagonist.getCasilla();
        switch (this.protagonist.orientacion) {
            case 0:
                posSig[0] -= 1;
                break;
            case 1:
                posSig[1] += 1;
                break;
            case 2:
                posSig[0] += 1;
                break;
            case 3:
                posSig[1] -= 1;
                break;
        }
        console.log("el prota esta " + this.protagonist.getCasilla() + "  y se mueve a " + posSig);
        if (this.map.esEscalera(posSig[0], posSig[1])) {
            this.numPiso++;
            this.interface.addTextLog("subiendo a piso " + this.numPiso);
            this.stateGamePlay = 3;
            if (this.numPiso == 10) {
                this.stateGamePlay = 4;
            }
        }
    }
    atacar() {
        switch (this.stateAtacar) {
            case 0:
                if (this.numeroPersonajeAndando == 0) {
                    if (this.protagonist.state == 2) {
                        this.enemigoDañado = this.comprobarEnemigoDañado();
                        this.protagonist.clock.iniciar();
                    }
                    else {
                        this.enemigoDañado = this.comprobarEnemigoDañadoArco();
                        this.arco.clock.iniciar();
                    }
                    if (this.enemigoDañado != -1) {
                        this.Enemys[this.enemigoDañado].clock.iniciar();
                        this.Enemys[this.enemigoDañado].setHp(this.protagonist.dañoGolpe);
                        if (this.Enemys[this.enemigoDañado].HpActual <= 0) {
                            this.Enemys[this.enemigoDañado].state = 3;
                            this.interface.addTextLog(this.Enemys[this.enemigoDañado].model + " recibe " + this.protagonist.dañoGolpe + " de daño y muere");
                        }
                        else {
                            this.Enemys[this.enemigoDañado].state = 3;
                            this.interface.addTextLog(this.Enemys[this.enemigoDañado].model + " recibe " + this.protagonist.dañoGolpe + " de daño");
                        }
                    }
                    this.stateAtacar = 1;
                }
                break;
            case 1:
                if (this.enemigoDañado != -1)
                    this.Enemys[this.enemigoDañado].actualizarFrame();
                if (this.protagonist.state == 2) {
                    this.protagonist.actualizarFrame();
                    if (this.protagonist.frameActual == this.protagonist.framesAnimaciones[this.protagonist.getState()] - 1) {
                        this.stateAtacar = 2;
                        if (this.enemigoDañado != -1)
                            this.Enemys[this.enemigoDañado].state = 0;
                    }
                }
                else {
                    this.arco.actualizarFrame();
                    if (this.arco.frameActual == this.arco.framesAnimaciones[0] - 1) {
                        this.stateAtacar = 2;
                        if (this.enemigoDañado != -1)
                            this.Enemys[this.enemigoDañado].state = 0;
                    }
                }
                break;
            case 2:
                this.stateAtacar = 4;
                if (this.enemigoDañado != -1 && this.Enemys[this.enemigoDañado].HpActual <= 0) {
                    this.protagonist.expActual += this.Enemys[this.enemigoDañado].expPorDerrota;
                    this.turnos.borrarEnTurnos(this.Enemys[this.enemigoDañado].identificador);
                    this.map.liberarCasilla(this.Enemys[this.enemigoDañado].casillaActual);
                    this.Enemys.splice(this.enemigoDañado, 1);
                    if (this.protagonist.expActual > this.protagonist.expSubirNivel) {
                        let resto = 0;
                        do {
                            resto = (this.protagonist.expActual) - this.protagonist.expSubirNivel;
                            if (resto > 0) {
                                this.protagonist.expSubirNivel = this.protagonist.expSubirNivel + 10;
                                this.protagonist.nivel++;
                                this.interface.addTextLog("Has subido al nivel " + this.protagonist.nivel);
                                this.protagonist.clock.iniciar();
                                this.stateAtacar = 3;
                            }
                        } while (resto > 0);
                    }
                }
                break;
            case 3:
                this.protagonist.actualizarFrame();
                if (this.protagonist.frameActual == this.protagonist.framesAnimaciones[1] - 1) {
                    this.stateAtacar = 4;
                }
                break;
            case 4:
                this.stateAtacar = 0;
                this.protagonist.state = 0;
                this.arco.state = 0;
                return 0;
                break;
                return 1;
        }
    }
    comprobarEnemigoDañado() {
        let casillaProta = this.protagonist.getCasilla();
        if (this.protagonist.orientacion == 0)
            casillaProta[0] -= 1;
        if (this.protagonist.orientacion == 1)
            casillaProta[1] += 1;
        if (this.protagonist.orientacion == 2)
            casillaProta[0] += 1;
        if (this.protagonist.orientacion == 3)
            casillaProta[1] -= 1;
        for (let i = 0; i < this.Enemys.length; i++)
            if (this.Enemys[i].getCasilla()[0] == casillaProta[0] && this.Enemys[i].getCasilla()[1] == casillaProta[1]) {
                return i;
            }
        return -1;
    }
    comprobarEnemigoDañadoArco() {
        let casillasAfectadas = [];
        if (this.protagonist.orientacion == 0) {
            casillasAfectadas.push([this.protagonist.getCasilla()[0] - 1, this.protagonist.getCasilla()[1]]);
            casillasAfectadas.push([this.protagonist.getCasilla()[0] - 2, this.protagonist.getCasilla()[1]]);
            casillasAfectadas.push([this.protagonist.getCasilla()[0] - 3, this.protagonist.getCasilla()[1]]);
        }
        if (this.protagonist.orientacion == 1) {
            casillasAfectadas.push([this.protagonist.getCasilla()[0], this.protagonist.getCasilla()[1] + 1]);
            casillasAfectadas.push([this.protagonist.getCasilla()[0], this.protagonist.getCasilla()[1] + 2]);
            casillasAfectadas.push([this.protagonist.getCasilla()[0], this.protagonist.getCasilla()[1] + 3]);
        }
        if (this.protagonist.orientacion == 2) {
            casillasAfectadas.push([this.protagonist.getCasilla()[0] + 1, this.protagonist.getCasilla()[1]]);
            casillasAfectadas.push([this.protagonist.getCasilla()[0] + 2, this.protagonist.getCasilla()[1]]);
            casillasAfectadas.push([this.protagonist.getCasilla()[0] + 3, this.protagonist.getCasilla()[1]]);
        }
        if (this.protagonist.orientacion == 3) {
            casillasAfectadas.push([this.protagonist.getCasilla()[0], this.protagonist.getCasilla()[1] - 1]);
            casillasAfectadas.push([this.protagonist.getCasilla()[0], this.protagonist.getCasilla()[1] - 2]);
            casillasAfectadas.push([this.protagonist.getCasilla()[0], this.protagonist.getCasilla()[1] - 3]);
        }
        for (let i = 0; i < 3; i++) {
            if (casillasAfectadas[i][0] > 0 && casillasAfectadas[i][0] < this.map.tamMapa && casillasAfectadas[i][1] > 0 && casillasAfectadas[i][1] < this.map.tamMapa) {
                for (let e = 0; e < this.Enemys.length; e++) {
                    if (this.Enemys[e].getCasilla()[0] == casillasAfectadas[i][0] && this.Enemys[e].getCasilla()[1] == casillasAfectadas[i][1]) {
                        console.log("dañe a enemigo " + e);
                        return e;
                    }
                }
            }
        }
        return -1;
    }
    ataqueEnemigo(indice) {
        switch (this.stateAtaqueEnemigo) {
            case 0:
                this.Enemys[indice].clock.iniciar();
                if (this.numeroPersonajeAndando == 0) {
                    this.Enemys[indice].clock.iniciar();
                    this.protagonist.clock.iniciar();
                    this.protagonist.state = 3;
                    this.protagonist.setHp(this.Enemys[indice].dañoGolpe);
                    this.interface.addTextLog("Protagonista recibe " + this.Enemys[indice].dañoGolpe + " de daño");
                    this.stateAtaqueEnemigo = 1;
                }
                break;
            case 1:
                this.Enemys[indice].actualizarFrame();
                this.protagonist.actualizarFrame();
                if (this.Enemys[indice].frameActual == this.Enemys[indice].framesAnimaciones[this.Enemys[indice].getState()] - 1) {
                    this.stateAtaqueEnemigo = 2;
                }
                break;
            case 2:
                if (this.protagonist.HpActual <= 0) {
                    this.interface.addTextLog("has sido derrotado!!");
                    this.stateGamePlay = 5;
                }
                this.stateAtaqueEnemigo = 0;
                this.protagonist.state = 0;
                this.Enemys[indice].state = 0;
                return 0;
                break;
        }
        return 1;
    }
    actualizarMovimientos() {
        if (this.protagonist.getState() == 1) {
            if (this.protagonist.andar(this.map) == 0) {
                this.numeroPersonajeAndando--;
                this.comprobarSiCogerObjeto();
            }
        }
        this.Enemys.forEach(enemy => {
            if (enemy.getState() == 1)
                if (enemy.andar(this.map) == 0) {
                    this.numeroPersonajeAndando--;
                }
        });
    }
    subir() {
        console.log("subiendo");
        this.numPiso++;
        this.interface.addTextLog("subiendo a piso " + this.numPiso);
        if (this.numPiso == 2) {
            this.stateGamePlay = 4;
            this.numPiso = 0;
        }
        else
            this.stateGamePlay = 3;
    }
}
let game = new Game();
game.init(gl);
var tecla = -1;
document.addEventListener("keydown", majeadorTeclado, false);
let clockControles = new Clock();
clockControles.delta = 1;
function majeadorTeclado(e) {
    if (clockControles.delta >= 0.2) {
        clockControles.iniciar();
        console.log(e.keyCode);
        if (e.keyCode == 39) {
            tecla = 1;
            console.log("der");
        }
        else if (e.keyCode == 37) {
            tecla = 3;
            console.log("izq");
        }
        else if (e.keyCode == 38) {
            tecla = 0;
            console.log("arr");
        }
        else if (e.keyCode == 40) {
            tecla = 2;
            console.log("abaj");
        }
        else if (e.keyCode == 65) {
            tecla = 4;
            console.log("atacar");
        }
        else if (e.keyCode == 67) {
            tecla = 8;
            console.log("flecha");
        }
        else if (e.keyCode == 80) {
            tecla = 7;
            console.log("pocion");
        }
        else if (e.keyCode == 77) {
            tecla = 6;
            console.log("m de mapa");
        }
        else if (e.keyCode == 81) {
            game.subir();
        }
        else
            tecla = -1;
    }
    clockControles.actualizarDelta();
}
document.addEventListener("keyup", (e) => { tecla = -1; clockControles.delta = 1; }, false);
document.addEventListener("touchstart", (e) => {
    if (canvas2 != null) {
        if (Matematicas.distance([e.touches[0].clientX, e.touches[0].clientY], [window.innerWidth * 0.145, window.innerHeight * 0.63]) <= window.innerWidth * 0.05) {
            game.interface.sombrearTouch(e.touches[0].clientX, e.touches[0].clientY, true);
            tecla = 0;
        }
        if (Matematicas.distance([e.touches[0].clientX, e.touches[0].clientY], [window.innerWidth * 0.215, window.innerHeight * 0.765]) <= window.innerWidth * 0.05) {
            game.interface.sombrearTouch(e.touches[0].clientX, e.touches[0].clientY, true);
            tecla = 1;
        }
        if (Matematicas.distance([e.touches[0].clientX, e.touches[0].clientY], [window.innerWidth * 0.145, window.innerHeight * 0.9]) <= window.innerWidth * 0.05) {
            game.interface.sombrearTouch(e.touches[0].clientX, e.touches[0].clientY, true);
            tecla = 2;
        }
        if (Matematicas.distance([e.touches[0].clientX, e.touches[0].clientY], [window.innerWidth * 0.065, window.innerHeight * 0.765]) <= window.innerWidth * 0.05) {
            game.interface.sombrearTouch(e.touches[0].clientX, e.touches[0].clientY, true);
            tecla = 3;
        }
        if (Matematicas.distance([e.touches[0].clientX, e.touches[0].clientY], [window.innerWidth * 0.92, window.innerHeight * 0.87]) <= window.innerWidth * 0.05) {
            game.interface.sombrearTouch(e.touches[0].clientX, e.touches[0].clientY, true);
            tecla = 4;
        }
        if (Matematicas.distance([e.touches[0].clientX, e.touches[0].clientY], [window.innerWidth * 0.8, window.innerHeight * 0.87]) <= window.innerWidth * 0.05) {
            game.interface.sombrearTouch(e.touches[0].clientX, e.touches[0].clientY, true);
            tecla = 7;
        }
        if (Matematicas.distance([e.touches[0].clientX, e.touches[0].clientY], [window.innerWidth * 0.92, window.innerHeight * 0.68]) <= window.innerWidth * 0.05) {
            game.interface.sombrearTouch(e.touches[0].clientX, e.touches[0].clientY, true);
            tecla = 8;
        }
        if (Matematicas.distance([e.touches[0].clientX, e.touches[0].clientY], [window.innerWidth * 0.87, window.innerHeight * 0.17]) <= window.innerWidth * 0.09) {
            game.interface.sombrearTouch(e.touches[0].clientX, e.touches[0].clientY, true);
            tecla = 6;
        }
        if (Matematicas.distance([e.touches[0].clientX, e.touches[0].clientY], [window.innerWidth * 0.15, window.innerHeight * 0.01]) <= window.innerWidth * 0.09) {
            game.interface.sombrearTouch(e.touches[0].clientX, e.touches[0].clientY, true);
            tecla = 9;
        }
    }
}, false);
document.addEventListener("touchend", (e) => {
    if (canvas2 != null) {
        game.interface.sombrearTouch(0, 0, false);
    }
}, false);
function comprobarAccionPulsada() {
    let teclacomprobada = tecla;
    tecla = -1;
    if (teclacomprobada == -1) {
        return -1;
    }
    else if (teclacomprobada == 0) {
        return 0;
    }
    else if (teclacomprobada == 1) {
        return 1;
    }
    else if (teclacomprobada == 2) {
        return 2;
    }
    else if (teclacomprobada == 3) {
        return 3;
    }
    else if (teclacomprobada == 4) {
        return 4;
    }
    else if (teclacomprobada == 5) {
        return 5;
    }
    else if (teclacomprobada == 6) {
        return 6;
    }
    else if (teclacomprobada == 7) {
        return 7;
    }
    else if (teclacomprobada == 8) {
        return 8;
    }
    else if (teclacomprobada == 9) {
        game.interface.showLog();
    }
    return -1;
}
function resizeScreen() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    WebGLController.ResizeScreen();
    game.interface.resize();
}
window.addEventListener('resize', resizeScreen);
let fpsClock = new Clock();
fpsClock.iniciar();
let fps = 0;
function contadorFPS() {
    fps++;
    if (fpsClock.delta >= 1) {
        game.interface.fps = fps;
        fps = 0;
        fpsClock.iniciar();
    }
    fpsClock.actualizarDelta();
}
