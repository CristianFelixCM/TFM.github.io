var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { VAO } from "./VAO.js";
import { LectorOBJ } from "./LectorOBJ.js";
export class ModelController {
    ;
    static cargarModelo(name, animaciones, framesAnimaciones, gl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.models.has(name)) {
                let model = new Model();
                yield model.cargarModelo(name, animaciones, framesAnimaciones, gl);
                this.models.set(name, model);
            }
        });
    }
    static getVAO(name, animation, frame) {
        var _a;
        return (_a = this.models.get(name)) === null || _a === void 0 ? void 0 : _a.getVAO(animation, frame);
    }
    static getTexture(name, animation, frame) {
        var _a;
        return (_a = this.models.get(name)) === null || _a === void 0 ? void 0 : _a.getTexture(animation, frame);
    }
    static getTotalVertex(name, animation, frame) {
        var _a;
        return (_a = this.models.get(name)) === null || _a === void 0 ? void 0 : _a.getTotalVertex(animation, frame);
    }
    static getKa(name) {
        var _a;
        return (_a = this.models.get(name)) === null || _a === void 0 ? void 0 : _a.getKa();
    }
    static getKd(name) {
        var _a;
        return (_a = this.models.get(name)) === null || _a === void 0 ? void 0 : _a.getKd();
    }
    static getKs(name) {
        var _a;
        return (_a = this.models.get(name)) === null || _a === void 0 ? void 0 : _a.getKs();
    }
    static getNs(name) {
        var _a;
        return (_a = this.models.get(name)) === null || _a === void 0 ? void 0 : _a.getNs();
    }
}
ModelController.models = new Map();
class Model {
    constructor() {
        this.animations = [];
    }
    cargarModelo(modelo, animaciones, framesAnimaciones, gl) {
        return __awaiter(this, void 0, void 0, function* () {
            for (var animacion = 0; animacion < animaciones.length; animacion++) {
                var animation = [];
                for (var frame = 1; frame <= framesAnimaciones[animacion]; frame++) {
                    var vao = this.cargarVAODeOBJ("/ts/Models/" + modelo + "/" + animaciones[animacion] + "/", modelo + "" + frame, gl);
                    animation.push(yield vao);
                }
                this.animations.push(animation);
            }
        });
    }
    cargarVAODeOBJ(ruta, nombreModelo, gl) {
        return __awaiter(this, void 0, void 0, function* () {
            var textObj = LectorOBJ.getTextOBJ(ruta + nombreModelo + ".obj");
            const OBJ = JSON.parse(yield textObj);
            var v = [];
            var vt = [];
            var vn = [];
            for (var i = 0; i < OBJ.face0.length; i++) {
                v.push(OBJ.v[OBJ.face0[i][0] - 1][0]);
                v.push(OBJ.v[OBJ.face0[i][0] - 1][1]);
                v.push(OBJ.v[OBJ.face0[i][0] - 1][2]);
                v.push(OBJ.v[OBJ.face1[i][0] - 1][0]);
                v.push(OBJ.v[OBJ.face1[i][0] - 1][1]);
                v.push(OBJ.v[OBJ.face1[i][0] - 1][2]);
                v.push(OBJ.v[OBJ.face2[i][0] - 1][0]);
                v.push(OBJ.v[OBJ.face2[i][0] - 1][1]);
                v.push(OBJ.v[OBJ.face2[i][0] - 1][2]);
                vt.push(OBJ.vt[OBJ.face0[i][1] - 1][0]);
                vt.push(OBJ.vt[OBJ.face0[i][1] - 1][1]);
                vt.push(OBJ.vt[OBJ.face1[i][1] - 1][0]);
                vt.push(OBJ.vt[OBJ.face1[i][1] - 1][1]);
                vt.push(OBJ.vt[OBJ.face2[i][1] - 1][0]);
                vt.push(OBJ.vt[OBJ.face2[i][1] - 1][1]);
                vn.push(OBJ.vn[OBJ.face0[i][2] - 1][0]);
                vn.push(OBJ.vn[OBJ.face0[i][2] - 1][1]);
                vn.push(OBJ.vn[OBJ.face0[i][2] - 1][2]);
                vn.push(OBJ.vn[OBJ.face1[i][2] - 1][0]);
                vn.push(OBJ.vn[OBJ.face1[i][2] - 1][1]);
                vn.push(OBJ.vn[OBJ.face1[i][2] - 1][2]);
                vn.push(OBJ.vn[OBJ.face2[i][2] - 1][0]);
                vn.push(OBJ.vn[OBJ.face2[i][2] - 1][1]);
                vn.push(OBJ.vn[OBJ.face2[i][2] - 1][2]);
            }
            var vao = new VAO(gl);
            if (this.image == null) {
                var textMTL = LectorOBJ.getTextMTL(ruta + nombreModelo + ".mtl");
                const OBJMTL = JSON.parse(yield textMTL);
                this.image = new Image();
                yield this.setImage(ruta + OBJMTL.image);
                yield vao.createTextureBuffer(gl, this.image);
                this.ka = [OBJMTL.Ka[0], OBJMTL.Ka[1], OBJMTL.Ka[2], 1.0];
                if (OBJMTL.hasOwnProperty("Kd")) {
                    this.kd = [OBJMTL.Kd[0], OBJMTL.Kd[1], OBJMTL.Kd[2], 1.0];
                }
                else {
                    this.kd = [1.0, 1.0, 1.0, 1.0];
                }
                this.ks = [OBJMTL.Ks[0], OBJMTL.Ks[1], OBJMTL.Ks[2], 1.0];
                this.ns = OBJMTL.Ns;
            }
            vao.init(gl, v, vn, vt);
            return vao;
        });
    }
    getVAO(animacion, frame) {
        return this.animations[animacion][frame].vao;
    }
    getTexture(animacion, frame) {
        return this.animations[animacion][frame].textureBuffer;
    }
    getKa() { return this.ka[0]; }
    getKd() { return this.kd; }
    getKs() { return this.ks[0]; }
    getNs() { return this.ns[0]; }
    getTotalVertex(animacion, frame) {
        return this.animations[animacion][frame].getTotalVertices();
    }
    setImage(dato) {
        return __awaiter(this, void 0, void 0, function* () {
            let myPromise = new Promise(function (resolve) {
                var image = new Image();
                image.onload = function () {
                    resolve(image);
                };
                image.src = dato;
            });
            this.image = yield myPromise;
        });
    }
}
