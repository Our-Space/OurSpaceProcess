import * as d3 from 'd3'

var data = {
    nodes: {
        a: "Initial idea",
        b: "Group formation",
        c: "First pivot",
        d: "Continue on orignal path"
    },
    edges: [
        ["a","b"],
        ["b", "c"],
        ["b", "d"]
    ],
    sequence: [
        ["a"],
        ["b"],
        ["c", "d"]
    ]
};

var getNodePosition = function (data, node) {

}

var width = 1280;
var height = 300;

var svg = d3.select("#process").append("svg")
    .attr("width", width)
    .attr("height", height+150)
    .attr("viewBox", "0 0 "+ width +" "+ height);

var circleContainer = svg.append("g")

var circles = circleContainer.selectAll(".circles")
