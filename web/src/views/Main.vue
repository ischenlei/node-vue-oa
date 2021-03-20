<template>
  <div class="about">
<!--    <div class="topbar bg-black py-2">-->
<!--      This is an topBar-->
<!--    </div>-->
    <div class="bg-primary pt-3 pb-2">
      <div class="nav nav-inverse pb-1 jc-around">
        <div class="nav-item text-white active">
          <router-link class="nav-link" tag="div" to="/">首页</router-link>
        </div>
        <div class="nav-item text-white ">
          <router-link class="nav-link" tag="div" to="/">个人中心</router-link>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>

</script>
<style>

</style>