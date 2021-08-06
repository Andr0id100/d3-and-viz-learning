var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var svg = d3.select("#barcodes")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

let barWidth = 2
let barHeight = 50

function createBarCode(data, number) {
    svg.selectAll("bar")
        .data(data['colors'])
        .enter()
        .append("rect")
        .attr("x", function (d, i) { return barWidth * i; })
        .attr("y", (barHeight + 10) * (number))
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("fill", function (d) { return `rgb(${d[0]}, ${d[1]}, ${d[2]})` })
}
d3.json("processed-data.json").then(function (data) {
    data.forEach((songData, number) => {
        createBarCode(songData, number)
        // d3.select("#barcodes")
        // .append("p")
        // .text(songData['name'])
    });
})
