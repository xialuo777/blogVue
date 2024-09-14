<template>
  <div class="user-home">
    <div class="header">
      <h2>欢迎来到您的主页, {{ user.uname }}！</h2>
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
      <el-button type="primary" icon="el-icon-plus" title="添加文章" @click="addArticle" size="mini" class = "add-article-button"></el-button>
      <el-table :data="userArticles" style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="categoryName" label="分类" width="100"></el-table-column>
        <el-table-column prop="blogTitle" label="标题"></el-table-column>
        <el-table-column prop="creatTime" label="发布时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="viewArticle(scope.row.blogId)" type="text" size="small">查看</el-button>
            <el-button @click="editArticle(scope.row.blogId)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteArticle(scope.row.blogId)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pagination.pageSize"
            :total="pagination.totalCount"
            layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
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
import { MessageBox } from 'element-ui';

export default {
  data() {
    return {
      user: {
        uname: "",
        bio: "",
        email: "",
        phone: "",
      },
      userArticles: [],
      pagination: {
        currentPage: 1, //初始页
        pageSize: 10, //每页的数据
        totalCount: 0 //总数据
      },
      selectedCategory: '', // 当前选中的分类
      categories: [] // 所有分类列表
    };
  },
  methods: {
    addArticle() {
      // 跳转到添加文章的页面或弹出添加文章的对话框
      this.$router.push('/add-article');
    },
    // 改变分页的每页的页数
    handleSizeChange(newSize) {
      this.pagination.pageSize = newSize;
      this.pagination.currentPage = 1; // 重置为第一页
      this.fetchUserArticles();
    },
    // 改变分页的当前页面
    handleCurrentChange(newPage) {
      this.pagination.currentPage = newPage;
      this.fetchUserArticles();
    },
    logout() {
      sessionStorage.removeItem('token');
      this.$router.push('/login');
    },
    editUserInfo() {
      this.$router.push('/edit-user-info');
    },
    viewArticle(blogId) {
      if (!blogId) {
        console.error('博客ID未定义');
        this.$message.error('博客ID未定义');
        return;
      }
      this.$router.push({ name: 'BlogDetail', params: { id: blogId } });
    },
    editArticle(blogId) {
      this.$router.push(`/edit-article/${blogId}`);
    },
    deleteArticle(blogId) {
      // 确认对话框
      MessageBox.confirm('确定要删除这篇文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 从 sessionStorage 中获取 accessToken
        const token = sessionStorage.getItem('token');
        const accessToken = token ? JSON.parse(token).accessToken : null;

        // 构建请求头
        const headers = {
          'Authorization': accessToken ? `${accessToken}` : ''
        };
        // 发送 DELETE 请求
        axios.delete(`/api/blogs/delete/${blogId}`, { headers })
            .then(response => {
              if (response.data.code === 20000) {
                this.$message.success(response.data.msg);
                // 成功后重新获取文章列表
                this.fetchUserArticles();
              } else {
                this.$message.error(response.data.msg);
              }
            })
            .catch(error => {
              console.error('删除文章出错', error);
              this.$message.error('删除失败，请重试');
            });
      }).catch(() => {
        // 取消删除
        this.$message.info('已取消删除');
      });
    },
    fetchUserArticles() {
      // 从 sessionStorage 中获取 accessToken
      const token = sessionStorage.getItem('token');
      const accessToken = token ? JSON.parse(token).accessToken : null;

      // 构建请求头
      const headers = {
        'Authorization': accessToken ? `${accessToken}` : ''
      };
      axios.get('api/blogs/list', {
        params: {
          pageNo: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        },
        headers: headers
      }).then(response => {
        const data = response.data.data;
        console.log(data);
        if (response.data.code == 20000) {
          this.userArticles = data.list;
          this.pagination.totalCount = data.totalCount;
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch(error => {
        console.error('请求错误', error);
      });
    },
    fetchUserInfo() {
      this.makeRequest('/api/users/home', 'get')
          .then(response => {
            if (response.data.code === 20000) {
              const userData = response.data.data;
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
          }).catch(error => {
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
        const headers = {...config.headers, Authorization: `${accessToken}`};
        return axios({url, method, data, headers});
      } else {
        // 如果没有accessToken，可以处理未登录的逻辑
        console.error('未找到accessToken');
      }
    },
  },

  mounted() {
    this.fetchUserInfo();
    // this.fetchUserArticles();
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

.contact-row {
  justify-content: space-between; /* 确保联系方式并排排列 */
  align-items: center; /* 垂直居中 */
}
.add-article-button {
  margin-left: auto; /* 将按钮推到最右边 */
}

</style>