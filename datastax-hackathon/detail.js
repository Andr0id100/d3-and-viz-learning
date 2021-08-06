var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var svg = d3.select(".board")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

let dataset
d3.json("sample-user-data.json").then(data => {
    dataset = data
    var partsOfSpeech = data.map(d => d.parts)
    partsOfSpeech = [].concat.apply([], partsOfSpeech)
    partsOfSpeech = new Set(partsOfSpeech)
    // partsOfSpeech = Array.from(new Set(partsOfSpeech))

    var sentenceScale = d3.scaleOrdinal()
        .domain(Array(data.length).fill().map((x, i) => i))
        .range(Array(data.length).fill().map((x, i) => 20 + i / (data.length - 1) * (height - margin.bottom - 10)))

    var sentences = svg.selectAll(".sentence")
        .data(data)
        .enter()
        .append("g")
        .classed("sentence", true)
        .attr("transform", (d, i) => `translate(100, ${sentenceScale(i)})`)

    var partPanel = svg.selectAll(".partOfSpeech")
        .data(partsOfSpeech)
        .enter()
        .append("g")
        .classed("partOfSpeech", true)
        .attr("transform", (d, i) => `translate(${width * 0.8}, ${height * 0.2 + height * 0.6 / partsOfSpeech.size * i})`)


    var boxes = sentences.selectAll(".sentence")
        .data(d => d.words.map((e, i) => {
            let datum = {}
            datum.word = d.words[i]
            datum.flag = d.flags[i]
            datum.part = d.parts[i]
            return datum
        }))
        .enter()
        .append("rect")
        .attr("x", (d, i) => 100 * i - 5)
        .attr("y", (d, i) => -20)
        // .attr("rx", "5")
        // .attr("ry", "5")
        .attr("width", 100)
        .attr("height", 30)
        .attr("fill", (d) => d.flag === 0 ? "#ff616d" : "#66de93")


    // var boxes = sentences.selectAll(".sentence")
    //     .data(d => d.words.map((e, i) => {
    //         let datum = {}
    //         datum.word = d.words[i]
    //         datum.flag = d.flags[i]
    //         datum.part = d.parts[i]
    //         return datum
    //     }))
    //     .enter()
    //     .append("rect")
    //     .attr("x", (d, i) => 100 * i - d.word.length)
    //     .attr("y", (d, i) => -15)
    //     .attr("rx", "5")
    //     .attr("ry", "5")
    //     .attr("width", d => d.word.length * 12 * 0.9)
    //     .attr("height", 19)
    //     .attr("fill", (d) => d.flag === 0 ? "#ff616d" : "#66de93")

    var words = sentences.selectAll(".sentence")
        .data(d => d.words.map((e, i) => {
            let datum = {}
            datum.word = d.words[i]
            datum.flag = d.flags[i]
            datum.part = d.parts[i]
            return datum
        }))
        .enter()
        .append("text")
        .classed("word", true)
        .attr("x", (d, i) => 100 * i)
        .attr("y", (d, i) => 0)
        .text(d => d.word)
        .style("font-weight", "bold")
        // .attr("fill", "#394250")


    var partBoxes = partPanel.selectAll(".partsOfSpeech")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("x", (d, i) => -2 + 100 * i)
        .attr("y", (d, i) => -18)
        .attr("rx", "5")
        .attr("ry", "5")
        .attr("width", d => d.length * 14 * 0.9)
        .attr("height", 25)
        .attr("fill", "#ffc074")
        .on("mouseover", hide)
        .on("mouseout", show)



    var parts = partPanel.selectAll(".partsOfSpeech")
        .data(d => [d])
        .enter()
        .append("text")
        .attr("x", (d, i) => 100 * i)
        .attr("y", (d, i) => 0)
        .text(d => d)
        // .attr("fill", "orange")
        .on("mouseover", hide)
        .on("mouseout", show)


})

function hide(event, d) {
    d3.selectAll("rect")
        .filter(e => (e.part !== d && e !== d))
        .style("opacity", 0.2)
}

function show(event, d) {
    d3.selectAll("rect")
        .style("opacity", 1)
}