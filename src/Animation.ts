import { ChromaInstance } from "./ChromaInstance";
import Color from "./Color";
import DeviceContainer from "./Devices";
import { IDevice, IDeviceData } from "./Devices/Base";
import ChromaLink from "./Devices/ChromaLink";
import Headset from "./Devices/Headset";
import Keyboard from "./Devices/Keyboard";
import Keypad from "./Devices/Keypad";
import Mouse from "./Devices/Mouse";
import Mousepad from "./Devices/Mousepad";
import Effect from "./Effect";

function sleep(time: number) {
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
    sendDeviceUpdate(devices: IDeviceData[], store: boolean): Promise<any>;
    send(container: DeviceContainer): void;
}

export class Animation {
    Frames: AnimationFrame[] = [];
    isPlaying: boolean = false;
    Instance: PlayInstance = null;
    currentFrame: number = 0;
    private isInit: boolean= false;

    constructor(){

    }

    async init(){

    }

    async play(instance: PlayInstance) {
        if (!this.isInit) {
            this.isInit = true;
            this.createFrames();
        }
        this.Instance = instance;
        this.isPlaying = true;
        this.currentFrame = 0;
        await this.createEffects(instance);

        this.playLoop(instance);
    }

    async playLoop(instance: PlayInstance) {
        for (const i of this.Frames) {
            instance.send(i);
            await sleep(i.delay);
            if (!this.isPlaying)
                break;
        }
        if (this.isPlaying)
            this.playLoop(instance);
    }

    async stop(){
        this.isPlaying = false;
        const effectIds: string[] = [];
        for (const frame of this.Frames) {
            if (frame.Keyboard.effectId != "")
            effectIds.push(frame.Keyboard.effectId);
            frame.Keyboard.effectId = "";
        }

        await this.Instance.deleteEffect(effectIds);
    }

    async createEffects(instance: PlayInstance){
        this.Instance = instance;
        const keyboardEffectData: any = [];
        const device = new DeviceRequestData();
        device.device = "keyboard";

        for (const frame of this.Frames){
            keyboardEffectData.push(frame.Keyboard.effectData);
        }

        device.effectData = {
            effects: keyboardEffectData,
        };

        const response = await instance.sendDeviceUpdate([device], true);
        const keyboardids = response[0];

        for (let i = 0; i < keyboardids.length; i++){
            this.Frames[i].Keyboard.effectId = keyboardids[i].id;
        }
        return;
    }

    createFrames(){
        for (let i = 0; i < 10; i++){
            const frame = new AnimationFrame();
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
        const frequency = 1;
        const rainbow: Color[] = [];
        console.log(rainbow.length);
        for (let num = 0; num < Math.PI * 2; num += (Math.PI * 2 / 22)){
                const red   = Math.cos(num) * 255 / 2 + 255 / 2;
                const green   = Math.cos(num + Math.PI) * 255 / 2 + 255 / 2;
                const blue   = Math.sin(num) * 255 / 2 + 255 / 2;
                const color = new Color(red, blue, green);
                rainbow.push(color);
        }

        for (let c2 = 0; c2 < rainbow.length; ++c2)
        {
            const frame = new AnimationFrame();
            for (let c = 0; c < Keyboard.Columns; ++c)
            {
                frame.Keyboard.setCol(c, rainbow[c]);
            }
            if (this.rightToLeft){
              const first = rainbow.shift();
              rainbow.push(first);
            } else {
              const first = rainbow.pop();
              rainbow.unshift(first);
            }
            this.Frames.push(frame);
        }

    }
}

export class TestAnimation extends Animation{

    createFrames(){
        for (let i = 0; i < 255; i += 10){
            const frame = new AnimationFrame();
            frame.Keyboard.setAll(new Color(0, i, 0));
            this.Frames.push(frame);
        }
    }
}

export class AnimationFrame extends DeviceContainer {
    delay: number = 1000 / 15;

}
