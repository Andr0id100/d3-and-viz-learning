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

let barWidth = 3
let barHeight = 50

let barsInRow = Math.floor(width / barWidth)
// let barsInRow = 100

function createBarCode(data) {
    svg.selectAll("bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d, i) { return barWidth * (i % barsInRow); })
        .attr("y", function (d, i) { return (barHeight + 5) * Math.floor(i / barsInRow) })
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("fill", function (d) { return `rgb(${d[0]}, ${d[1]}, ${d[2]})` })
}
d3.json("processed-data.json").then(function (data) {
    let barData = []
    data.forEach((songData) => {
        barData.push(...songData.colors)
    });
    // shuffleArray(barData)
    createBarCode(barData)
})

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}