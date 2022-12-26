class Figure{
    static figuresConfig = [
        {
            top: [0,0,1,1], //O
            left: [0,1,0,1],
            type: "O"
        },
        {
            top: [0,0,0,0], //I
            left: [0,1,2,3],
            type: "I",
            center: 1
        },
        {
            top: [0,0,0,1], //J
            left: [0,1,2,2],
            type: "J",
            center: 1
        },
        {
            top: [0,0,0,1], //L
            left: [0,1,2,0],
            type:  "L",
            center: 1
        },
        {
            top: [0,0,0,1], //T
            left: [0,1,2,1],
            type:  "T",
            center: 1
        },
        {
            top: [0,0,1,1], //S
            left: [1,2,0,1],
            type:  "S",
            center: 3
        },
        {
            top: [0,0,1,1], //Z
            left: [0,1,1,2],
            type:  "Z",
            center: 2
        }
    ];
    static stateArray;
    constructor(storage=null, parent, squareSide, position){
        Figure.storage || (Figure.storage = storage);
        let figure = this.config = Figure.figuresConfig[Math.floor(Math.random()*Figure.figuresConfig.length)];
        this.squares = [];
        this.isVertical = 1;
        for (let i=0; i<figure.top.length; i++){
            let newPosition = {
                a: position.a+figure.top[i],
                b: position.b+figure.left[i]
            };
            // this.squares.push(new Square(squareSide, newPosition));
            let sq = new Square(squareSide, newPosition);
            // sq.element.innerText = i;
            // sq.element.style.color='white';
            this.squares.push(sq);
        }
        this.Append(parent);
        this.maxWidth = Math.max(Math.max(...figure.top)-Math.min(...figure.top), Math.max(...figure.left)-Math.min(...figure.left));
    }
    GetPosition(){
        let positions=[];
        this.squares.forEach(el=>{
            positions.push({a:el.position.a, b:el.position.b});
        });
        return positions;
    }
    SetPosition(positions){
        //// Check
        for (let i=0; i<positions.length; i++){
            if (positions[i].a<0 || positions[i].b<0 || positions[i].a>=Field.height || positions[i].b>=Field.width) {
                return false;    
            } 
            if (Figure.stateArray[positions[i].a][positions[i].b]) {
                return false;
            }
        }
        ////

        let pos = [...positions];
        this.squares.forEach(a=>{
            a.SetPosition(pos.shift());
        });
        return true;
    }

    GoDown(){
        if (!isGoingDownAvailable()){
            landing();
            return false;
        }
        let positions = this.GetPosition();
        positions.forEach(el=>{
            el.a++;
        });
        this.SetPosition(positions);
    }
    GoLeft(){
        let positions = this.GetPosition();
        positions.forEach(el=>{
            el.b--;
        });
        this.SetPosition(positions);
    }
    GoRight(){
        let positions = this.GetPosition();
        positions.forEach(el=>{
            el.b++;
        });
        this.SetPosition(positions);
    }
    Append(parent){
        this.squares.forEach(el=>{
            el.Append(parent);
        })
    }
    Rotate(){
        if (!this.config.center) return false;
        let center = this.squares[this.config.center].position;
        let reverse = (this.config.type=='I'||this.config.type=='S'||this.config.type=='Z') ? this.isVertical : 1;
        let newPositions = [];
        for (let i=0; i<this.squares.length; i++){
            let a = center.a + reverse*(-center.b + this.squares[i].position.b);
            let b = center.b + reverse*(center.a - this.squares[i].position.a);
            // if (a<0 || b<0 || b>=Field.width || a>=Field.height) return false;
            newPositions.push({a:a,b:b});
        }
        if (this.SetPosition(newPositions)) this.isVertical *= -1;
        else {
            this.RotateAndShift(newPositions);
        }
    }
    RotateAndShift(positions){
        for (let i=1; i<=this.maxWidth; i++){
            let newPositions = [];
            //left
            positions.forEach(el=>{ newPositions.push({a: el.a, b: el.b-i}); });
            if (this.SetPosition(newPositions)) return true;
            newPositions = [];
            //top
            positions.forEach(el=>{ newPositions.push({a: el.a-i, b: el.b}); });
            if (this.SetPosition(newPositions)) return true;
            newPositions = [];
            //right
            positions.forEach(el=>{ newPositions.push({a: el.a, b: el.b+i}); });
            if (this.SetPosition(newPositions)) return true;
            newPositions = [];
            //bottom
            positions.forEach(el=>{ newPositions.push({a: el.a+i, b: el.b}); });
            if (this.SetPosition(newPositions)) return true;
        }
        return false;
    }
    
}