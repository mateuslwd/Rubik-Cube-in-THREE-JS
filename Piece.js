import * as THREE from "three";
import {scene} from "./setup.js";

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const BLUE = new THREE.MeshBasicMaterial({ color: "#428af5" });
const RED = new THREE.MeshBasicMaterial({ color: "#f54242" });
const YELLOW = new THREE.MeshBasicMaterial({ color: "#f5dd42" });
const ORANGE = new THREE.MeshBasicMaterial({ color: "#ed790c" });
const WHITE = new THREE.MeshBasicMaterial({ color: "#ffffff" });
const GREEN = new THREE.MeshBasicMaterial({ color: "#95e677" });
const BLACK = new THREE.MeshBasicMaterial({ color: "#000000" });

function colorToArray (cube){

    let array = new Array(6)

    array[0] = cube.R != undefined ? cube.R : BLACK;
    array[1] = cube.L != undefined ? cube.L : BLACK;
    array[2] = cube.D != undefined ? cube.D : BLACK;
    array[3] = cube.U != undefined ? cube.U : BLACK;
    array[4] = cube.F != undefined ? cube.F : BLACK;
    array[5] = cube.B != undefined ? cube.B : BLACK;

    return array

}

var colors = [];

//#region COLORS
colors.push(colorToArray({L:GREEN, B:RED, D:WHITE}))
colors.push(colorToArray({L:GREEN, D:WHITE}))
colors.push(colorToArray({L:GREEN, F: ORANGE, D: WHITE}))

colors.push(colorToArray({L: GREEN, B:RED, D:WHITE}))
colors.push(colorToArray({L: GREEN, D:WHITE}))
colors.push(colorToArray({L: GREEN, F:ORANGE, D:WHITE}))

colors.push(colorToArray({L: GREEN, B:RED, U:YELLOW}))
colors.push(colorToArray({L: GREEN, U:YELLOW}))
colors.push(colorToArray({L: GREEN, F:ORANGE, U:YELLOW}))

colors.push(colorToArray({B:RED, D:WHITE}))
colors.push(colorToArray({D:WHITE}))
colors.push(colorToArray({F:ORANGE, D:WHITE}))

colors.push(colorToArray({B:RED}))
colors.push(colorToArray({}))
colors.push(colorToArray({F:ORANGE}))


colors.push(colorToArray({B:RED, U:YELLOW}))
colors.push(colorToArray({U:YELLOW}))
colors.push(colorToArray({F:ORANGE, U:YELLOW}))

colors.push(colorToArray({R:BLUE, B:RED, D:WHITE}))
colors.push(colorToArray({R:BLUE, D:WHITE}))
colors.push(colorToArray({R:BLUE, F:ORANGE, D:WHITE}))

colors.push(colorToArray({R:BLUE, B:RED}))
colors.push(colorToArray({R:BLUE}))
colors.push(colorToArray({R:BLUE, F:ORANGE}))

colors.push(colorToArray({R:BLUE, B:RED, U:YELLOW}))
colors.push(colorToArray({R:BLUE, U:YELLOW}))
colors.push(colorToArray({R:BLUE, F:ORANGE, U:YELLOW}))
//#endregion

class Piece{

    constructor(vector, colorIndex){

        this.mesh = new THREE.Group()
        this.colorIndex = colorIndex;
        this.createPlanes();
    
        this.mesh.position.set(...vector)

    }
    
    createPlanes(){

        
        this.createPositions();
        this.createRotations();
        
        
        this.planes = []
        
        let geometry = new THREE.PlaneGeometry();
        
        for(let i = 0; i < 6; i++){

            let plane = new THREE.Mesh(geometry, colors[this.colorIndex][i]);
            plane.position.set(...this.positions[i])
            plane.applyQuaternion(this.rotations[i])
            this.mesh.attach(plane)

        }   

        //Na minha cabeça não tem necessidade de guardar isso na memoria
        this.positions = undefined;
        this.rotations = undefined;

    }

    createPositions(){

        this.positions = []

        this.positions.push(new THREE.Vector3(.5, 0, 0))
        this.positions.push(new THREE.Vector3(-.5, 0, 0))
        this.positions.push(new THREE.Vector3(0, -.5, 0))
        this.positions.push(new THREE.Vector3(0, .5, 0))
        this.positions.push(new THREE.Vector3(0, 0, .5))
        this.positions.push(new THREE.Vector3(0, 0, -.5))
        
    }

    createRotations(){

        this.rotations = []

        this.rotations.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(90)))
        this.rotations.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(-90)))
        this.rotations.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(90)))
        this.rotations.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(-90)))
        this.rotations.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0)))
        this.rotations.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(180)))

    }

}

export class Cube{

    constructor(){

        this.createCube();

        this.anchor = this.pieces[13];
        this.update = undefined;

        this.speed = 4;

        this.cascate = false
    }

    createCube(){

        this.pieces = [];

        for(let x = -1; x <= 1; x++){
            for(let y = -1; y <= 1; y++){
                for(let z = -1; z <= 1; z++){

                    let piece = new Piece(new THREE.Vector3(x, y, z), this.pieces.length)
                    scene.add(piece.mesh)

                    this.pieces.push(piece);

                }
            }
        }

    }

    addToAnchor(axis, col){

        //Converte o vector3 recebido em uma lista
        let arr = [...axis]
        //Encontra o indice não nulo
        let index = arr.indexOf(1)

        for(let i = 0; i < this.pieces.length; i++){
            //Se a peça atual, no axis que eu mandei, for igual a coluna que eu estou selecionando
            if(this.pieces[i].mesh.position.getComponent(index) == col){

                this.anchor.mesh.attach(this.pieces[i].mesh)

            }

        }

    }

    removeFromAnchor(){
        
        for(let i = this.anchor.mesh.children.length - 1; i >= 0; i--){
            
            let child = this.anchor.mesh.children[i]

            scene.attach(child)
            child.position.round()

        }

    }

    animate(obj){

        let axis = obj.axis
        let col = obj.col
        let angle = obj.angle

        if(this.update == undefined){

            this.addToAnchor(axis, col)
            this.angle = 0;
            this.desireAngle = angle

            this.update = ()=>{

                if(Math.abs(this.angle) <= Math.abs(this.desireAngle)){
                    this.anchor.mesh.quaternion.setFromAxisAngle(axis, THREE.MathUtils.degToRad(this.angle))
                    this.angle += this.speed * Math.sign(angle);
                } else {

                    this.anchor.mesh.quaternion.setFromAxisAngle(axis, THREE.MathUtils.degToRad(angle))
                    this.removeFromAnchor();
                    this.anchor.mesh.quaternion.setFromAxisAngle(axis, THREE.MathUtils.degToRad(0))

                    this.update = undefined;

                    if(this.cascate == true){

                        if(this.formula.length > this.index){
                            this.animate(this.move(this.formula[this.index]))
                            this.index += 1;
                        } else {
                            this.cascate = false
                        }

                    }

                }

            }

        }

    }

    setTo(obj){

        let axis = obj.axis
        let col = obj.col
        let angle = obj.angle

        this.addToAnchor(axis, col)

        this.anchor.mesh.quaternion.setFromAxisAngle(axis, THREE.MathUtils.degToRad(angle))
        this.removeFromAnchor();
        this.anchor.mesh.quaternion.setFromAxisAngle(axis, THREE.MathUtils.degToRad(0))

    }

    convertString(formula, invert){

        let stringToArray = (string)=>{

            let movements = []
        
            for(let i = 0; i < string.length; i++){
        
                let movement =  '';
        
                for(let j = i; j < string.length; j++){
        
                    if(string[j] != " "){
                        movement += string[j]
                    } else {
                        break
                    }
        
                }
        
                if(movement.length == 2){
                    i += 1
                }
        
                if(movement != ''){
                    movements.push(movement)
                }
        
            }
        
            return movements;
        
        }

        let invertFormula = (array)=>{

            for(let i = 0; i < array.length; i++){

                if(array[i][array[i].length - 1] == "'"){

                    array[i] = array[i].slice(0, -1)
                    
                } else {
                    
                    array[i] += "'"

                }

            }

            return array

        }

        let form = stringToArray(formula)

        if(!invert){
            return form
        } else {
            form = invertFormula(form)
            form = [...form].reverse();
            return form
        }

    }

    setAnimateFormula(formula){

        this.formula = this.convertString(formula, false);
        this.index = 0;

        this.stringFormula = formula

    }

    continueAnimateFormula(){
        this.cascate = true;
        this.animate(this.move(this.formula[this.index]))
        this.index += 1
    }

    setFormula(formula){

        let form = this.convertString(formula, true);

        for(let formula of form){

            this.setTo(this.move(formula))

        }

    }

    move(movement){

        switch(movement){

            //#region BASICS MOVEMENTS
            case "U":
                return {axis: new THREE.Vector3(0, 1, 0), col: 1, angle: -90}
            case "U'":
                return {axis: new THREE.Vector3(0, 1, 0), col: 1, angle: 90}
            case "D":
                return {axis: new THREE.Vector3(0, 1, 0), col: -1, angle: 90}
            case "D'":
                return {axis: new THREE.Vector3(0, 1, 0), col: -1, angle: -90}
            case "L":
                return {axis: new THREE.Vector3(1, 0, 0), col: -1, angle: 90}
            case "L'":
                return {axis: new THREE.Vector3(1, 0, 0), col: -1, angle: -90}
            case "R":
                return {axis: new THREE.Vector3(1, 0, 0), col: 1, angle: -90}
            case "R'":
                return {axis: new THREE.Vector3(1, 0, 0), col: 1, angle: 90}
            case "F":
                return {axis: new THREE.Vector3(0, 0, 1), col: 1, angle: -90}
            case "F'":
                return {axis: new THREE.Vector3(0, 0, 1), col: 1, angle: 90}
            case "B":
                return {axis: new THREE.Vector3(0, 1, 0), col: -1, angle: 90}
            case "B'":
                return {axis: new THREE.Vector3(0, 0, 1), col: -1, angle: -90}
                //#endregion    
            
            //#region DOUBLE MOVEMENTS
            case "U2":
                return {axis: new THREE.Vector3(0, 1, 0), col: 1, angle: -180}
            case "U2'":
                return {axis: new THREE.Vector3(0, 1, 0), col: 1, angle: 180}
            case "D2":
                return {axis: new THREE.Vector3(0, 1, 0), col: -1, angle: 180}
            case "D2'":
                return {axis: new THREE.Vector3(0, 1, 0), col: -1, angle: -180}
            case "L2":
                return {axis: new THREE.Vector3(1, 0, 0), col: -1, angle: 180}
            case "L2'":
                return {axis: new THREE.Vector3(1, 0, 0), col: -1, angle: -180}
            case "R2":
                return {axis: new THREE.Vector3(1, 0, 0), col: 1, angle: -180}
            case "R2'":
                return {axis: new THREE.Vector3(1, 0, 0), col: 1, angle: 180}
            case "F2":
                return {axis: new THREE.Vector3(0, 0, 1), col: 1, angle: -180}
            case "F2'":
                return {axis: new THREE.Vector3(0, 0, 1), col: 1, angle: 180}
            case "B2":
                return {axis: new THREE.Vector3(0, 1, 0), col: -1, angle: 180}
            case "B2'":
                return {axis: new THREE.Vector3(0, 0, 1), col: -1, angle: -180}
            //#endregion
            
        }
        
    }

    nextMovement(){
        
        if(this.cascate == false && this.index < this.formula.length && this.update == undefined){

            this.animate(this.move(this.formula[this.index]))
            this.index++

        }
        
    }
    
    previousMovement(){

        if(this.cascate == false && this.index > 0 && this.update == undefined){

            this.index--
            this.animate(this.move(this.convertString(this.formula[this.index], true)[0]))

        }

    }

    resetToFormula(){

        this.setFormula(this.stringFormula)
        this.index = 0;

    }

}

/*
class Piece{

    constructor(vector, colorIndex){

        this.mesh = new THREE.Group()
        this.colorIndex = colorIndex;
        this.createPlanes();
    
        this.mesh.position.set(...vector)

    }
    
    createPlanes(){

        
        this.createPositions();
        this.createRotations();
        
        
        this.planes = []
        
        let geometry = new THREE.PlaneGeometry();
        
        for(let i = 0; i < 6; i++){

            let plane = new THREE.Mesh(geometry, colors[this.colorIndex][i]);
            plane.position.set(...this.positions[i])
            plane.applyQuaternion(this.rotations[i])
            this.mesh.attach(plane)

        }   

        //Na minha cabeça não tem necessidade de guardar isso na memoria
        this.positions = undefined;
        this.rotations = undefined;

    }

    createPositions(){

        this.positions = []

        this.positions.push(new THREE.Vector3(.5, 0, 0))
        this.positions.push(new THREE.Vector3(-.5, 0, 0))
        this.positions.push(new THREE.Vector3(0, -.5, 0))
        this.positions.push(new THREE.Vector3(0, .5, 0))
        this.positions.push(new THREE.Vector3(0, 0, .5))
        this.positions.push(new THREE.Vector3(0, 0, -.5))
        
    }

    createRotations(){

        this.rotations = []

        this.rotations.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(90)))
        this.rotations.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(-90)))
        this.rotations.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(90)))
        this.rotations.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(-90)))
        this.rotations.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0)))
        this.rotations.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(180)))

    }

}

export class Cube{

    constructor(){

        this.createCube();

    }

    createCube(){

        this.pieces = [];

        for(let x = -1; x <= 1; x++){
            for(let y = -1; y <= 1; y++){
                let inner = []
                for(let z = -1; z <= 1; z++){

                    let piece = new Piece(new THREE.Vector3(x, y, z), this.pieces.length)
                    scene.add(piece.mesh)

                    this.pieces.push(piece);

                }
            }
        }

    }

    rotate(axis, col, angle){

        //Converte o vector3 recebido em uma lista
        let arr = [...axis]
        //Encontra o indice não nulo
        let index = arr.indexOf(1)

        //Itera sob todas as peças
        for(let i = 0; i < this.pieces.length; i++){
            //Se a peça atual, no axis que eu mandei, for igual a coluna que eu estou selecionando
            if(this.pieces[i].mesh.position.getComponent(index) == col){
                
                let piece = this.pieces[i].mesh

                let matrix = new Matrix2();
                matrix.rotate(THREE.MathUtils.degToRad(angle))

                //Converte a posição da peça ATUAl em uma lista
                let pieceArr = [...piece.position]
                //Remove da lista o AXIS selecionado
                pieceArr.splice(index, 1)

                matrix.translate(...pieceArr)

                let translated = matrix.getPos();

                //Converte o vector2 recebido em uma lista
                let arrTranslated = [...translated]

                //Adiciona nessa lista no index recebido o valor original
                arrTranslated.splice(index, 0, piece.position.getComponent(index))

                //Atualiza a posição
                piece.position.set(...arrTranslated)
                //Atualiza a rotação
                piece.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(angle)))

            } 
        } 
        
    }

}

class Matrix2{

    constructor(){

        this.init();

    }

    init(){

        this.elements = [];

        this.elements[0] = 1
        this.elements[1] = 0
        this.elements[2] = 0
        this.elements[3] = 1
        this.elements[4] = 0
        this.elements[5] = 0

    }

    setPosition(x, y){

        this.elements[4] = x
        this.elements[5] = y

    }

    translate(tx, ty) {
        const a = this.elements[0];
        const b = this.elements[1];
        const c = this.elements[2];
        const d = this.elements[3];
        const e = this.elements[4];
        const f = this.elements[5];

        // Update the matrix elements for translation
        this.elements[4] = a * tx + c * ty + e;
        this.elements[5] = b * tx + d * ty + f;
    }

    rotate(angle) {

        let roundToDecimal = (number, decimals)=>{
            let sign = Math.sign(number);
            let factor = Math.pow(10, decimals);
            return Math.round(Math.abs(number) * factor) / factor * sign;
        }

        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const a = this.elements[0];
        const b = this.elements[1];
        const c = this.elements[2];
        const d = this.elements[3];

        this.elements[0] = roundToDecimal(a * cosA - b * sinA, 3);
        this.elements[1] = roundToDecimal(a * sinA + b * cosA, 3);
        this.elements[2] = roundToDecimal(c * cosA - d * sinA, 3);
        this.elements[3] = roundToDecimal(c * sinA + d * cosA, 3);

    }

    getPos(){

        return new THREE.Vector2(this.elements[4], this.elements[5]);

    }

}
*/