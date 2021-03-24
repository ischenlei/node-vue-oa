<template>
  <div class="CategoryList">
    <el-table :data="items">
      <el-table-column prop="title" label="文章名称"></el-table-column>
      <el-table-column prop="read" label="查阅量"></el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  data() {
    return {
      items: []
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
    },
  },
  created() {
    this.fetch()
  },
}
</script>