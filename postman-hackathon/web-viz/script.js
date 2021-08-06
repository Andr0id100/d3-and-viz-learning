var margin = { top: 40, right: 10, bottom: 10, left: 40 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var svg = d3.select(".board")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform",
        `translate(${margin.left}, ${margin.top})`)

RADIUS = 40

let xScale = d3.scaleLinear()
    .domain([0, 10])
    .range([width / 2, width / 2 + RADIUS])

let yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([height / 2, height / 2 - 10])

function appendCircles() {
    svg.selectAll("circle")
        .data(_.range(RADIUS, RADIUS * 10, RADIUS))
        .enter()
        .append("circle")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", d => d)

}

function appendSeason(showAverage, season, seasonData) {
    svg.append("path")
        .datum(seasonData)
        .attr("fill", "green")
        .attr("stroke", "none")
        .attr("d", d3.area()
            .curve(d3.curveStep)
            .x((d, i) => (season) * RADIUS + xScale(i))
            .y0(yScale(0))
            .y1(d => {
                if (d.imdbRating > showAverage) {
                    return yScale(d.imdbRating)
                }
                else {
                    return yScale(0)
                }
            })
        )


    svg.append("path")
        .datum(seasonData)
        .attr("fill", "red")
        .attr("stroke", "none")
        .attr("d", d3.area()
            .curve(d3.curveStep)
            .x((d, i) => (season) * RADIUS + xScale(i))
            .y0(yScale(0))
            .y1(d => {
                if (d.imdbRating < showAverage) {
                    return yScale(d.imdbRating)
                }
                else {
                    return yScale(0)
                }
            })
        )

    svg.append("path")
        .datum(seasonData)
        .attr("fill", "black")
        .attr("stroke", "none")
        .attr("d", d3.area()
            .curve(d3.curveStep)
            .x((d, i) => (season) * RADIUS + xScale(i))
            .y0(yScale(0))
            .y1(d => {
                if (d.imdbRating == 0) {
                    return yScale(10)
                }
                else {
                    return yScale(0)
                }
            })
        )
}

function appendSeason(showAverage, season, seasonData) {
    svg.selectAll(".episode")
        .data(seasonData)
        .enter()
        .append("circle")
        .attr("fill", d => {
            if (d.imdbRating == 0) {
                return "black"
            }

            if (d.imdbRating < showAverage) {
                return "red"
            }
            else {
                return "green"
            }
        })
        .attr("cx", (d, i) => (season) * RADIUS + xScale(i))
        .attr("cy", yScale(0))
        .attr("r", 2)


}

function appendSeason(showAverage, season, seasonData) {
    svg.selectAll(".episode")
        .data(seasonData)
        .enter()
        .append("path")
        .attr("fill", d => {
            // return "orange"
            if (d.imdbRating == 0) {
                return "black"
            }

            if (d.imdbRating < showAverage) {
                return "red"
            }
            else {
                return "green"
            }
        })
        .attr("d", d3.arc()
            .innerRadius((d, i) => {
                // console.log()
                return (season) * RADIUS + xScale(i) - width / 2
            })
            .outerRadius((d, i) => {
                // console.log(d)
                return (season) * RADIUS + xScale(i) - width / 2 + 4
            })
            .startAngle(Math.PI * (45 + (90 - 45) / 2) / 180)
            .endAngle(Math.PI * (90 + (90 - 45) / 2) / 180)
        )
        .attr("transform", (d, i) => `translate(${width / 2}, ${height / 2})`)



}


let dataset
d3.json("got.json").then(data => {
    dataset = data
    console.log(data)

    let totalRating = 0
    let ratingCount = 0
    data.forEach(season => {
        season["Episodes"].forEach(episode => {
            if (episode.imdbRating == "N/A") {
                episode.imdbRating = 0
            }
            else {
                totalRating += eval(episode.imdbRating)
                ratingCount += 1
            }
        })
    })

    data.forEach(d => appendSeason(totalRating / ratingCount, eval(d.Season), d["Episodes"]))
}).then(appendCircles)

