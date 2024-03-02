const drawRectangle = (element, ctx) => {
    let x = element.x;
    let y = element.y;
    let w = element.width;
    let h = element.height;

    if (w < 0) {
        x += w;
        w = -w;
    }
    if (h < 0) {
        y += h;
        h = -h;
    }

    let r = x + w;
    let b = y + h;
    let radius = (Math.min(w, h) / 4 < 18 ? Math.min(w, h) / 4 : 18);

    ctx.beginPath();
    ctx.strokeStyle = element.strokeColor;
    ctx.lineWidth = element.strokeWidth;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(r - radius, y);
    ctx.quadraticCurveTo(r, y, r, y + radius);
    ctx.lineTo(r, y + h - radius);
    ctx.quadraticCurveTo(r, b, r - radius, b);
    ctx.lineTo(x + radius, b);
    ctx.quadraticCurveTo(x, b, x, b - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.stroke();
    ctx.closePath();
}

const drawEllipse = (element, ctx) => {
    let x = element.x;
    let y = element.y;
    let w = element.width;
    let h = element.height;

    let xRadius = w / 2;
    let yRadius = h / 2;

    x += xRadius;
    y += yRadius;

    if (xRadius < 0)
        xRadius = -xRadius;
    if (yRadius < 0)
        yRadius = -yRadius;

    ctx.beginPath();
    ctx.lineWidth = element.strokeWidth;
    ctx.strokeStyle = element.strokeColor;
    ctx.ellipse(x, y, xRadius, yRadius, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}

const drawArrow = (element, ctx) => {
    let tox = element.points[1].x, toy = element.points[1].y;
    let fromx = element.points[0].x, fromy = element.points[0].y;

    let dx = tox - fromx;
    let dy = toy - fromy;
    let angle = Math.atan2(dy, dx);
    let lineLength = Math.sqrt(dx*dx + dy*dy)
    let headlen = lineLength > 60 ? 20: lineLength/3;

    ctx.beginPath();
    ctx.lineWidth = element.strokeWidth;
    ctx.strokeStyle = '#e1e1e1';
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
    ctx.closePath();
}

const drawLine = (element, ctx) => {
    let tox = element.points[1].x, toy = element.points[1].y;
    let fromx = element.points[0].x, fromy = element.points[0].y;

    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.strokeStyle = '#e1e1e1';
    ctx.stroke();
    ctx.closePath();
    
}

const drawElement = (element, ctx) => {
    if (element.type === 'rectangle') drawRectangle(element, ctx);
    if (element.type === 'ellipse') drawEllipse(element, ctx);
    if (element.type === 'arrow') drawArrow(element, ctx);
    if (element.type === 'line') drawLine(element, ctx);
}

export default drawElement;