<template>
  <div class="categoryEdit">
    <h1>编辑轮播图</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input :value="model.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="轮播图">
        <el-button size="small" @click="model.items.push({})"><i class="el-icon-plus"></i>添加轮播图</el-button>
        <el-row type="flex" style="flex-wrap: wrap">
          <el-col :md="24" v-for="(item,i) in model.items" :key="i">
            <!--<el-form-item label="跳转链接">-->
            <!--  <el-input v-model="item.url"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="图片">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :headers="getAuthHeaders()"
                :on-success="res => $set(item,'image', res.url)">
                <img v-if="item.image" :src="item.image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                size="small"
                v-model="item.tips"
                @click="model.items.splice(i, 1)">删除
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
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
      model: {
        items: []
      }
    }
  },
  methods: {
    async save() {
      // let res
      // await this.$http.post('swiper/edit', this.model)
      if (this.model._id) {
        //修改
        await this.$http.post('swiper/edit', this.model)
      } else {
        //新建
        await this.$http.post('swiper/create', this.model)
      }
      // await this.$router.push('/ads/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })

    },
    //获取轮播图
    async fetch() {
      const res = await this.$http.get('swiper')
      this.model = Object.assign({}, this.model, res.data)
      // this.model = {...this.model, ...res.data}
    }
  },
  created() {
    this.fetch()
  }
}
</script>

<style scoped>
.avatar-uploader{
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 100px;
  margin-top: 20px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 200px;
  height: 100px;
  display: block;
}
</style>
