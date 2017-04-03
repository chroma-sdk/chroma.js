import DeviceBase from './Base';
import Effect from '../Effect';
import Grid from '../Grid';
import {ChromaInstance} from "../ChromaInstance";
import Color from "../Color";

export default class Mouse extends DeviceBase {
    grid:Grid;

    constructor(){
        super();
        this.device = "mouse";
        this.grid = new Grid(9,7);   
    }

    setAll(color:Color){
        this.grid.set(color);
        this.set();
        return this;
    }

    setPosition(r:number,c:number,color:Color){
        this.grid.setPosition(r,c,color);
        this.set();
        return this;
    }

    set(){
        this.setDeviceEffect(Effect.CHROMA_CUSTOM2, this.grid.grid);
        return this;
    }
}