<template>
  <div class="login">
    <div class="box">
      <h2>登录</h2>
      <form @submit.prevent="login()">
        <div class="inputBox">
          <input type="text" name="" required v-model="model.username">
          <label>用户名</label>
        </div>
        <div class="inputBox">
          <input type="password" name="" required v-model="model.password">
          <label>密码</label>
        </div>
        <input type="submit" value="登录">
      </form>
    </div>
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
      this.$store.commit('setUser', res.data.info)
      await this.$router.push('/')
      // this.$message({
      //   type: 'success',
      //   message: '登陆成功'
      // })
    }
  }
}
</script>

<style scoped>
.login {
  background-color: #fff;
  height: 100%;
}

.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25.385rem;
  padding: 3.077rem;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0 1.154rem 1.923rem rgba(0, 0, 0, .1);
  border-radius: 0.769rem; /*登录窗口边角圆滑*/
}

.box h2 {
  margin: 0 0 0.769rem;
  color: #222;
  text-align: center;
}

.box .inputBox {
  position: relative;
}

.box .inputBox input {
  width: 100%;
  padding: 0.769rem 0;
  font-size: 1.231rem;
  color: #222;
  letter-spacing: 0.077rem;
  margin-bottom: 2.308rem; /*输入框设置*/
  border: none;
  border-bottom: 0.077rem solid #999;
  outline: none;
  background: transparent;
}

.box .inputBox label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 1.231rem;
  color: #222;
  pointer-events: none;
  transition: .5s;
}

.box .inputBox input:focus ~ label,
.box .inputBox input:valid ~ label {
  top: -1.385rem;
  left: 0;
  color: #db9e3f;
  font-size: 0.923rem;
}

.box input[type="submit"] {
  background: #db9e3f;
  border: none;
  outline: none;
  color: #fff;
  padding: 0.769rem 1.538rem;
  cursor: pointer;
  border-radius: 0.385rem;
}

</style>
