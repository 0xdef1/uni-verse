<template>
    <div class="container">
        <div class="explainer">
            <p>How long will it take for a loan to repay itself? Use the sliders below to simulate loan durations for various combinations of parameters.</p>
            <div class="slider-box">
                <div class="slider-label">
                    <div>Collateral:</div><div style="text-align: right">{{deposit.toLocaleString()}}</div>
                </div>
                <vue-slider 
                    v-model="deposit" 
                    :tooltip="'active'" 
                    :use-keyboard="false" 
                    :min="1000" 
                    :max="100000" 
                    :interval="250" 
                    :duration="0" 
                    :tooltip-formatter="val => val.toLocaleString()"
                    v-on:change="updateDeposit"/>
            </div>
            <div class="slider-box">
                <div class="slider-label">
                    <div>Borrowed:</div><div style="text-align: right">{{borrow.toLocaleString()}}</div>
                </div>
                <vue-slider 
                    v-model="borrow" 
                    :tooltip="'active'" 
                    :use-keyboard="false" 
                    :min="1000" 
                    :max="50000" 
                    :interval="250" 
                    :duration="0" 
                    :tooltip-formatter="val => val.toLocaleString()"
                    v-on:change="updateBorrow"/>
            </div>
            <div class="slider-box">
                <div class="slider-label">
                    <div>APY:</div><div style="text-align: right">{{(apy * 100).toFixed(1) + '%'}}</div>
                </div>
                <vue-slider 
                    v-model="apy" 
                    :tooltip="'active'" 
                    :use-keyboard="false" 
                    :min="0.01" 
                    :max="0.5" 
                    :interval="0.001" 
                    :duration="0" 
                    :tooltip-formatter="val => (val * 100).toFixed(1) + '%'"
                    v-on:change="updateChart"/>
            </div>
        </div>
        <div class="chart">
            <div class="backdrop" style="margin-bottom: 10px; width: 400px; padding: 30px; font-size: 25px; font-weight: bold">
                <div style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 10px">
                    <div style="color: #566c83">Duration:</div><div style="text-align: right">{{((maturityDate - Date.now())/(1000*60*60*24)).toFixed(0) + ' Days'}}</div>
                </div>
                <div style="display: flex; flex-direction: row; justify-content: space-between;">
                    <div style="color: #566c83">Maturity Date:</div><div style="text-align: right">{{maturityDate.toLocaleDateString()}}</div>
                </div>
            </div>
            <div class="backdrop">
                <div style="margin-top: 20px;" ref="chart"></div>
                
            </div>
            <Tooltip ref="tooltip"/>
        </div>
    </div>
</template>
<script>
import VueSlider from 'vue-slider-component'
import '@/assets/slider-theme.css'
import Tooltip from '@/components/tooltip.vue'
import abbreviateNumber from '@/data/abbreviate-number.js'
const d3 = require('d3')

export default {
  name: 'LoanCalculator',
  components: {
      Tooltip,
      VueSlider
   },
   data() {
       return {
           deposit: 50000,
           borrow: 25000,
           apy: 0.291,
       }
   },
   methods: {
        updateChart: function() {

            drawChart(this.$refs['chart'], this.$refs['tooltip'].$el, this.deposit, this.borrow, this.apy)
        },
        updateDeposit: function() {
            if (this.deposit < this.borrow * 2) {
                this.borrow = this.deposit / 2
            }
            this.updateChart()
        },
        updateBorrow: function() {
            if (this.deposit < this.borrow * 2) {
                this.deposit = this.borrow * 2
            }
            this.updateChart()
        }
    },
    mounted() {
       this.updateChart()
    },
    computed: {
        maturityDate: function() {
            var midDays = this.borrow / (this.deposit * this.apy) * 365;
            return incrementDate(Date.now(), midDays)
        }
    }
}

function incrementDate(date, amount) {
    var tmpDate = new Date(date);
    return new Date(tmpDate.getTime()+1000*60*60*24*amount)
}

function nextNewYear(date) {
    var tmpDate = new Date(date.getFullYear() + 1, 0);
    return tmpDate
}

function drawChart(el, tooltip, deposit, borrow, apy) {
    var margin = {top: 10, right: 30, bottom: 40, left: 60},
        width = 460 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    d3.select(el).selectAll('svg').remove()

    // append the svg object to the body of the page
    var svg = d3.select(el)
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

    var buffer = 0.2;
    var midDays = borrow / (deposit * apy) * 365;
    var upperDays = borrow / (deposit * apy * (1 - buffer)) * 365;
    var lowerDays = Math.log((borrow + deposit) / deposit) / Math.log(1 + (apy/ 365));

    var startDate = Date.now();

    var x = d3.scaleTime()
        .domain([startDate, nextNewYear(incrementDate(startDate, midDays))])
        .range([ 0, width ]);
    svg.append("g")
        .attr('class', 'axis')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(4))

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([ 0, 51000])
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
        .text("Remaining Debt");

    var lowerFn = function(x) {
        return Math.max(0, borrow - (Math.pow(1 + (apy / 365), x) - 1) * deposit)
    }

    var midFn = function(x) {
        return Math.max(0, borrow - (apy  * (x / 365)) * deposit)
    }

    var upperFn = function(x) {
        return Math.max(0, borrow - (apy * (1 - buffer) * (x / 365)) * deposit)
    }

    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function (d) {return x(d.x);})
        .y(function (d) {return y(d.y);});

    var area = d3.area()
        .curve(d3.curveBasis)
        .x0(function(d) { return x(incrementDate(startDate, d)) } )
        .x1(function(d) { return x(incrementDate(startDate, d)) } )
        .y0(function(d) { return y(upperFn(d)) } )
        .y1(function(d) { return d <= lowerDays ? y(lowerFn(d)) : y(0)} );

    var midData = d3.range(0, midDays).concat(midDays).map(function (d) {
      return {x:incrementDate(startDate, d), y:midFn(d)};
    });

    svg.append('path')
        .datum(d3.range(0, upperDays).concat(upperDays))
        .attr('d', area)
        .attr('fill', '#e615b130')

    svg.append('path')
        .datum(midData)
        .attr('d', line)
        .attr("stroke", "#e615b1")
        .attr("stroke-width", 1.5)
        .attr('fill', 'none')

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
    
    var bisect = d3.bisector(d => d.x).right;

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
        var i = bisect(midData, x0);
        var debt = midData[i-1].y;
        var date = midData[i-1].x;

        focus
            .attr("d", function () {
                var d = "M" + pointerX + "," + 0;
                d += " " + pointerX + "," + height;
                d += "M" + 0 + "," + y(debt);
                d += " " + width + "," + y(debt);
                return d;
            })

        tip.style("left", event.pageX + "px").style("top", event.pageY + "px");
        tip
            .selectAll('div')
            .html(`${d3.timeFormat("%Y-%m-%d")(date)}<br/>Remaining Debt: ${abbreviateNumber(debt)}`)
            .attr('fill', '#ffffff')
    }



}

</script>
<style lang="css" src="@/assets/dyor.css" scoped></style>
<style scoped>
.slider-box {
    margin-bottom: 30px; 
    padding: 20px; 
    background: #ffffff20; 
    border-radius: 10px
}
.slider-label {
    display: flex; 
    flex-direction: row; 
    justify-content: space-between; 
    margin-bottom: 10px; 
    font-size: 25px
}
</style>