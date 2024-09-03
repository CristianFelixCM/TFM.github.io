export class Screens{

    imageIni : any

    context : any;
    canvas : any;

    constructor(canvas :any, context : any){
        this.imageIni = new Image();
        this.imageIni.src = "ts/Images/PantallaInicio.png"
        
        this.context = context;
        this.canvas = canvas;

    }


    drawPantallaInicio(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.drawImage(this.imageIni,0,0,this.imageIni.width,this.imageIni.height,0,0,this.canvas.width,this.canvas.height);
    }

    drawPantalla(text : string){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);


        this.context.fillStyle = "black";
        this.context.fillRect(0,0, this.canvas.width, this.canvas.height);


        this.context.shadowColor="white";
        this.context.shadowBlur=7;
        this.context.fillStyle = "white";
        this.context.font = this.canvas.width*0.06+"px Amita";
        let posY = this.canvas.height*0.5;
        let posX = this.canvas.width*0.5;
        this.context.strokeText(text, posX, posY);
        this.context.fillText(text, posX, posY);

    }




}