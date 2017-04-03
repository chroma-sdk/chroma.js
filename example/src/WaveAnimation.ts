import {Color, Animation, AnimationFrame, Keyboard} from '../../sdk/dist/index';

export class WaveAnimation extends Animation{
    rightToLeft: boolean;


    constructor(rightToLeft: boolean = true){
        super();
        this.rightToLeft = rightToLeft;
    }

    createFrames(){
        var frequency = 1;
        let rainbow: Array<Color> = [];
        for(let num=0; num<Math.PI*2; num+=(Math.PI*2/22)){
                let red   = Math.cos(num) * 255/2 + 255/2;
                let green   = Math.cos(num+Math.PI) * 255/2 + 255/2;
                let blue   = Math.sin(num) * 255/2 + 255/2;
                var color = new Color(red,blue,green);
                rainbow.push(color);
        }

        for (let c2 = 0; c2 < rainbow.length; ++c2)
        {
            let frame = new AnimationFrame();
            for (let c = 0; c < Keyboard.Columns; ++c)
            {
                frame.Keyboard.setCol(c, rainbow[c]);
            }
            if(this.rightToLeft){
              var first = rainbow.shift();
              rainbow.push(first);
            } else {
              var first = rainbow.pop();
              rainbow.unshift(first);
            }
            this.Frames.push(frame);
        }
        
    }
}