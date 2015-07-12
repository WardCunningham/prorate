function retrobars () {

  var w = 15
  var h = 150

  var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, w])

  var y = d3.scale.linear()
    .domain([0, 100000])
    .rangeRound([0, h])

  var mark = watermark({height:h})

  function my (selection) {
    selection.each(function (data) {

      mark.width(w*data.length)

      var svg = d3.select(this).selectAll('svg')
        .data([data])

      var skeleton = svg.enter()
        .append("svg:svg")
          .attr("class", "chart")
          .attr("width", w * data.length - 1)
          .attr("height", h);

      skeleton
          .datum("instrumentation")
          .call(mark)

      skeleton
        .append("g")
        .attr("class","bars")
        .data([data])

      skeleton.append("svg:line")
          .attr("x1", 0)
          .attr("x2", w * data.length)
          .attr("y1", h - .5)
          .attr("y2", h - .5)
          .attr("stroke", "#000");

      var rect = svg.select("g.bars").selectAll("rect")
        .data(function(d) {return d}, function(d) { return d.time; });

      rect.enter().insert("svg:rect", "line")
          .attr("x", function(d, i) { return x(i + 1) - .5; })
          .attr("y", function(d) { return h - y(d.value) - .5; })
          .attr("width", w)
          .attr("height", function(d) { return y(d.value); })
        .transition()
          .duration(rep.bin/2)
          .attr("x", function(d, i) { return x(i) - .5; });

      rect.transition()
          .duration(rep.bin/2)
          .attr("x", function(d, i) { return x(i) - .5; })
          .attr("y", function(d) { return h - y(d.value) - .5; })
          .attr("height", function(d) { return y(d.value); })

      rect.exit().transition()
          .duration(rep.bin/2)
          .attr("x", function(d, i) { return x(i - 1) - .5; })
          .remove();
    })
  }

  return my

}