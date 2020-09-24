const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const svg = document.getElementById('svg1');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];
let adjustX = 8;
let adjustY = 45;

const mouse = {
    x: null,
    y: null,
    radius: 100
};

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

let gradient = ctx.createLinearGradient(0,0,canvas.width,0);
gradient.addColorStop('0','rgba(25,0,0,1)');
gradient.addColorStop('1','rgba(25,0,0,1)');

ctx.fillStyle = gradient;
ctx.font = '30px Verdana';
ctx.fillText("BLURRED", 0, 40);
ctx.fillText("HOVER", 20, 80);
const textCoord = ctx.getImageData(0, 0, 150, 80);

class Particle {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 0;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 50)+.5;
    }

    draw(){
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();  
    }

    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forcceDirX = dx / distance;
        let forcceDirY = dy / distance;
        let maxDist = mouse.radius;
        let force = (maxDist - distance) / maxDist;
        let directionX = forcceDirX * force * this.density;
        let directionY = forcceDirY * force * this.density;
        
        if (distance < mouse.radius){
            this.x -= directionX;
            this.y -= directionY;
        }else{
            if(this.x!== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/7;
            }
            if(this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/7;
            }
        }
    }
}
console.log(textCoord);
function init() {
    particleArray = [];
    for (let y= 0, y2 = textCoord.height; y < y2; y++){
        for (let x= 0, x2 = textCoord.width; x < x2; x++){
            if(textCoord.data[(y*4*textCoord.width)+ (x*4) + 3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX*8,positionY*8));
            }
        }
    }
}
init();

function animate(){
    ctx.clearRect(0, 0, canvas.width ,canvas.height);
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

function connect(){
    for(let i = 0; i < particleArray.length; i++){
        for(let j = i; j < particleArray.length; j++){
            let dx = particleArray[i].x - particleArray[j].x;
            let dy = particleArray[i].y - particleArray[j].y;
            let distance = Math.sqrt(dx*dx + dy*dy);

            if(distance < 20){
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 10;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(particleArray[i].x, particleArray[i].y);
                ctx.lineTo(particleArray[j].x, particleArray[j].y);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
}