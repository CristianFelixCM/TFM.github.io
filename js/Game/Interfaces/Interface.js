export class Interface {
    constructor(canvas, context) {
        this.mapa = [];
        this.log = [];
        this.mapaActivo = false;
        this.logActivo = false;
        this.pulsadoTouch = false;
        this.xPulsado = 0;
        this.yPulsado = 0;
        this.fps = 0;
        this.context = context;
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context.width = window.innerWidth;
        this.context.height = window.innerHeight;
        this.imagen = new Image();
        if (/android|iphone|ipad/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
            this.imagen.src = "ts/Images/InterfazMovil.png";
            this.isPC = false;
        }
        else {
            this.imagen.src = "ts/Images/InterfazPC.png";
            this.isPC = true;
        }
        for (var y = 0; y < 50; y++) {
            this.mapa[y] = [];
            for (var x = 0; x < 50; x++) {
                this.mapa[y][x] = 0;
            }
        }
    }
    drawInterfaceGamePlay(map, prota) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.imagen, 0, 0, this.imagen.width, this.imagen.height, 0, 0, this.canvas.width, this.canvas.height);
        this.drawMiniMap(map, prota);
        if (this.isPC) {
            this.showTextLog();
        }
        else {
            if (this.logActivo) {
                this.showTextLog();
            }
        }
        this.showNumeroPocionesYFlechas(prota);
        this.showBarraVida(prota);
        if (this.mapaActivo == true) {
            this.drawMap(map, prota);
        }
        if (this.pulsadoTouch)
            this.pintarSombrado();
    }
    drawMiniMap(map, prota) {
        let posY = this.canvas.width * 0.02;
        let posX = this.canvas.width * 0.78;
        let tamY = this.canvas.width * 0.02;
        let tamX = this.canvas.width * 0.02;
        for (let y = -2; y <= 2; y++) {
            for (let x = -2; x <= 2; x++) {
                if (prota.getCasilla()[0] + y >= 0 && prota.getCasilla()[1] + x >= 0 && prota.getCasilla()[0] + y < map.tamMapa && prota.getCasilla()[1] + x < map.tamMapa) {
                    if (!map.comprobarCasillaEsPared(prota.getCasilla()[0] + y, prota.getCasilla()[1] + x)) {
                        this.mapa[prota.getCasilla()[0] + y][prota.getCasilla()[1] + x] = 1;
                    }
                    else {
                        this.mapa[prota.getCasilla()[0] + y][prota.getCasilla()[1] + x] = 2;
                    }
                    if (map.esEscalera(prota.getCasilla()[0] + y, prota.getCasilla()[1] + x)) {
                        this.mapa[prota.getCasilla()[0] + y][prota.getCasilla()[1] + x] = 3;
                        console.log("ES CALERA");
                    }
                }
            }
        }
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                this.context.fillStyle = "rgba(0, 0, 0, 0.25)";
                this.context.fillRect(posX + (x * tamX), posY + (y * tamY), tamX, tamY);
                if (prota.getCasilla()[0] - (4 - y) >= 0 && prota.getCasilla()[0] + (4 - y) < map.tamMapa && prota.getCasilla()[1] - (4 - x) >= 0 && prota.getCasilla()[1] + (4 - x) < map.tamMapa) {
                    if (this.mapa[prota.getCasilla()[0] - (4 - y)][prota.getCasilla()[1] - (4 - x)] == 1) {
                        this.context.fillStyle = "rgba(255, 255, 255, 0.5)";
                        this.context.fillRect(posX + (x * tamX), posY + (y * tamY), tamX, tamY);
                    }
                    if (this.mapa[prota.getCasilla()[0] - (4 - y)][prota.getCasilla()[1] - (4 - x)] == 2) {
                        this.context.fillStyle = "rgba(80, 80, 80, 0.5)";
                        this.context.fillRect(posX + (x * tamX), posY + (y * tamY), tamX, tamY);
                    }
                    if (this.mapa[prota.getCasilla()[0] - (4 - y)][prota.getCasilla()[1] - (4 - x)] == 3) {
                        this.context.fillStyle = "rgba(255, 240, 0, 0.5)";
                        this.context.fillRect(posX + (x * tamX), posY + (y * tamY), tamX, tamY);
                    }
                    if (map.comprobarCasillaOcupada(prota.getCasilla()[0] - (4 - y), prota.getCasilla()[1] - (4 - x))) {
                        this.context.fillStyle = "rgba(255, 0, 0, 0.5)";
                        this.context.fillRect(posX + (x * tamX), posY + (y * tamY), tamX, tamY);
                    }
                    if (x == 4 && y == 4) {
                        this.context.fillStyle = "rgba(80, 80, 80, 1)";
                        this.context.fillRect(posX + (x * tamX), posY + (y * tamY), tamX, tamY);
                        this.context.fillStyle = "rgba(255, 255, 255, 1)";
                        var path = new Path2D();
                        if (prota.getOrientacion() == 0) {
                            path.moveTo(posX + (x * tamX) + (tamX), posY + (y * tamY) + (tamY));
                            path.lineTo(posX + (x * tamX) + (tamX / 2), posY + (y * tamY));
                            path.lineTo(posX + (x * tamX), posY + (y * tamY) + (tamY));
                        }
                        else if (prota.getOrientacion() == 1) {
                            path.moveTo(posX + (x * tamX), posY + (y * tamY));
                            path.lineTo(posX + (x * tamX) + (tamX), posY + (y * tamY) + (tamX / 2));
                            path.lineTo(posX + (x * tamX), posY + (y * tamY) + (tamY));
                        }
                        else if (prota.getOrientacion() == 2) {
                            path.moveTo(posX + (x * tamX) + (tamX), posY + (y * tamY));
                            path.lineTo(posX + (x * tamX) + (tamX / 2), posY + (y * tamY) + (tamY));
                            path.lineTo(posX + (x * tamX), posY + (y * tamY));
                        }
                        else {
                            path.moveTo(posX + (x * tamX) + (tamX), posY + (y * tamY));
                            path.lineTo(posX + (x * tamX), posY + (y * tamY) + (tamX / 2));
                            path.lineTo(posX + (x * tamX) + (tamX), posY + (y * tamY) + (tamY));
                        }
                        this.context.fill(path);
                    }
                }
            }
        }
    }
    drawMap(map, prota) {
        let posY = this.canvas.height * 0.05;
        let posX = this.canvas.width * 0.32;
        let tamY = (this.canvas.height * (this.canvas.width / this.canvas.height)) * 0.008;
        let tamX = this.canvas.width * 0.008;
        this.context.fillStyle = "rgba(0, 0, 0, 0.25)";
        this.context.fillRect(posX, posY, tamX * map.tamMapa, tamY * map.tamMapa);
        for (let y = 0; y < this.mapa.length; y++) {
            for (let x = 0; x < this.mapa.length; x++) {
                if (this.mapa[y][x] == 1) {
                    this.context.fillStyle = "rgba(255, 255, 255, 0.5)";
                    this.context.fillRect(posX + (x * tamX), posY + (y * tamY), tamX, tamY);
                }
                if (this.mapa[y][x] == 2) {
                    this.context.fillStyle = "rgba(80, 80, 80, 0.5)";
                    this.context.fillRect(posX + (x * tamX), posY + (y * tamY), tamX, tamY);
                }
                if (this.mapa[y][x] == 3) {
                    this.context.fillStyle = "rgba(255, 240, 0, 0.5)";
                    this.context.fillRect(posX + (x * tamX), posY + (y * tamY), tamX, tamY);
                }
                if (x == prota.getCasilla()[1] && y == prota.getCasilla()[0]) {
                    this.context.fillStyle = "rgba(80, 80, 80, 1)";
                    this.context.fillRect(posX + (x * tamX), posY + (y * tamY), tamX, tamY);
                    this.context.fillStyle = "rgba(255, 255, 255, 1)";
                    var path = new Path2D();
                    if (prota.getOrientacion() == 0) {
                        path.moveTo(posX + (x * tamX) + (tamX), posY + (y * tamY) + (tamY));
                        path.lineTo(posX + (x * tamX) + (tamX / 2), posY + (y * tamY));
                        path.lineTo(posX + (x * tamX), posY + (y * tamY) + (tamY));
                    }
                    else if (prota.getOrientacion() == 1) {
                        path.moveTo(posX + (x * tamX), posY + (y * tamY));
                        path.lineTo(posX + (x * tamX) + (tamX), posY + (y * tamY) + (tamX / 2));
                        path.lineTo(posX + (x * tamX), posY + (y * tamY) + (tamY));
                    }
                    else if (prota.getOrientacion() == 2) {
                        path.moveTo(posX + (x * tamX) + (tamX), posY + (y * tamY));
                        path.lineTo(posX + (x * tamX) + (tamX / 2), posY + (y * tamY) + (tamY));
                        path.lineTo(posX + (x * tamX), posY + (y * tamY));
                    }
                    else {
                        path.moveTo(posX + (x * tamX) + (tamX), posY + (y * tamY));
                        path.lineTo(posX + (x * tamX), posY + (y * tamY) + (tamX / 2));
                        path.lineTo(posX + (x * tamX) + (tamX), posY + (y * tamY) + (tamY));
                    }
                    this.context.fill(path);
                }
            }
        }
    }
    showMap() {
        this.mapaActivo = !this.mapaActivo;
    }
    showLog() {
        this.logActivo = !this.logActivo;
        if (this.logActivo) {
            this.imagen.src = "ts/Images/InterfazMovilLogOn.png";
        }
        else {
            this.imagen.src = "ts/Images/InterfazMovil.png";
        }
    }
    addTextLog(text) {
        this.log.push(text);
        if (this.log.length >= 5)
            this.log.shift();
    }
    showTextLog() {
        this.context.shadowColor = "Black";
        this.context.shadowBlur = 7;
        this.context.fillStyle = "White";
        let posY = 0;
        let posX = 0;
        let desplazamiento = 0;
        if (this.isPC) {
            this.context.font = this.canvas.width * 0.01 + "px Amita";
            posY = this.canvas.height * 0.85;
            posX = this.canvas.width * 0.02;
            desplazamiento = this.canvas.height * 0.03;
        }
        else {
            this.context.font = this.canvas.width * 0.02 + "px Amita";
            posY = this.canvas.height * 0.12;
            posX = this.canvas.width * 0.05;
            desplazamiento = this.canvas.height * 0.05;
        }
        for (let i = 0; i < this.log.length; i++) {
            this.context.strokeText(this.log[i], posX, posY + desplazamiento * i);
            this.context.fillText(this.log[i], posX, posY + desplazamiento * i);
        }
    }
    showNumeroPocionesYFlechas(prota) {
        let posY = 0;
        let posX = 0;
        if (this.isPC) {
            this.context.font = this.canvas.width * 0.02 + "px Amita";
            posY = this.canvas.height * 0.915;
            posX = this.canvas.width * 0.81;
            this.context.strokeText(prota.numPociones, posX, posY);
            this.context.fillText(prota.numPociones, posX, posY);
            posY = this.canvas.height * 0.915;
            posX = this.canvas.width * 0.915;
            this.context.strokeText(prota.numFlechas, posX, posY);
            this.context.fillText(prota.numFlechas, posX, posY);
        }
        else {
            this.context.font = this.canvas.width * 0.03 + "px Amita";
            posY = this.canvas.height * 0.875;
            posX = this.canvas.width * 0.795;
            this.context.strokeText(prota.numPociones, posX, posY);
            this.context.fillText(prota.numPociones, posX, posY);
            posY = this.canvas.height * 0.685;
            posX = this.canvas.width * 0.905;
            this.context.strokeText(prota.numFlechas, posX, posY);
            this.context.fillText(prota.numFlechas, posX, posY);
        }
    }
    showBarraVida(prota) {
        let posY = 0;
        let posX = 0;
        this.context.fillStyle = "red";
        if (this.isPC)
            this.context.fillRect(this.canvas.width * 0.355, this.canvas.height * 0.9, this.canvas.width * 0.321 * (prota.HpActual / prota.Hp), this.canvas.height * 0.055);
        else
            this.context.fillRect(this.canvas.width * 0.343, this.canvas.height * 0.865, this.canvas.width * 0.321 * (prota.HpActual / prota.Hp), this.canvas.height * 0.055);
        this.context.shadowColor = "Black";
        this.context.shadowBlur = 7;
        this.context.fillStyle = "White";
        if (this.isPC) {
            this.context.font = this.canvas.width * 0.02 + "px Amita";
            posY = this.canvas.height * 0.945;
            posX = this.canvas.width * 0.475;
        }
        else {
            this.context.font = this.canvas.width * 0.03 + "px Amita";
            posY = this.canvas.height * 0.925;
            posX = this.canvas.width * 0.44;
        }
        this.context.strokeText(prota.HpActual + " / " + prota.Hp, posX, posY);
        this.context.fillText(prota.HpActual + " / " + prota.Hp, posX, posY);
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context.width = window.innerWidth;
        this.context.height = window.innerHeight;
    }
    sombrearTouch(x, y, pintar) {
        this.xPulsado = x;
        this.yPulsado = y;
        this.pulsadoTouch = pintar;
    }
    pintarSombrado() {
        this.context.fillStyle = "rgba(80, 80, 80, 0.5)";
        this.context.fill();
        this.context.beginPath();
        this.context.arc(this.xPulsado, this.yPulsado, innerWidth * 0.05, 0, 2 * Math.PI);
        this.context.stroke();
    }
    pintarContadorFPS() {
        let posY = 0;
        let posX = 0;
        this.context.shadowColor = "Black";
        this.context.shadowBlur = 7;
        this.context.fillStyle = "White";
        if (this.isPC) {
            this.context.font = this.canvas.width * 0.02 + "px Amita";
            posY = this.canvas.height * 0.1;
            posX = this.canvas.width * 0.1;
        }
        else {
            this.context.font = this.canvas.width * 0.03 + "px Amita";
            posY = this.canvas.height * 0.1;
            posX = this.canvas.width * 0.1;
        }
        this.context.strokeText("FPS = " + this.fps, posX, posY);
        this.context.fillText("FPS = " + this.fps, posX, posY);
    }
    comprobarBotones() {
        this.context.fillStyle = "red";
        this.context.fill();
        this.context.beginPath();
        this.context.arc(window.innerWidth * 0.065, window.innerHeight * 0.765, innerWidth * 0.05, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(window.innerWidth * 0.145, window.innerHeight * 0.63, innerWidth * 0.05, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(window.innerWidth * 0.215, window.innerHeight * 0.765, innerWidth * 0.05, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(window.innerWidth * 0.145, window.innerHeight * 0.9, innerWidth * 0.05, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(window.innerWidth * 0.87, window.innerHeight * 0.17, innerWidth * 0.09, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(window.innerWidth * 0.8, window.innerHeight * 0.87, innerWidth * 0.05, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(window.innerWidth * 0.92, window.innerHeight * 0.68, innerWidth * 0.05, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(window.innerWidth * 0.92, window.innerHeight * 0.87, innerWidth * 0.05, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(window.innerWidth * 0.15, window.innerHeight * 0.01, innerWidth * 0.05, 0, 2 * Math.PI);
        this.context.stroke();
    }
}
