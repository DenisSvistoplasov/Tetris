const squareSide = 16*1;

const Field = {
    width: 13,
    height: 18,
    element: document.getElementsByClassName('field')[0],
    array: [],
    delay: 400,
    speed: 1
}

function fullField(){
    Field.array = new Array(Field.height);
    for (let i=0; i<Field.height; i++) Field.array[i] = new Array(Field.width);
}
fullField();

function gridArea(j,i){
    return (j+1)+'/'+(i+1)+'/'+(j+2)+'/'+(i+2);
}
