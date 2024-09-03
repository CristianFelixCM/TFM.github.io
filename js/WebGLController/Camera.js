import { Matematicas } from "./Matematicas.js";
export class Camera {
    constructor(width, height) {
        this.proj_matrix = Matematicas.createM4;
        Matematicas.identity(this.proj_matrix);
        this.proj_matrix = Matematicas.perspective(45 * (Math.PI / 180), width / height, 0.1, 1000);
        this.position = Matematicas.createV3();
        this.focus = Matematicas.createV3();
        this.up = Matematicas.createV3();
        this.right = Matematicas.createV3();
        this.axis = Matematicas.createV3();
        this.matrix = Matematicas.createM4();
        this.azimuth = 0;
        this.elevation = 0;
    }
    changeViewPort(width, height) {
        this.proj_matrix = Matematicas.createM4;
        Matematicas.identity(this.proj_matrix);
        this.proj_matrix = Matematicas.perspective(45 * (Math.PI / 180), width / height, 0.1, 1000);
    }
    setPosition(position) {
        Matematicas.copyV3(this.position, position);
        this.update();
    }
    changePosition(position) {
        this.position[0] += position[0];
        this.position[1] += position[1];
        this.position[2] += position[2];
        this.update();
    }
    getPosition() {
        return [this.position[0], this.position[1], this.position[2]];
    }
    setFocus(focus) {
        Matematicas.copyV3(this.focus, focus);
        this.update();
    }
    setAzimuth(azimuth) {
        this.changeAzimuth(azimuth - this.azimuth);
    }
    changeAzimuth(azimuth) {
        this.azimuth -= azimuth;
        this.azimuth = Matematicas.modulo(this.azimuth, 360);
        this.update();
    }
    setElevation(elevation) {
        this.changeElevation(elevation - this.elevation);
    }
    changeElevation(elevation) {
        this.elevation += elevation;
        if (this.elevation > 360 || this.elevation < -360) {
            this.elevation = this.elevation % 360;
        }
        this.update();
    }
    calculateOrientation() {
        const right = Matematicas.createV4();
        Matematicas.set(right, 1, 0, 0, 0);
        Matematicas.transformMat4(right, right, this.matrix);
        Matematicas.copyV3(this.right, right);
        const up = Matematicas.createV4();
        Matematicas.set(up, 0, 1, 0, 0);
        Matematicas.transformMat4(up, up, this.matrix);
        Matematicas.copyV3(this.up, up);
        const axis = Matematicas.createV4();
        Matematicas.set(axis, 0, 0, 1, 0);
        Matematicas.transformMat4(axis, axis, this.matrix);
        Matematicas.copyV3(this.axis, axis);
    }
    update() {
        Matematicas.identity(this.matrix);
        Matematicas.translate(this.matrix, this.matrix, this.position);
        Matematicas.rotateY(this.matrix, this.matrix, this.azimuth * Math.PI / 180);
        Matematicas.rotateX(this.matrix, this.matrix, this.elevation * Math.PI / 180);
    }
    getViewTransform() {
        const matrix = Matematicas.createIdentityMatrix();
        Matematicas.invert(matrix, this.matrix);
        return matrix;
    }
}
