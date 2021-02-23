<template>
  <div class="uni-verse">
    <h1>UNI-verse</h1>
    <svg width="1000" height="800"></svg>
  </div>
</template>

<script>
import graph from "../data/graph.js";
var d3 = require('d3');
console.log(graph);

export default {
  name: "UNI-verse",
  mounted() {
    graph.nodes = graph.nodes.filter((node) => {
      return graph.links.filter((link) => link.source == node.id).length > 0;
    });

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

    /*   var link = svg.append("g")
          .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
          .attr("stroke-width", function(d) { return Math.sqrt(d.value); }); */

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
      });
    /*.call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));*/

    /*  var lables = node.append("text")
          .text(function(d) {
            return d.id;
          })
          .attr('x', 6)
          .attr('y', 3);  */

    node.append("title").text(function (d) {
      return d.id;
    });

    node.on("click", function (e, d) {
      window.open("https://etherscan.io/address/" + d.id, "_blank");
    });

    simulation.nodes(graph.nodes).on("tick", ticked);

    simulation.force("link").links(graph.links);

    //simulation.tick(200);
    //simulation.stop();

    function ticked() {
      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }

    function radius(d) {
      return Math.sqrt(d.trackedReserveETH / 200);
    }
  },
};
</script>