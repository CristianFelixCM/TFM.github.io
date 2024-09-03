var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ProgramShader } from "./Shader/ProgramShader.js";
import { ModelController } from "./Model.js";
import { Camera } from "./Camera.js";
import { Lights } from "./Lights.js";
export class WebGLController {
    static init(gl) {
        return __awaiter(this, void 0, void 0, function* () {
            this.gl = gl;
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            ProgramShader.generarShaders(this.gl);
            this.camera = new Camera(window.innerWidth, window.innerHeight);
            this.lights = new Lights();
        });
    }
    static initRender() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        this.gl.uniformMatrix4fv(ProgramShader.shaderProgram.uProjectionMatrix, false, this.camera.proj_matrix);
        this.gl.uniformMatrix4fv(ProgramShader.shaderProgram.uViewMatrix, false, this.camera.getViewTransform());
        this.gl.uniform1i(ProgramShader.shaderProgram.totalLightsVS, this.lights.getNumLight());
        this.gl.uniform1i(ProgramShader.shaderProgram.totalLightsFS, this.lights.getNumLight());
        this.gl.uniform3fv(ProgramShader.shaderProgram.lightPointPosition, this.lights.getArrayPosition());
        this.gl.uniform4fv(ProgramShader.shaderProgram.lightPointAmbient, this.lights.getArrayKa());
        this.gl.uniform4fv(ProgramShader.shaderProgram.lightPointDiffuse, this.lights.getArrayKd());
        this.gl.uniform4fv(ProgramShader.shaderProgram.lightPointSpecular, this.lights.getArrayKs());
    }
    static drawModel(model, matrixModel, animacion, frame) {
        this.gl.uniformMatrix4fv(ProgramShader.shaderProgram.matrixModel, false, matrixModel);
        this.gl.uniform1f(ProgramShader.shaderProgram.shininess, ModelController.getNs(model));
        this.gl.uniform4fv(ProgramShader.shaderProgram.materialAmbient, ModelController.getKa(model));
        this.gl.uniform4fv(ProgramShader.shaderProgram.materialDiffuse, ModelController.getKd(model));
        this.gl.uniform4fv(ProgramShader.shaderProgram.materialSpecular, ModelController.getKs(model));
        this.gl.uniform1i(ProgramShader.shaderProgram.isLamp, this.isLamp);
        this.gl.bindVertexArray(ModelController.getVAO(model, animacion, frame));
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, ModelController.getTexture(model, 0, 0));
        this.gl.drawArrays(this.gl.TRIANGLES, 0, ModelController.getTotalVertex(model, animacion, frame));
        this.gl.bindVertexArray(null);
    }
    static getCamera() {
        return this.camera;
    }
    static getLights() {
        return this.lights;
    }
    static ResizeScreen() {
        this.gl.canvas.width = window.innerWidth;
        this.gl.canvas.height = window.innerHeight;
        this.camera.changeViewPort(window.innerWidth, window.innerHeight);
    }
}
WebGLController.mover = [0.0, 0.0, 0.0];
WebGLController.isLamp = 0;
