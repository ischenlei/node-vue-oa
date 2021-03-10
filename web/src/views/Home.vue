<template>
  <div class="home">
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide>
        <img class="w-100 h-swiper" src="../assets/images/swiper1.png"/>
      </swiper-slide>
      <swiper-slide>
        <img class="w-100 h-swiper" src="../assets/images/swiper2.png"/>
      </swiper-slide>
      <div class="swiper-pagination pagination-home" slot="pagination"></div>
    </swiper>
    <!--  end of swiper  -->
  </div>
</template>

<script>
// import ECharts from "echarts";
export default {
  name: 'Home',
  data() {
    return {
      swiperOptions: {
        pagination: {
          el: '.pagination-home'
        },
        autoplay: {
          delay: 1500
        }
      }
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss">
@import '../assets/scss/variables';
.pagination-home {
  .swiper-pagination-bullet {
    opacity: 1;
    border-radius: 0.154rem;
    background-color: map-get($colors, 'white');
    &.swiper-pagination-bullet-active {
      background: map-get($colors, 'info');
    }
  }
}
</style>
