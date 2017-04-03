import {ChromaApp, Color, Key, Animation, AnimationFrame, Keyboard} from '../../sdk/dist/index';
import {WaveAnimation} from './WaveAnimation';

let app = new ChromaApp("TestApp","Some Description of my app", "Author");


async function Execute(colorstring: string){
    let instance = await app.Instance();
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

async function stopAnimation(){
    let instance = await app.Instance();
    instance.stopAnimation();
}

async function closeChroma(){
    let instance = await app.Instance(false);
    if(instance!=null)
        instance.destroy();      
}

function sleep(time:number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function ExecuteServer(){
    await sleep(1000);
    await Execute("ff0000");
    await sleep(1000);
    await Execute("00ff00");
    await sleep(1000);
    await Execute("0000ff");
    await sleep(2000);
    await playAnimation();
    await sleep(5000);
    await stopAnimation();
    await sleep(1000);
    await closeChroma();
}

ExecuteServer();