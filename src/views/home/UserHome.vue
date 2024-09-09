<template>
  <div class="user-home">
    <div class="header">
      <h2>欢迎, {{ user.uname }}！</h2>
      <div class="logout-button">
        <el-button type="primary" @click="editUserInfo">编辑信息</el-button>
        <el-button type="danger" @click="logout">退出登录</el-button>
        <router-link to="/index">
          <el-button style="margin-left:10px">查找用户</el-button>
        </router-link>
      </div>
    </div>
    <div class="user-info">
      <h3>个人简介</h3>
      <p>{{ user.bio }}</p>
    </div>
    <div class="article-list">
      <h3>我的文章</h3>
      <el-table :data="userArticles" style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="publishDate" label="发布时间"></el-table-column>
        <el-table-column prop="updateDate" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="viewArticle(scope.row.id)" type="text" size="small">查看</el-button>
            <el-button @click="editArticle(scope.row.id)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteArticle(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="contact-info">
      <el-row :gutter="20" class="contact-row">
      <h3>联系方式</h3>
        <el-col :span="12">
          <p>邮箱: {{ user.email }}</p>
        </el-col>
        <el-col :span="12">
          <p>电话: {{ user.phone }}</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        uname: "",
        bio: "",
        email: "",
        phone: "",
        articles: [], // 用户文章列表
      },
      userArticles: [], // 存储用户文章数据
    };
  },
  methods: {
    logout() {
      sessionStorage.removeItem('token');
      this.$router.push('/login');
    },
    editUserInfo() {
      this.$router.push('/edit-user-info');
    },
    viewArticle(id) {
      this.$router.push(`/article/${id}`);
    },
    editArticle(id) {
      this.$router.push(`/edit-article/${id}`);
    },
    deleteArticle(id) {
      console.log('删除文章', id);
    },
    fetchUserArticles() {
      // 这里使用静态数据模拟
      this.userArticles = [
        { id: 1, title: 'java 基础', publishDate: '2024-06-01', updateDate: '2024-06-02', summary: 'Vue.js 是一个渐进式JavaScript框架...' },
        { id: 2, title: 'Vue 学习', publishDate: '2024-07-15', updateDate: '2024-07-16', summary: 'Vue Router 是 Vue.js 的官方路由管理器...' },
      ];
    },
    fetchUserInfo() {
      this.makeRequest('/api/users/home', 'get')
          .then(response => {
            if (response.data.code === 20000) {
              const userData = response.data.data;
              console.log(userData);
              this.user = {
                uname: userData.nickName, // 使用nickName作为用户名显示
                bio: '暂无简介', // 假设后端没有提供个人简介，可以设置默认值
                email: userData.email,
                phone: userData.phone,
              };
              this.fetchUserArticles(); // 在获取用户信息后获取文章列表
            } else {
              console.error('获取用户信息失败');
            }
          })
          .catch(error => {
            console.error('请求错误', error);
          });
    },
    // 通用请求函数
    makeRequest(url, method, data = null, config = {}) {
      // 从sessionStorage获取accessToken
      const token = sessionStorage.getItem('token');
      console.log(token);
      if (token) {
        const accessToken = JSON.parse(token).accessToken;
        console.log(accessToken);
        // 将accessToken添加到请求头
        const headers = { ...config.headers, Authorization: `Bearer ${accessToken}` };
        return axios({ url, method, data, headers });
      } else {
        // 如果没有accessToken，可以处理未登录的逻辑
        console.error('未找到accessToken');
      }
    },
  },
  mounted() {
    this.fetchUserInfo();
  },
};
</script>

<style scoped>
.user-home {
  max-width: 800px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.header {
  width: 100%;
}
.logout-button {
  display: flex;
  justify-content: flex-end; /* 将按钮组放在右侧 */
  gap: 10px; /* 添加间隔 */
  margin-top: 10px; /* 添加一些上边距 */
}
.user-info, .article-list {
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
}
.contact-info {
  width: 100%;
  text-align: center;
  font-size: 0.9rem; /* 缩小字体大小 */
  margin-top: auto; /* 将联系方式推到页面底部 */
}
.contact-info p {
  margin: 5px 0;
}
.el-row {
  justify-content: space-around;
}
.contact-row {
  justify-content: space-between; /* 确保联系方式并排排列 */
  align-items: center; /* 垂直居中 */
}
</style>