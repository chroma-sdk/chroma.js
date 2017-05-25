import {ChromaInstance} from "./ChromaInstance";
import fetch from "./request";

export class ChromaApp {
    uninitpromise: any = null;
    _instance: Promise<ChromaInstance> = null;
    data: any;

    constructor(title: string, description: string= "", author: string= "", contact: string= "", devices: string[] = [
                "keyboard",
                "mouse",
                "headset",
                "mousepad",
                "keypad",
                "chromalink"], category: string= "application"){
        this._instance = null;
        this.data = {
            title,
            description,
            author: {
                name: author,
                contact,
            },
            device_supported: devices,
            category,
        };
    }

    async Instance(create: boolean= true){
        if (this._instance !== null){
            const instance = await this._instance;

            if (!instance.destroyed)
                return instance;
            else
                this._instance = null;
        }

        if (create) {
            const options = {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(this.data),
            };

            this._instance = new Promise<ChromaInstance>(async (resolve, reject) => {
                try{
                  const response = await fetch("http://localhost/razer/chromasdk", options);
                  const json = await response.json();
                  resolve(new ChromaInstance(json.uri));
                } catch (error){
                  reject(error);
                }
            });

            return await this._instance;
        } else {
            return null;
        }
    }
}
