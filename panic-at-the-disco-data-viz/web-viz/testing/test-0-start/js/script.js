let data = []

for (i = 0; i < 230; i++) {
    data.push([Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)])
}

var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#barcodes")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

svg.selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d, i) { return 3 * i; })
    .attr("y", 0)
    .attr("width", 3)
    .attr("height", 100)
    .attr("fill", function (d) { return `rgb(${d[0]}, ${d[1]}, ${d[2]})` })
