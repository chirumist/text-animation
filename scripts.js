const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particalArray = [];

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
ctx.font = '40px system-ui';
ctx.fillText('A', 0, 30);
const data = ctx.getImageData(0, 0, 100, 100);

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
        ctx.fillStyle = 'blue'
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
    for (let index = 0; index < 1000; index++) {
        let x = Math.random() * canvas.width
        let y = Math.random() * canvas.height
        particalArray.push(new Partial(x,y))
    }
        
}

init()
function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    particalArray.forEach(item => {
        item.draw()
        item.update()
    })
    window.requestAnimationFrame(animate)
}
animate();
