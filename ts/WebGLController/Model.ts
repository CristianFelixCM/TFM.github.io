import { VAO } from "./VAO.js";
import { LectorOBJ } from "./LectorOBJ.js"; 



export class ModelController{
    static models : Map<string, Model> = new Map<string, Model>();;

    static async cargarModelo(name : string, animaciones : string[], framesAnimaciones : number[], gl : WebGL2RenderingContext){
        if(!this.models.has(name)){
            let model = new Model();
            await model.cargarModelo(name, animaciones, framesAnimaciones, gl);
            this.models.set(name, model);
        }
    }

    static getVAO(name : string, animation : number, frame : number){
            return this.models.get(name)?.getVAO(animation, frame);
    }

    static getTexture(name : string, animation : number, frame : number){
            return this.models.get(name)?.getTexture(animation, frame);
    }

    static getTotalVertex(name : string, animation : number, frame : number){
        return this.models.get(name)?.getTotalVertex(animation,frame);
    }

  
    static getKa(name : string){
        return this.models.get(name)?.getKa();
    }
    static getKd(name : string){
        return this.models.get(name)?.getKd();
    }
    static getKs(name : string){
        return this.models.get(name)?.getKs();
    }
    static getNs(name : string){
        return this.models.get(name)?.getNs();
    }

}



class Model {


    animations : any[] = [];
    
    image  : any;

    ka : any; 
    kd : any; 
    ks : any;
    ns : any;

    async cargarModelo(modelo : String, animaciones : string[], framesAnimaciones : number[], gl : WebGL2RenderingContext){

      for(var animacion = 0; animacion < animaciones.length; animacion++){ 
         var animation : VAO[] = [];
       
         for(var frame = 1; frame <= framesAnimaciones[animacion]; frame++){
            var vao = this.cargarVAODeOBJ("/ts/Models/"+modelo+"/"+animaciones[animacion]+"/",modelo+""+frame, gl);   
            animation.push(await vao);
         }
         this.animations.push(animation);
      }
     
    }

 
   async cargarVAODeOBJ(ruta : string, nombreModelo : string, gl : WebGL2RenderingContext){
       

       var textObj = LectorOBJ.getTextOBJ(ruta+nombreModelo+".obj");

       const OBJ = JSON.parse(await textObj);


        var v = [];
        var vt = [];
        var vn = [];
        
        for(var i = 0; i < OBJ.face0.length; i++){
        

            v.push(OBJ.v[OBJ.face0[i][0]-1][0]); 
            v.push(OBJ.v[OBJ.face0[i][0]-1][1]); 
            v.push(OBJ.v[OBJ.face0[i][0]-1][2]); 
            v.push(OBJ.v[OBJ.face1[i][0]-1][0]);
            v.push(OBJ.v[OBJ.face1[i][0]-1][1]);
            v.push(OBJ.v[OBJ.face1[i][0]-1][2]);
            v.push(OBJ.v[OBJ.face2[i][0]-1][0]);
            v.push(OBJ.v[OBJ.face2[i][0]-1][1]);
            v.push(OBJ.v[OBJ.face2[i][0]-1][2]);

            vt.push(OBJ.vt[OBJ.face0[i][1]-1][0]);
            vt.push(OBJ.vt[OBJ.face0[i][1]-1][1]);
            vt.push(OBJ.vt[OBJ.face1[i][1]-1][0]);
            vt.push(OBJ.vt[OBJ.face1[i][1]-1][1]);
            vt.push(OBJ.vt[OBJ.face2[i][1]-1][0]);
            vt.push(OBJ.vt[OBJ.face2[i][1]-1][1]);

            vn.push(OBJ.vn[OBJ.face0[i][2]-1][0]);
            vn.push(OBJ.vn[OBJ.face0[i][2]-1][1]);
            vn.push(OBJ.vn[OBJ.face0[i][2]-1][2]); 
            vn.push(OBJ.vn[OBJ.face1[i][2]-1][0]);
            vn.push(OBJ.vn[OBJ.face1[i][2]-1][1]);
            vn.push(OBJ.vn[OBJ.face1[i][2]-1][2]);
            vn.push(OBJ.vn[OBJ.face2[i][2]-1][0]);
            vn.push(OBJ.vn[OBJ.face2[i][2]-1][1]);
            vn.push(OBJ.vn[OBJ.face2[i][2]-1][2]);


        }



        var vao = new VAO(gl);



        if(this.image == null){ 
           

            var textMTL = LectorOBJ.getTextMTL(ruta+nombreModelo+".mtl");
            const OBJMTL = JSON.parse(await textMTL);

            this.image = new Image();
            await this.setImage(ruta+OBJMTL.image);
            await vao.createTextureBuffer(gl,this.image);

            this.ka = [OBJMTL.Ka[0],OBJMTL.Ka[1],OBJMTL.Ka[2], 1.0];

            if(OBJMTL.hasOwnProperty("Kd")){
                this.kd = [OBJMTL.Kd[0],OBJMTL.Kd[1],OBJMTL.Kd[2], 1.0];
            }else{
                this.kd = [1.0, 1.0, 1.0, 1.0];
            }
            
            this.ks = [OBJMTL.Ks[0],OBJMTL.Ks[1],OBJMTL.Ks[2], 1.0];
            this.ns = OBJMTL.Ns;
        }


       vao.init(gl,v, vn, vt);
       return vao;

   }




   getVAO(animacion : number, frame : number){
    return this.animations[animacion][frame].vao;
   }

   getTexture(animacion : number, frame : number){
    return this.animations[animacion][frame].textureBuffer;
   }

   getKa(){return this.ka[0];}
   getKd(){return this.kd;}
   getKs(){return this.ks[0];}
   getNs(){return this.ns[0];}

   getTotalVertex(animacion : number, frame : number){
    return this.animations[animacion][frame].getTotalVertices();
   }


   async setImage(dato : any){
    let myPromise = new Promise(function(resolve) {
        var image = new Image();
        image.onload = function() {
            resolve(image);
        };
        image.src = dato;
     });
    this.image = await myPromise;
}




}


