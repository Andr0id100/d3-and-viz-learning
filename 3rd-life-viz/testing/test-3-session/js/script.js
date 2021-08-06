var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

let barWidth = 2
let barHeight = 50

let LATEST_SESSION = 6
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
        if (d["death-1"] === "-1") {
            d.deathPosition1 = LATEST_SESSION
            d.deathPosition2 = LATEST_SESSION
            d.deathPosition3 = LATEST_SESSION
        }
        else {
            if (d["death-2"] === "-1") {
                d.deathPosition1 = eval(d["death-1"]) + 0.5
                d.deathPosition2 = LATEST_SESSION
                d.deathPosition3 = LATEST_SESSION
            }
            else {
                if (d["death-1"] === d["death-2"]) {
                    if (d["death-3"] === "-1") {
                        d.deathPosition1 = eval(d["death-1"]) + 0.25
                        d.deathPosition2 = eval(d["death-2"]) + 0.75
                        d.deathPosition3 = LATEST_SESSION
                    }
                    else {
                        if (d["death-3"] === "-1") {
                            d.deathPosition1 = eval(d["death-1"]) + 0.5
                            d.deathPosition2 = eval(d["death-2"]) + 0.5
                            d.deathPosition3 = LATEST_SESSION
                        }
                        else {
                            if (d["death-2"] === d["death-3"]) {
                                d.deathPosition1 = eval(d["death-1"]) + 0.5
                                d.deathPosition2 = eval(d["death-2"]) + 0.25
                                d.deathPosition3 = eval(d["death-3"]) + 0.75
                            }
                            else {
                                d.deathPosition1 = eval(d["death-1"]) + 0.5
                                d.deathPosition2 = eval(d["death-2"]) + 0.5
                                d.deathPosition3 = eval(d["death-3"]) + 0.5
                            }
                        }
                    }
                }
                else {
                    if (d["death-3"] === "-1") {
                        d.deathPosition1 = eval(d["death-1"]) + 0.5
                        d.deathPosition2 = eval(d["death-2"]) + 0.5
                        d.deathPosition3 = LATEST_SESSION
                    }
                    else {
                        if (d["death-2"] === d["death-3"]) {
                            d.deathPosition1 = eval(d["death-1"]) + 0.5
                            d.deathPosition2 = eval(d["death-2"]) + 0.25
                            d.deathPosition3 = eval(d["death-3"]) + 0.75
                        }
                        else {
                            d.deathPosition1 = eval(d["death-1"]) + 0.5
                            d.deathPosition2 = eval(d["death-2"]) + 0.5
                            d.deathPosition3 = eval(d["death-3"]) + 0.5
                        }
                    }
                }
            }
        }
        return d
    })

    let playerScale = d3.scalePoint()
        .domain(data.map((d) => d.name))
        .range([3 * margin.top, height - 3 * margin.top])

    let sessionScale = d3.scaleLinear()
        .domain([1, LATEST_SESSION])
        .range([2 * SESSION_LENGTH, width - 2 * SESSION_LENGTH])

    svg.selectAll("boundary")
        .data(Array.from({ length: LATEST_SESSION }, (_, i) => i + 1))
        .enter()
        .append("line")
        .attr("x1", d => sessionScale(d))
        .attr("y1", 0)
        .attr("x2", d => sessionScale(d))
        .attr("y2", height)
        .attr("stroke", "black")

    svg.selectAll("names")
        .data(data)
        .enter()
        .append("text")
        .attr("x", 0)
        .attr("y", d => playerScale(d.name))
        .attr("font-weight", "bold")
        .text(d => d.name)

    let greenBars = svg.selectAll("bar")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", d => sessionScale(1))
        .attr("y1", d => playerScale(d.name))
        .attr("x2", d => sessionScale(1))
        .attr("y2", d => playerScale(d.name))
        .attr("stroke", "green")

    let yellowBars = svg.selectAll("bar")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", d => sessionScale(d.deathPosition1))
        .attr("y1", d => playerScale(d.name))
        .attr("x2", d => sessionScale(d.deathPosition1))
        .attr("y2", d => playerScale(d.name))
        .attr("stroke", "yellow")

    let redBars = svg.selectAll("bar")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", d => sessionScale(d.deathPosition2))
        .attr("y1", d => playerScale(d.name))
        .attr("x2", d => sessionScale(d.deathPosition2))
        .attr("y2", d => playerScale(d.name))
        .attr("stroke", "red")

    greenBars
        .transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attr("x2", d => sessionScale(d.deathPosition1))
        .on("end", () => {
            yellowBars
                .transition()
                .ease(d3.easeLinear)
                .duration(2000)
                .attr("x2", d => sessionScale(d.deathPosition2))
                .on("end", () => {
                    redBars
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(2000)
                        .attr("x2", d => sessionScale(d.deathPosition3))
                })
        })

})
