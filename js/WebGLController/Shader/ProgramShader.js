import { Vertex } from "./VertexShader.js";
import { Fragment } from "./FragmentShader.js";
export class ProgramShader {
    static generarShaders(gl) {
        Vertex.generateVertexShader(gl);
        Fragment.generateFragmentShader(gl);
        this.createShaderProgram(gl);
        this.attachLocation(gl);
    }
    static createShaderProgram(gl) {
        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, Vertex.vertShader);
        gl.attachShader(this.shaderProgram, Fragment.fragShader);
        gl.linkProgram(this.shaderProgram);
        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            console.error('Could not initialize shaders');
        }
        gl.useProgram(this.shaderProgram);
    }
    static attachLocation(gl) {
        this.shaderProgram.aVertexPosition = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        this.shaderProgram.aNormal = gl.getAttribLocation(this.shaderProgram, 'aNormal');
        this.shaderProgram.aTextureIndex = gl.getAttribLocation(this.shaderProgram, 'aTextureIndex');
        this.shaderProgram.uProjectionMatrix = gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
        this.shaderProgram.matrixModel = gl.getUniformLocation(this.shaderProgram, 'matrixModel');
        this.shaderProgram.uViewMatrix = gl.getUniformLocation(this.shaderProgram, 'uViewMatrix');
        this.shaderProgram.u_texture = gl.getUniformLocation(this.shaderProgram, 'u_texture');
        this.shaderProgram.modelViewMatrix = gl.getUniformLocation(this.shaderProgram, 'modelViewMatrix');
        this.shaderProgram.normalMatrix = gl.getUniformLocation(this.shaderProgram, 'normalMatrix');
        this.shaderProgram.shininess = gl.getUniformLocation(this.shaderProgram, 'shininess');
        this.shaderProgram.materialAmbient = gl.getUniformLocation(this.shaderProgram, 'materialAmbient');
        this.shaderProgram.materialDiffuse = gl.getUniformLocation(this.shaderProgram, 'materialDiffuse');
        this.shaderProgram.materialSpecular = gl.getUniformLocation(this.shaderProgram, 'materialSpecular');
        this.shaderProgram.totalLightsVS = gl.getUniformLocation(this.shaderProgram, 'totalLightsVS');
        this.shaderProgram.totalLightsFS = gl.getUniformLocation(this.shaderProgram, 'totalLightsFS');
        this.shaderProgram.lightPointPosition = gl.getUniformLocation(this.shaderProgram, 'lightPointPosition');
        this.shaderProgram.lightPointAmbient = gl.getUniformLocation(this.shaderProgram, 'lightPointAmbient');
        this.shaderProgram.lightPointDiffuse = gl.getUniformLocation(this.shaderProgram, 'lightPointDiffuse');
        this.shaderProgram.lightPointSpecular = gl.getUniformLocation(this.shaderProgram, 'lightPointSpecular');
        this.shaderProgram.isLamp = gl.getUniformLocation(this.shaderProgram, 'isLamp');
    }
}
