// initial variables. Osnovne elemente najprej definiramo kot spremenljivke

var scene;
var renderer;
var camera;
var mouseX = 0;
var mouseY = 0;
var particles = [];

// velike crke, ker je neka konstantna vrednost, ki se ne spreminja

var PARTICLE_NUM = 200;
var COLORS = [0x4285F4, 0x34a853, 0xFBBC05, 0xEA4335];

//ko imamo osnovne elemente definirano inicializiramo naso aplikacijo
//osnovnim parametrom pripisemo vrednosti

function init() {

    //v funkciji dolocimo spremenljivke, kako naj se orientira kamera
    //osnovne nastavitve za naso kamero

    camera = new THREE.PerspectiveCamera(
        75,                                         //field of view
        $(window).width()/$(window).height(),       //aspect
        1,                                           //near
        10000                                       //far
    );

    //privzeta lega kamere
    camera.position.z = 100;

    //scene setup
    scene = new THREE.Scene();

    //renderer setup - renderer bo prikazal 3D sceno

    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio(window.devicePixelRation);               //browser izpostavi koliksna je gostoto, za renderer lahko nastavimo koliko naj bo gosto razmerja pixel-ov
    renderer.setSize($(window).width(), $(window).height());        // velikost nase scene. izpostaviti mora tako, kot je veliko okno v browser-ju
    renderer.setClearColorHex(0xffffff, 1);                         // OZADJE, kaksne barve bo scena (bela barva, transparency). 1 je vrednost od 0 do 1 za Alfo

    $('body').append(renderer.domElement);                          //CANVAS element, ki ga vstavimo v index.html

    createParticles();

    $(window).on('mousemove', function (evt) {

        mouseX = evt.clientX;                       // te dve vrednosti bosta imel epodatke kje se nasa miska nahaja
        mouseY = evt.clientY;

    });

}
////vektor, ki bo dolocil obliko sprite-a.
function createParticles() {

    var geometry = new THREE.Geometry();                // objekt, ki lahko prejme veliko tock


    for(var i=0;i<PARTICLE_NUM;i++) {                               // TO SE BO ZGODILO 1000x

        var color = COLORS[Math.floor(Math.random()*4)];        //Math.random je vrednsot od 0-1, zato damo x4, ker imamo stiri barve. Math.floor - zaokrozi vrednost na dol.

        //tukaj smo sami ustvarili material. lahko bi tudi vstavili sliko.
        var material = new THREE.SpriteCanvasMaterial({
            color:color,                                         //barva kroga
            program:function (context) {
                // create a circle path and fill it
                context.beginPath();
                context.arc(0,0,0.5,0,Math.PI*2,true);                //kot da bi risali kroznico v illustrator-ju. S tem smo definirali KROG!
                context.fill();                                      //krog s polnilom, crna barva ki smo jo zgoraj dolocili
            }

        });

        var particle = new THREE.Sprite(material);                  // SPRITE je tip objekta, ki ga damo v 3D prostor in nima globine. ni kugla, ni kvadrat
        particle.position.x = Math.random() * 2 - 1;                // to pomeni od -1 do 1
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;

        particle.position.normalize();                          // najprej normaliziramo te vrednosti, jih zaokrozimo
        particle.position.multiplyScalar(450);                  // da od -1 do 1 spravimo pa neko vecjo vrednost oziroma povrsino. -450 do 450!

        //velikost, povemo koliko naj se particle razsiri na x in z os
        //particle.scale.x = 15;
        //particle.scale.y = 15;
        particle.scale.x = particle.scale.y = Math.random()*20+5;

        particles.push(particle);


        //ustvarimo objekt, ki bo drzal vse polozaje noter
        geometry.vertices.push(particle.position);              //tocke, ki definirajo geometrijo lahko potisnemo noter - potisnemo  POZICIJO

        scene.add(particle);                                    // scena je na koncu tista, ki se bo rendrala. Vse kar damo noter v sceno se bo renderer

    }

    var lineMaterial = new THREE.LineBasicMaterial({ color:0x000000, opacity:0.5 });        //definiramo material, ki ga dolocimo za crto

    var line = new THREE.Line(geometry, lineMaterial);                                      //da narisemo crto.//povemo kaj crta deifnira

    scene.add(line);                                                                        // v sceno porinemo crto, zgoraj smo porinili particle

}

// funkcija animate bo poklicala render
// najprej se v sceni predstavi nekaj, potem se render

function animate() {

    //funkcija, ki bo poklicala, ko bo pripravljen naslednji frame; ko bo browser pripravljen, da mi iterira cez novi frame - takrat bo poklicala funkcijo, ki je noter dana = ANIMATE
    // to se bo zgodilo: 60 frames na sekundo je native frame rate v brskalnikih
    // request-a nov frame, ko ga dobi, poklice animate. to je resitev da se ne sprozi neskoncen loop
    requestAnimationFrame(animate);

    //CE ZELIMO DA SE NEKAJ DOGAJA - animate
    //camera.position.z += 0.5;
    //camera.rotation.y += 0.001;

    //Animate camera based on mouse position
    camera.position.x += (mouseX - camera.position.x)*0.05;
    camera.position.y += (-mouseY + 200 - camera.position.y)*0.05;

    camera.lookAt(scene.position);    // pozicija scene je center nase scene in sedaj bo kamera gledala noter v sceno

    for(var i = 0;i<particles.length;i++){

        var particle = particles[i];
        particle.position.y += Math.random()*2-1;       // delce rahlo trese

    }

    render();

}

function render() {

    // renderer mora vedeti za sceno in camero. kar koli bomo porinili v sceno nam bo pokazal v brskalniku
    renderer.render(scene, camera);

}

init();
animate();                                  // animate bo sprozil animate funkcijo, potem bo pa animate sam sebe sprozil 60x na sekundo
