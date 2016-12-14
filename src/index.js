import React from 'react'
import {render} from 'react-dom'
import * as d3 from 'd3'
require("./default.scss")

const data = {
    nodes: {
        a: {
            title:"Initial idea"
        },
        b: {
            title: "Group formation"
        },
        c: {
            title:"First pivot"
        },
        d: {
            title:"Continue on orignal path"
        },
        e: {
            title:"Test"
        }
    },
    edges: [
        ["a","b"],
        ["b", "c"],
        ["b", "d"],
        ["d", "e"]
    ],
    sequences: [
        ["a"],
        ["b"],
        ["c", "d"],
        ["e"]
    ]
};

const getNodePosition = (data, node) => {

    // Find the index of the entry in which the node is found
    for (let j = 0; j < data.sequences.length; j++) {

       // If the node is found in the sequence entry
       if (data.sequences[j].indexOf(node) > -1) {
           // The x position is the index of the entry
           const x = j

           // The position of the node in the entry
           const i = data.sequences[j].indexOf(node)

           // The number of nodes in that entry
           const n = data.sequences[j].length

           return {x, i, n}
       }
    }

    console.error("Couldn't find node: " + node)
}

const y = (i, n, height) => {
    // Return the y-coord of the centre of the node
    return height / n * i + height / n / 2
}

const width = 1280;
const height = 500;

const numSequenceEntries = data.sequences.length

const xScale = d3.scaleBand()
    .domain(d3.range(0, data.sequences.length))
    .range([0, width])



const Viz = ({onSelectNode}) => {

    const nodes = Object.keys(data.nodes).map(key => {

        const {x, i, n} = getNodePosition(data, key)
        const xCoord = xScale(x)
        const yCoord = y(i, n, height)

        return (
            <g className="node" onClick={() => onSelectNode(key)}>
                <text x={xCoord} y={yCoord-75} textAnchor="middle">{data.nodes[key].title}</text>
                <circle key={key} r="50" cx={xCoord} cy={yCoord} fill="black" />
            </g>
        )
    })

    const edges = data.edges.map((edge,i) => {

        const a = getNodePosition(data, edge[0])
        const b = getNodePosition(data, edge[1])

        return (
            <line key={i} stroke="black" strokeWidth="2px" x1={xScale(a.x)} y1={y(a.i,a.n, height)} x2={xScale(b.x)} y2={y(b.i,b.n, height)} />
        )
    })

    return (<svg viewBox={"0 0 " + width + " " + height}>
            <g className="edges" transform="translate(100,0)">
                {edges}
            </g>
            <g className="nodes" transform="translate(100,0)">
                {nodes}
            </g>
        </svg>
    )
}


const Description = ({node}) => (
    <div className="Description">
        {data.nodes[node].title}
    </div>
)

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {node: "a"}
        this.onSelectNode = this.onSelectNode.bind(this)
    }

    onSelectNode(node) {
        this.setState((prevState) => ({node: node}))
    }

    render() {
        return (
            <div>
                <Viz onSelectNode={this.onSelectNode} />
                <Description node={this.state.node} />
            </div>
        )
    }
}

render(
    <App/>,
    document.getElementById('root')
)