{
	"use strict";

	console.clear();

	var canvas1 = document.getElementById('mycanvas1');
	var context1 = canvas1.getContext('2d');
	context1.imageSmoothingEnabled = true;
	canvas1.setAttribute('style', 'z-index:1; position: absolute; left: 10px; top: 10px;');
	var canvas2 = document.getElementById('mycanvas2');
	var context2 = canvas2.getContext('2d');
	context2.imageSmoothingEnabled = true;
	canvas2.setAttribute('style', 'z-index:0; position: absolute; left: 10px; top: 10px;');

	const rand = Math.random;
	const floor = Math.floor;
	const TWO_PI = Math.PI * 2;

	let h, w;
	let flag_kill_bubbles = false;
	let asset = {name: 'ninja', path:'images/ninja2.jpg'};
	let particlesArray = [];
	let colorsArray = ['#3498db','#1abc9c','#e74c3c','#9b59b6'];

	let mouseX, mouseY;

	function loadImage (item) {
		return new Promise((resolve) => {
			let img = new Image();
			img.setAttribute('data-name', item.name);
			img.crossOrigin = "Anonymous";
			img.onload = () => resolve(img);
			img.src = item.path;
		});
	}

	loadImage(asset).then((image) => {
		w = image.width;
		h = image.height;

		canvas1.width = w;
		canvas1.height = h;
		canvas2.width = w;
		canvas2.height = h;

		canvas2.setAttribute('data-name', image.getAttribute('data-name'));
		context2.drawImage(image, 0, 0, w, h);
	});

	//addEventListener('resize', () => {
		//canvas.height = innerHeight;
		//canvas.width = innerWidth;
	//	init();
	//});

	addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
		return mouseX
	});

	class Particle{
		constructor(x, y, radius, color, velocity, xmax, ymax){
			this.x = x;
			this.y = y;
			this.xmax = xmax;
			this.ymax = ymax;
			this.radius = radius;
			this.color = color;
			this.velocity = {
				x: (rand() - 0.5) * velocity,
				y: (rand() - 0.5) * velocity
			}
		}
		getDatas() {
			return {
				x: this.x,
				y: this.y,
				radius: this.radius,
				color: this.color
			}
		}
		update(){
			// Algorithm largely inspired by the pen of Dev Loop : Glowing Particles
			// https://codepen.io/dev_loop/pen/pmQJgR
			var mouseRange = 120;
			this.x += this.velocity.x;
			this.y += this.velocity.y;

			const xDist = mouseX - this.x;
			const yDist = mouseY - this.y;

			if(this.x + this.radius > this.xmax || this.x - this.radius < 0){
				this.velocity.x = -this.velocity.x;
			} else if(this.y + this.radius > this.ymax || this.y -this.radius < 0){
				this.velocity.y = -this.velocity.y;
			}

			if(xDist < mouseRange && xDist > -mouseRange &&
				yDist < mouseRange && yDist > -mouseRange){
				this.color = '#fff';
				this.x += (4 * this.velocity.x);
				this.y += (4 * this.velocity.y);
			} else {
				this.color = this.color;
			}

		}
	}

	function init(){
		particlesArray = [];
		var nb_colors = colorsArray.length;
		for(let i = 0; i < 200; i++){
			let randRadius = rand() * 8;
			let randX = rand() * innerWidth - (2 * randRadius) + randRadius;
			let randY = rand() * innerHeight - (2 * randRadius) + randRadius;
			let randVelocity = rand() * 6;
			let randColorIndex = floor(rand() * nb_colors);
			particlesArray.push(new Particle(randX, randY, randRadius, colorsArray[randColorIndex], randVelocity, w, h));
		}
	}

	addEventListener('click', (e) => {
		for(let i = 0; i < 20; i++){
			let randRadius = rand() * 15;
			let randVelocity = rand() * 10;
			let randColorIndex = floor(rand() * colorsArray.length);
			particlesArray.push(new Particle(e.x, e.y, randRadius, colorsArray[randColorIndex], randVelocity, w, h));
		}
	});

	function draw(ctx, datas){
		ctx.save();
		ctx.beginPath();
		ctx.arc(datas.x, datas.y, datas.radius, 0, TWO_PI, false);
		ctx.fillStyle = datas.color;
		ctx.shadowColor = datas.color;
		ctx.shadowBlur = 5;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}

	function animate(){
		context1.clearRect(0, 0, w, h);

		particlesArray.forEach((particle, idx) => {
			if (flag_kill_bubbles) {
				particle.radius -= .1;
			} else {
				particle.update();
			}

			if (particle.radius > 0) {
				draw(context1, particle.getDatas());
			} else {
				delete particlesArray[idx];
			}
		})
		requestAnimationFrame(animate);
	}

	function keyPressed (e) {
	    e.preventDefault();
		// console.log(e.keyCode);

	    // Documentation about keyboard events :
	    //    https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
			const KEY_X = 88;
	    const KEY_Q = 81;

	    switch (e.keyCode) {
	      case KEY_Q:{
			  flag_kill_bubbles = true;
	          break;
	      }
				case KEY_X:{
	          var link = document.getElementById('page3');
	          if (link) {
	            link.click();
	          } else {
	            console.log('link to page3 not found');
	          }
	          break;
	      }

		}
	}

	document.addEventListener('keydown', keyPressed, false);

	document.addEventListener("DOMContentLoaded", function(event) {
		console.log("DOM fully loaded and parsed");
		console.log("Press Q to kill the bubbles");
		console.log("Press X to go to page3");
		animate();
		init();
	}, false);
}
