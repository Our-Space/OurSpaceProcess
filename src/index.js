import React from 'react'
import {render} from 'react-dom'
import * as d3 from 'd3'
import Tabletop from "tabletop"
import Markdown from "react-remarkable"
require("./default.scss")

const getNodePosition = (data, node) => {

    // Find the index of the entry in which the node is found
    for (let j = 0; j < data.sequence.length; j++) {

       // If the node is found in the sequence entry
       if (data.sequence[j].indexOf(node) > -1) {
           // The x position is the index of the entry
           const x = j

           // The position of the node in the entry
           const i = data.sequence[j].indexOf(node)

           // The number of nodes in that entry
           const n = data.sequence[j].length

           return {x, i, n}
       }
    }

    console.error("Couldn't find node: " + node)
}

const y = (i, n, height) => {
    // Return the y-coord of the centre of the node
    return height / n * i + height / n / 2
}

const widthPerSequenceEntry = 250;
const height = 500;

const Viz = ({data, selected, onSelectNode}) => {
    console.log(data)

    const numSequenceEntries = data.sequence.length
    const width = widthPerSequenceEntry * (numSequenceEntries-1)

    const xScale = d3.scaleBand()
        .domain(d3.range(0, numSequenceEntries))
        .range([0, width])

    const nodes = Object.keys(data.nodes).map(key => {

        const {x, i, n} = getNodePosition(data, key)
        const xCoord = xScale(x)
        const yCoord = y(i, n, height)

        let r = 25
        switch (data.nodes[key].significance) {
            case "2":
                r = 35
                break
            case "3":
                r = 45
                break
        }

        return (
            <g className={key === selected ? "node selected" : "node"} onClick={() => onSelectNode(key)}>
                <text x={xCoord} y={x % 2 === 0 || (n > 1 && i === 0) ? yCoord-r-20 : yCoord+40+r} textAnchor="middle">{data.nodes[key].shortTitle === "" ? data.nodes[key].title : data.nodes[key].shortTitle}</text>
                <circle className={"outer " + data.nodes[key].colour} key={key} r={r} cx={xCoord} cy={yCoord} fill="black" />
                <circle className="hollow" key={key + "hollow"} r={r*3/4} cx={xCoord} cy={yCoord} fill="white" />
            </g>
        )
    })

    const edges = data.edges.map((edge,i) => {

        const a = getNodePosition(data, edge[0])
        const b = getNodePosition(data, edge[1])

        return (
            <line key={i} stroke="#acacac" strokeWidth="2px" x1={xScale(a.x)} y1={y(a.i,a.n, height)} x2={xScale(b.x)} y2={y(b.i,b.n, height)} />
        )
    })

    return (
        <div className="Viz">
            <svg viewBox={"0 0 " + width + " " + (height+100)}>
                <g className="edges" transform="translate(100,50)">
                    {edges}
                </g>
                <g className="nodes" transform="translate(100,50)">
                    {nodes}
                </g>
            </svg>
        </div>
    )
}


const Description = ({data, node}) => (
    <div className="Description">
        <div className="header">
            <h1>{data.nodes[node].title}</h1>
            <h2>/ {data.nodes[node].time}</h2>
        </div>
        <div className="descriptionA">
            <Markdown>{data.nodes[node].descriptionA}</Markdown>
        </div>
        <div className="descriptionB">
            <Markdown>{data.nodes[node].descriptionB}</Markdown>
        </div>
    </div>
)

// &.Define { fill: #6fd0e6 }
// &.Ideate { fill: #229fdd }
// &.Test { fill: #185c9c }
// &.Critique { fill: #f25152 }
// &.Reflect { fill: #f27c7d }

const Legend = () => (
    <div className="Legend">
        <div className="key Define"><div></div><p>Define</p></div>
        <div className="key Ideate"><div></div><p>Ideate</p></div>
        <div className="key Test"><div></div><p>Test</p></div>
        <div className="key Critique"><div></div><p>Critique</p></div>
        <div className="key Reflection"><div></div><p>Reflection</p></div>
    </div>
)

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {data: null, node: "a", splash: true}
        this.onSelectNode = this.onSelectNode.bind(this)
        this.onStart = this.onStart.bind(this)

        const DOCS_KEY = "13WuL_ouXk2CwY46u0xWfmt58SwdPXRmAX94XDE41lbU"

        Tabletop.init({
            key: DOCS_KEY,
            callback: (sheetsData) => {

                let data = {
                    nodes: {},
                    edges: [],
                    sequence: {"100": []}
                }

                sheetsData.forEach(row => {
                    data.nodes[row.id] = row

                    let nodeEdges = row.connectedTo.split(",")
                    if (nodeEdges[0] !== "") {
                        nodeEdges.forEach(to => {
                            data.edges.push([row.id, to])
                        })
                    }
                    if (typeof data.sequence[row.sequence] === 'undefined') {
                        data.sequence[row.sequence] = []
                    }
                    if (row.sequence === "") data.sequence["100"].push(row.id)
                    else data.sequence[row.sequence].push(row.id)
                })

                data.sequence = Object.values(data.sequence)

                this.setState(prevState => ({data: data, node: "a"}))
                console.log(data)

            },
            simpleSheet: true
        })

    }

    onStart() {
        this.setState((prevState) => ({...prevState, splash: false}))
    }

    onSelectNode(node) {
        this.setState((prevState) => ({...prevState, node: node}))
    }

    render() {
        if (this.state.splash === true) {
            return (
                <div className="splash" onClick={() => this.onStart()}>
                    <img src="images/explainer.png" />
                </div>
            )
        }
        else if (this.state.data === null) {
            return (
                <h1>Loading</h1>
            )
        }
        else {
            return (
                <div className="process">
                    <Legend/>
                    <Viz data={this.state.data} selected={this.state.node} onSelectNode={this.onSelectNode} />
                    <Description data={this.state.data} node={this.state.node} />
                </div>
            )
        }
    }
}

render(
    <App/>,
    document.getElementById('root')
)