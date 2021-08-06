var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

// var svg = d3.select("#visual")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");

let barWidth = 2
let barHeight = 50

// function createBarCode(data, number) {
//     svg.selectAll("bar")
//         .data(data['colors'])
//         .enter()
//         .append("rect")
//         .attr("x", function (d, i) { return barWidth * i; })
//         .attr("y", (barHeight + 10) * (number))
//         .attr("width", barWidth)
//         .attr("height", barHeight)
//         .attr("fill", function (d) { return `rgb(${d[0]}, ${d[1]}, ${d[2]})` })
// }
// d3.json("processed-data.json").then(function (data) {
//     data.forEach((songData, number) => {
//         createBarCode(songData, number)
//         // d3.select("#barcodes")
//         // .append("p")
//         // .text(songData['name'])
//     });
// })

let LATEST_SESSION = 7
let SESSION_LENGTH = 100

var svg = d3.select("#visual")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data.csv").then((unprocessedData) => {

    let data = unprocessedData.map(d => {
        if (d["death-1"] !== "-1") {
            if (d["death-2"] !== "-1") {
                if (d["death-3"] !== "-1") {
                    d.deathPosition1 = eval(d["death-1"]) + 0.25
                    d.deathPosition2 = eval(d["death-2"]) + 0.50
                    d.deathPosition3 = eval(d["death-2"]) + 0.75
                }
                d.deathPosition1 = eval(d["death-1"]) + 0.25
                d.deathPosition2 = eval(d["death-2"]) + 0.75
                d.deathPosition3 = LATEST_SESSION

            }
            else {
                d.deathPosition1 = eval(d["death-1"]) + 0.5
                d.deathPosition2 = LATEST_SESSION
                d.deathPosition3 = LATEST_SESSION

            }
        }
        else {
            d.deathPosition1 = LATEST_SESSION
            d.deathPosition2 = LATEST_SESSION
            d.deathPosition3 = LATEST_SESSION
        }
        return d
    })

    let playerScale = d3.scalePoint()
        .domain(data.map((d) => d.name))
        .range([3 * margin.top, height])

    svg.selectAll("bar")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", 10)
        .attr("y1", d => playerScale(d.name))
        .attr("x2", d => d.deathPosition1 * SESSION_LENGTH)
        .attr("y2", d => playerScale(d.name))
        .attr("stroke", "green")

    svg.selectAll("bar")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", d => d.deathPosition1 * SESSION_LENGTH)
        .attr("y1", d => playerScale(d.name))
        .attr("x2", d => d.deathPosition2 * SESSION_LENGTH)
        .attr("y2", d => playerScale(d.name))
        .attr("stroke", "yellow")

    svg.selectAll("bar")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", d => d.deathPosition2 * SESSION_LENGTH)
        .attr("y1", d => playerScale(d.name))
        .attr("x2", d => d.deathPosition3 * SESSION_LENGTH)
        .attr("y2", d => playerScale(d.name))
        .attr("stroke", "red")
})
