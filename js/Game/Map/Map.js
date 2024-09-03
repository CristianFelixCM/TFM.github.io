import { Matematicas } from "../../WebGLController/Matematicas.js";
export class Mapa {
    constructor() {
        this.tamMapa = 50;
        this.cuadricula = [];
        this.inicializarMatriz();
        this.semilla = Matematicas.RandInteger(0, 19999);
        this.mapaNumero = 1;
        this.tamHabitacionMax = 20;
        this.tamHabitacionMin = 8;
        this.numHabitacionesMin = 5;
        this.numIntentos = 0;
        this.HabitacionesCreadas = 0;
        this.PosHabitacionesX = [];
        this.PosHabitacionesY = [];
        this.dividir(1, 1, this.tamMapa - 1, this.tamMapa - 1);
    }
    inicializarMatriz() {
        this.cuadricula = [];
        for (var y = 0; y < this.tamMapa; y++) {
            this.cuadricula[y] = [];
            for (var x = 0; x < this.tamMapa; x++) {
                this.cuadricula[y][x] = 999;
            }
        }
    }
    dividir(y, x, h, w) {
        let nuevaH = 0;
        let nuevaW = 0;
        let nuevaY = 0;
        let nuevaX = 0;
        if (h - y >= this.tamHabitacionMax && w - x >= this.tamHabitacionMax) {
            let horizontaloVertical = (this.numIntentos + (this.semilla + this.mapaNumero) + (this.HabitacionesCreadas * this.tamMapa)) % 2;
            if (horizontaloVertical == 0) {
                let mitadY = Math.floor((y + h) / 2);
                let mitIzqY = Math.floor((y + mitadY) / 2);
                let mitDerY = Math.floor((h + mitadY) / 2);
                nuevaH = mitIzqY + (this.semilla % (mitDerY - mitIzqY));
                if (nuevaH > this.tamMapa)
                    nuevaH = this.tamMapa - 1;
                nuevaW = w;
                nuevaY = nuevaH;
                nuevaX = x;
            }
            else {
                let mitadX = Math.floor((x + w) / 2);
                let mitIzqX = Math.floor((x + mitadX) / 2);
                let mitDerX = Math.floor((w + mitadX) / 2);
                nuevaH = h;
                nuevaW = mitIzqX + (this.semilla % (mitDerX - mitIzqX));
                if (nuevaW > this.tamMapa)
                    nuevaW = this.tamMapa - 1;
                nuevaY = y;
                nuevaX = nuevaW;
            }
            this.numIntentos++;
            if (y < nuevaH && x < nuevaW && nuevaY < h && nuevaX < w) {
                this.dividir(y, x, nuevaH, nuevaW);
                this.dividir(nuevaY, nuevaX, h, w);
            }
        }
        else {
            if (h - y >= this.tamHabitacionMin && w - x >= this.tamHabitacionMin) {
                this.crearHabitacion(y, x, h, w);
                this.HabitacionesCreadas++;
            }
        }
    }
    crearHabitacion(y, x, h, w) {
        let puntoMedioY = Math.floor((h + y) / 2);
        let puntoMedioX = Math.floor((w + x) / 2);
        let radio = this.tamHabitacionMin / 2;
        let newY = Matematicas.RandInteger(y + radio, puntoMedioY) - radio;
        let maxH = Matematicas.RandInteger(puntoMedioY, h - radio) + radio;
        let newX = Matematicas.RandInteger(x + radio, puntoMedioX) - radio;
        let maxW = Matematicas.RandInteger(puntoMedioX, w - radio) + radio;
        for (let y0 = newY; y0 < maxH; y0++) {
            for (let x0 = newX; x0 < maxW; x0++) {
                this.cuadricula[y0][x0] = 1;
            }
        }
        this.PosHabitacionesY.push(puntoMedioY);
        this.PosHabitacionesX.push(puntoMedioX);
        if (this.PosHabitacionesY.length > 1)
            this.crearCamino(this.PosHabitacionesY[this.PosHabitacionesY.length - 1], this.PosHabitacionesY[this.PosHabitacionesY.length - 2], this.PosHabitacionesX[this.PosHabitacionesX.length - 1], this.PosHabitacionesX[this.PosHabitacionesX.length - 2]);
    }
    crearCamino(hab1Y, hab2Y, hab1X, hab2X) {
        let lineaHorizontal = hab1X - hab2X;
        let lineaVertical = hab1Y - hab2Y;
        if (lineaHorizontal > lineaVertical) {
            if (lineaHorizontal > 0) {
                this.cuadricula[hab1Y][hab1X - 1] = 1;
                this.crearCamino(hab1Y, hab2Y, hab1X - 1, hab2X);
            }
            else if (lineaHorizontal < 0) {
                this.cuadricula[hab1Y][hab1X + 1] = 1;
                this.crearCamino(hab1Y, hab2Y, hab1X + 1, hab2X);
            }
        }
        else {
            if (lineaVertical > 0) {
                this.cuadricula[hab1Y - 1][hab1X] = 1;
                this.crearCamino(hab1Y - 1, hab2Y, hab1X, hab2X);
            }
            else if (lineaVertical < 0) {
                this.cuadricula[hab1Y + 1][hab1X] = 1;
                this.crearCamino(hab1Y + 1, hab2Y, hab1X, hab2X);
            }
        }
    }
    comprobarCasillaEsPared(y, x) {
        if (this.cuadricula[y][x] == 999)
            return true;
        return false;
    }
    comprobarCasillaVacia(y, x) {
        if (this.cuadricula[y][x] == 1)
            return true;
        return false;
    }
    comprobarCasillaOcupada(y, x) {
        if (this.cuadricula[y][x] == 2)
            return true;
        return false;
    }
    getCasillaVacia() {
        let intentos = 0;
        let y = 0;
        let x = 0;
        let habitacion = 0;
        do {
            habitacion = Matematicas.RandInteger(0, this.HabitacionesCreadas - 1);
            y = Matematicas.RandInteger(this.PosHabitacionesY[habitacion] - (this.tamHabitacionMin / 2) + 1, this.PosHabitacionesY[habitacion] + (this.tamHabitacionMin / 2) - 1);
            x = Matematicas.RandInteger(this.PosHabitacionesX[habitacion] - (this.tamHabitacionMin / 2) + 1, this.PosHabitacionesX[habitacion] + (this.tamHabitacionMin / 2) - 1);
        } while (this.cuadricula[y][x] != 1 && intentos < 10);
        if (intentos >= 10)
            return [this.PosHabitacionesY[habitacion], this.PosHabitacionesX[habitacion]];
        return [y, x];
    }
    pintarConsola(posProta) {
        let dato = "";
        for (var y = 0; y < this.tamMapa; y++) {
            dato = dato + "\n";
            for (var x = 0; x < this.tamMapa; x++) {
                if (this.cuadricula[y][x] == 999)
                    dato += "1";
                if (this.cuadricula[y][x] == 1)
                    dato += "0";
                if (y == posProta[0] && x == posProta[1])
                    dato += "9";
            }
        }
        console.log(dato);
    }
    comprobarSiPuedeMoverse(c) {
        switch (c.orientacion) {
            case 0:
                if (this.comprobarCasillaVacia(c.casillaActual[0] - 1, c.casillaActual[1])) {
                    this.cuadricula[c.casillaActual[0]][c.casillaActual[1]] = 1;
                    this.cuadricula[c.casillaActual[0] - 1][c.casillaActual[1]] = 2;
                    return true;
                }
                break;
            case 1:
                if (this.comprobarCasillaVacia(c.casillaActual[0], c.casillaActual[1] + 1)) {
                    this.cuadricula[c.casillaActual[0]][c.casillaActual[1]] = 1;
                    this.cuadricula[c.casillaActual[0]][c.casillaActual[1] + 1] = 2;
                    return true;
                }
                break;
            case 2:
                if (this.comprobarCasillaVacia(c.casillaActual[0] + 1, c.casillaActual[1])) {
                    this.cuadricula[c.casillaActual[0]][c.casillaActual[1]] = 1;
                    this.cuadricula[c.casillaActual[0] + 1][c.casillaActual[1]] = 2;
                    return true;
                }
                break;
            case 3:
                if (this.comprobarCasillaVacia(c.casillaActual[0], c.casillaActual[1] - 1)) {
                    this.cuadricula[c.casillaActual[0]][c.casillaActual[1]] = 1;
                    this.cuadricula[c.casillaActual[0]][c.casillaActual[1] - 1] = 2;
                    return true;
                }
                break;
        }
        return false;
    }
    liberarCasilla(casilla) {
        this.cuadricula[casilla[0]][casilla[1]] = 1;
    }
    OcuparCasilla(casilla) {
        this.cuadricula[casilla[0]][casilla[1]] = 2;
    }
    esDentroMapa(y, x) {
        if (y >= 0 && y <= this.tamMapa && x >= 0 && x < this.tamMapa)
            return true;
        return false;
    }
    getPosParaEscaleras() {
        let habitacion = Matematicas.RandInteger(0, this.HabitacionesCreadas - 1);
        let orientacion = Matematicas.RandInteger(0, 4);
        let y = this.PosHabitacionesY[habitacion];
        let x = this.PosHabitacionesX[habitacion];
        let totalVeces = 0;
        while (this.esDentroMapa(y, x) && this.comprobarCasillaVacia(y, x)) {
            if (orientacion == 0)
                y--;
            if (orientacion == 1)
                x++;
            if (orientacion == 2)
                y++;
            if (orientacion == 3)
                x--;
            totalVeces++;
        }
        if (orientacion == 0)
            y++;
        if (orientacion == 1)
            x--;
        if (orientacion == 2)
            y--;
        if (orientacion == 4)
            x++;
        console.log("escaleras en habitacion " + habitacion + " y = " + y + " x = " + x);
        this.cuadricula[y][x] = 3;
        return [y, x, orientacion];
    }
    esEscalera(y, x) {
        if (this.cuadricula[y][x] == 3)
            return true;
        return false;
    }
    getPosicioneHabitaciones() {
        let array = [];
        for (let i = 0; i < this.PosHabitacionesX.length; i++) {
            array.push(this.PosHabitacionesX[i]);
            array.push(this.PosHabitacionesY[i]);
        }
        return array;
    }
}
