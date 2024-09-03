import { Matematicas } from "./../WebGLController/Matematicas.js"; 


export class Turnos{

    turnos = [0];
    turnoActual = 0;

    añadirEnTurnos(id : number){
      this.turnos.push(id);
    }
    
    actualizarTurnos(){
      for(let idx = 0; idx < this.turnos.length; idx++){
        if(this.turnos[idx] == this.turnoActual){
          this.turnoActual = this.turnos[Matematicas.modulo(idx+1,this.turnos.length)]
          console.log("turno actual "+this.turnoActual)
          break;
        }
      }
    }

    borrarEnTurnos(id : number){
      console.log(this.turnos);
      for(let idx = 0; idx < this.turnos.length; idx++){
        if(this.turnos[idx] == id){
          if(id == this.turnoActual){this.turnoActual = this.turnos[Matematicas.modulo(idx+1,this.turnos.length)]}
          
          this.turnos.splice(idx, 1);
          break;
        }
      }    
    }
  
}