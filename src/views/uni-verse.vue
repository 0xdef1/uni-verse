<template>
  <div class="uni-verse">
    <h1>UNI-verse</h1>
    <svg width="1000" height="800">
      <filter id="shadow">
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="14"
          floodColor="#000000"
          floodOpacity="0.5"
        />
      </filter>
    </svg>
    <div ref="tooltip" class="tooltip">
      <svg width="300" height="100">
        <filter id="sofGlow" height="300%" width="300%" x="-75%" y="-75%">
          <feMorphology
            operator="dilate"
            radius="10"
            in="SourceAlpha"
            result="thicken"
          />
          <feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />
          <feFlood flood-color="rgb(0,0,0)" result="glowColor" />
          <feComposite
            in="glowColor"
            in2="blurred"
            operator="in"
            result="softGlow_colored"
          />
          <feMerge>
            <feMergeNode in="softGlow_colored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <line x1="12" y1="17" x2="35" y2="40" />
        <text x="40" y="55" ref="tooltiplabel"></text>
      </svg>
    </div>
  </div>
</template>

<script>
import graph from "../data/graph.js";
var d3 = require("d3");
console.log(graph);

export default {
  name: "UNI-verse",
  mounted() {
    graph.nodes = graph.nodes.filter((node) => {
      return graph.links.filter((link) => link.source == node.id).length > 0;
    });

    var tip = d3.select(this.$refs.tooltip);
    var tiplabel = d3.select(this.$refs.tooltiplabel);

    var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");
    console.log(width + height);

    var color = d3
      .scaleSequential(d3.interpolateYlOrRd)
      .domain(
        d3.extent(
          graph.nodes.map((d) => Math.log(Math.max(100000, d.volumeUSD)))
        )
      );

    var simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id(function (d) {
            return d.id;
          })
          .distance((d) => {
            return Math.log(Math.max(1, 400 - d.cnt));
          })
      )
      .force("charge", d3.forceManyBody().strength(-75))
      .force(
        "collision",
        d3.forceCollide((d) => {
          return radius(d);
        })
      )
      .force("center", d3.forceCenter(width / 2, height / 2).strength(1));

    // var link = svg.append("g")
    //   .attr("class", "links")
    //   .selectAll("line")
    //   .data(graph.links)
    //   .enter().append("line")

    var node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter()
      .append("g");

    /*var circles = */ node
      .append("circle")
      .attr("r", (d) => {
        return radius(d);
      })
      .attr("fill", function (d) {
        return color(Math.log(d.volumeUSD));
      })
      .on("mouseover", function (event, d) {
        tip.transition().duration(100).style("opacity", 1);
        tip.style("left", event.pageX + "px").style("top", event.pageY + "px");
        tiplabel.text(d.id);
      })
      .on("mousemove", function (event) {
        tip.style("left", event.pageX + "px").style("top", event.pageY + "px");
      })
      .on("mouseout", function () {
        tip.transition().duration(100).style("opacity", 0);
      });

    node.on("click", function (e, d) {
      window.open("https://info.uniswap.org/pair/" + d.id, "_blank");
    });

    simulation.nodes(graph.nodes).on("tick", ticked);

    simulation.force("link").links(graph.links);

    simulation.tick(200);

    function ticked() {
      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

      simulation.stop();
    }

    function radius(d) {
      return Math.sqrt(d.trackedReserveETH / 200);
    }
  },
};
</script>

<style scoped>
svg >>> .nodes {
  filter: url(#shadow);
}

svg >>> .nodes circle {
  cursor: pointer;
}

.tooltip {
  position: absolute;
  text-align: center;
  width: 100px;
  height: 100px;
  padding: 2px;
  font: 12px sans-serif;
  pointer-events: none;
  opacity: 0;
  filter: url(#sofGlow);
}

.tooltip line {
  stroke-width: 1.5px;
  stroke: #fff;
  stroke-opacity: 0.6;
}

.tooltip text {
  fill: #fff;
  opacity: 0.6;
  font-family: sans-serif;
}
</style>