import Keyboard from './Devices/Keyboard';
import Mousepad from './Devices/Mousepad';
import Mouse from './Devices/Mouse';
import Keypad from './Devices/Keypad';
import Headset from './Devices/Headset';
import ChromaLink from './Devices/ChromaLink';
import {ChromaInstance} from "./ChromaInstance";
import Color from "./Color";
import Effect from "./Effect";
import { IDeviceData, IDevice } from "./Devices/Base";
import DeviceContainer from './Devices';


function sleep(time:number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


class DeviceRequestData implements IDeviceData {
    activeEffect: Effect;
    effectData: any;
    device: string;
}

export interface PlayInstance {
    send(container: DeviceContainer): void;
    deleteEffect(effects: string[]): Promise<any>;
    sendDeviceUpdate(devices: Array<IDeviceData>, store: boolean): Promise<any>;
    send(container: DeviceContainer): void;
}

export class Animation {
    Frames: AnimationFrame[] = [];
    isPlaying: boolean = false;
    Instance: PlayInstance = null;
    currentFrame: number = 0;
    private isInit:boolean=false;

    constructor(){
        
    }

    async init(){

    }
 
    async play(instance: PlayInstance){     
        if(!this.isInit){
            this.isInit=true;
            this.createFrames();
        }   
        this.Instance = instance;
        this.isPlaying=true;
        this.currentFrame = 0;
        await this.createEffects(instance);

        this.playLoop(instance);
    }

    async playLoop(instance: PlayInstance){
        for(let i of this.Frames){
            instance.send(i);
            await sleep(i.delay);
            if(!this.isPlaying)
                break;
        }
        if(this.isPlaying)
            this.playLoop(instance);
    }
 
    async stop(){
        this.isPlaying = false;
        let effectIds: string[] = [];
        for(let frame of this.Frames){
            if(frame.Keyboard.effectId!="")
            effectIds.push(frame.Keyboard.effectId);
            frame.Keyboard.effectId="";
        }

        await this.Instance.deleteEffect(effectIds);
    }

    async createEffects(instance: PlayInstance){
        this.Instance = instance;
        let keyboardEffectData: any = [];
        var device = new DeviceRequestData();
        device.device = "keyboard";

        for(let frame of this.Frames){
            keyboardEffectData.push(frame.Keyboard.effectData);
        }

        device.effectData = {
            effects: keyboardEffectData
        };

        var response = await instance.sendDeviceUpdate([device], true);
        var keyboardids = response[0];

        for(let i=0; i<keyboardids.length; i++){
            this.Frames[i].Keyboard.effectId = keyboardids[i].id;
        }
        return;
    }

    createFrames(){
        for(var i=0; i<10; i++){
            let frame = new AnimationFrame();
            frame.Keyboard.setAll(new Color("ff0000"));
            this.Frames.push(frame);
        }
    }
}

export class WaveAnimation extends Animation{
    rightToLeft: boolean;


    constructor(rightToLeft: boolean = true){
        super();
        this.rightToLeft = rightToLeft;
    }

    createFrames(){
        var frequency = 1;
        let rainbow: Array<Color> = [];  
        console.log(rainbow.length);
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


export class TestAnimation extends Animation{

    createFrames(){
        for(var i=0; i<255; i+=10){
            let frame = new AnimationFrame();
            frame.Keyboard.setAll(new Color(0,i,0));
            this.Frames.push(frame);
        }
    }
}


export class AnimationFrame extends DeviceContainer {
    delay: number = 1000/15;

}