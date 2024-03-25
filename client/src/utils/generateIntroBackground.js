
function drawArrowhead(ctx, locx, locy, angle, sizex, sizey) {
    var hx = sizex / 2;
    var hy = sizey / 2;

    ctx.translate((locx ), (locy));
    ctx.rotate(angle);
    ctx.translate(-hx,-hy);

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,1*sizey);    
    ctx.lineTo(1*sizex,1*hy);
    ctx.closePath();
    ctx.fill();

    ctx.translate(hx,hy);
    ctx.rotate(-angle);
    ctx.translate(-locx,-locy);
}        

// returns radians
function findAngle(sx, sy, ex, ey) {
    // make sx and sy at the zero point
    return Math.atan2((ey - sy), (ex - sx));
}

const drawToolInto = (ctx) =>{
    ctx.textBaseline = 'top';
    ctx.font = "normal 16px 'Gloria Hallelujah', cursive";
    ctx.fillStyle = '#8e8e8e';
    ctx.strokeStyle = '#8e8e8e';
    const toolbarIntoText1 = 'Pick a Tool &';
    const toolbarIntoText2 = 'Start drawing!';
    ctx.fillText(toolbarIntoText1, 400, 100);
    ctx.fillText(toolbarIntoText2, 398, 125);

    ctx.beginPath();
    ctx.moveTo(520,115);
    ctx.quadraticCurveTo(600, 120, 600, 80);
    ctx.stroke();
    var ang = findAngle(520, 115, 530, 80);
    ctx.fillRect(600, 80, 2, 2);
    drawArrowhead(ctx, 600, 80, ang, 12, 12);
}

const drawShareInto = (ctx) => {
    ctx.textBaseline = 'top';
    ctx.font = "normal 16px 'Gloria Hallelujah', cursive";
    ctx.fillStyle = '#8e8e8e';
    ctx.strokeStyle = '#8e8e8e';
    const sessionText = 'Start a new Session';
    ctx.fillText(sessionText, 1280, 100);

    ctx.beginPath();
    ctx.moveTo(1440,107);
    ctx.quadraticCurveTo(1500, 100, 1500, 70);
    ctx.stroke();
    var ang = findAngle(1440, 107, 1450, 70);
    ctx.fillRect(1500, 70, 2, 2);
    drawArrowhead(ctx, 1500, 70, ang, 12, 12);
}


const generateIntroBackground = (roughCanvas, ctx) => {
    drawToolInto(ctx);
    drawShareInto(ctx);
}

export default generateIntroBackground;