<template>
  <div class="alcx">
    <h1>DYOR: Alchemix</h1>
    <div class="container">
        <div class="intro">
            <p>Imagine a bank. You can deposit money, and the bank pays you 10-15% interest. There's a credit card
            attached to the account, with a credit limit of 50% of the amount you have deposited. There's no interest
            on the card. There are no monthly payments to make. Instead, the interest you earn on your balance
            pays off any debt you have, automatically.</p>
            <p>The above description is the core mechanism of <a href="https://alchemix.fi">Alchemix</a>, 
            a new DeFi/lending protocol built on Ethereum. It combines aspects of MakerDAO, Yearn, Curve, and Sushi in a novel 
            way to create these "self-paying" loans. </p>
    </div>
    </div>
    <div class="container">
        <div class="explainer">
            <p><a href="https://etherscan.io/token/0xdbdb4d16eda451d0503b854cf79d55697f90c8df">ALCX</a> is the governance token for the Alchemix protocol. Its supply increases when users claim new tokens they've earned by 
            staking liquidity in various pools. The total supply will continue to increase over time, in line with the <a href="https://alchemix-finance.gitbook.io/alchemix-finance/token-distribution/alcx-monetary-policy">emissions schedule</a>.</p>
            <p><a href="https://velocity-app.flipsidecrypto.com/shareable/alcx-supply-npeLZi">Source →</a></p>
        </div>
        <div class="chart">
                <ALCXSupply/>
        </div>
    </div>
    <div class="container">
        <div class="explainer">
            <p><a href="https://etherscan.io/token/0xbc6da0fe9ad5f3b0d58160288917aa56653660e9">alUSD</a> is a stablecoin that is minted when users take out a loan using Alchemix.
            It can be traded for other stable coins using a dedicated stable swap pool on <a href="https:/crv.finance">crv.finance</a>, 
            or "transmuted" to DAI over time using the <a href="https://app.alchemix.fi/transmute">Alchemix transmuter</a>.</p>
            <p>It can also be staked to earn ALCX tokens in the <a href="https://app.alchemix.fi/farms">alUSD pool</a>.</p>
            <p><a href="https://velocity-app.flipsidecrypto.com/shareable/al-usd-supply-6PapN6">Source →</a></p>
        </div>
        <div class="chart">
                <alUSDSupply/>
        </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import ALCXSupply from '@/components/alcx/alcx-supply.vue'
import alUSDSupply from '@/components/alcx/alusd-supply.vue'

export default {
  name: 'ALCX',
  components: {
    ALCXSupply,
    alUSDSupply
  }
}
</script>

<style scoped>
.alcx {
    color: #ffffffa0;
}

h1 {
    color: #566c83;
}

.container {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
}

.intro {
    text-align: left;
    width: 720px;
    padding-left: 40px;
    padding-right: 40px;
}

.explainer {
  width: 350px;
  text-align: left;
  margin-right: 20px;
  margin-top: 20px;
}

.chart {
    width: 500px;
    text-align: left;
}
</style>

<style>
.legend {
    padding-left: 50px; 
    width: 410px;
}

.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 460px;
    height: 420px;
}

.title {
  font-size: 48px;
  font-weight: bold;
  margin-left: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #566c83;
}

.subhead {
  font-size: 12px;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 50px;
}

.backdrop {
    background: #1f2227; 
    box-shadow: 0px 0px 50px #00000080; 
    padding-top: 10px;
    display: inline-block;
    margin: 20px;
}

.axis text {
    font-family: 'Ubuntu Mono';
    font-size: 13px;
    font-weight: bold;
}

a {
    font-weight: bold;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.tooltip {
  position: absolute;
  text-align: center;
  padding: 2px;
  pointer-events: none;
  opacity: 0;
  filter: url(#sofGlow);
  font-size: 20px;
  text-align: left;
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
</style>