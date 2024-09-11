<template>
  <div class="edit-user-info">
    <el-form ref="userForm" :model="user" label-width="100px">
      <el-form-item label="昵称">
        <el-input v-model="user.nickName"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="user.account"></el-input>
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input
            type="textarea"
            v-model="user.bio">
        </el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="user.email" disabled></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="user.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUserInfo">更新信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        userId: "",
        account:"",
        nickName: "",
        bio: "",
        email: "",
        phone: "",
      },
    };
  },
  created() {
    this.fetchUserInfo();
  },
  methods: {
    fetchUserInfo() {
      // 从 sessionStorage 中获取 accessToken
      const token = sessionStorage.getItem('token');
      const accessToken = token ? JSON.parse(token).accessToken : null;

      // 构建请求头
      const headers = {
        'Authorization': accessToken ? `${accessToken}` : ''
      };
      axios.get('/api/users/home', { headers })
          .then(response => {
            if (response.data.code === 20000) {
              this.user = response.data.data;
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            console.error('请求用户信息出错', error);
            this.$message.error('获取用户信息失败');
          });
    },
    submitUserInfo() {
      // 从 sessionStorage 中获取 accessToken
      const token = sessionStorage.getItem('token');
      const accessToken = token ? JSON.parse(token).accessToken : null;

      // 构建请求头
      const headers = {
        'Authorization': accessToken ? `${accessToken}` : ''
      };
      axios.put('/api/users/update', this.user, { headers })
          .then(response => {
            if (response.data.code === 20000) {
              this.$message.success(response.data.msg);
              this.$router.push('/');
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            console.error('更新用户信息出错', error);
            this.$message.error('更新失败，请重试');
          });
    }
  }
};
</script>

<style scoped>
.edit-user-info {
  max-width: 500px;
  margin: 20px auto;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>