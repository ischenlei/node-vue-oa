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
    <div class="nav-icons bg-white mt-3  text-center pt-3 text-dark-1">
      <div class="d-flex flex-wrap">
        <div class="nav-item mb-3" v-for="n in 4" :key="n">
          <i class="sprite sprite-news"></i>
          <div class="py-2">爆料站</div>
        </div>
      </div>
      <div class="bg-light py-2 fs-sm d-flex jc-center ai-center">
        <i class="sprite sprite-arrow mr-1"></i>
        <span>收起</span>
      </div>
    </div>
    <!--  end of nav icons  -->
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
.nav-icons {
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  .nav-item {
    width: 25%;
    border-right: 1px solid $border-color;
    &:nth-child(4n) {
      border-right: none;
    }
  }
}
</style>
