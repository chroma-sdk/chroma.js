import Color from "../Color";
import {IDevice} from "./Base";
import ChromaLink from "./ChromaLink";
import Headset from "./Headset";
import Keyboard from "./Keyboard";
import Keypad from "./Keypad";
import Mouse from "./Mouse";
import Mousepad from "./Mousepad";

export enum AvailableDevices {
    ChromaLink = "chromalink" as any,
    Headset = "headset" as any,
    Keyboard = "keyboard" as any,
    Keypad = "keypad" as any,
    Mouse = "mouse" as any,
    Mousepad = "mousepad" as any,
}

export default class DeviceContainer {
    public Keyboard: Keyboard = new Keyboard();
    public Mousepad: Mousepad = new Mousepad();
    public Mouse: Mouse = new Mouse();
    public Keypad: Keypad = new Keypad();
    public Headset: Headset = new Headset();
    public ChromaLink: ChromaLink = new ChromaLink();
    public AnimationId: string = "";
    public Devices: IDevice[] = [];

    constructor() {

        this.Devices.push(this.Keyboard, this.Mousepad, this.Mouse, this.Keypad, this.Headset, this.ChromaLink);
    }

    public setAll(color: Color) {
        this.Devices.forEach((device) => {
            device.setAll(color);
        });
    }
}
