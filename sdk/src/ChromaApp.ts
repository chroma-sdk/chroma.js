import fetch from './request';
import {ChromaInstance} from './ChromaInstance';


export class ChromaApp {
    uninitpromise: any = null;
    _instance: Promise<ChromaInstance> = null;
    data: any;

    constructor(title: string, description: string="", author: string="", contact: string="", devices: Array<string> =[
                "keyboard",
                "mouse",
                "headset",
                "mousepad",
                "keypad",
                "chromalink"], category:string="application"){
        this._instance = null;        
        this.data = {
            "title": title,
            "description": description,
            "author": {
                "name": author,
                "contact": contact
            },
            "device_supported": devices,
            "category": category
        };
    }

    async Instance(create: boolean=true){
        if(this._instance!==null){
            var instance = await this._instance;
            
            if(!instance.destroyed)
                return instance;
            else
                this._instance=null;
        }
        
        if(create) {
            let options = {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.data)
            }

            this._instance = new Promise<ChromaInstance>(async (resolve, reject) => {
                try{
                  let response = await fetch("http://localhost/razer/chromasdk", options);
                  let json = await response.json();
                  resolve(new ChromaInstance(json.uri));
                } catch(error){
                  reject(error);
                }
            });

            return await this._instance;
        } else {
            return null;
        }
    }
}