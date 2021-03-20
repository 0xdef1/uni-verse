<template>
    <div class="somnium">
        <h1>SOMNIUM SPACE VR</h1>
        <div class="container">
            <div class="explainer">
                <ul>
                    <li><h2>Recent Sales</h2></li>
                    <li v-for="sale in sales" :key="sale.id">
                        <span style="font-size: 15px">{{sale.dateStr}}</span><br/>
                        <div :style="{marginRight: '5px', marginLeft: '5px', width: '10px', height: '10px', background: colorForSize(sizeForDescription(sale.description)), display: 'inline-block', 'border-radius': '50%'}"></div>
                        {{sale.price}} {{sale.paymentToken}}
                        <a :href="sale.permalink" target="_blank">#{{sale.id}} →</a> 
                    </li>
                </ul>
            </div>
            <div class="chart">
                <div class="backdrop">
                    <div v-if="loading" class="loader"><Loading/></div>
                    <div :style="{display: loading ? 'none' : 'block'}">
                        <div class="title">Land Parcel Sales</div>
                        <div style="margin-left: 60px; display: flex; flex-direction: column;">
                            <div>
                                <div style="width: 10px; height: 10px; background: #C315E6; display: inline-block; border-radius: 50%"></div> Small
                            </div>
                            <div>
                                <div style="width: 10px; height: 10px; background: #6C91BF; display: inline-block; border-radius: 50%"></div> Medium
                            </div>
                            <div>
                                <div style="width: 10px; height: 10px; background: #E615B1; display: inline-block; border-radius: 50%"></div> Extra Large
                            </div>
                        </div>
                        <div ref="chart"></div>
                    </div>
                    <Tooltip ref="tooltip"/>
                </div>
            </div>
        </div>
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
  name: 'SomniumSales',
  data() {
      return {
          loading: true,
          sales: [],
          colorForSize: colorForSize,
          sizeForDescription: sizeForDescription
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
       this.sales = _.chain(results[0]).take(10).value()
       console.log(this.sales);
       drawChart(this.$refs['chart'], this.$refs['tooltip'].$el, results[0])
    })
  },
}

function sizeForDescription(description) {
    var size = description.startsWith('Small') ? 's' :
    description.startsWith('Medium') ? 'm' : 
    description.startsWith('Extra Large') ? 'xl' : '?'
    return size;
}

function colorForSize(size) {
    var color = d3.scaleOrdinal()
    .domain(['s', 'm', 'xl'])
    .range(['#C315E6','#6C91BF','#E615B1','#083D77',])
    return color(size);
}

async function fetchData() {
    const api = 'https://api.opensea.io/api/v1/events?only_opensea=true&offset=0&limit=10000&asset_contract_address=0x913ae503153d9a335398d0785ba60a2d63ddb4e2&event_type=successful';
    const response = await axios({
        url: api,
        method: "get",
     });
     var sales = response.data.asset_events
        .filter(s => s.asset != null &&
             s.asset.asset_contract.address == "0x913ae503153d9a335398d0785ba60a2d63ddb4e2" &&
             (s.payment_token.symbol == "ETH" || s.payment_token.symbol == "WETH"))
        .map(s => ({
            id: s.asset.token_id,
            description: s.asset.description,
            date: new Date(s.created_date),
            dateStr: d3.timeFormat( "%Y-%m-%d %H:%M:%S")(new Date(s.created_date)),
            price: parseInt(s.total_price) / Math.pow(10, s.payment_token.decimals),
            paymentToken: s.payment_token.symbol,
            permalink: s.asset.permalink,
            assetContract: s.asset.asset_contract.address
        }))
     console.log(sales);
     return sales;
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
        .domain([ 0, d3.max(data, d => +d.price) * 1.2])
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
        .text("Sale Price (Ξ)");

    var tip = d3.select(tooltip);

    svg.selectAll('.dot')
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 4)
        .attr("cx", d => {
            return x(d.date)
        })
        .attr("cy", d => {
            return y(d.price)
        })
        .style("fill", d => {
            return colorForSize(sizeForDescription(d.description));
        })
        .style("opacity", "0.5")
        .on("mouseover", () => {
            tip.transition().duration(100).style("opacity", 1);
        })
        .on("mouseout", () => {
            tip.transition().duration(100).style("opacity", 0);
        })
        .on("mousemove", (event, d) => {
            tip.style("left", event.pageX + "px").style("top", event.pageY + "px");
            tip
                .selectAll('div')
                .html(`#${d.id}<br/>${d.price} ${d.paymentToken}`)
                .attr('fill', '#ffffff')
        })

    
}

</script>

<style scoped>

.somnium {
    color: #ffffffa0;
}

ul {
    list-style-type: none;
}

li {
    margin-bottom: 10px;
}

p {
    font-size: 25px;
}


h1 {
    color: #566c83;
}

h2 {
    margin-top: 0;
    color: #566c83;
}

.container {
  margin-top: 10px;
  margin-bottom: 70px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
}

.intro {
    text-align: left;
    width: 600px;
    padding-left: 40px;
    padding-right: 40px;
}

.intro p {
    font-size: 20px;
}

.explainer {
  width: 400px;
  text-align: left;
  margin-right: 20px;
  margin-top: 20px;
}

.chart {
    width: 500px;
    text-align: left;
}

.chart >>> svg {
    cursor: crosshair;
}

a {
    font-weight: bold;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.backdrop {
    background: #1f2227; 
    box-shadow: 0px 0px 50px #00000080; 
    padding-top: 10px;
    display: inline-block;
    margin: 20px;
}

</style>
