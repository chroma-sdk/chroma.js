import fetch from './request';
import Color from './Color';


import {IDevice, IDeviceData} from './Devices/Base';
import {Animation} from './Animation';

import DeviceContainer from './Devices';


import Effect from "./Effect";

export class ChromaInstance extends DeviceContainer {
    url: string;
    private interval: number;
    activeAnimation: Animation = null;
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
        if(this.activeAnimation!==null){
            await this.activeAnimation.stop();
            this.activeAnimation=null;
        }
        return;
    }


    async destroy(){
        this.destroyed=true;
        clearInterval(this.interval);
        this.interval=null;
        var url = this.url;
        this.url="";
        var response = await fetch(url,{
            method: 'delete',
        });

        if(!response.ok)
            throw Error(response.statusText); 
        
        return true;
    }

    async heartbeat(){
        if(this.url==="") return;
        var response = await fetch(this.url+"/heartbeat",{
            method: 'put',
        });

        if(!response.ok)
            throw Error(response.statusText); 
        
        return response; 
    }


    async send(container: DeviceContainer = this){
        if(this.url==="") return;

        let devices : Array<IDevice> = [];
        let effectids = [];
        for(let device of container.Devices){
            if(device.activeEffect === Effect.UNDEFINED)
                continue;

            if(device.effectId !== ""){
                effectids.push(device.effectId);
            } else {
                devices.push(device);
            }
        }
        this.setEffect(effectids);
        return await this.sendDeviceUpdate(devices, false)

    }


    async sendDeviceUpdate(devices: Array<IDeviceData>, store: boolean=false){
        let response = [];
        for(let device of devices){
            let name = device.device;
            let parsedData = device.effectData;
            var deviceresponse = await fetch(this.url+"/"+name, {
                method: (store)?'post':'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsedData)
            });

            if(!deviceresponse.ok)
                throw Error(deviceresponse.statusText); 
            var data = await deviceresponse.json();
            
            response.push(data.results);      
        }
        return response;
    }

    async setEffect(effectids: Array<string>){
        if(effectids.length===0) return;
        for(let effectid of effectids){

            var payload = JSON.stringify({
                    "id": effectid
                });
            var deviceresponse = await fetch(this.url+"/effect", {
                method: 'put',
                headers: { 'Content-Type': 'application/json', 'Content-Length': payload.length },
                body: payload
            });

            let jsonresp = await deviceresponse.json();
        }
    }

    async deleteEffect(effectids: Array<string>){
        if(effectids.length===0) return;

        
        var payload = JSON.stringify({
                "ids": effectids
            });
        var deviceresponse = await fetch(this.url+"/effect", {
            method: 'delete',
            headers: { 'Content-Type': 'application/json', 'Content-Length': payload.length },
            body: payload
        });
    }


}
