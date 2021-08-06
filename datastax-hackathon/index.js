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
d3.json("sample-user-data.json").then(drawData)

function drawData(data) {
    dataset = data

    let sessionDays = new Set(data.map(d => d.day))
    var sessionScale = d3.scaleOrdinal()
        .domain(sessionDays)
        .range(Array(sessionDays.size).fill().map((x, i) => i / (sessionDays.size - 1) * width * 0.4))

    var sessions = svg.selectAll("g")
        .data(sessionDays)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(${sessionScale(d)}, 0)`)

    var correctWords = data.map(d => {
        words = d.words.filter((e, i) => d.flags[i] === 0)
        return words.map(e => {
            let datum = {}
            datum.word = e
            datum.day = d.day
            return datum
        })
    })
    correctWords = [].concat.apply([], correctWords)

    var wrongWords = data.map(d => {
        words = d.words.filter((e, i) => d.flags[i] === 1)
        return words.map(e => {
            let datum = {}
            datum.word = e
            datum.day = d.day
            return datum
        })
    })
    wrongWords = [].concat.apply([], wrongWords)

    var greens = sessions.selectAll("g")
        .data(d => correctWords.filter(e => e.day === d))
        .enter()
        .append("circle")
        .attr("cx", d => sessionScale(d.day))
        .attr("cy", (d, i) => height - 50 - 25 * i)
        .attr("r", 10)
        .attr("fill", "#66de93")

    var reds = sessions.selectAll("g")
        .data(d => wrongWords.filter(e => e.day === d))
        .enter()
        .append("circle")
        .attr("cx", d => sessionScale(d.day))
        .attr("cy", (d, i) => 50 + 25 * i)
        .attr("r", 10)
        .attr("fill", "#ff616d")

    var percentageTexts = sessions.selectAll("g")
        .data((d) => {
            var datum = {}
            let c = correctWords.filter(e => e.day === d).length
            let w = wrongWords.filter(e => e.day === d).length

            datum.day = d
            datum.percentage = `${parseInt(c / (c + w) * 100)}%`
            // console.log(datum)
            return [datum]
        })
        .enter()
        .append("text")
        .attr("x", d => sessionScale(d.day) + 13)
        .attr("y", height - 43)
        // .attr("y", height * 0.5 )
        .text(d => d.percentage)
        .attr("fill", "white")
        .attr("font-size", "1.3em")

    var sessionTexts = sessions.selectAll("g")
        .data((d, i) => {
            var datum = {}

            datum.day = d
            datum.text = `Session: ${i}`
            // console.log(datum)
            return [datum]
        })
        .enter()
        .append("text")
        .attr("x", d => sessionScale(d.day) - 30)
        // .attr("y", (d, i) => { console.log(d); return height * 0.97 })
        .attr("y", height * 0.03)
        .text(d => d.text)
        .attr("fill", "white")
        .attr("font-size", "1em")

}


function changeUser(e) {
    if (e.code === "KeyD") {
        if (currentIndex < userIds.length) {
            console.log("Previous", ++currentIndex)
        }
    }
    else if (e.code === "KeyA") {
        if (currentIndex > 0) {
            console.log("Previous", --currentIndex)
        }
    }
}

document.addEventListener("keypress", changeUser)


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
