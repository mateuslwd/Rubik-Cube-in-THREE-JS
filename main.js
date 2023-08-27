import * as e from './setup.js';
import { Cube } from "./Piece.js";

var cube = new Cube();

let form = "R U R' U' R' F R2 U' R' U' R U R' F'"

cube.setFormula(form)
cube.setAnimateFormula(form)

function frame(){

    requestAnimationFrame(frame)

    e.renderer.render(e.scene, e.camera)

    if(cube.update != undefined){cube.update()}

}

frame()

document.addEventListener('keypress', (e)=>{

    switch(e.key){

        case 'q':
            if(cube.cascate){
                cube.cascate = false
            } else {
                if(cube.cascate == false){

                    cube.continueAnimateFormula();
        
                }        
            }
            break
        case 'w':
            cube.nextMovement()
            break
        case 'e':
            cube.previousMovement()
            break
        case 'r':
            cube.resetToFormula()
            break

    }

})