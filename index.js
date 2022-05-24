import * as THREE from 'three';

import gsap from 'gsap';

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import * as dat from "dat.gui";

const world = {
    plane: {
        width: 400,
        height:400,
        widthSegments: 75,
        heightSegments: 75
    }
}

// const gui = new dat.GUI();
// gui.add(world.plane, 'width', 1, 500).onChange(generatePlane)

// gui.add(world.plane, 'height', 1, 500).onChange(generatePlane)

// gui.add(world.plane, 'widthSegments', 1, 100).onChange(generatePlane)

// gui.add(world.plane, 'heightSegments', 1, 100).onChange(generatePlane)

function generatePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
    
    //vertices position randomization
    const {array} =planeMesh.geometry.attributes.position;

    const randomValues = []
    for (let i = 0; i < array.length; i++) {

        if(i%3 ===0){
            const x = array[i];
            const y = array[i+1];
            const z = array[i+2];
            
            array[i]= x + (Math.random() - 0.5)*3;
            array[i + 1]= y + (Math.random() - 0.5)*3;
            array[i + 2]= z + (Math.random() - 0.5)*3;
        }

        randomValues.push(Math.random() * Math.PI*2)
    }

    planeMesh.geometry.attributes.position.randomValues = randomValues;

    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;

    const colors = [];

    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0, 0.19, 0.4)
    }

    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
}

const rayCaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

new OrbitControls(camera, renderer.domElement);

document.body.appendChild(renderer.domElement);

camera.position.z = 50;

const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true
});
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(planeMesh);
    
    //vertices position randomization
    const {array} =planeMesh.geometry.attributes.position;

    const randomValues = []
    for (let i = 0; i < array.length; i++) {

        if(i%3 ===0){
            const x = array[i];
            const y = array[i+1];
            const z = array[i+2];
            
            array[i]= x + (Math.random() - 0.5)*3;
            array[i + 1]= y + (Math.random() - 0.5)*3;
            array[i + 2]= z + (Math.random() - 0.5)*3;
        }

        randomValues.push(Math.random()-0.5)
    }

    planeMesh.geometry.attributes.position.randomValues = randomValues;

    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;

    generatePlane();
    
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, -1, 1);
    scene.add(light);

    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(0, 0, -1);
    scene.add(backLight);

    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff
    })

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random()-0.5)*2000;
        const y = (Math.random()-0.5)*2000;
        const z = (Math.random()-0.5)*2000;
        starVertices.push(x,y,z)
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars)

    const mouse = {
        x:undefined,
        y:undefined
    }

    let frame = 0;
    
    function animate(){
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        rayCaster.setFromCamera(mouse, camera);
        frame+=0.01;

        const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position;
        for (let i = 0; i < array.length; i+=3) {
            // x
            array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) *0.003;

            // y
            array[i+1] = originalPosition[i+1] + Math.sin(frame + randomValues[i +1]) *0.003;
        }

        planeMesh.geometry.attributes.position.needsUpdate = true;
        
        const intersects = rayCaster.intersectObject(planeMesh);

        if (intersects.length > 0){
            const {color} = intersects[0].object.geometry.attributes;
            // vertices 1
            color.setX(intersects[0].face.a,0.1);
            color.setY(intersects[0].face.a,0.5);
            color.setZ(intersects[0].face.a,1);

            // vertices 1
            color.setX(intersects[0].face.b,0.1);
            color.setY(intersects[0].face.b,0.5);
            color.setZ(intersects[0].face.b,1);

            // vertices 1
            color.setX(intersects[0].face.c,0.1);
            color.setY(intersects[0].face.c,0.5);
            color.setZ(intersects[0].face.c,1);

            intersects[0].object.geometry.attributes.color.needsUpdate = true;

            const initialColor = {
                r: 0,
                g: .19,
                b: .4
            }

            const hoverColor = {
                r: .1,
                g: .5,
                b: 1
            }
            gsap.to(hoverColor, {
                r: initialColor.r,
                g: initialColor.g,
                b: initialColor.b,
                onUpdate: () => {
                     // vertices 1
            color.setX(intersects[0].face.a,hoverColor.r);
            color.setY(intersects[0].face.a,hoverColor.g);
            color.setZ(intersects[0].face.a, hoverColor.b);

            // vertices 1
            color.setX(intersects[0].face.b,hoverColor.r);
            color.setY(intersects[0].face.b,hoverColor.g);
            color.setZ(intersects[0].face.b, hoverColor.b);

            // vertices 1
            color.setX(intersects[0].face.c,hoverColor.r);
            color.setY(intersects[0].face.c,hoverColor.g);
            color.setZ(intersects[0].face.c, hoverColor.b);
                }
            })
        }

        stars.rotation.x += 0.0001
    }
    
    
    animate();
    

    addEventListener('mousemove', ()=>{
        mouse.x = (event.clientX / innerWidth)*2-1;
        mouse.y = -(event.clientY / innerHeight)*2+1;
    })
    

    // TEXT ANIMATION
    gsap.to('#pieroCapra', {
        opacity: 1,
        duration: 1.5,
        y: 0,
        ease: 'expo'
      })
      
      gsap.to('#oneWithAn', {
        opacity: 1,
        duration: 1.5,
        delay: 0.3,
        y: 0,
        ease: 'expo'
      })
      
      gsap.to('#viewWorkBtn', {
        opacity: 1,
        duration: 1.5,
        delay: 0.6,
        y: 0,
        ease: 'expo'
      })

// CLICK BUTTON ANIMATION
document.querySelector('#viewWorkBtn').addEventListener('click', (e)=>{
    e.preventDefault();
    gsap.to('#container', {
        opacity: 0
    })
    gsap.to(camera.position, {
        z:25,
        ease:'power3.inOut',
        duration:2
    })
    gsap.to(camera.rotation, {
        x: 1.57,
        ease:'power3.inOut',
        duration:2
    })
    gsap.to(camera.position, {
        y: 1000,
        ease:'power3.in',
        duration:1,
        delay: 2,
        onComplete: ()=>{
            window.location = 'https://pierocapra.com/'
        }
    })
})  

// resize viewport dinamically
addEventListener('resize', ()=>{
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight);
})