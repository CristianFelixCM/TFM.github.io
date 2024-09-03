export class Vertex {
    static vertCode =
`    #version 300 es
    precision mediump float;

    // Supplied vertex position attribute
    in vec3 aVertexPosition;
    in vec3 aNormal;
    in vec2 aTextureIndex;

    out vec2 vTextureCoords;
    out vec3 eyeVector;
    out vec3 normal;
    
    
    uniform vec3 lightPointPosition[10]; //max 10 luces
    out vec3 light[10];

    uniform int totalLightsVS;

    out float distanceToLight[10];


    uniform mat4 uProjectionMatrix;
    uniform mat4 matrixModel;
    uniform mat4 uViewMatrix;

    uniform mat4 modelViewMatrix;
    uniform mat4 normalMatrix;
    

    //uniform vec3 pos;


    void main(void) {

      mat4 modelViewMatrix =  uViewMatrix * matrixModel;

      
      vec4 x = modelViewMatrix * vec4(aVertexPosition, 1.0);

      vec4 l;
      for(int i = 0; i < totalLightsVS; i++){
        l = uViewMatrix * vec4(lightPointPosition[i],1.0);
        light[i] = l.xyz - x.xyz;
        distanceToLight[i] = length(l.xyz - x.xyz );
      }


      //variables para el frangment shader
      normal = vec3(transpose(inverse(modelViewMatrix)) * vec4(aNormal, 1.0));
         
      eyeVector = -vec3((modelViewMatrix * vec4(aVertexPosition, 1.0)).xyz);
      

      vTextureCoords = aTextureIndex;


      // Simply set the position in clipspace coordinates
      gl_Position = uProjectionMatrix * modelViewMatrix * vec4(aVertexPosition, 1.0);
      

    }
`


    static vertShader  : any;

    static generateVertexShader(gl : WebGL2RenderingContext) {
        
        this.vertShader = gl.createShader(gl.VERTEX_SHADER);

        gl.shaderSource(this.vertShader, this.vertCode);

        gl.compileShader(this.vertShader);

        if (!gl.getShaderParameter(this.vertShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(this.vertShader));
            return null;
        }        
    }


}