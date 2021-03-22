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
    <div class="card bg-white p-3 mt-3 ">
      <div class="card-header d-flex ai-center">
        <i class="iconfont icon-cc-menu-circle"></i>
        <div class="fs-xl flex-1 px-2">新闻资讯</div>
        <i class="iconfont icon-menu"></i>
      </div>
      <div class="card-body pt-3">
        <div class="nav jc-around">
          <div
            class="nav-item"
            :class="{active: active === index}"
            v-for="(item, index) in newsCats"
            :key="index"
            @click="$refs.list.swiper.slideTo(index)"
          >
            <div class="nav-link">{{item.name}}</div>
          </div>
        </div>
        <div class="pt-3">
          <swiper
            ref="list"
            @slide-change="() => active = $refs.list.swiper.realIndex"
          >
            <swiper-slide v-for="(item, index) in newsCats" :key="index">
              <router-link
                tag="div"
                :to="`/articles/${item._id}`"
                class="py-3 fs-lg d-flex"
                v-for="(item, index) in newsCats[index].newsList"
                :key="index"
              >
                <span class="text-info">[{{ item.cateGoryName }}]</span>
                <span class="px-2">|</span>
                <span class="flex-1 text-dark-1 text-ellipsis pr-2">{{ item.title }}</span>
                <span class="text-grey fs-sm">{{ item.createdAt | date }}</span>
              </router-link>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'Home',
  filters: {
    date(val) {
      return dayjs(val).format('MM/DD')
    }
  },
  data() {
    return {
      swiperOptions: {
        pagination: {
          el: '.pagination-home'
        },
        autoplay: {
          delay: 1500
        }
      },
      active: 0,
      newsCats: []
    }
  },
  created() {
    this.fetchNewsCats()
  },
  methods: {
    async fetchNewsCats() {
      const res = await this.$http.get('/news/list')
      this.newsCats = res.data
    }
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
