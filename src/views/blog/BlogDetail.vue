<template>
  <div className="blog-detail">
    <el-button type="danger" class="back-button-right-top" @click="back">返回</el-button>
    <h1>{{ blogData.blogTitle }}</h1>
    <img :src="blogData.thumbnail" alt="Thumbnail" v-if="blogData.thumbnail">
    <p><strong>ID:</strong> {{ blogData.blogId }}</p>
    <p><strong>标题:</strong> {{ blogData.blogTitle }}</p>
    <p><strong>概要:</strong> {{ blogData.blogDesc }}</p>
    <p><strong>内容:</strong> {{ blogData.blogContent }}</p>
    <p><strong>分类:</strong> {{ blogData.categoryName }}</p>
    <p><strong>标签:</strong> {{ blogData.blogTags }}</p>
    <p><strong>创建时间:</strong> {{ blogData.creatTime}}</p>
    <p><strong>更新时间:</strong> {{ blogData.updateTime}}</p>
    <p><strong>缩略图:</strong> {{ blogData.thumbnail}}</p>
    <p><strong>状态:</strong> {{ getStatusText(blogData.blogStatus) }}</p>
    <p><strong>是否置顶:</strong> {{ getIsTopText(blogData.isTop) }}</p>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BlogDetail',
  data() {
    return {
      blogData: {
        blogId: null,
        blogTitle: '',
        categoryName: '',
        creatTime: '',
        updateTime: '',
        blogDesc: '',
        blogContent: '',
        blogTags: '',
        thumbnail: '',
        isTop: null,
        blogStatus: null,
      },
    };
  },
  created() {
    this.fetchBlogDetails(this.$route.params.id);
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    fetchBlogDetails(id) {

      // 从 sessionStorage 中获取 accessToken
      const token = sessionStorage.getItem('token');
      const accessToken = token ? JSON.parse(token).accessToken : null;

      // 构建请求头
      const headers = {
        'Authorization': accessToken ? `${accessToken}` : ''
      };
      axios.get(`/api/blogs/detail/${id}`,
          {headers: headers})
          .then(response => {
            console.log(response.data);
            if (response.data.code === 20000) {
              this.blogData = response.data.data;
            } else {
              // 处理错误情况
              console.error('获取博客详情失败');
            }
          })
          .catch(error => {
            console.error('请求博客详情出错', error);
          });
    },
    getStatusText(status) {
      const statusMap = {0: '草稿', 1: '公开', 2: '私密'};
      return statusMap[status] || '未知状态';
    },
    getIsTopText(isTop) {
      return isTop === 1 ? '是' : '否';
    }
  },
  // 监听路由变化，如果路由参数变化，则重新获取数据
  watch: {
    '$route'(to, from) {
      if (to.params.id !== from.params.id) {
        this.fetchBlogDetails(to.params.id);
      }
    }
  }
};
</script>

<style scoped>
.blog-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.blog-detail img {
  max-width: 100%;
  height: auto;
}
.back-button-right-top {
  position: absolute;
  top: 10px; /* 根据需要调整 */
  right: 10px; /* 根据需要调整 */
  z-index: 1000; /* 确保按钮在最上层 */
}
</style>