function watermark (o) {
  var width = o.width || 500
  var height = o.height || 200

  function mark(s) {
    s.each(function (data) {
      s.append("line")
        .attr("x1",0).attr("x2",width)
        .attr("y1",height/2).attr("y2",height/2)
        .attr("stroke","#eee")
        .attr("stroke-width",60)
      s.append("text")
        .attr("x",width/2).attr("y",height/2).attr('dy','0.35em')
        .attr("text-anchor","middle")
        .attr("font-size",45)
        .attr("font-family","Verdana")
        .attr("fill", "#fff")
        .text(data)
    })
  }

  mark.width = function (v) { if (!arguments.length) return width; width = v; return mark }
  mark.height = function (v) { if (!arguments.length) return height; height = v; return mark }

  return mark 
}