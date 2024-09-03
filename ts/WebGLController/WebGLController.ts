import { ProgramShader } from "./Shader/ProgramShader.js";
import { ModelController } from "./Model.js";
import { Camera } from "./Camera.js";
import { Matematicas } from "./Matematicas.js";
import { Lights } from "./Lights.js";


export class WebGLController {

    static gl: WebGL2RenderingContext;
    
    static camera: any;
    static lights : Lights;

    static mover = [0.0, 0.0, 0.0];

    static isLamp = 0;


    static async init(gl: WebGL2RenderingContext) {

      this.gl = gl;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.enable(gl.DEPTH_TEST);

      gl.enable(gl.CULL_FACE);

      ProgramShader.generarShaders(this.gl);


      this.camera = new Camera(window.innerWidth, window.innerHeight);
      this.lights = new Lights();


    }

    static initRender() {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);

      this.gl.uniformMatrix4fv(ProgramShader.shaderProgram.uProjectionMatrix, false, this.camera.proj_matrix);
      this.gl.uniformMatrix4fv(ProgramShader.shaderProgram.uViewMatrix, false, this.camera.getViewTransform());

      this.gl.uniform1i(ProgramShader.shaderProgram.totalLightsVS, this.lights.getNumLight());
      this.gl.uniform1i(ProgramShader.shaderProgram.totalLightsFS, this.lights.getNumLight());
      this.gl.uniform3fv(ProgramShader.shaderProgram.lightPointPosition, this.lights.getArrayPosition());
      this.gl.uniform4fv(ProgramShader.shaderProgram.lightPointAmbient,  this.lights.getArrayKa());
      this.gl.uniform4fv(ProgramShader.shaderProgram.lightPointDiffuse,  this.lights.getArrayKd());
      this.gl.uniform4fv(ProgramShader.shaderProgram.lightPointSpecular,  this.lights.getArrayKs());  


    }


    static drawModel(model: string, matrixModel : any, animacion : any, frame: any) {

      this.gl.uniformMatrix4fv(ProgramShader.shaderProgram.matrixModel, false, matrixModel);

      this.gl.uniform1f(ProgramShader.shaderProgram.shininess, ModelController.getNs(model));
      this.gl.uniform4fv(ProgramShader.shaderProgram.materialAmbient, ModelController.getKa(model));
      this.gl.uniform4fv(ProgramShader.shaderProgram.materialDiffuse, ModelController.getKd(model));
      this.gl.uniform4fv(ProgramShader.shaderProgram.materialSpecular, ModelController.getKs(model));

      this.gl.uniform1i(ProgramShader.shaderProgram.isLamp, this.isLamp);




      // VAO
      this.gl.bindVertexArray(ModelController.getVAO(model, animacion, frame));

          this.gl.activeTexture(this.gl.TEXTURE0);
          this.gl.bindTexture(this.gl.TEXTURE_2D, ModelController.getTexture(model,0, 0));

          this.gl.drawArrays(this.gl.TRIANGLES, 0, ModelController.getTotalVertex(model,animacion, frame));//para pintar directamente los vertices

      this.gl.bindVertexArray(null);
    }
    



    static getCamera(){
      return this.camera;
    }

    static getLights(){
      return this.lights;
    }

    static ResizeScreen(){
      this.gl.canvas.width = window.innerWidth;
      this.gl.canvas.height = window.innerHeight;
      this.camera.changeViewPort(window.innerWidth, window.innerHeight);
    }
}