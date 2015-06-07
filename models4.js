var twoPI = 2 * Math.PI;

function Agent(p, r, m, v, c)
{
    this.p = p;
    this.r = r;
    this.m = m;
    this.v = v;
    this.p0 = new Point(0, 0);
    this.color = c;
}
Agent.prototype.reset = function ()
{
    this.p = this.p0;
}
Agent.prototype.move = function (friction)
{
    // calculate direction of friction
    var frictionVector = new Vector(0, 0);
    if (this.v.mag() > 0)
    {
        frictionVector = this.v.unit().scale(-1.0 * friction * this.r / this.m);
    }

    // augment velocity based on friction constant and radio of objects radius/mass (the idea being radius corresponds to wind resistance, and mass corresponds to inertia)
    if (frictionVector.mag() > this.v.mag())
    {
        this.v.x = 0;
        this.v.y = 0;
    }
    else
    {
        this.v = this.v.add(frictionVector);
    }

    // update position
    this.p0 = this.p;
    this.p = this.p.add(this.v); 
}
Agent.prototype.draw = function(ctx)
{
    ctx.beginPath();
    var grd = ctx.createRadialGradient(this.p.x, this.p.y, 0, this.p.x, this.p.y, this.r);
    grd.addColorStop(1, "black");
    grd.addColorStop(.5, this.color);
    ctx.fillStyle = grd;
    ctx.arc(this.p.x, this.p.y, this.r, 0, twoPI);
    ctx.closePath();
    ctx.fill();
}

function Pilot(p, r, m, v, c)
{
    Agent.call(this, p, r, m, v, c);
    this.heading = 0.0;
}
Pilot.prototype = new Agent();
Pilot.prototype.draw = function (ctx)
{
    ctx.save();
    {
        // transform base matrix
        ctx.translate(this.p.x, this.p.y);
        ctx.rotate(this.heading);

        ctx.beginPath();
        {
            var grd = ctx.createLinearGradient(-this.r, 0, this.r, 0);
            grd.addColorStop(0, "black");
            grd.addColorStop(0.3, this.color);
            ctx.fillStyle = grd;
            ctx.moveTo(-this.r, -this.r);
            ctx.lineTo(-this.r, this.r);
            ctx.lineTo(this.r, 0);
        }
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();
}

function Structure(points)
{
    this.walls = [];
    this.points = points;

    walls[0] = new Wall(points[points.length-1], points[0]);
    wallCount = 1;
    while (wallCount < points.length - 1)
    {
        this.walls[wallCount] = new Wall(points[wallCount], points[wallCount-1]);
    }
}

function Collision(obj, dist)
{  
    this.obj = obj;
    this.dist = dist;
}

function Wall(p1, p2)
{
    this.p1 = p1;
    this.p2 = p2;
    this.vector = this.p2.sub(this.p1);
    this.norm = this.vector.norm();
    this.length = this.vector.mag();
}
Wall.prototype.draw = function (ctx)
{
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.closePath();
    ctx.stroke();
}
Wall.prototype.checkCollision = function(agent)
{
    var d1 = this.p1.sub(p).mag();
    var d2 = this.p2.sub(p).mag();

    if (d1 < this.length && d2 < this.length)
    {
        // ball is within range, so check vertical distance
        var L1 = (d1 * d1 - d2 * d2 + this.length * this.length) / (2 * this.length);
        var dist = Math.sqrt(d1 * d1 - L1 * L1);
        if (dist < agent.r)
        {
            return new Collision(this, dist);
        }
    }
    else
    {
        // ball is outside bounds of line, so check for apex collision
        if (d1 < agent.r && d1 < d2)
        {
            return new Collision(this.p1, d1);
        }
        else if (d2 < agent.r)
        {
            return new Collision(this.p2, d2);
        }
    }
    
    return null;
}
