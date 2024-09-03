export class Fragment {
    static fragCode =
`   #version 300 es
    precision highp float;

    // Color that is the result of this shader
    out vec4 fragColor;

    in vec2 vTextureCoords;
    in vec3 eyeVector;
    in vec3 normal;

    uniform float shininess;
    uniform vec4 materialAmbient;
    uniform vec4 materialDiffuse;
    uniform vec4 materialSpecular;


    in vec3 light[10];
    uniform int totalLightsFS;
    uniform vec4 lightPointAmbient;
    uniform vec4 lightPointDiffuse;
    uniform vec4 lightPointSpecular;

    in float distanceToLight[10];


    uniform int isLamp;


    uniform sampler2D u_texture;

    void main(void) {


        vec3 lightDirection = vec3(-0.25, -0.25, -0.25);
        vec4 lightAmbient = vec4(0.7,0.7, 0.7, 1.0);
        vec4 lightDifusse = vec4(0.7,0.7, 0.7, 1.0);
        vec4 lightSpecular = vec4(0.7,0.7, 0.7, 1.0);


        vec3 color;

    // ---------AMBIENTAL

   
        // Normalized light direction
        vec3 L = normalize(lightDirection);


        // Normalized normal
        vec3 N = normalize(normal);

        float lambertTerm = dot(N, -L);
        // Ambient
        vec4 Ia = lightAmbient * materialAmbient;
        // Diffuse
        vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
        // Specular
        vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

        if (lambertTerm > 0.0) {
            Id = lightDifusse * materialDiffuse * lambertTerm;
            vec3 E = normalize(eyeVector);
            vec3 R = reflect(L, N);
            float specular = pow( max(dot(R, E), 0.0), shininess);
            Is = lightSpecular * materialSpecular * specular;
        }

        color = vec3(Ia + Id + Is);



//PUNTO LUZ ---------
        float l;
        float atenuacion;
        for(int i = 0; i < totalLightsFS; i++){
            l = dot(normalize(normal),normalize(light[i]));

            atenuacion = clamp( 5.0 / distanceToLight[i], 0.0, 1.0);
            
            l *= atenuacion;  

            color += l; 
        }
//-------------

    
        fragColor = texture(u_texture, vTextureCoords);

        fragColor.rgb *= color;


        if(isLamp == 1) fragColor = texture(u_texture, vTextureCoords);
  


    }
`


    static fragShader : any;

    static generateFragmentShader(gl :WebGL2RenderingContext) {
        this.fragShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(this.fragShader, this.fragCode);

        gl.compileShader(this.fragShader);
              
        if (!gl.getShaderParameter(this.fragShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(this.fragShader));
            return null;
        }

    }


}