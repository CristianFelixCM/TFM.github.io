import { WebGLController } from "../../WebGLController/WebGLController.js";
import { ModelController } from "../../WebGLController/Model.js";
import { Matematicas } from "../../WebGLController/Matematicas.js";
import { Clock } from "../Clock.js";

export class Character{

    model : string;
    matrix : any;

    orientacion: any;
    gradosGiro : any;
    
    animaciones : string[];
    framesAnimaciones : number[];
    animacionActual : number;
    frameActual : number;
    tiempoTardaRealizarAnimacion;

    clock : Clock;

    state : number; 

    stateAndar : number; 

    casillaActual : number[] = [0,0]; 
    tiempoRecorrerCasilla : number;


    identificador : number; 

    Hp = 100;
    HpActual = this.Hp;
    dañoGolpe = 50;
    expPorDerrota = 10;
    expActual = 0;
    expSubirNivel = 10;
    nivel = 1;

    
    constructor(id : number, name : string, animaciones : string[], framesAnimaciones : number[]){
        this.model = name;

        this.matrix = new Float32Array([
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            0.0,  0.0,  0.0,  1.0  
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
    

    async cargarModelo(gl : WebGL2RenderingContext){
        await ModelController.cargarModelo(this.model, this.animaciones, this.framesAnimaciones ,gl);
    }


    setPosition(x : any, y : any, z : any){
        this.matrix = Matematicas.setPosition(this.matrix, x, y, z)
    }
    translation(x : any, y : any, z : any){
        this.matrix = Matematicas.translation(this.matrix, x, y, z)
    }
    getPosition(){
        return [this.matrix[12],this.matrix[13],this.matrix[14]];
    }
    setEscalar(Sx : any, Sy : any, Sz : any){
        this.matrix = Matematicas.setEscalar(this.matrix, Sx, Sy, Sz)
    }
    setRotateZ(angulo  : any) {
        this.matrix = Matematicas.setRotateZ(this.matrix, angulo);
     }
     setRotateX(angulo  : any) {
        this.matrix = Matematicas.setRotateX(this.matrix, angulo);
     }
     setRotateY(angulo  : any) {
        this.matrix = Matematicas.setRotateY(this.matrix, angulo);
     }   

     actualizarFrame(){
        this.clock.actualizarDelta();
        this.frameActual = Math.floor((this.clock.getDelta() / (this.tiempoTardaRealizarAnimacion / this.framesAnimaciones[this.animacionActual])) % this.framesAnimaciones[this.animacionActual]);
    }

     setState(s : number){
        this.state = s;
     }
     getState(){
        return this.state;
     }
     
     getCasilla(){
        return [this.casillaActual[0],this.casillaActual[1]];
     }
     setCasilla(y : number, x : number){
        this.casillaActual[0] = y;
        this.casillaActual[1] = x;
     }


     cambiarOrientacion(orientacion : number){
        this.gradosGiro = (this.orientacion - orientacion) * 90;
        this.setRotateY(this.gradosGiro) ;
        this.orientacion = orientacion;
        
     }


     cambiarCasilla(){
        switch(this.orientacion){
            case 0 :
                this.casillaActual[0] -= 1;
            break;
            case 1 :
                this.casillaActual[1] += 1;
            break;
            case 2 :
                this.casillaActual[0] += 1;
            break;
            case 3 :
                this.casillaActual[1] -= 1;
            break;             
        }       
     }


     setHp(daño : number){
        this.HpActual -= daño;
     }



     getOrientacion(){return this.orientacion}

}