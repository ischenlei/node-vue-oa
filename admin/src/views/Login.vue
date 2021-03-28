<template>
  <div class="login">
    <el-card header="请登录" class="login-card">
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input show-password v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 360px" type="primary" native-type="submit">登陆</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {}
    }
  },
  methods: {
    async login() {
      const res = await this.$http.post('login', this.model)
      localStorage.token = res.data.token
      localStorage.uid = res.data.info._id
      this.$store.commit('setUser',res.data.info)
      await this.$router.push('/')
      this.$message({
        type: 'success',
        message: '登陆成功'
      })
    }
  }
}
</script>

<style scoped>
.login-card{
  width: 25rem;
  margin: 6rem auto;
}
</style>
