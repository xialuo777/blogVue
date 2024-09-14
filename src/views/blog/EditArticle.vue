<template>
  <div class="edit-article">
    <el-button type="danger" class="back-button-right-top" @click="back">返回</el-button>
    <el-form ref="articleForm" :model="article" label-width="120px">
      <el-form-item label="博客标题">
        <el-input v-model="article.blogTitle"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-input v-model="article.categoryName"></el-input>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input type="textarea" v-model="article.blogDesc"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input type="textarea" v-model="article.blogContent"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="article.blogTags"></el-input>
      </el-form-item>
      <el-form-item label="是否置顶">
        <el-switch v-model="isTopValue" @change="toggleIsTop"></el-switch>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="article.blogStatus">
          <el-option label="草稿" :value="0"></el-option>
          <el-option label="公开" :value="1"></el-option>
          <el-option label="私密" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitArticle">更新文章</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      article: {
        blogTitle: '',
        categoryName: '',
        blogDesc: '',
        blogContent: '',
        blogTags: '',
        thumbnail: '',
        isTop: 0,
        blogStatus: 0, // 默认为草稿状态
      },
      isTopValue: false, // 用于el-switch的布尔值
    };
  },
  created() {
    this.fetchArticleInfo();
  },
  watch: {
    isTopValue(newValue) {
      this.article.isTop = newValue ? 1 : 0;
    },
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    fetchArticleInfo() {

      // 从 sessionStorage 中获取 accessToken
      const token = sessionStorage.getItem('token');
      const accessToken = token ? JSON.parse(token).accessToken : null;

      // 构建请求头
      const headers = {
        'Authorization': accessToken ? `${accessToken}` : ''
      };
      const articleId = this.$route.params.id;
      axios.get(`/api/blogs/detail/${articleId}`, { headers })
          .then(response => {
            if (response.data.code === 20000) {
              const data = response.data.data;
              this.article = data;
              this.isTopValue = data.isTop === 1;
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            console.error('请求文章信息出错', error);
            this.$message.error('获取文章信息失败');
          });
    },
    toggleIsTop() {
      // 切换置顶状态
      this.article.isTop = this.isTopValue ? 1 : 0;
    },
    submitArticle() {

      // 从 sessionStorage 中获取 accessToken
      const token = sessionStorage.getItem('token');
      const accessToken = token ? JSON.parse(token).accessToken : null;

      // 构建请求头
      const headers = {
        'Authorization': accessToken ? `${accessToken}` : ''
      };

      axios.put(`/api/blogs/update/${this.$route.params.id}`, this.article, { headers })
          .then(response => {
            if (response.data.code === 20000) {
              this.$message.success(response.data.msg);
              this.$router.back();
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            console.error('更新文章出错', error);
            this.$message.error('更新失败，请重试');
          });
    }
  }
};
</script>

<style scoped>
.edit-article {
  max-width: 800px;
  margin: 20px auto;
}

.el-form-item {
  margin-bottom: 20px;
}
.back-button-right-top {
  position: absolute;
  top: 10px; /* 根据需要调整 */
  right: 10px; /* 根据需要调整 */
  z-index: 1000; /* 确保按钮在最上层 */
}
</style>