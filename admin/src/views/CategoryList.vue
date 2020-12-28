<template>
  <div class="CategoryList">
    <h1>分类列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="200"></el-table-column>
      <el-table-column prop="name" label="分类名称"></el-table-column>
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
        const res =await this.$http.get('categories')
        this.items = res.data
        console.log(res)
      }
    },
    created() {
      this.fetch()
    }
  }
</script>