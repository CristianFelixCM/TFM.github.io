export class LectorOBJ{

     static async getTextOBJ(file : string | URL) {

        let objetoOBJ = await fetch(file);

        let textoOBJ = await objetoOBJ.text();
        

        var v = [];
        var vt = [];
        var vn = [];
        var face0 = [];  
        var face1 = [];
        var face2 = [];

        var dato = textoOBJ.replace("\r",'').split("\n");
        for(var i = 0; i < dato.length; i++){
            var intermedio = dato[i].split(" ");

            if("v " == dato[i].slice(0, 2)) {
                v.push([intermedio[1], intermedio[2], intermedio[3]]); 
             }
            if("vt" == dato[i].slice(0, 2)) {
                vt.push([intermedio[1] , intermedio[2]]); 
            }
            if("vn" == dato[i].slice(0, 2)) {
                vn.push([intermedio[1] , intermedio[2] , intermedio[3]]);
             }
            
            if("f " == dato[i].slice(0, 2)) {
                let datosFace = dato[i].split(" ");
                 face0.push(datosFace[1].split("/")); 
                 face1.push(datosFace[2].split("/")); 
                 face2.push(datosFace[3].split("/"));
            }
        } 


        const JSonOBJ = `{
            "v": [],
            "vt":[],
            "vn":[],
            "face0" :[],
            "face1" : [],
            "face2" :[]
            }`;
        const myObj = JSON.parse(JSonOBJ);
        myObj.v = v;
        myObj.vt = vt;
        myObj.vn = vn;
        myObj.face0 = face0;
        myObj.face1 = face1;
        myObj.face2 = face2;

        return JSON.stringify(myObj);
      }



    static async getTextMTL(file : string | URL){

       
        let objetoMTL = await fetch(file);
        let textoMTL = await objetoMTL.text();

        var Ns;
        var Ka = [];
        var Ks = [];
        var Ke = [];
        var Ni;
        var d;
        var image;

        var dato = textoMTL.replace("\r",'').split("\n");
        for(var i = 0; i < dato.length; i++){
            var intermedio = dato[i].split(" ");

            if("Ns" == dato[i].slice(0, 2)) {
                Ns = intermedio[1];
            }
            if("Ka" == dato[i].slice(0, 2)) {
                Ka.push([intermedio[1] , intermedio[2], intermedio[3]]); 
            }
            if("Ks" == dato[i].slice(0, 2)) {
                Ks.push([intermedio[1] , intermedio[2] , intermedio[3]]);
             }
            if("Ke" == dato[i].slice(0, 2)) {
                Ke.push([intermedio[1] , intermedio[2] , intermedio[3]]);
            }           
            if("Ni" == dato[i].slice(0, 2)) {
                Ni = intermedio[1];
            }
            if("d " == dato[i].slice(0, 2)) {
                d = intermedio[1];
            }
            if("ma" == dato[i].slice(0, 2)) {
                image = intermedio[1];
            }
        } 


        const JSonMTL = `{
            "Ns" : [],
            "Ka":[],
            "Ks":[],
            "Ke" :[],
            "Ni" : [],
            "d" : [],
            "image" : []
            }`;
        const myObj = JSON.parse(JSonMTL);
        myObj.Ns = Ns;
        myObj.Ka = Ka;
        myObj.Ks = Ks;
        myObj.Ke = Ke;
        myObj.Ni = Ni;
        myObj.d = d;
        myObj.image = image;


        return JSON.stringify(myObj);
    }

}