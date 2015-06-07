var twoPI = 2 * Math.PI;
function agent(x, y, r, m, vx, vy, c)
{
    this.p = new Vector(x, y);
    this.r = r;
    this.m = m;
    this.v = new Vector(vx, vy);
    this.p0 = new Vector(0, 0);
    this.color = c;
}
agent.prototype = {
    reset: function ()
    {
        this.p = this.p0; 
    },
    move: function ()
    {
        this.p0 = this.p;
        this.p = this.p.add(this.v); 
    },
    draw: function(ctx)
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.p.x, this.p.y, this.r, 0, twoPI);
        ctx.closePath();
        ctx.fill();
    }
}

function pilot(x, y, r, m, vx, vy, c)
{
    agent.call(this, x, y, r, m, vx, vy, c);
    this.heading = 0.0;
}
pilot.prototype = new agent();
pilot.prototype.draw = function (ctx)
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

function wall(x1, y1, x2, y2)
{
    this.p1 = new Vector(x1, y1);
    this.p2 = new Vector(x2, y2);
    this.vector = this.p2.sub(this.p1);
    this.norm = this.vector.norm();
    this.length = this.vector.mag();
}
wall.prototype = {
    distance: function (p)
    {
        var d1 = this.p1.sub(p).mag();
        var d2 = this.p2.sub(p).mag();

        if (d1 < this.length && d2 < this.length)
        {
            // ball is within range, so check vertical distance
            var L1 = (d1 * d1 - d2 * d2 + this.length * this.length) / (2 * this.length);
            return Math.sqrt(d1 * d1 - L1 * L1);
        }
        else
        {
            // ball is outside bounds of line, so just take min of distances
            return Math.min(d1, d2);
        }

    },
    draw: function (ctx)
    {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.closePath();
        ctx.stroke();
    }
}
