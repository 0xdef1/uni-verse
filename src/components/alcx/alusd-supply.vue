<template>
    <div class="backdrop">
        <div v-if="loading" class="loader"><Loading/></div>
        <div :style="{display: loading ? 'none' : 'block'}">
            <div class="title">alUSD Supply</div>
            <div ref="chart"></div>
        </div>
    </div>
</template>

<script>

import Loading from '@/components/loading.vue';
import axios from 'axios';
import _ from 'lodash';
var d3 = require('d3');
import abbreviateNumber from '@/data/abbreviate-number.js'

export default {
  name: 'alUSDSupply',
  data() {
      return {
          loading: true,
      }
  },
  components: {
      Loading
  },
  mounted() {
    Promise.all([
      fetchData()
    ])
    .then((results) => {
       this.loading = false;
       console.log(results[0]);
       console.log(d3.extent(results[0].map(d => d.date)));
       drawChart(this.$refs['chart'], results[0])
    })
  },
}

async function fetchData() {
    const api = 'https://api.flipsidecrypto.com/api/v2/queries/a6316105-651a-4ce6-912e-feb3c3cc7e88/data/latest';
    const response = await axios({
        url: api,
        method: "get",
     });
     return _.sortBy(response.data.map(d => ({date: d3.isoParse(d.t), supply: d.alusd})), 'date')
}

function drawChart(el, data) {
    var margin = {top: 10, right: 30, bottom: 40, left: 60},
        width = 460 - margin.left - margin.right,
        height = 320 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(el)
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");      

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain(d3.extent(data.map(d => d.date)))
        .range([ 0, width ]);
    svg.append("g")
        .attr('class', 'axis')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(4))

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([ 0, d3.max(data, d => +d.supply) * 1.2])
        .range([ height, 0 ]);
    svg.append("g")
        .attr('class', 'axis')
        .call(d3.axisLeft(y).ticks(3).tickFormat(abbreviateNumber))
        .append("text")
        .style("fill", "currentColor")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Supply");

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#e615b1")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line().curve(d3.curveStepAfter)
                .x(d => x(d.date))
                .y(d => y(d.supply))
                )
}


</script>

