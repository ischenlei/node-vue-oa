<template>
  <div class="categoryEdit">
    <h1>{{id ? '编辑' : '新建'}}用户</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="用户名">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="model.password"></el-input>
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
      model: {}
    }
  },
  methods: {
    async save() {
      // let res
      if (this.id) {
        //修改
        await this.$http.put(`rest/users/${this.id}`, this.model)
      } else {
        //新建
        await this.$http.post('rest/users', this.model)
      }
      await this.$router.push('/users/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })

    },
    //
    async fetch() {
      const res = await this.$http.get(`rest/users/${this.id}`)
      this.model = res.data
    }
  },
  created() {
    this.id && this.fetch()
  }
}
</script>

<style scoped>

</style>
