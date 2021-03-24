<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu
        router
        unique-opened
        :default-active="$route.path"
      >
        <el-menu-item index="/dashboard">DashBoard</el-menu-item>
        <el-menu-item index="/collection">我的收藏</el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-message"></i>内容管理
          </template>
          <el-menu-item-group>
            <template slot="title">文章</template>
            <el-menu-item index="/articles/create">新建文章</el-menu-item>
            <el-menu-item index="/articles/list">文章列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-message"></i>运营管理
          </template>
          <el-menu-item-group>
            <template slot="title">轮播图</template>
<!--            <el-menu-item index="/ads/create">新建广告位</el-menu-item>-->
            <el-menu-item index="/ads/list">轮播图列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-message"></i>系统设置
          </template>
          <el-menu-item-group>
            <template slot="title">分类</template>
            <el-menu-item index="/categories/create">新建分类</el-menu-item>
            <el-menu-item index="/categories/list">分类列表</el-menu-item>
          </el-menu-item-group>
<!--          <el-menu-item-group>-->
<!--            <template slot="title">物品</template>-->
<!--            <el-menu-item index="/items/create">新建物品</el-menu-item>-->
<!--            <el-menu-item index="/items/list">物品列表</el-menu-item>-->
<!--          </el-menu-item-group>-->
<!--          <el-menu-item-group>-->
<!--            <template slot="title">英雄</template>-->
<!--            <el-menu-item index="/heroes/create">新建英雄</el-menu-item>-->
<!--            <el-menu-item index="/heroes/list">英雄列表</el-menu-item>-->
<!--          </el-menu-item-group>-->
          <el-menu-item-group>
            <template slot="title">管理员</template>
            <el-menu-item index="/admin_users/create">新建管理员</el-menu-item>
            <el-menu-item index="/admin_users/list">管理员列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native = "logout()">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{userInfo.username}}</span>
      </el-header>

      <!--内容区域-->
      <el-main>
        <router-view :key="$route.path"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

<script>
// import { mapState } from 'vuex'

export default {
  data() {
    return {
      userInfo: {}
    }
  },
  // computed: mapState({
  //   // 传字符串参数 'count' 等同于 `state => state.count`
  //   countAlias: 'userInfo'
  // }),
  methods: {
    async fetchInfo() {
      let res = await this.$http.post('/user', {
        id: localStorage.getItem('uid')
      })
      this.userInfo = res.data
      this.$store.commit('setUser', res.data)
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
  created() {
    this.fetchInfo()
  }

};
</script>
