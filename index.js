var z_camera = -10;
var anim_idx = 0;
var anim_n = 6;
var ctx = null;

function run() {
    ctx = document.getElementById('scene').getContext('2d');
    render_frame();
}

function render_frame() {
    // 24 fps
    window.setTimeout(render_frame, 1000 / 24);
    ctx.clearRect(0, 0, 500, 500);

    draw_spiral(0, anim_idx, "#ff0000");
    draw_spiral(Math.PI, anim_idx, "#00ffcc");

    anim_idx += 1;
    if (anim_idx >= anim_n) anim_idx = 0;
}

function draw_spiral(theta_offset, anim_idx, color) {
    var r_rate = 0.06
    var y_rate = 1/(2*Math.PI);
    var theta_step = 0.05;
    var theta_anim = theta_step * anim_idx / anim_n;
    for (var t = 0; t < 3*6.28; t += theta_step) {
        var start = compute_point(t-theta_anim, theta_offset, r_rate, y_rate); 
        var end = compute_point(t-theta_anim+theta_step/2, theta_offset, r_rate, y_rate);
        var line = {
            start: start,
            end: end,
            color: color,
        };

        draw_line(line);
    }
}

function compute_point(theta, theta_offset, r_rate, y_rate) {
    var radius = r_rate * theta
    var x = radius * Math.cos(theta+theta_offset);
    var z = -radius * Math.sin(theta+theta_offset);
    var y = y_rate * theta

    var alpha_min = 0.25;
    var alpha_max = 1.0;
    var brightness = (Math.cos(theta+theta_offset - Math.PI/2) + 1)/2;
    var alpha = brightness * (alpha_max - alpha_min) + alpha_min;
    
    // project into 2d
    var x_2d = x / (z - z_camera);
    var y_2d = y / (z - z_camera);
    // HACKS: FIGURE OUT CAMERA MATH...
    return {
        x: 200 + 800*x_2d,
        y: 200 + 800*y_2d,
        alpha: alpha,
    }
}

function draw_line(line) {
    ctx.strokeStyle = line.color;
    ctx.globalAlpha = line.start.alpha;
    ctx.beginPath();
    ctx.moveTo(line.start.x, line.start.y);
    ctx.lineTo(line.end.x, line.end.y);
    ctx.closePath();
    ctx.stroke();
}
