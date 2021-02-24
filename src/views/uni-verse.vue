<template>
  <div class="uni-verse">
    <h1>THE UNI-VERSE</h1>
    <div style="margin-top: -40px; font-weight: bold;">by <a href="https://twitter.com/0xdef1">@0xdef1</a></div>
    <div id="container">
    <div id="explainer">
      <p><b>Nodes:</b> Uniswap Liquidity Pools<br/>
      <b>Node Size:</b> Liquidity ($)<br/>
      <b>Node Color:</b> 24hr Volume ($)<br/>
      <b>Links:</b> Frequency of transactions that contain swaps in both pools</p>
      <p>Credits:<br/>
      <b><a href="https://twitter.com/flipsidecrypto">@flipsidecrypto</a></b> for data<br/>
      <b><a href="https://twitter.com/will__price">@will__price</a></b> for review<br/>
      </p>
      <p>Last updated: Feb. 24, 2021</p>
      
    </div>
    <svg width="1000" height="1080">
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
    </div>
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
        <text x="40" y="55" ref="tooltipname"></text>
        <text x="40" y="75" ref="tooltipliq"></text>
        <text x="40" y="95" ref="tooltipvol"></text>
      </svg>
    </div>
  </div>
</template>

<script>
import graph from "../data/graph.js";
var d3 = require("d3");

export default {
  name: "UNI-verse",
  mounted() {
    graph.nodes = graph.nodes.filter((node) => {
      return graph.links.filter((link) => link.source == node.id).length > 0;
    });

    var tip = d3.select(this.$refs.tooltip);
    var tipname = d3.select(this.$refs.tooltipname);
    var tipliq = d3.select(this.$refs.tooltipliq);
    var tipvol = d3.select(this.$refs.tooltipvol);

    var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    var color = d3
      .scaleSequential(d3.interpolateYlOrRd)
      .domain(
        d3.extent(
          graph.nodes.map((d) => Math.log(Math.max(5000, d.volumeUSD)))
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
            return Math.log(Math.max(1, 600 - d.cnt));
          })
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force(
        "collision",
        d3.forceCollide((d) => {
          return radius(d);
        })
      )
      .force("center", d3.forceCenter(width / 2, height / 2).strength(1));

    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")

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
        tipname.text(d.poolName);
        tipliq.text('liq: $' + abbreviateNumber(d.trackedReserveETH * 1800));
        tipvol.text('vol: $' + abbreviateNumber(d.volumeUSD));
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
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

      simulation.stop();
    }

    function radius(d) {
      return Math.sqrt(d.trackedReserveETH / 200);
    }

    function abbreviateNumber(number){
      var SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];
      
      let negative = number < 0 ? '-' : '';
      number = Math.abs(number);


      // what tier? (determines SI symbol)
      const tier = Math.log10(number) / 3 | 0;

      // if zero, we don't need a suffix
      if (tier <= 0) {
        return negative + parseFloat(number.toFixed(Math.abs(tier) * 3 + 2)).toString();
      }

      // get suffix and determine scale
      const suffix = SI_SYMBOL[tier];
      const scale = Math.pow(10, tier * 3);

      // scale the number
      const scaled = number / scale;

      // format number and add suffix
      return negative + scaled.toFixed(1) + suffix;
    }
  },
};
</script>

<style scoped>

/* svg >>> .nodes {
  filter: url(#shadow);
} */

svg >>> .nodes circle {
  cursor: pointer;
}

svg >>> .links line {
  stroke: #fff;
  stroke-opacity: 0.0075;
}

svg >>> .nodes circle {
  stroke: #00000060;
  stroke-width: 3px;
}

.tooltip {
  position: absolute;
  text-align: center;
  width: 100px;
  height: 100px;
  padding: 2px;
  pointer-events: none;
  opacity: 0;
  filter: url(#sofGlow);
  font-size: 20px;
}

.tooltip line {
  stroke-width: 1.5px;
  stroke: #fff;
  stroke-opacity: 0.6;
}

.tooltip text {
  fill: #fff;
  opacity: 0.6;
}

#container {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
}

#explainer {
  margin-top: 50px;
  width: 300px;
  text-align: left;
  color: #ffffffa0
}

</style>