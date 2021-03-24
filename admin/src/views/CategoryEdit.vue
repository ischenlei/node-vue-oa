<template>
  <div class="categoryEdit">
    <h1>{{id ? '编辑' : '新建'}}分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="上级分类">
        <el-select v-model="model.parent">
          <el-option
              v-for="item in parents"
              :key="item._id"
              :label="item.name"
              :value="item._id">

          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },
  data() {
    return {
      model: {},
      parents: []
    }
  },
  methods: {
    async save() {
      // let res
      if (this.id) {
        //修改
        await this.$http.put(`rest/categories/${this.id}`, this.model)
      } else {
        //新建
        await this.$http.post('rest/categories', this.model)
      }
      await this.$router.push('/categories/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })

    },
    //
    async fetch() {
      const res = await this.$http.get(`rest/categories/${this.id}`)
      this.model = res.data
    },
    //获取父级选项
    async fetchParents() {
      const res = await this.$http.get(`rest/categories`)
      for (let item of res.data) {
        if (!('parent' in item)) {
          console.log('================')
          console.log(item)
          this.parents = [item]
        }
      }
    }

  },
  created() {
    this.fetchParents()
    this.id && this.fetch()
  }
}
</script>

<style scoped>

</style>
