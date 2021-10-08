'use strict';

export class Vector{
    constructor(x,y,z){
        this.x= x;
        this.y= y;  
        this.z= z;
    }

    get (Index){
        switch(Index){
            case 0: { return this.x; break; }
            case 1: { return this.y; break; }
            case 2: { return this.z; break; }
            default: { console.log("Out of range . . .\n"); }
        }
    }

    add (v)
    { return new Vector( this.x+v.x , this.y+v.y, this.z+v.z ); }

    sub (v)
    { return new Vector( this.x-v.x , this.y-v.y, this.z-v.z ); }

    mul (r)
    { return new Vector( r*this.x, r*this.y, r*this.z );}

    dot (v)
    { return this.x*v.x + this.y*v.y + this.z*v.z; }

    cross (v){
        var X= this.y*v.z - this.z*v.y;
        var Y= this.z*v.x - this.x*v.z;
        var Z= this.x*v.y - this.y*v.x;
        return new Vector(X,Y,Z);
    }

    module ()
    { return Math.sqrt( this.dot(this) ); }

    normal (){
        var r = this.module();
        var X = this.x/r;
        var Y = this.y/r;
        var Z = this.z/r;
        return new Vector(X,Y,Z);
    }

    print ()
    { console.log( '<' + this.x + ',' + this.y + ',' + this.z + '>' ); }
}

export var O = new Vector(0,0,0);

export class Matrix{
    n= 4;
    A= [];

    constructor(f,s=0,t=0){
        // ---> Genera Matriz Identidad
        this.initializeMatrix(1);
        var M = this.A;

        // ---> Constructor -- Matriz de Rotacion 
        if( typeof(f)=='string' ){
            s *= pi/180.0;
            switch(f){
                case 'X':
                case 'x': {
                    M[1][1] = cos(s); M[1][2] = -sin(s);
                    M[2][1] = sin(s); M[2][2] =  cos(s);
                }
                case 'Y':
                case 'y': {
                    M[0][0] = cos(s); M[0][2] = -sin(s);
                    M[2][0] = sin(s); M[2][2] =  cos(s);
                }
                case 'Z':
                case 'z': {
                    M[0][0] = cos(s); M[0][1] = -sin(s);
                    M[1][0] = sin(s); M[1][1] =  cos(s);
                }
            }
        }

        // ---> Constructor -- Matriz de Elongacion
        if( typeof(f)=='number' )
            this.initializeMatrix(f);
        
        if( typeof(f)=='object' && s==0 ){
            for(var floor=0; floor<3; ++floor)
                M[floor][3] = f.get(floor);
        }

        if( typeof(f)=='object' && typeof(s)=='number' ){
            var x = (f.normal()).x, y = (f.normal()).y, z = (f.normal()).z;
            var s = s*pi/180.0;
            var ucos = 1 - cos(s);
            M[0][0] = cos(s) + x*x*ucos  ; M[0][1] = x*y*ucos - z*sin(s); M[0][2] = x*z*ucos + y*sin(s);
            M[1][0] = y*x*ucos + z*sin(s); M[1][1] = cos(s) + y*y*ucos  ; M[1][2] = y*z*ucos - x*sin(s);
            M[2][0] = z*x*ucos - y*sin(s); M[2][1] = z*y*ucos + x*sin(s); M[2][2] = cos(s) + z*z*ucos  ;
        }
    }

    initializeMatrix (diagonal){
        this.A.length = this.n;
        for( var index = 0; index<this.n; ++index){
            this.A[index] = [];
            this.A[index].length = this.n;
            for(var j=0; j<this.n; ++j)
                this.A[index][j] = 0.0;
            this.A[index][index] = diagonal;
        }   
        this.A[3][3] = 1.0;
    }

    print (){
        for(var i=0; i<this.n; ++i){
            var M = this.A;
            console.log( M[i][0] + ' ' + M[i][1] + ' ' + M[i][2] + ' ' + M[i][3] + '\n');
        }
    }
}
