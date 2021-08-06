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

var title = svg.append("text")
    .attr("x", 0)
    .attr("y", height / 10)
    .attr("font-weight", "bold")

let barWidth = 2
let barHeight = 50

let circleRadius = width > height ? width / 6 : height / 4

let currentIndex = 0
let songNames = []

function createBarCodeCircle(data) {
    svg.selectAll("bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d, i) { return width / 2 + circleRadius * Math.cos(i / data.length * 2 * Math.PI) })
        .attr("y", function (d, i) { return height / 2 + circleRadius * Math.sin(i / data.length * 2 * Math.PI) })
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("transform", function (d, i) {
            let angle = i / data.length * 2 * Math.PI
            return `rotate(
                ${90 + angle / (2 * Math.PI) * 360},
                ${width / 2 + (circleRadius) * Math.cos(angle)},
                ${height / 2 + (circleRadius) * Math.sin(angle)})`
        })
        .attr("fill", function (d) { return `rgb(${d.color[0]}, ${d.color[1]}, ${d.color[2]})` })
        .attr("name", function (d) { return d.name })
}
d3.json("processed-data.json").then(function (data) {
    let barData = []
    data.forEach((songData) => {
        songNames.push(songData.name)
        songData.colors.forEach((color) => {
            let bar = {}
            bar.color = color
            bar.name = songData.name
            barData.push(bar)
        })
    });
    barData.forEach((bar, index) => {
        bar.index = index
        bar.total = barData.length
    })
    // shuffleArray(barData)
    createBarCodeCircle(barData)
    highlightFocus()
    // createBarCode(barData.splice(0, 100))
})

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function highlightFocus() {
    d3.selectAll("rect")
        .attr("x", function (d) { return width / 2 + circleRadius * Math.cos(d.index / d.total * 2 * Math.PI) })
        .attr("y", function (d) { return height / 2 + circleRadius * Math.sin(d.index / d.total * 2 * Math.PI) })
        .attr("transform", function (d) {
            let angle = d.index / d.total * 2 * Math.PI
            return `rotate(
                ${90 + angle / (2 * Math.PI) * 360},
                ${width / 2 + (circleRadius) * Math.cos(angle)},
                ${height / 2 + (circleRadius) * Math.sin(angle)})`
        })


    title.text(songNames[currentIndex])

    d3.selectAll("rect")
        .filter(dat => dat.name === songNames[currentIndex])
        .attr("x", function (d, i) { return i * barWidth })
        .attr("y", function (d) { return height / 2 + 1.3 * circleRadius })
        .attr("transform", function (d) {
            return `rotate(
                ${0},
                ${width / 2},
                ${height / 2})`
        })
}

function nextSong() {
    currentIndex++
    currentIndex %= songNames.length
    // console.log(songNames[currentIndex])
    highlightFocus()
}


document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;
    // Alert the key name and key code on keydown
    if (name == " ") {
        nextSong()
        highlightFocus()
    }
}, false);

setInterval(nextSong, 1000)
