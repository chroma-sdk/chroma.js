import DeviceBase from './Base';
import {ChromaInstance} from "../ChromaInstance";

export default class Headset extends DeviceBase {
    constructor(){
        super();
        this.device = "headset";
        this.supports = ["CHROMA_NONE","CHROMA_CUSTOM","CHROMA_STATIC"];
    }
}