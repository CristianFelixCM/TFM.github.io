export class Lights{

    numMaxLight : number;
    numLight : number;


    arrayPositions : Float32Array;
    arrayKa : Float32Array;
    arrayKd : Float32Array;
    arrayKs : Float32Array;

    constructor(){
        this.numLight = 0;
        this.numMaxLight = 10;
        this.arrayPositions = new Float32Array(this.numMaxLight*3);
        this.arrayKa = new Float32Array(this.numMaxLight*3);
        this.arrayKd = new Float32Array(this.numMaxLight*3);
        this.arrayKs = new Float32Array(this.numMaxLight*3);
    }

    addLight(pos: number[], ka : number[], kd : number[], ks : number[] ){
        if(this.numLight<10){
         
            this.arrayPositions[this.numLight * 3] = pos[0];
            this.arrayPositions[(this.numLight * 3) + 1] = pos[1];
            this.arrayPositions[(this.numLight * 3) + 2] = pos[2];

            this.arrayKa[this.numLight * 3] = ka[0];
            this.arrayKa[(this.numLight * 3) + 1] = ka[1];
            this.arrayKa[(this.numLight * 3) + 2] = ka[2];

            this.arrayKd[this.numLight * 3] = kd[0];
            this.arrayKd[(this.numLight * 3) + 1] = kd[1];
            this.arrayKd[(this.numLight * 3) + 2] = kd[2];

            this.arrayKs[this.numLight * 3] = ks[0];
            this.arrayKs[(this.numLight * 3) + 1] = ks[1];
            this.arrayKs[(this.numLight * 3) + 2] = ks[2];       

            this.numLight ++;
        }
    }

    
    getArrayPosition(){
        return this.arrayPositions;
    }

    getArrayKa(){
        return this.arrayKa;
    }

    getArrayKd(){
        return this.arrayKd;
    }

    getArrayKs(){
        return this.arrayKs;
    }

    getNumLight(){
        return this.numLight;
    }

}


