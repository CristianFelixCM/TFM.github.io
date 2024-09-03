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
export class VAO {
    constructor(gl) {
        this.vao = gl.createVertexArray();
    }
    init(gl, vertices, normales, textureIndices) {
        gl.bindVertexArray(this.vao);
        this.totalVertices = vertices.length;
        const VertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(ProgramShader.shaderProgram.aVertexPosition);
        gl.vertexAttribPointer(ProgramShader.shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        const NormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, NormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normales), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(ProgramShader.shaderProgram.aNormal);
        gl.vertexAttribPointer(ProgramShader.shaderProgram.aNormal, 3, gl.FLOAT, false, 0, 0);
        const TextureIndiceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, TextureIndiceBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureIndices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(ProgramShader.shaderProgram.aTextureIndex);
        gl.vertexAttribPointer(ProgramShader.shaderProgram.aTextureIndex, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    createTextureBuffer(gl, textureData) {
        return __awaiter(this, void 0, void 0, function* () {
            gl.bindVertexArray(this.vao);
            this.textureBuffer = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.textureBuffer);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureData);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.bindVertexArray(null);
        });
    }
    getTotalVertices() {
        return (this.totalVertices / 3);
    }
}
