'use strict';

var screen_x = window.innerWidth;
var screen_y = window.innerHeight;

export var pi = Math.PI;

export function cos(th)
{ return Math.cos(th); }

export function sin(th)
{ return Math.sin(th); }

export class InitPovray{
    // ---> Povray properties
    scene;
    camera;
    renderer;
    
    // ---> Camera properties
    frustrumVertical;
    near;
    far;
    pos;
    lok;

    // ---> Geometry properties
    sphereParameters = [ 1, 3, 2, 0, 2*Math.PI, 0, Math.PI ];
    boxParameters = [ 1, 1, 1, 1, 1, 1];
    planeParameters = [];
    circleParameter = [1,150,0,2*pi];
    

    // ---> Figure
    list_geometries = [ new THREE.SphereGeometry(1,150,150),
                        new THREE.BoxGeometry( 1, 1, 1 ) ,
                        new THREE.PlaneGeometry( 1, 1, 1, 1 ),
                        new THREE.CircleGeometry( 1, 150, 0, 2*pi ),
                        new THREE.ConeGeometry( 1, 1, 50, 2, false, 0, 2*pi )];
    geometry;
    material;
    figure;

    constructor(){
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer( { alpha: true });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    // ---> Set Perspective Camera ---------------------------------------------------
    setPCamera (FrustrumVertical=45,near=0.1,far=1000){ 
        this.frustrumVertical = FrustrumVertical;0
        this.near = near;
        this.far = far;
        this.camera = new THREE.PerspectiveCamera(FrustrumVertical,screen_x/screen_y,near,far); 
    }

    updateCam (pos,look){ 
        if (look==null) { look = this.lok; }
        this.camera.position.set( pos.x, pos.y, pos.z );
        this.camera.lookAt( look.x, look.y, look.z ); 
    }

    updateRatio(X,Y)
    { his.camera = new THREE.PerspectiveCamera(FrustrumVertical,X/Y,near,far); }

    setLight(Hexcolour,pos){
        this.light = new THREE.DirectionalLight( Hexcolour );
        this.light.position.set( pos.x, pos.y, pos.z ).normalize();
        this.scene.add( this.light );   
    }

    // ---> Set geometry ---------------------------------------------------
    updateGeometry(key='sphere'){
        if (key=='sphere'){ this.geometry = this.list_geometries[0]; }
        if (key=='box')   { this.geometry = this.list_geometries[1]; }
        if (key=='plane') { this.geometry = this.list_geometries[2]; }
        if (key=='circle'){ this.geometry = this.list_geometries[3]; }
        if (key=='cone')  { this.geometry = this.list_geometries[4]; }
    }

    updateSphere (radius=1,width=150,height=150,initPhi=0,LenghtPhi=2*Math.PI,initTh=0,LenghtTh=Math.PI)
    { this.sphereParameters = [ radius, width, height, initPhi, LenghtPhi, initTh, LenghtTh ] }

    BasicMaterial (Hexcolour)
    { this.material = new THREE.MeshBasicMaterial( {color: Hexcolour} ); }

    PhongMaterial (Hexcolour)
    { this.material = new THREE.MeshPhongMaterial( {color: Hexcolour, specular: 0x555555, shininess: 30 } ); }

    setFigure ()
    { this.figure = new THREE.Mesh( this.geometry,this.material ); }

    translate(v)
    { this.figure.position.set( v.x, v.y, v.z ); }

    rotate(v)
    { this.figure.rotation.set( v.x, v.y, v.z ); }
    
}

export function init(p){ 
    p = new InitPovray();
    document.body.appendChild( p.renderer.domElement );
}