<template>
    <div class="backdrop">
        <div v-if="loading" class="loader"><Loading/></div>
        <div :style="{display: loading ? 'none' : 'block'}">
            <div class="title">Farming TVL</div>
            <div ref="chart"></div>
        </div>
        <Tooltip ref="tooltip"/>
    </div>
</template>

<script>

import Loading from '@/components/loading.vue';
import Tooltip from '@/components/tooltip.vue';
import axios from 'axios';
import _ from 'lodash';
var d3 = require('d3');
import abbreviateNumber from '@/data/abbreviate-number.js'
import sleep from '@/data/sleep.js'

export default {
  name: 'FarmsTVL',
  data() {
      return {
          loading: true,
      }
  },
  components: {
      Loading,
      Tooltip
  },
  mounted() {
    Promise.all([
      fetchData(),
      sleep(750)
    ])
    .then((results) => {
       this.loading = false;
       console.log(this.$refs['tooltip']);
       drawChart(this.$refs['chart'], this.$refs['tooltip'].$el, results[0])
    })
  },
}

async function fetchData() {
    const api = 'https://api.flipsidecrypto.com/api/v2/queries/d55ad9e1-2454-4b6a-8939-059b6eb4050d/data/latest';
    const response = await axios({
        url: api,
        method: "get",
     });
     return _.sortBy(response.data.map(d => ({date: d3.isoParse(d.balance_date), al3usd: d.al3usd_tvl, alcx: d.alcx_tvl, alusd: d.alusd_tvl, slp: d.slp_tvl})), 'date')
}

function drawChart(el, tooltip, data) {
    var margin = {top: 10, right: 30, bottom: 40, left: 60},
        width = 460 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(el)
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")  


    var pools = ['al3usd', 'slp', 'alcx', 'alusd'];
    var stackedData = d3.stack()
        .keys(pools)(data)
    var color = d3.scaleOrdinal()
        .domain(pools)
        .range(['#E615B180','#083D7780','#6C91BF80','#C315E680']);

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
        .domain([ 0, d3.max(stackedData[3], d => d[1]) * 1.2])
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
        .text("TVL");



    var area = d3.area().curve(d3.curveBasis)
        .x(function(d) { return x(d.data.date); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
 
    svg.selectAll('g.area')
        .data(stackedData)
        .enter()
        .append("path")
            .style("fill", function(d) { return color(d.key); })
            .attr("d", area)


    var tip = d3.select(tooltip);

    svg
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
    
    var bisect = d3.bisector(d => d.date).right;

    var focus = svg
        .append('g')
        .append('path')
        .style("stroke", "#fff")
        .style("stroke-width", "0.5px")
        .style("stroke-dasharray", "5,5")
        .style("opacity", 0)
        .style("pointer-events", "none")

    function mouseover() {
        tip.transition().duration(100).style("opacity", 1);
        focus.transition().duration(100).style("opacity", 1);
    }

    function mouseout() {
        tip.transition().duration(100).style("opacity", 0);
        focus.transition().duration(100).style("opacity", 0);
    }

    function mousemove(event) {

        var pointerX = d3.pointer(event)[0]
        var x0 = x.invert(pointerX);
        var i = bisect(data, x0);
        var alusd = data[i-1].alusd;
        var al3usd = data[i-1].al3usd;
        var alcx = data[i-1].alcx;
        var slp = data[i-1].slp;
        var date = data[i-1].date;

        focus
            .attr("d", function () {
                var d = "M" + pointerX + "," + 0;
                d += " " + pointerX + "," + height;
                return d;
            })

        tip.style("left", event.pageX + "px").style("top", event.pageY + "px");
        tip
            .selectAll('div')
            .html(`${d3.timeFormat("%Y-%m-%d")(date)}<br/>alUSD: ${abbreviateNumber(alusd)}<br/>ALCX: ${abbreviateNumber(alcx)}<br/>ALCX/WETH: ${abbreviateNumber(slp)}<br/>alUSD/3crv: ${abbreviateNumber(al3usd)}<br/>Total: ${abbreviateNumber(alusd+al3usd+alcx+slp)}`)
            .attr('fill', '#ffffff')
    }



}


</script>

