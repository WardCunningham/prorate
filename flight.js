function flight () {

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 960 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  var padding = 6,
      radius = d3.scale.sqrt().domain([0,5000]).range([5, 15]),
      color = d3.scale.category10();

  var play = function (arrival) {}

  function my(selection) {

    function readout(text) {
      d3.select("#readout").text(text);
    }

    var nodes = [];
    var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(0)
        .friction(.6)
        .charge(0)
        .on("tick", tick)
        .start();

    var svg = selection.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var circle = svg.selectAll("circle")
        .data(nodes, function(d) { return d.id;})
      .enter().append("circle")
        .attr("r", function(d) { return d.radius; })
        .style("fill", function(d) { return d.color; })
        .call(force.drag);

    // Update dom as transactions come and go

    function finished (transaction, now) {
      return transaction.start + (transaction.client||3000) < now
    }
   
    var id = 0;
    function tick(e) {
      var now = new Date().getTime();
      for (var i = nodes.length - 1; i >= 0; i--) {
        if (finished(nodes[i],now)) {
          nodes.splice(i,1)
        }
      };
      play(function(arrival){
        readout(new Date(arrival.time).toTimeString().split(" ")[0]+" "+arrival.request);
        arrival.id = id++;
        arrival.radius = radius(arrival.server);
        arrival.color = color(arrival.request);
        arrival.cx = arrival.x = 10;
        arrival.cy = arrival.y = height / 2 + Math.random()*30;
        arrival.start = now;
        nodes.push(arrival);
      });

      var circle = svg.selectAll("circle")
        .data(nodes, function(d) { return d.id;});

      circle
        .enter().append("circle")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) { return d.radius; })
          .style("fill", function(d) { return d.color; });

      circle
        .exit().remove();

      circle
          .each(gravity(.2 * e.alpha))
          .each(collide(.5))
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      force.start();
    }

    // Move nodes toward cluster focus.
    function gravity(alpha) {
      return function(d) {
        d.y += (d.cy - d.y) * alpha;
        var now = new Date().getTime();
        var pos = width * (now - d.start)/d.client;
        d.x += (pos - d.x) * alpha;
      };
    }

    // Resolve collisions between nodes.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + radius.domain()[1] + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2
              || x2 < nx1
              || y1 > ny2
              || y2 < ny1;
        });
      };
    }
  }

  my.play = function(value) {
    if (!arguments.length) return play
    play = value
    return my
  }

  return my
}
