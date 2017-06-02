import Keyboard from './Keyboard';
import Mousepad from './Mousepad';
import Mouse from './Mouse';
import Keypad from './Keypad';
import Headset from './Headset';
import ChromaLink from './ChromaLink';
import {IDevice} from './Base';
import Color from '../Color';


export default class DeviceContainer{
    Keyboard: Keyboard = new Keyboard();
    Mousepad: Mousepad = new Mousepad();
    Mouse: Mouse = new Mouse();
    Keypad: Keypad = new Keypad();
    Headset: Headset = new Headset();
    ChromaLink: ChromaLink = new ChromaLink();
    AnimationId: string = "";
    Devices: Array<IDevice> = [];

    
    constructor() {
        
        this.Devices.push(this.Keyboard, this.Mousepad, this.Mouse, this.Keypad, this.Headset, this.ChromaLink);
    }

    setAll(color:Color){
        this.Devices.forEach((device)=>{
            device.setAll(color);
        });
    }
}