<script>
	import { onMount } from "svelte";
	import { drawBg, drawWindows, drawCurve } from './draw';

	let canvas;
	let ctx;
	let dx = 1;
	let inV = 5;
	let outV = 5
	let inVMax = 15
	let outVMax = 15
	let xMax = 10;
	let x = 1;
	let limit = 10;
	let fn = 'Math.sin(x*4)';
	let drawWaves = false;

	onMount(() =>{
		ctx = canvas.getContext("2d");
		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const opts = {
				x,
				dx,
				xMax,
				inV,
				inVMax,
				outV: inV,
				outVMax: inVMax,
				limit,
				drawWaves,
				func: `(x) => { return ${fn} }`
			};
			drawBg(ctx, opts);
			drawWindows(ctx, opts);
			drawCurve(ctx, opts);
			window.requestAnimationFrame(() => {
				draw();
			});
		}

		draw();
	});

</script>

<main>
	<div id="controls">
		<label for="fn">Function</label>
		<div class="func">
			<p>y=</p>
			<input type="text" bind:value={fn} id="fn" />
		</div>
		<label for="x">X: {x}</label>
		<input type="range" min={-1*xMax} max={xMax} step="0.01" bind:value={x} id="x" />
		<hr>
		<label for="inV">Input voltage: ±{inV}V</label>
		<input type="range" min="0" max={inVMax} step="0.01" bind:value={inV} id="inV" />
		<!--
		<label for="limit">Upper/lower limit: ±{limit}V</label>
		<input type="range" min="0" max={inVMax} step="0.1" bind:value={limit} id="limit" />
		<hr>
		-->
		<label for="inVMax">Max voltage: {inVMax}V</label>
		<input type="range" min="0" max="24" step="0.1" bind:value={inVMax} id="inVMax" />
		<label for="xMax">X max range: {xMax}</label>
		<input type="range" min="0" max="1000" step="1" bind:value={xMax} id="xMax" />
		<label for="dx">Resolution: {dx}</label>
		<input type="range" min="1" max="1000" step="1" bind:value={dx} id="dx" />
		<input type="checkbox" bind:checked={drawWaves} id="drawWaves" />
		<label for="drawWaves">Waves</label>
	</div>
	<canvas bind:this={canvas} width="640" height="640" />
</main>

<style>
	hr {
		margin: 1rem 0;
		border-top: 1px solid #ccc;
	}
	main {
		background: #fafafa;
		display: flex;
		width: 100%;
		padding: 0;
		position: relative;
		height: 100%;
		justify-content: center;
		align-items: center;
	}
	input[type=checkbox],
	input[type=checkbox]+label {
		display: inline-block;
		font-size: 0.75rem;
		line-height: 1.25rem;
		vertical-align: top;
	}
	input[type=checkbox] {
		margin-right: 0.5rem;
		margin-bottom: 0.75rem;
		height: 20px;
		width: 20px;
	}
	label {
		font-size: 0.75rem;
		line-height: 1.25rem;
	}
	input {
		margin-bottom: 0.75rem;
	}
	input~hr {
		margin-top: 0;
	}
	#controls {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 2;
		padding: 2rem;
		background: rgba(255,255,255,0.85);
		width: 12rem;
		border: 1px solid #ccc;
		box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.12);
	}
	canvas {
		width: 640px;
		height: 640px;
		position: relative;
		z-index: 1;
	}
	.func {
		display: inline-flex;
		align-items: flex-start;
		flex-wrap: nowrap;
	}
	input[type=range],
	input[type=text] {
		width: 100%;
	}
	.func p {
		padding-top: 7px;
		margin: 0;
		vertical-align: top;
	}
</style>