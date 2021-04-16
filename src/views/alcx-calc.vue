<template>
    <div>
        <h1>DYOR: ALCHEMIX</h1>
        <h2>Loan Calculator by <a href="https://twitter.com/0xdef1">0xdef1</a></h2>
        <div class="container">
            <div class="intro">
                Alchemix loans repay themselves by using your collateral to generate yield and pay down your debt. The amount of time it takes
                for a loan to be repaid depends on the amount of collateral you deposit, the amount you borrow, and the amount of yield
                the protocol is able to generate. 
            </div>
        </div>
        <LoanCalculator/>
    </div>
</template>
<script>
import LoanCalculator from '@/components/alcx/calculator.vue'

export default {
  name: 'ALCXCalc',
  components: {
      LoanCalculator
   }
}
</script>
<style lang="css" src="@/assets/dyor.css" scoped></style>