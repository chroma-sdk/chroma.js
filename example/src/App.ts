import {ChromaApp, Color, Key, Animation, AnimationFrame, Keyboard} from '../../sdk/dist/index';
import {WaveAnimation} from './WaveAnimation';

import * as $ from 'jquery';

let app = new ChromaApp("TestApp","Some Description of my app", "Author");

async function Execute(colorstring: string){
    console.log("Setting "+colorstring);
    let instance = await app.Instance();
    console.log("INSTANCE", instance);
    let color = new Color(colorstring);
    instance.setAll(color);
    instance.Keyboard.setKey([Key.W,Key.A,Key.S,Key.D,Key.Z], Color.Orange);
    instance.send();
}

async function playAnimation(){
    let instance = await app.Instance();
    var animation = new WaveAnimation();
    instance.playAnimation(animation);
}


async function closeChroma(){
    let instance = await app.Instance(false);
    if(instance!=null)
        instance.destroy();   
}

async function stopAnimation(){
    let instance = await app.Instance(false);
    if(instance!=null) await instance.stopAnimation();
    closeChroma();
}


$(".red").click(()=>Execute("ff0000"));
$(".green").click(()=>Execute("00ff00"));
$(".blue").click(()=>Execute("0000ff"));
$(".animate").click(()=>playAnimation());
$(".stop").click(()=>stopAnimation());