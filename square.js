class Square{
    constructor(squareSide, position){
        let element = this.element = document.createElement('div');
        element.style.width = element.style.height = squareSide + 'px';
        element.style.borderWidth = Math.floor(squareSide/8) + 'px';
        element.classList.add('square');
        this.SetPosition(position);
    }
    SetPosition(position){
        this.element.style.gridArea = gridArea(position.a, position.b);
        Figure.storage && (Figure.storage[position.a][position.b] = this) && (Figure.storage[this.position.a][this.position.b] = null);
        this.position = {a:position.a, b:position.b};
    }
    GoDown(){
        this.position.a++;
        this.element.style.gridArea = gridArea(this.position.a, this.position.b);
    }
    GoLeft(){
        if (this.position.b>1){
            this.position.b--;
            this.element.style.gridArea = gridArea(this.position.a, this.position.b);
        }
    }
    GoRight(){
        if (this.position.b<Field.width){
            this.position.b++;
            this.element.style.gridArea = gridArea(this.position.a, this.position.b);
        } 
    }
    Append(parent){
        parent.appendChild(this.element);
    }
}