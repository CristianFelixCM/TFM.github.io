var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class LectorOBJ {
    static getTextOBJ(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let objetoOBJ = yield fetch(file);
            let textoOBJ = yield objetoOBJ.text();
            var v = [];
            var vt = [];
            var vn = [];
            var face0 = [];
            var face1 = [];
            var face2 = [];
            var dato = textoOBJ.replace("\r", '').split("\n");
            for (var i = 0; i < dato.length; i++) {
                var intermedio = dato[i].split(" ");
                if ("v " == dato[i].slice(0, 2)) {
                    v.push([intermedio[1], intermedio[2], intermedio[3]]);
                }
                if ("vt" == dato[i].slice(0, 2)) {
                    vt.push([intermedio[1], intermedio[2]]);
                }
                if ("vn" == dato[i].slice(0, 2)) {
                    vn.push([intermedio[1], intermedio[2], intermedio[3]]);
                }
                if ("f " == dato[i].slice(0, 2)) {
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
        });
    }
    static getTextMTL(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let objetoMTL = yield fetch(file);
            let textoMTL = yield objetoMTL.text();
            var Ns;
            var Ka = [];
            var Ks = [];
            var Ke = [];
            var Ni;
            var d;
            var image;
            var dato = textoMTL.replace("\r", '').split("\n");
            for (var i = 0; i < dato.length; i++) {
                var intermedio = dato[i].split(" ");
                if ("Ns" == dato[i].slice(0, 2)) {
                    Ns = intermedio[1];
                }
                if ("Ka" == dato[i].slice(0, 2)) {
                    Ka.push([intermedio[1], intermedio[2], intermedio[3]]);
                }
                if ("Ks" == dato[i].slice(0, 2)) {
                    Ks.push([intermedio[1], intermedio[2], intermedio[3]]);
                }
                if ("Ke" == dato[i].slice(0, 2)) {
                    Ke.push([intermedio[1], intermedio[2], intermedio[3]]);
                }
                if ("Ni" == dato[i].slice(0, 2)) {
                    Ni = intermedio[1];
                }
                if ("d " == dato[i].slice(0, 2)) {
                    d = intermedio[1];
                }
                if ("ma" == dato[i].slice(0, 2)) {
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
        });
    }
}
