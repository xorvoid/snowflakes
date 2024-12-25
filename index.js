var canvas_width = 700;
var canvas_height = 700;
var snowflake_start = canvas_height/2+10;
var snowflake_end = -canvas_height/2-10;
var snowflakes_per_second = 3.0;
var snowflakes = [];
var ctx = null;
const fps = 60;

function run() {
    ctx = document.getElementById('scene').getContext('2d');
    snowflakes = [];
    render_frame();
}

function render_frame() {
    window.setTimeout(render_frame, 1000 / fps);
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    update();
    draw_scene();
}

class Snowflake {
    constructor(sz, pos, vel) {
        this.sz = sz;
        this.pos = pos;
        this.vel = vel;
    }

    draw() {
        var loc = ctx.save();
        translate(this.pos[0], this.pos[1]);
        scale(this.sz, this.sz);
        draw_snowflake();
        ctx.restore(loc);
    }
}

function update() {
    var new_snowflakes = [];

    // update positions
    for (const snowflake of snowflakes) {
        snowflake.pos[0] += snowflake.vel[0]/fps;
        snowflake.pos[1] += snowflake.vel[1]/fps;
    }

    // retain snowflakes that are still visible (remove old snowflakes)
    for (const snowflake of snowflakes) {
        if (snowflake.pos[1] > snowflake_end) {
            new_snowflakes.push(snowflake);
        }
    }

    // create new snowflakes
    if (Math.random() <= snowflakes_per_second/fps) {
        var sz = random_range(0.05, 0.2);
        var x = random_range(-canvas_width/2, canvas_width/2);
        var vel_y = -random_range(20, 100);
        new_snowflakes.push(new Snowflake(
            sz, [x, snowflake_start], [0, vel_y]
        ));
    }
    
    
    snowflakes = new_snowflakes;
}

function rotate(deg) {
    var t = deg*Math.PI/180
    ctx.rotate(t)
}

function translate(x, y) {
    ctx.translate(x, y);
}

function scale(x, y) {
    ctx.scale(x, y)
}

function square(color) {
    ctx.fillStyle = color;
    ctx.fillRect(-0.5, -0.5, 1, 1);
}

function draw_axes() {
    var loc = ctx.save();
    scale(canvas_width, 1)
    square('red')
    ctx.restore(loc)

    var loc = ctx.save();
    rotate(90)
    scale(canvas_height, 1)
    square('green')
    ctx.restore(loc)
}

function random_range(a, b) {
    return Math.random() * (b-a) + a;
}

function draw_scene() {
    var loc_start = ctx.save();
    translate(canvas_width/2, canvas_height/2)
    scale(1, -1);
    //draw_axes();

    // var n = 40;
    // for(var i = 0; i < n; i++) {
    //     var x = random_range(-canvas_width/2, canvas_width/2);
    //     var y = random_range(-canvas_height/2, canvas_height/2);
    //     var sz = random_range(0.5, 3);

    //     // var loc = ctx.save();
    //     // translate(x, y);
    //     // scale(sz/10, sz/10);
    //     // draw_snowflake();
    //     // ctx.restore(loc);
    //     var snowflake = new Snowflake(sz/10, [x, y], [0, 0]);
    //     snowflake.draw();
    // }
    for (const snowflake of snowflakes) {
        snowflake.draw();
    }
    ctx.restore(loc_start);
}

function draw_snowflake() {
    var width = 12;
    function draw_leaf() {
        translate(5, 0);
        
        // Arm 
        var loc = ctx.save();
        translate(60, 0);
        scale(120, width);
        square('white');
        ctx.restore(loc);

        // First leaf
        var loc = ctx.save();
        translate(20, 0);
        rotate(40);
        translate(35, 0)
        scale(70, width-2);
        square('white');
        ctx.restore(loc);

        var loc = ctx.save();
        translate(20, 0);
        rotate(-40);
        translate(35, 0)
        scale(70, width-2);
        square('white');
        ctx.restore(loc);

        // Second leaf
        var loc = ctx.save();
        translate(65, 0);
        rotate(40);
        translate(20, 0);
        scale(40, width-2);
        square('white');
        ctx.restore(loc);
        var loc = ctx.save();
        translate(65, 0);
        rotate(-40);
        translate(20, 0);
        scale(40, width-2);
        square('white');
        ctx.restore(loc);

        // End
        var loc = ctx.save();
        translate(120, 0);
        rotate(45);
        scale(20, 20);
        square('white');
        ctx.restore(loc);
    }

    var loc = ctx.save();
    draw_leaf();
    ctx.restore(loc);

    var loc = ctx.save();
    rotate(90);
    draw_leaf();
    ctx.restore(loc);

    var loc = ctx.save();
    rotate(180);
    draw_leaf();
    ctx.restore(loc);

    var loc = ctx.save();
    rotate(270);
    draw_leaf();
    ctx.restore(loc);

    var loc = ctx.save();
    scale(28, 28);
    square('white');
    ctx.restore(loc);

    //ctx.restore(loc_top);
}
