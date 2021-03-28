<template>
  <div class="page-article" v-if="model">
    <div class="d-flex py-3 px-2 border-bottom">
      <div class="iconfont icon-Back text-blue"></div>
      <strong class="flex-1 text-blue pl-2">
        {{model.title}}
      </strong>
      <i @click="setLike()" :class="isLike ? 'icon-like' : 'icon-Like'" class="iconfont fs-xxl text-red"></i>
<!--      <div class="text-grey fs-xs">-->
<!--        2020-3-21-->
<!--      </div>-->
    </div>
    <div v-html="model.body" class="px-3 body fs-lg"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      model: null
    }
  },
  computed: {
    ...mapState({
      info: 'userInfo'
    }),
    isLike() {
      return this.info.likes.find(val => {
        return val === this.model._id
      })
    }
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`/articles/${this.id}`)
      this.model = res.data
    },
    async fetchInfo() {
      let res = await this.$http.post('/user', {
        id: localStorage.getItem('uid')
      })
      // this.userInfo = res.data
      this.$store.commit('setUser', res.data)
    },
    setLike() {
      // for (let val of this.info.likes) {
      //   if (val !== this.model._id) {
      //     this.info.likes.push(this.model._id)
      //   } else {
      //     this.info.likes.push(this.model._id)
      //   }
      // }
      let tag = this.info.likes.findIndex(val => {
        return val === this.model._id
      })
      if (tag === -1) {
        this.info.likes.push(this.model._id)
      } else {
        this.info.likes.splice(tag, 1)
      }
      this.$store.commit('setLike', this.info.likes)

      this.$http.post('like', {
        username: this.info.username,
        likes: this.info.likes
      })
    }
  },
  created() {
    this.fetch()
    this.fetchInfo()
  }
}
</script>
<style lang="scss">
.page-article {
  .icon-Back {
    font-size: 1.692rem;
  }
  .body {
    img {
      width: 100%;
      height: auto;
    }
    iframe {
      width: 100%;
      height: auto;
    }
  }
}
</style>
