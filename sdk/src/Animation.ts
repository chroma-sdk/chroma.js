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
            await this.createFrames();
        }   
        this.Instance = instance;
        this.isPlaying=true;
        this.currentFrame = 0;
        await this.createEffects(instance);

        this.playLoop(instance);
    }

    async playLoop(instance: PlayInstance){
        for(let i of this.Frames){
            await instance.send(i);
            await sleep(i.delay);
            if(!this.isPlaying)
                break;
        }
        if(this.isPlaying)
            this.playLoop(instance);
    }
 
    async stop(){
        console.log("STOPPING ANIMATION");
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
        console.log("Received "+keyboardids.length);
        for(let i=0; i<keyboardids.length; i++){
            if(keyboardids[i]!==null){
                this.Frames[i].Keyboard.effectId = keyboardids[i].id;
            } else {
                this.Frames[i].Keyboard.effectId = "";
            }
        }
        return;
    }

    async createFrames(){
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

    async createFrames(){
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

export class BcaAnimation extends Animation {
    url:string = null;
    blob: Blob = null;
    
    constructor(url: string | Blob){
        super();
        if(typeof url === "string"){
            this.url = url as string;
        } else {
            this.blob = url as Blob;
        }
    }

    async createFrames(){
        if(this.blob!==null){
            await this.fromBlob(this.blob);
        } else {
            await fetch(this.url).then((response) => {
                return response.blob();
            })
            .then(this.fromBlob);
        }
    }

    async fromBlob(myBlob: Blob){
            this.blob = myBlob;
            let reader = new FileReader();
            console.log("Start");
            let resolve;
            let test = new Promise<ArrayBuffer>((resolve, reject)=>{
                reader.addEventListener("loadend", () => {
                    resolve(reader.result as ArrayBuffer);
                });
            });
            reader.readAsArrayBuffer(myBlob);
            var anim = await test;
            await this.parseAnimation(anim);
            console.log(myBlob);
    }

    async parseAnimation(buffer: ArrayBuffer){
        var view = new DataView( buffer );

        var fileheader = {
            Type: view.getUint16(0x0),
            Size: view.getUint16(0x02, true),
            BcaOffset: view.getUint32(0x0A, true),
        };

        var bcaheader = {
            Size: view.getUint32(fileheader.BcaOffset, true),
            Version: view.getUint16(fileheader.BcaOffset+4, true),
            FrameOffset: view.getUint32(fileheader.BcaOffset+6, true),
            FPS: view.getUint16(fileheader.BcaOffset+10, true),
            FrameCount: view.getUint32(fileheader.BcaOffset+12, true)
        };
        let lastframe: AnimationFrame = null;
        
        let frame = 1;
        
        let offset = bcaheader.FrameOffset;
        for(let frame=1; frame<=bcaheader.FrameCount; frame++){
            var frameheader = {
                HeaderSize: view.getUint16(offset, true),
                DeviceCount: view.getUint16(offset+2, true),
                DataSize: view.getUint16(offset+4, true),
            };
            let animframe = new AnimationFrame();
            animframe.delay = 10;
            if(lastframe!==null){
                animframe.Keyboard.grid = lastframe.Keyboard.grid.clone();
            }
            
            let deviceoffset = offset+6;
            for(let device=0; device<frameheader.DeviceCount; device++){
                var deviceheader = {
                    HeaderSize: view.getUint8(deviceoffset),
                    DataType: view.getUint8(deviceoffset+1),
                    Device: view.getUint16(deviceoffset+2, true),
                    DataSize: view.getUint16(deviceoffset+4, true),
                };
                let dataoffset = deviceoffset+6;
                
                
                var datacount = deviceheader.DataSize/6;
            // console.log("COUNT", datacount);

                for(let devicedatanum = 0; devicedatanum<datacount; devicedatanum++){
                        
                    let devicedata = {
                        Row: view.getUint8(dataoffset),
                        Col: view.getUint8(dataoffset+1),
                        RGBa: view.getUint32(dataoffset+2, true)
                    };
                    //let r = devicedata.RGBa ^ 16;
                    //console.log(devicedata);

                    if(deviceheader.Device===1){
                        //console.log(devicedata.Row, devicedata.Col, new Color(devicedata.RGBa));
                        animframe.Keyboard.setPosition(devicedata.Row, devicedata.Col, new Color(devicedata.RGBa));
                    } else {
                        console.log("UNKNOWN");
                    }
                // console.log("devicedatanum "+frame+" "+device+" "+devicedatanum,devicedata);
                    dataoffset += 6;
                }

                deviceoffset=dataoffset;
            }


            offset=deviceoffset;
            lastframe = animframe;
            this.Frames.push(animframe);                  
        }
    }
}


export class TestAnimation extends Animation{

    async createFrames(){
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