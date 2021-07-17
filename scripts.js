const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particalArray = [];
let adjustX = 0
let adjustY = 0

// handel mouse
let mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x
    mouse.y = e.y
})
ctx.fillStyle = 'white'
ctx.font = '1rem system-ui';
ctx.fillText("CHIRAG", 8, 25);
let textCoodinates = ctx.getImageData(0, 0, 100, 100);

class Partial {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.size = 3
        this.baseX = this.x
        this.baseY = this.y
        this.density = (Math.random() * 30) + 1
    }

    draw() {
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(this.x, this.y,this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
    }
    update () {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy)
        let forceDistanceX = dx / distance;
        let forceDistanceY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / distance;
        let distanceX = forceDistanceX * force * this.density
        let distanceY = forceDistanceY * force * this.density
        if (distance < mouse.radius) {
            this.x -= distanceX
            this.y -= distanceY
        } else {
            // this.size = 3
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX
                this.x -= dx/10
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY
                this.y -= dy/10
            }
        }
    }
}

function init() {
    particalArray = []
    // for (let index = 0; index < 1000; index++) {
    //     let x = Math.random() * canvas.width
    //     let y = Math.random() * canvas.height
    //     particalArray.push(new Partial(x,y))
    // }
    for (let y = 0, y2 = textCoodinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoodinates.width; x < x2; x++) {
            if(textCoodinates.data[(y * 4 * textCoodinates.width) + (x * 4) + 3] > 128) {
                let positionX = x + adjustX
                let positionY = y + adjustY
                particalArray.push(new Partial(positionX * 20,positionY * 20))
            }
        }
    }
}

init()
function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    particalArray.forEach(item => {
        item.draw()
        item.update()
    })
    connect()
    window.requestAnimationFrame(animate)
}
animate();


document.addEventListener('keyup', (e) => {
    if(e.target.value !== '') {
        ctx.fillText(e.target.value.toUpperCase(), 8, 25);
        textCoodinates = ctx.getImageData(0, 0, 100, 100)
    } else {
        ctx.fillText("CHIRAG", 8, 25);
        textCoodinates = ctx.getImageData(0, 0, 100, 100)
    }
    init()
})

function connect() {
    let opacityValue = .3
    for (let a = 0; a < particalArray.length; a++) {
        for (let b = a; b < particalArray.length; b++) {
            let dx = particalArray[a].x -  particalArray[b].x
            let dy = particalArray[a].y -  particalArray[b].y
            let distance = Math.sqrt(dx * dx + dy * dy)
            // opacityValue = 1 - (distance/50)
            ctx.strokeStyle = 'rgba(255,255,255,'+opacityValue+')'
            if(distance < 40) {
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.moveTo(particalArray[a].x,particalArray[a].y)
                ctx.lineTo(particalArray[b].x,particalArray[b].y)
                ctx.stroke()
            }
        }
    }
}