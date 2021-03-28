<template>
  <div class="user">
    <div class="user-head d-flex">
      <div class="user-img mr-2">
        <img src="../assets/images/User.png"/>
      </div>
      <h2 class="text-black">hello，{{info.username}}</h2>
    </div>
    <div class="card bg-white p-3 mt-3 ">
      <div class="card-header d-flex ai-center">
        <i class="iconfont icon-Like"></i>
        <div class="fs-xl flex-1 px-2">我的收藏</div>
        <i class="iconfont icon-menu"></i>
      </div>
      <div class="card-body pt-1">
        <div class="pt-1">
          <router-link
            tag="div"
            :to="`/articles/${item._id}`"
            class="py-3 fs-lg d-flex"
            v-for="(item, index) in likes"
            :key="index"
            @click.native="addRead(item._id)"
          >
            <span class="text-info">[{{ item.categories.name }}]</span>
            <span class="px-2">|</span>
            <span class="flex-1 text-dark-1 text-ellipsis pr-2">{{ item.title }}</span>
            <span class="text-grey fs-sm">{{ item.createdAt | date }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import dayjs from "dayjs";
export default {
  data() {
    return {
      likes: []
    }
  },
  filters: {
    date(val) {
      return dayjs(val).format('MM/DD')
    }
  },
  computed: {
    ...mapState({
      info: 'userInfo'
    })
  },
  methods: {
    // async fetchTop() {
    //   const res = await this.$http.get('/articles/top')
    //   this.top = res.data
    // },
    async fetchLikes() {
      const res = await this.$http.get('/articles/likes')
      this.likes = res.data
    },
    async fetchInfo() {
      let res = await this.$http.post('/user', {
        id: localStorage.getItem('uid')
      })
      // this.userInfo = res.data
      this.$store.commit('setUser', res.data)
    },
    async addRead(id) {
      console.log('aaaaaaaa')
      await this.$http.post('/read', {
        id: id
      })
    }
  },
  created() {
    // this.fetchTop()
    this.fetchInfo()
    this.fetchLikes()
  }
}
</script>

<style>
.user-head
{
  padding: 1rem;
  margin: 0.769rem;
  background:#fff;
  box-sizing:border-box;
  box-shadow:0 15px 25px rgba(0,0,0,.1);
  border-radius: 10px;/*登录窗口边角圆滑*/
}
.user-head img {
  width: 6.154rem;
}

</style>
