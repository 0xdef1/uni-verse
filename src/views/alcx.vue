<template>
  <div class="alcx">
    <h1>DYOR: Alchemix</h1>
    <h2>by <a href="https://twitter.com/0xdef1">0xdef1</a></h2>
    <div class="container" style="margin-bottom: 0px">
        <div class="intro">
            <p>Imagine a bank. You can deposit money, and the bank pays you 10-15% interest. There's a credit card
            attached to the account, with a credit limit of 50% of the amount you have deposited. There's no interest
            on the card. There are no monthly payments to make. Instead, the interest you earn on your balance
            pays off any debt you have, automatically.</p>
            <p><a href="https://alchemix.fi" target="_blank">Alchemix</a> is 
            a new kind of DeFi/lending protocol built on Ethereum. It combines aspects of MakerDAO, Yearn, Curve, and Sushi in a novel 
            way to create "self-paying" loans.</p>
            <p>Quick Links:</p>
            <div class="quicklinks">
                <div>
               <a href="https://velocity-app.flipsidecrypto.com/shareable/alcx-supply-npeLZi" target="_blank">ALCX Supply →</a> 
               <a href="https://velocity-app.flipsidecrypto.com/shareable/al-usd-supply-6PapN6" target="_blank">alUSD Supply →</a>
               <a href="https://velocity-app.flipsidecrypto.com/shareable/aldai-pool-cIN5fS" target="_blank">Farm TVL →</a>
               <a href="https://velocity-app.flipsidecrypto.com/shareable/alchemix-harvests-Mza34X" target="_blank">Harvests →</a>
                </div>
                <div>

               <a href="https://velocity-app.flipsidecrypto.com/shareable/alchemix-alchemist-tvl-p4NZME" target="_blank">Deposits →</a>
               <a href="https://velocity-app.flipsidecrypto.com/shareable/alchemix-transmuter-tvl-hlVJVi" target="_blank">Transmuter Balance →</a>
               <a href="#resources">Other Resources →</a>
               </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="explainer">
            <p><a href="https://etherscan.io/token/0xbc6da0fe9ad5f3b0d58160288917aa56653660e9" target="_blank">alUSD</a> is a stablecoin that is minted when users take out a loan using Alchemix.
            It can be traded for other stable coins using a dedicated stable swap pool on <a href="https:/crv.finance" target="_blank">crv.finance</a>, 
            or "transmuted" to DAI over time using the <a href="https://app.alchemix.fi/transmute" target="_blank">Alchemix transmuter</a>.</p>
            <p>It can also be staked to earn ALCX tokens in the <a href="https://app.alchemix.fi/farms" target="_blank">alUSD pool</a>.</p>
            <p class="source"><a href="https://velocity-app.flipsidecrypto.com/shareable/al-usd-supply-6PapN6" target="_blank">Source Data →</a></p>
        </div>
        <div class="chart">
                <alUSDSupply/>
        </div>
    </div>
    <div class="container">
        <div class="explainer">
            <p>The <a href="https://etherscan.io/address/0xc21D353FF4ee73C572425697f4F5aaD2109fe35b" target="_blank">Alchemist</a> is the primary way users interact with Alchemix.
            This smart contract accepts DAI deposits from users and issues debt in alUSD. It also allows users to repay their outstanding loans, either with alUSD, DAI, or their existing collateral.</p>
            <p>Deposited DAI is put to work earning interest in the <a href="https://yearn.finance/vaults" target="_blank">Yearn v2 DAI vault</a>.
            <p class="source"><a href="https://velocity-app.flipsidecrypto.com/shareable/alchemix-alchemist-tvl-p4NZME" target="_blank">Source Data →</a></p>
        </div>
        <div class="chart">
                <AlchemistTVL/>
        </div>
    </div>
    <div class="container">
        <div class="explainer">
            <p>The <a href="https://etherscan.io/address/0xaB7A49B971AFdc7Ee26255038C82b4006D122086" target="_blank">Transmuter</a> completes the life cycle of alUSD. It backstops the peg by guaranteeing that all outstanding alUSD 
            can be converted 1:1 to DAI. </p> 
            <p>When alUSD is staked in the transmuter, it is converted to DAI over time via the proceeds from loan repayments. When DAI is 
            evenutally claimed, the staked alUSD is burned.
            </p>
            <p class="source"><a href="https://velocity-app.flipsidecrypto.com/shareable/alchemix-transmuter-tvl-hlVJVi" target="_blank">Source Data →</a></p>
        </div>
        <div class="chart">
                <TransmuterTVL/>
        </div>
    </div>
    <div class="container">
        <div class="explainer">
            <p>To bootstrap liquidity for alUSD, Alchemix launched with incentivized staking pools, where users can deposit capital and earn
                ALCX tokens as a reward. APY information and reward allocation can be found at <a href="https://vfat.tools/alcx" target="_blank">vfat.tools</a>.
            </p>
            <p>Note: This chart may lag real time by a few hours.</p>
            <p class="source"><a href="https://velocity-app.flipsidecrypto.com/shareable/aldai-pool-cIN5fS" target="_blank">Source Data →</a></p>
        </div>
        <div class="chart">
                <FarmsTVL/>
        </div>
    </div>
    <div class="container">
        <div class="explainer">
            <p><a href="https://etherscan.io/token/0xdbdb4d16eda451d0503b854cf79d55697f90c8df" target="_blank">ALCX</a> is the governance token for the Alchemix protocol. Its supply increases when users claim new tokens they've earned by 
            staking liquidity in the various pools above.</p>
            <p>The total supply will continue to increase over time, in line with the <a href="https://alchemix-finance.gitbook.io/alchemix-finance/token-distribution/alcx-monetary-policy" target="_blank">emissions schedule</a>.</p>
            <p class="source"><a href="https://velocity-app.flipsidecrypto.com/shareable/alcx-supply-npeLZi" target="_blank">Source Data →</a></p>
        </div>
        <div class="chart">
                <ALCXSupply/>
        </div>
    </div>
    <p><a name="resources"></a></p>
    <h1>Resources:</h1>
    <div class="container">
        <div class="intro">
            <p>
                Alchemix App: <a href="https://app.alchemix.fi" target="_blank">alchemix.fi →</a><br/>
                Price &amp; Charts: <a href="https://dex.guru/token/0xdbdb4d16eda451d0503b854cf79d55697f90c8df" target="_blank">dex.guru →</a><br/>
                Farming APY &amp; Yield Information: <a href="https://vfat.tools/alcx" target="_blank">vfat.tools →</a><br/>
                Emissions Schedule: <a href="https://alchemix-finance.gitbook.io/alchemix-finance/token-distribution/alcx-monetary-policy" target="blank">Gitbook →</a><br/>
            </p>
            <p>Data above from <a href="https://flipsidecrypto.com" target="_blank">Flipside Crypto →</a></p>
            <p>
                ALCX: <a href="https://etherscan.io/address/0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF" target="_blank">0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF →</a><br/>
                AlUSD: <a href="https://etherscan.io/address/0xBC6DA0FE9aD5f3b0d58160288917AA56653660E9" target="_blank">0xBC6DA0FE9aD5f3b0d58160288917AA56653660E9 →</a><br/>
                Alchemist: <a href="https://etherscan.io/address/0xc21D353FF4ee73C572425697f4F5aaD2109fe35b" target="_blank">0xc21D353FF4ee73C572425697f4F5aaD2109fe35b →</a><br/>
                Transmuter: <a href="https://etherscan.io/address/0xaB7A49B971AFdc7Ee26255038C82b4006D122086" target="_blank">0xaB7A49B971AFdc7Ee26255038C82b4006D122086 →</a><br/>
                YearnVaultAdapter: <a href="https://etherscan.io/address/0x014dE182c147f8663589d77eAdB109Bf86958f13" target="_blank">0x014dE182c147f8663589d77eAdB109Bf86958f13 →</a><br/>
                StakingPools: <a href="https://etherscan.io/address/0xAB8e74017a8Cc7c15FFcCd726603790d26d7DeCa" target="_blank">0xAB8e74017a8Cc7c15FFcCd726603790d26d7DeCa →</a><br/>
                TimeToken: <a href="https://etherscan.io/address/0x869d1b8610c038A6C4F37bD757135d4C29ae8917" target="_blank">0x869d1b8610c038A6C4F37bD757135d4C29ae8917 →</a><br/>
                MultiSigWalletWithTimeLock: <a href="https://etherscan.io/address/0x8392F6669292fA56123F71949B52d883aE57e225" target="_blank">0x8392F6669292fA56123F71949B52d883aE57e225 →</a><br/>
                SLP token: <a href="https://etherscan.io/address/0xc3f279090a47e80990fe3a9c30d24cb117ef91a8" target="_blank">0xc3f279090a47e80990fe3a9c30d24cb117ef91a8 →</a>
            </p>
        </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import ALCXSupply from '@/components/alcx/alcx-supply.vue'
import alUSDSupply from '@/components/alcx/alusd-supply.vue'
import AlchemistTVL from '@/components/alcx/alchemist-tvl.vue'
import TransmuterTVL from '@/components/alcx/transmuter-tvl.vue'
import FarmsTVL from '@/components/alcx/farms-tvl.vue'


export default {
  name: 'ALCX',
  components: {
    ALCXSupply,
    alUSDSupply,
    AlchemistTVL,
    TransmuterTVL,
    FarmsTVL
  }
}
</script>

<style scoped>
p {
    font-size: 25px;
}

.quicklinks {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-start;
  margin-bottom: 20px;
}

.quicklinks div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.quicklinks a {
    display: inline-block;
    font-size: 16px;
}

.alcx {
    color: #ffffffa0;
}

h1 {
    margin-bottom: 0;
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

.source {
    font-size: 20px;
}

</style>

<style>

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
  margin-left: 60px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #566c83;
}

.axis text {
    font-family: 'Ubuntu Mono';
    font-size: 13px;
    font-weight: bold;
    fill: #ffffffa0;
}

</style>