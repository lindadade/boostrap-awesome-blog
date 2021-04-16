// 时间
const Timer = "2021-01-27 3:01:00".split(/[- :]/)
// 常量
let WINDOW_WIDTH = 1024;
let WINDOW_HEIGHT = 768;
let RADIUS = 8;
let MARGIN_TOP = 60;
let MARGIN_LEFT = 30;

// 存放小球
const balls = [];
// 更换颜色
const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"]

window.onload = function () {
	timerStart();
	// 根据用户屏幕来自定义常量
	const containerDom = document.getElementsByClassName('timer-canvas-container')[0]
	console.log(document.getElementsByClassName('timer-canvas-container')[0].clientHeight)
	WINDOW_WIDTH = containerDom.clientWidth;
	WINDOW_HEIGHT = containerDom.clientHeight;
	MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
	// 根据 renderDigit 的 x 来进行判断
	RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108)-1
	MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5)

	// 初始化画布
	const canvas = document.getElementById('canvas');
	const context = canvas.getContext("2d");

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;
	curShowTimeSeconds = getCurrentShowTimeSeconds()
	// 定时渲染
	setInterval(() => {
		render(context);
		update()	// 更新函数
	}, 50)
}

// 获取当前时间
function getCurrentShowTimeSeconds() {
	let curTime = new Date();
	// 存的是今天已经走过了多久 => 时钟
	let ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds()

	return ret
}

// 时间开始
function timerStart(){
	const startTime = new Date(Timer[0], Timer[1]-1, Timer[2], Timer[3], Timer[4], Timer[5])
	let duration = parseInt(Math.ceil(+(new Date() - startTime)/1000 / 3600 / 24))
	const days = '' + duration + ' 个日夜';
	const timerDom = document.getElementById('dayTimer')
	timerDom.innerHTML = (days);
	timerDom.setAttribute('data-text', days)
}

// 更新
function update() {
	// 下一秒的时钟
	const nextShowTimeSeconds = getCurrentShowTimeSeconds()
	let nextHours = parseInt(nextShowTimeSeconds / 3600);
	let nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60)
	let nextSeconds = nextShowTimeSeconds % 60

	// 当前秒的时钟
	let curHours = parseInt(curShowTimeSeconds / 3600);
	let curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60)
	let curSeconds = curShowTimeSeconds % 60

	// 更新秒钟
	if (nextShowTimeSeconds != curShowTimeSeconds) {
		// 对 6 个数字一起判断更新
		if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
			// 添加小球
			addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10));
		}
		if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
			addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours / 10));
		}
		if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
			addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
		}
		if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
			addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
		}
		if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
			addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
		}
		if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
			addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds % 10));
		}

		curShowTimeSeconds = nextShowTimeSeconds;
	}
	// 更新小球
	updateBalls();
}

// 更新小球运动
function updateBalls() {
	for (let i = 0; i < balls.length; i++) {
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			balls[i].vy = -balls[i].vy * 0.75;
		}
	}

	// 数量初始化为 0 => 确立还有多少个小球保留在画布中
	let cnt = 0
	for( let i = 0 ; i < balls.length ; i ++ )
		// 是否在画布中
		if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH )
		// 是则添加小球
			balls[cnt++] = balls[i]
	// 只保留 300 或存在画布的小球
	while( balls.length > Math.min(400, cnt) ){
		balls.pop();
	}
}

// 添加小球
function addBalls(x, y, num) {
	for (let i = 0; i < digit[num].length; i++)
		for (let j = 0; j < digit[num][i].length; j++)
			if (digit[num][i][j] == 1) {
				const aBall = {
					// 原点
					x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
					y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
					// 动画随机设计
					g: 1.5 + Math.random(),
					vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
					vy: -5,
					color: colors[Math.floor(Math.random() * colors.length)]
				}

				balls.push(aBall)
			}
}

// 绘制数字的每一个圆点
function render(cxt) {

	// 对整个屏幕矩形进行刷新
	cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT)

	let hours = parseInt(curShowTimeSeconds / 3600);
	let minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60)
	let seconds = curShowTimeSeconds % 60

	renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt)
	renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt)
	renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt)
	renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt);
	renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt);
	renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
	renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt);
	renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt);

	// 绘制小球
	for (let i = 0; i < balls.length; i++) {
		cxt.fillStyle = balls[i].color;

		cxt.beginPath();
		cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
		cxt.closePath();

		cxt.fill();
	}
}

// 绘制圆点
function renderDigit(x, y, num, cxt) {
	cxt.fillStyle = "rgb(0,102,153)";

	for (let i = 0; i < digit[num].length; i++)
		for (let j = 0; j < digit[num][i].length; j++)
			if (digit[num][i][j] == 1) {
				cxt.beginPath();
				// 第（i, j）个圆的圆心位置：
				// j*2*(R+1) => 第 j 列个的框框
				// x: x+j*2*(R+1)+(R+1)
				// y: y+i*2*(R+1)+(R+1)
				cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI)
				cxt.closePath()

				cxt.fill()
			}
}

