<template>
    <div class="loading">
        <div class="box box-1"></div>
        <div class="box box-2"></div>
        <div class="box box-3"></div>
    </div>
</template>

<script>
export default {
  name: 'Loading',
}
</script>

<style scoped>

@keyframes loading {
  0% { transform: scale(1) }
  30% { transform: scale(2); background: #e615b1 }
  60% { transform: scale(1) }  
  100% { transform: scale(1) }  
}

.loading {
    display: inline-block;
    width: 35px;
    text-align: cener;
}

.box {
  display: inline-block;
  width: 5px;
  height: 5px;
  margin: 3px;
  background : #c315e6;
  animation-name: loading;
  animation-iteration-count: infinite;  
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
}

.box-1 {
  animation-delay: 0;
}

.box-2 {
  animation-delay: .1s;
}

.box-3 {
  animation-delay: .2s;
}

</style>