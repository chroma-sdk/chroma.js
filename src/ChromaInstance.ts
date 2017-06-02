import Color from "./Color";
import fetch from "./request";

import {Animation} from "./Animation";
import {IDevice, IDeviceData} from "./Devices/Base";

import Effect from "./Effect";

export class ChromaInstance extends DeviceContainer {
    url: string;
    private interval: number;
    private activeAnimation: Animation = null;
    destroyed: boolean = false;

    constructor(url: string){
        super();
        this.url = url;
        this.heartbeat = this.heartbeat.bind(this);
        this.setAll = this.setAll.bind(this);
        this.destroy = this.destroy.bind(this);

        this.interval = setInterval(this.heartbeat, 10000);
    }

    async playAnimation(animation: Animation){
        await this.stopAnimation();
        this.activeAnimation = animation;
        await animation.play(this);
        return animation;
    }

    async stopAnimation(){
        if (this.activeAnimation !== null){
            await this.activeAnimation.stop();
            this.activeAnimation = null;
        }
        return;
    }

    async destroy(){
        this.destroyed = true;
        clearInterval(this.interval);
        this.interval = null;
        const url = this.url;
        this.url = "";
        const response = await fetch(url, {
            method: "delete",
        });

        if (!response.ok)
            throw Error(response.statusText);

        return true;
    }

    async heartbeat() {
        if (this.url === "") { return; }
        const response = await fetch(this.url + "/heartbeat", {
            method: "put",
        });

        if (!response.ok) {
            throw Error(response.statusText);
        }

        return response;
    }

    async send(container: DeviceContainer = this){
        if (this.url === "") return;

        const devices : IDevice[] = [];
        const effectids = [];
        for (const device of container.Devices){
            if (device.activeEffect === Effect.UNDEFINED)
                continue;

            if (device.effectId !== ""){
                effectids.push(device.effectId);
            } else {
                devices.push(device);
            }
        }
        this.setEffect(effectids);
        return await this.sendDeviceUpdate(devices, false);

    }

    async sendDeviceUpdate(devices: IDeviceData[], store: boolean= false){
        const response = [];
        for (const device of devices){
            const name = device.device;
            const parsedData = device.effectData;
            const deviceresponse = await fetch(this.url + "/" + name, {
                method: (store) ? "post" : "put",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedData),
            });

            if (!deviceresponse.ok) {
                throw Error(deviceresponse.statusText);
            }
            const data = await deviceresponse.json();

            response.push(data.results);
        }
        return response;
    }

    async setEffect(effectids: string[]){
        if (effectids.length === 0) return;
        for (const effectid of effectids){

            const payload = JSON.stringify({
                    id: effectid,
                });
            const deviceresponse = await fetch(this.url + "/effect", {
                method: "put",
                headers: { "Content-Type": "application/json", "Content-Length": payload.length },
                body: payload,
            });

            const jsonresp = await deviceresponse.json();
        }
    }

    async deleteEffect(effectids: string[]) {
        if (effectids.length === 0) { return; }

        const payload = JSON.stringify({
                ids: effectids,
            });
        const deviceresponse = await fetch(this.url + "/effect", {
            body: payload,
            headers: { "Content-Type": "application/json", "Content-Length": payload.length },
            method: "delete",
        });
    }

}
