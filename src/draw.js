export const size = {
  x: 640,
  y: 640
}

export function v2PX(V, maxV, maxPX) {
  return maxPX/maxV*V;
}

function useX(x) {
  return x*1;
}

export function drawCurve(ctx, opts) {

  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);

  // zero points in the middle of the graph
  const x0 = size.x/2;
  const y0 = size.x/2;
  const scale = size.x/2; // from x=0 to x=1

  let xx, yy;
  let dx = opts.dx;
  let max = Math.round((ctx.canvas.width-x0)/dx);
  let min = Math.round(-x0/dx);
  let fn;

  function defaultFn(x) {
    return x*1;
  }

  function callFn(x) {
    try {
      return fn(x);
    }
    catch(err) {
      return defaultFn(x);
    }
  }
  
  try {
    fn = eval(opts.func);
  }
  catch(err) {
    fn = defaultFn;
  }

  for (let i = min; i <= max; i++) {

    xx = dx*i;
    
    let x = (xx/scale)*opts.x;
    let y = callFn(x);

    yy = scale * y;

    if (i==min) {
      ctx.moveTo(x0+xx,y0-yy);
    }
    else {
      ctx.lineTo(x0+xx,y0-yy);
    } 
  }

  ctx.stroke();
  ctx.save();

  // Window
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,0,255,0.75)';
  const wx0 = v2PX(-1*opts.inV, opts.inVMax, size.x)/2;
  const wxx0 = (dx*wx0/scale)*opts.x;
  const wy0 = y0 - (scale * callFn(wxx0));
  const wx1 = v2PX(opts.inV, opts.inVMax, size.x)/2;
  const wxx1 = (dx*wx1/scale)*opts.x;
  const wy1 = y0 - (scale * callFn(wxx1));
  ctx.lineWidth = 2;
  ctx.setLineDash([5,2]);
  ctx.moveTo(x0 + wx0, wy0);
  ctx.lineTo(x0 + wx1, wy1);
  ctx.stroke();
  ctx.lineWidth = 2;
  const h = wy0-wy1;
  const w = wx1-wx0;
  ctx.rect(x0 + wx0, wy1, w, h);
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.restore();

  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = 'rgba(255,0,0,0.75)';
  ctx.textAlign = 'center';
  ctx.translate(x0 + wx1 + 6, wy1 + h/4);
  ctx.rotate(0.5*Math.PI);
  ctx.fillText(`+${opts.inV}V`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = 'rgba(255,0,0,0.75)';
  ctx.textAlign = 'center';
  ctx.translate(x0 + wx0 - 6, y0 + h/4);
  ctx.rotate(-0.5*Math.PI);
  ctx.fillText(`-${opts.inV}V`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = 'rgba(0,0,255,0.75)';
  ctx.textAlign = 'center';
  ctx.translate(x0, y0 - h/2);
  //ctx.fillText(`+${callFn(opts.inV)}V`, 0, 0);
  ctx.restore();
}

export function drawWindows(ctx, opts) {

  // Input
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,0,0,0.5)';
  const iw = v2PX(opts.inV, opts.inVMax, size.x);
  const ix = (size.x/2 - iw/2);
  const ih = 100;
  const iy = size.y-(ih+10);
  ctx.rect(ix, iy, iw, ih);
  if(opts.drawWaves) ctx.stroke();

  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = 'rgba(255,0,0,0.5)';
  ctx.textAlign = 'center';
  ctx.translate(ix-6, iy+ih/2);
  ctx.rotate(-0.5*Math.PI);
  if(opts.drawWaves) ctx.fillText(`-${opts.inV}V`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = 'rgba(255,0,0,0.5)';
  ctx.textAlign = 'center';
  ctx.translate(ix+iw+6, iy+ih/2);
  ctx.rotate(0.5*Math.PI);
  if(opts.drawWaves) ctx.fillText(`+${opts.inV}V`, 0, 0);
  ctx.restore();

  // Output
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0,0,255,0.5)';
  const oh = v2PX(opts.outV, opts.outVMax, size.y);
  const ow = 100;
  const oy = (size.y/2 - oh/2);
  const ox = size.x-(ow+10);
  ctx.rect(ox, oy, ow, oh);
  if(opts.drawWaves) ctx.stroke();

  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = 'rgba(0,0,255,0.5)';
  ctx.textAlign = 'center';
  ctx.translate(ox+ow/2, oy+oh+15);
  if(opts.drawWaves) ctx.fillText(`-${opts.outV}V`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = 'rgba(0,0,255,0.5)';
  ctx.textAlign = 'center';
  ctx.translate(ox+ow/2, oy-6);
  if(opts.drawWaves) ctx.fillText(`+${opts.outV}V`, 0, 0);
  ctx.restore();

}

export function drawBg(ctx, opts) {
  
  ctx.lineWidth = 1;

  // Best-fit line
  ctx.beginPath();
  ctx.moveTo(0, size.y);
  ctx.lineTo(size.x, 0);
  ctx.strokeStyle = 'rgba(255,0,0,0.25)';
  ctx.setLineDash([5, 5]);
  ctx.stroke();

  // Output line
  ctx.beginPath();
  ctx.moveTo(size.x/2, size.y);
  ctx.lineTo(size.x/2, 0);
  ctx.strokeStyle = 'rgba(0,0,255,0.5)';
  ctx.setLineDash([]);
  ctx.stroke();

  // Output text
  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = 'blue';
  ctx.translate(size.x/2 + 20, size.y);
  ctx.rotate(-0.5*Math.PI);
  ctx.fillText('OUTPUT ⟶', 0, 0);
  ctx.restore();
  
  // Output marks
  ctx.beginPath();
  ctx.moveTo(size.x/2-3, size.y);
  ctx.lineTo(size.x/2+3, size.y);
  ctx.moveTo(size.x/2-3, size.y/4*3);
  ctx.lineTo(size.x/2+3, size.y/4*3);
  ctx.moveTo(size.x/2-3, size.y/4*1);
  ctx.lineTo(size.x/2+3, size.y/4*1);
  ctx.moveTo(size.x/2-3, 0);
  ctx.lineTo(size.x/2+3, 0);
  ctx.strokeStyle = 'blue';
  ctx.stroke();

  // Min output V
  ctx.save();
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = 'blue';
  ctx.translate(size.x/2 - 6, size.y);
  ctx.rotate(-0.5*Math.PI);
  ctx.fillText(`-${opts.outVMax}V`, 0, 0);
  ctx.restore();
  
  // Max output text
  ctx.save();
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = 'blue';
  ctx.translate(size.x/2 - 6, 0);
  ctx.rotate(-0.5*Math.PI);
  ctx.textAlign = 'right';
  ctx.fillText(`+${opts.outVMax}V`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = 'blue';
  ctx.translate(size.x/2 - 6, size.y/4*1);
  ctx.rotate(-0.5*Math.PI);
  ctx.textAlign = 'center';
  ctx.fillText(`+${opts.outVMax/4*2}V`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = 'blue';
  ctx.translate(size.x/2 - 6, size.y/4*3);
  ctx.rotate(-0.5*Math.PI);
  ctx.textAlign = 'center';
  ctx.fillText(`-${opts.outVMax/4*2}V`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = 'blue';
  ctx.translate(size.x/2, size.y/2+15);
  ctx.textAlign = 'center';
  ctx.fillText(`0V`, 0, 0);
  ctx.restore();

  // Input line
  ctx.beginPath();
  ctx.moveTo(0, size.y/2);
  ctx.lineTo(size.x, size.y/2);
  ctx.strokeStyle = 'rgba(255,0,0,0.5)';
  ctx.setLineDash([]);
  ctx.stroke();

  // Input text
  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = 'red';
  ctx.translate(0, size.y/2 + 20);
  ctx.fillText('INPUT ⟶', 0, 0);
  ctx.restore();

  // Input marks
  ctx.beginPath();
  ctx.moveTo(0, size.y/2 - 3);
  ctx.lineTo(0, size.y/2 + 3);
  ctx.moveTo(size.x/4, size.y/2 - 3);
  ctx.lineTo(size.x/4, size.y/2 + 3);
  ctx.moveTo(size.x/2, size.y/2 - 3);
  ctx.lineTo(size.x/2, size.y/2 + 3);
  ctx.strokeStyle = '#ff0000';
  ctx.stroke();

  // Min input V text
  ctx.save();
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = 'red';
  ctx.translate(0, size.y/2 - 6);
  ctx.fillText(`-${opts.inVMax}V`, 0, 0);
  ctx.restore();
  
  // Min-mid input V text
  ctx.save();
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = 'red';
  ctx.textAlign = 'center';
  ctx.translate(size.x/4, size.y/2 - 6);
  ctx.fillText(`-${opts.inVMax/2}V`, 0, 0);
  ctx.restore();

  // Mid text
  ctx.save();
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = 'red';
  ctx.textAlign = 'center';
  ctx.translate(size.x/2, size.y/2 - 6);
  ctx.fillText(`0V`, 0, 0);
  ctx.restore();
  
  // Max-mid input V text
  ctx.beginPath();
  ctx.moveTo(size.x/2+size.x/4, size.y/2 - 3);
  ctx.lineTo(size.x/2+size.x/4, size.y/2 + 3);
  ctx.strokeStyle = '#ff0000';
  ctx.stroke();

  ctx.save();
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = 'red';
  ctx.textAlign = 'center';
  ctx.translate(size.x/2+size.x/4, size.y/2 - 6);
  ctx.fillText(`+${opts.inVMax/2}V`, 0, 0);
  ctx.restore();

  // Max input V text
  ctx.beginPath();
  ctx.moveTo(size.x, size.y/2 - 3);
  ctx.lineTo(size.x, size.y/2 + 3);
  ctx.strokeStyle = '#ff0000';
  ctx.stroke();

  ctx.save();
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = 'red';
  ctx.textAlign = 'right';
  ctx.translate(size.x, size.y/2 - 6);
  ctx.fillText(`+${opts.inVMax}V`, 0, 0);
  ctx.restore();

}

