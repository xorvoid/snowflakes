var canvas_width = 700;
var canvas_height = 700;
var snowflake_start = canvas_height/2+10;
var snowflake_end = -canvas_height/2-10;
var background_color = '#06224a';
var snowflake_color = ' #d9e5f5 ';
var snowflakes_per_second = 3.0;
var snowflakes = [];
var snow_level = 10;
var snow_level_inc = 2.5;
var snow_level_limit = 150;
var ctx = null;
const fps = 60;

const DEBUG = 0;
var DEBUG_COLORS = ['green', 'red', 'orange', 'cyan', 'yellow', 'blue'];

function run() {
    ctx = document.getElementById('scene').getContext('2d');
    snowflakes = [];
    render_frame();
}

function render_frame() {
    window.setTimeout(render_frame, 1000 / fps);
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    ctx.fillStyle = background_color;
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    update();
    draw_scene();
}

class Snowflake {
    constructor(sz, pos, vel, ang, ang_vel) {
        this.sz = sz;
        this.pos = pos;
        this.ang = ang;  // degrees
        this.vel = vel;
        this.ang_vel = ang_vel; // degress/sec
    }

    draw() {
        var loc = ctx.save();
        translate(this.pos[0], this.pos[1]);
        rotate(this.ang);
        scale(this.sz, this.sz);
        draw_snowflake();
        ctx.restore(loc);
    }
}

function update() {
    var new_snowflakes = [];

    console.log(snowflakes.length);
    
    // update speeds
    for (const snowflake of snowflakes) {
        const x_accel = random_range(-50, 50) / fps;
        //const x_accel = random_range(-200, 200) / fps;
        snowflake.vel[0] += x_accel;
    }
    
    // update positions and angles
    for (const snowflake of snowflakes) {
        snowflake.pos[0] += snowflake.vel[0]/fps;
        snowflake.pos[1] += snowflake.vel[1]/fps;
        snowflake.ang += snowflake.ang_vel/fps;
    }

    // retain snowflakes that are still visible (remove old snowflakes)
    for (const snowflake of snowflakes) {
        if (snowflake.pos[1] > snowflake_end) {
            new_snowflakes.push(snowflake);
        } else {
            snow_level += snow_level_inc;
            if (snow_level > snow_level_limit) {
                snow_level = snow_level_limit;
            }
        }
    }

    // create new snowflakes
    if (Math.random() <= snowflakes_per_second/fps) {
        var sz = random_range(0.07, 0.15);
        var x = random_range(-canvas_width/2, canvas_width/2);
        var vel_y = -random_range(20, 100);
        var ang = random_range(0, 90);
        var ang_vel = random_range(8, 24);
        new_snowflakes.push(new Snowflake(
            sz, [x, snowflake_start], [0, vel_y], ang, ang_vel,
        ));
    }
    
    
    snowflakes = new_snowflakes;
}

function draw_context(func) {
    let loc = ctx.save();
    func();
    ctx.restore(loc);
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

function circle(color, radius=1.0) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.arc(0, 0, radius, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.stroke();
}

function triangle(color, scale) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.moveTo(-0.5*scale, 0.0);
    ctx.lineTo(0.5*scale, 0.0);
    ctx.lineTo(0.0, Math.sqrt(3)/2*scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();    
}

function star(color, scale) {
    function triangle_point() {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.moveTo(-1.0*scale, 0.0);
        ctx.lineTo(1.0*scale, 0.0);
        ctx.lineTo(0.0, scale*3.0776835371752536);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    rotate(72);
    triangle_point();
    rotate(72);
    triangle_point();
    rotate(72);
    triangle_point();
    rotate(72);
    triangle_point();
    rotate(72);
    triangle_point();
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

function deg_to_rad(deg) {
    return deg / 180.0 * Math.PI;
}

function random_range(a, b) {
    return Math.random() * (b-a) + a;
}

function draw_scene() {
    var loc_start = ctx.save();
    translate(canvas_width/2, canvas_height/2)
    scale(1, -1);

    if (DEBUG) {
        draw_axes();
    }

    draw_ground();

    draw_context(() => {
        translate(-canvas_width/4, -canvas_height/2);
        draw_snowman();
    });
    draw_context(() => {
        translate(canvas_width*0.35, -canvas_height/2);
        draw_tree();
    });
    
    for (const snowflake of snowflakes) {
        snowflake.draw();
    }
    
    ctx.restore(loc_start);

    ctx.font = "78px Snell Roundhand";
    ctx.strokeStyle = '#baedf8';
    ctx.strokeText("Happy Holidays!", 100, 130);
}

function draw_ground() {
    var loc = ctx.save();
    translate(0, snow_level/2 - canvas_height/2);
    scale(canvas_width, snow_level);
    square(snowflake_color);
    ctx.restore();
}

function draw_snowman() {

    var size = 50;
    var radius_top = 0.45*size;
    var radius_mid = 0.65*size;
    var radius_bottom = 1.0*size;
    
    draw_context(() => {
        translate(0, radius_bottom);
        circle('white', radius_bottom);
        translate(0, radius_mid+radius_bottom-12);
        circle('white', radius_mid);
        translate(0, radius_top+radius_mid-4);
        circle('white', radius_top);
    });

    draw_context(() => {
        translate(0, 2.4*size);
        circle('black', 4.0);
    });

    draw_context(() => {
        translate(0, 1.9*size);
        circle('black', 4.0);
    });

    draw_context(() => {
        translate(0, 1.4*size);
        circle('black', 4.0);
    });

    var arm_angle = 35;
    function draw_arm() {
        draw_context(() => {
            translate(50, 0);
            rotate(45);
            translate(7.5, 0);
            scale(15, 5);
            square('#6E260E');
        });
        draw_context(() => {
            translate(50, 0);
            rotate(-45);
            translate(7.5, 0);
            scale(15, 5);
            square('#6E260E');
        });
        draw_context(() => {
            translate(35, 0);
            scale(70, 5);
            square('#6E260E');
        });
    }

    // left arm
    draw_context(() => {
        translate(-0.6*size, 2.4*size);
        rotate(180-arm_angle);
        draw_arm();
    });

    // right arm
    draw_context(() => {
        translate(0.6*size, 2.4*size);
        rotate(arm_angle);
        draw_arm();
    });

    function draw_face() {
        // Smile
        draw_context(() => {
            translate(0, 3.45*size);
            scale(1.0, 1);
            var a = 45;
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1.8;
            ctx.arc(0, 0, 15.0, deg_to_rad(180 + a), deg_to_rad(360 - a), false);
            //ctx.arc(0, 0, 10.0, 0, 2*Math.PI, false);
            ctx.stroke();
        });

        // Eyes
        draw_context(() => {
            translate(-0.15*size, 3.55*size);
            circle('black', 2.0);
        });
        draw_context(() => {
            translate(0.15*size, 3.55*size);
            circle('black', 2.0);
        });

        // Nose
        draw_context(() => {
            var color = 'orange';
            var scale = 7;
            translate(0.0, 3.30*size);
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.moveTo(0.0, 0.0);
            ctx.lineTo(0.0, 1.0*scale);
            ctx.lineTo(2.0*scale, 0.25*scale);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();    
        });
    }
    draw_face();

    // hat
    draw_context(() => {
        translate(0, 3.78*size);
        draw_context(() => {
            scale(30, 32);
            translate(0, 0.5);
            square('black');
        });
        draw_context(() => {
            scale(50, 10);
            translate(0, 0.5);
            square('black');
        });
    });

    // scarf
    draw_context(() => {
        // scale(5, 5);
        translate(0, 2.75*size);
        rotate(-33);
        scale(0.9, 0.9);
        // short part
        draw_context(() => {
            rotate(69);
            translate(11, 0);
            scale(26, 10);
            square('red');            
        });
        draw_context(() => {
            rotate(-4);
            // long part
            draw_context(() => {
                scale(50, 10);
                square('red');
            });
            // tassel 1
            draw_context(() => {
                translate(25+5, 0);
                scale(10, 2);
                square('red');
            });
            // tassel 2
            draw_context(() => {
                translate(25+5, 4);
                scale(10, 2);
                square('red');
            });
            // tassel 3
            draw_context(() => {
                translate(25+5, -4);
                scale(10, 2);
                square('red');
            });
        });
    });
}

function draw_tree() {
    draw_context(() => {
        scale(1.2,1.2);
        scale(0.8,1.2);
        for (var i = 0; i < 8; i++) {
            var color = 'green';
            draw_context(() => {
                translate(0.0, i*0.2*150);
                scale(1.5, 1.0);
                triangle(color, 150*(1-0.1*i));
            });
        }
    });

    draw_context(() => {
        translate(0, 365);
        star('orange', 10);
    });

}

function draw_snowflake() {
    var width = 12;
    var color = snowflake_color;
    function draw_leaf() {
        translate(5, 0);
        
        // Arm 
        var loc = ctx.save();
        translate(60, 0);
        scale(120, width-6);
        square(color);
        ctx.restore(loc);

        // First leaf
        var loc = ctx.save();
        translate(20, 0);
        rotate(40);
        translate(35, 0)
        scale(70, width-2);
        square(color);
        ctx.restore(loc);

        var loc = ctx.save();
        translate(20, 0);
        rotate(-40);
        translate(35, 0)
        scale(70, width-2);
        square(color);
        ctx.restore(loc);

        // Second leaf
        var loc = ctx.save();
        translate(65, 0);
         rotate(40);
        translate(20, 0);
        scale(40, width-2);
        square(color);
        ctx.restore(loc);
        var loc = ctx.save();
        translate(65, 0);
        rotate(-40);
        translate(20, 0);
        scale(40, width-2);
        square(color);
        ctx.restore(loc);

        // End
        var loc = ctx.save();
        translate(120, 0);
        rotate(45);
        scale(20, 20);
        square(color);
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
    square(color);
    ctx.restore(loc);
}
