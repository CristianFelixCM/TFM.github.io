export class Clock{

    now : number;
    then : number;
    delta: number;

    constructor(){
        this.now = Date.now();
        this.then = 0;
        this.delta = 0;
    }

    actualizarDelta(){
        this.now = Date.now();
        if(this.delta>60){this.delta=0;}
        this.delta += (this.now - this.then) / 1000; 
        this.then = this.now;
    }

    getDelta(){
        return this.delta;
    }

    iniciar(){
        this.now = 0;
        this.then = Date.now();
        this.delta = 0;
    }

}