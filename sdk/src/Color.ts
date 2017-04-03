export class Color {
    r: number;
    g: number;
    b: number;
    isKey: boolean = false;

    static Black: Color = new Color("000000");
    static Red: Color = new Color("ff0000");
    static Green: Color = new Color("00ff00");
    static Blue: Color = new Color("0000ff");
    static HotPink: Color = new Color(255,105,180);
    static Orange: Color = new Color("ffa500");
    static Pink: Color = new Color("ff00ff");
    static Purple: Color = new Color("800080");
    static While: Color = new Color(255,255,255);
    static Yellow: Color = new Color(255,255,0);


    constructor(r:number | string,g:number=null,b:number=null){
        if(g===null && b===null && r!==null){
            if(typeof r === "string"){
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r);
                this.r = parseInt(result[1],16);
                this.g = parseInt(result[2],16);
                this.b = parseInt(result[3],16);              
            } else {
                this.b = (r >> 16) & 0xff;
                this.g = (r >> 8) & 0xff;
                this.r = (r >> 0) & 0xff;
            }
        } else {
            this.r = Math.round(<number>r);
            this.g = Math.round(g);
            this.b = Math.round(b);
        }
        if(this.r>255) this.r=255;
        if(this.g>255) this.g=255;
        if(this.b>255) this.b=255;
        if(this.r<0) this.r=0;
        if(this.g<0) this.g=0;
        if(this.b<0) this.b=0;
    }

    toBGR(){
        let rhex = this.r.toString(16);
        if(rhex.length<2) rhex = "0"+rhex;
        let ghex = this.g.toString(16);
        if(ghex.length<2) ghex = "0"+ghex;
        let bhex = this.b.toString(16);
        if(bhex.length<2) bhex = "0"+bhex;

        let result = bhex+ghex+rhex;
        if(this.isKey){
            result = "ff"+result;
        }

        return parseInt(result,16);
    }

    toJSON(){
        return this.toBGR();
    }

    toString(){
        return this.r+" "+this.g+" "+this.b;
    }
}

export default Color;