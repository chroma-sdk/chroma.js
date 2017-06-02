import DeviceBase from './Base';
import {ChromaInstance} from "../ChromaInstance";

export default class ChromaLink extends DeviceBase {
    constructor(){
        super();
        this.device = "chromalink";
        this.supports = ["CHROMA_NONE","CHROMA_CUSTOM","CHROMA_STATIC"];
    }
}