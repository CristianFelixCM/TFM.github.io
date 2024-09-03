import { WebGLController } from "../../WebGLController/WebGLController.js";
import { Character } from "./Character.js";

export class Protagonist extends Character{

    numFlechas = 5;
    numPociones = 5;

    posPrevia = [0,0,0];
    posPreviaCamara = [0,0,0];
    andar(map : any){
       if(this.stateAndar == 0){ 

           if(map.comprobarSiPuedeMoverse(this)){
            this.clock.iniciar();
            this.stateAndar = 1;
            this.cambiarCasilla();
            this.posPrevia = this.getPosition();
            this.posPreviaCamara = WebGLController.getCamera().getPosition();
           }
           else{
            this.state = 0;
            this.stateAndar = 0;
            return 0;
            }

       }else{
           let pixelesActualesMovidos = this.clock.delta / (this.tiempoRecorrerCasilla / 2)
           this.actualizarFrame();
         
           if(this.clock.delta <= this.tiempoRecorrerCasilla){
 
               switch(this.orientacion){
                   case 0 :
                       this.setPosition(this.posPrevia[0],this.posPrevia[1],this.posPrevia[2] - pixelesActualesMovidos);                      
                       WebGLController.getCamera().setPosition([WebGLController.getCamera().getPosition()[0],WebGLController.getCamera().getPosition()[1],this.posPreviaCamara[2]-pixelesActualesMovidos]);
                   break;
                   case 1 :
                       this.setPosition(this.posPrevia[0] + pixelesActualesMovidos,this.posPrevia[1],this.posPrevia[2]);
                       WebGLController.getCamera().setPosition([this.posPreviaCamara[0]+pixelesActualesMovidos,WebGLController.getCamera().getPosition()[1],WebGLController.getCamera().getPosition()[2]]);
                   break;
                   case 2 :
                       this.setPosition(this.posPrevia[0] ,this.posPrevia[1],this.posPrevia[2] + pixelesActualesMovidos);
                       WebGLController.getCamera().setPosition([WebGLController.getCamera().getPosition()[0],WebGLController.getCamera().getPosition()[1],this.posPreviaCamara[2]+pixelesActualesMovidos]);
                   break;
                   case 3 :
                       this.setPosition(this.posPrevia[0] - pixelesActualesMovidos,this.posPrevia[1],this.posPrevia[2] );
                       WebGLController.getCamera().setPosition([this.posPreviaCamara[0]-pixelesActualesMovidos,WebGLController.getCamera().getPosition()[1],WebGLController.getCamera().getPosition()[2]]);
                   break;             
               }
           }
           else{

               
               this.setPosition(Math.round(this.getPosition()[0]), Math.round(this.getPosition()[1]), Math.round(this.getPosition()[2]));
               let cameraPos = WebGLController.getCamera().getPosition();
               WebGLController.getCamera().setPosition([Math.round(cameraPos[0]), cameraPos[1], Math.round(cameraPos[2])]);

               this.state = 0;
               this.stateAndar = 0;
               return 0;
           }
       }    
       return 1;
    }




    usarPocion(){
        if(this.HpActual != this.Hp && this.numPociones > 0){
            this.numPociones --;
            if(this.HpActual + 50 > this.Hp){
                this.HpActual = this.Hp;
             }
            else{
                this.HpActual += 50;
            }
            return 1; 
        }
        return -1 
     }

     cogerPocion(){
        if(this.numPociones < 10){
            this.numPociones++;
            return true;
        }
        return false;
     }

     cogerFlecha(){
        if(this.numFlechas < 20){
            this.numFlechas++;
            return true;
        }
        return false;
     }


}