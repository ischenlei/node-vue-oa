<template>
  <div class="CategoryList">
<!--    <div style="margin-top: 15px;">-->
<!--      <el-select style="float: left;margin-right: 10px" v-model="type" placeholder="请选择">-->
<!--        <el-option-->
<!--          v-for="item in categories"-->
<!--          :key="item._id"-->
<!--          :label="item.name"-->
<!--          :value="item._id">-->
<!--        </el-option>-->
<!--      </el-select>-->
<!--      <el-button style="margin-right: 100px" slot="append" icon="el-icon-search" @click="searchType()">搜索</el-button>-->
<!--      <el-input style="width: 500px" placeholder="请输入内容" v-model="input" class="input-with-select">-->
<!--        <el-button slot="append" icon="el-icon-search" @click="search()">搜索</el-button>-->
<!--      </el-input>-->
<!--    </div>-->
    <h1>我的收藏</h1>
    <el-table :data="likeItems">
      <el-table-column prop="_id" label="ID" width="200"></el-table-column>
      <el-table-column prop="title" label="文章名称"></el-table-column>
<!--      <el-table-column label="分类">-->
<!--        <template slot-scope="scope">-->
<!--          <span v-if="scope.row.categories[0]">{{scope.row.categories[0].name}}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
          fixed="right"
          label="操作"
          width="400">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.isLike ? 'warning' : ''"
            icon="el-icon-star-off"
            @click="setLike(scope.row._id)"
            circle>
          </el-button>
<!--          <el-button type="danger"-->
<!--                     size="small"-->
<!--                     round-->
<!--                     @click="setLike(scope.row._id)">{{ scope.row.isLike ? '取消' : '收藏' }}-->
<!--          </el-button>-->
          <el-button type="danger"
                     size="small"
                     round
                     @click="setTop(scope.row._id)">{{ scope.row.isTop ? '取消置顶' : '置顶' }}
          </el-button>
          <el-button type="primary"
                     size="small"
                     @click="$router.push(`/articles/edit/${scope.row._id}`)">编辑
          </el-button>
          <el-button type="primary"
                     size="small"
                     @click="remove(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { mapState } from 'vuex'

  export default {
    data() {
      return {
        items: [
          {isLike: false},
          {categories: [{name:''}]}
        ],
        likeItems: [],
        // input: '',
        categories: [],
        // type: '',
        likes: []
      }
    },
    methods: {
      async fetch() {
        const res = await this.$http.get('rest/articles')
        this.items = res.data
        for (let value of res) {
          value.categories
        }
        console.log(res)
        await this.fetchInfo()
        this.addIsLike()
      },
      //获取目录
      async fetchCategories() {
        const res = await this.$http.get(`rest/categories`)
        this.categories = res.data
        this.categories.splice(0,1)
        // console.log(this.categories)
      },
      async remove(row) {
        // console.log(row)
        this.$confirm(`是否要确定删除文章 "${row.title}"？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$http.delete(`rest/articles/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          await this.fetch()
        })
      },
      // async search() {
      //   const res = await this.$http.post('search/article', {
      //     name: this.input
      //   })
      //   this.items = res.data
      //   // console.log(this.items)
      // },
      // async searchType() {
      //   const res = await this.$http.post('search/type', {
      //     type: this.type
      //   })
      //   this.items = res.data
      // },
      async setTop(id) {
        const res = await this.$http.post('setTop', {
          id: id
        })
        this.items = res.data
      },
      async setLike(id) {
        let username = this.$store.state.userInfo.username
        console.log(username)
        const res = await this.$http.post('like', {
          id: id,
          username: username
        })
        this.likes = res.data
        console.log(this.likes)
        this.$store.commit('setLike', res.data)
        this.addIsLike()
      },
      addIsLike() {
        for (let like of this.likes) {
          for (let item of this.items) {
            if (item._id === like) {
              item.isLike = true
            }
          }
        }
      },
      async fetchInfo() {
        const res2 = await this.$http.get('rest/articles')
        this.items = res2.data
        let res = await this.$http.post('/user', {
          id: localStorage.getItem('uid')
        })
        this.likes = res.data.likes
        this.addIsLike()
        for (let item of this.items) {
          for (let like of this.likes) {
            if (item._id === like) {
              this.likeItems.push(item)
            }
          }
        }
      },
    },
    created() {
      this.fetch()
      this.fetchInfo()
      this.fetchCategories()
    },
  }
</script>