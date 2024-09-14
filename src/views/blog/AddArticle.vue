<template>
  <div class="add-article">
    <el-button type="danger" class="back-button-right-top" @click="back">返回</el-button>
    <el-form ref="articleForm" :model="article" label-width="120px">
      <el-form-item label="博客标题" :rules="[{ required: true, message: '请输入博客标题', trigger: 'blur' }]">
        <el-input v-model="article.blogTitle"></el-input>
      </el-form-item>
      <el-form-item label="分类" :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]">
        <el-input v-model="article.categoryName"></el-input>
      </el-form-item>
      <el-form-item label="摘要" :rules="[{ required: true, message: '请输入摘要', trigger: 'blur' }]">
        <el-input type="textarea" v-model="article.blogDesc"></el-input>
      </el-form-item>
      <el-form-item label="内容" :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]">
        <el-input type="textarea" v-model="article.blogContent"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="article.blogTags"></el-input>
      </el-form-item>
      <el-form-item label="是否置顶">
        <el-switch v-model="article.isTop"></el-switch>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="article.blogStatus" :placeholder="'请选择状态'">
          <el-option label="草稿" :value="3"></el-option>
          <el-option label="公开" :value="1"></el-option>
          <el-option label="私密" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitArticle">创建文章</el-button>
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
        blogStatus: 1, // 默认为公开状态
      },
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    submitArticle() {
      this.$refs.articleForm.validate((valid) => {
        if (valid) {
          // 从 sessionStorage 中获取 accessToken
          const token = sessionStorage.getItem('token');
          const accessToken = token ? JSON.parse(token).accessToken : null;

          // 构建请求头
          const headers = {
            'Authorization': accessToken ? `${accessToken}` : ''
          };
          // 转换 isTop 为整数
          this.article.isTop = this.article.isTop ? 1 : 0;

          // 发送请求到后端 API 创建博客
          axios.post('/api/blogs/save', this.article, { headers })
              .then(response => {
                if (response.data.code === 20000) {
                  this.$message.success(response.data.msg);
                  this.$router.back();
                } else {
                  this.$message.error(response.data.msg);
                }
              })
              .catch(error => {
                console.error('创建文章出错', error);
                this.$message.error('创建失败，请重试');
              });
        } else {
          console.log('表单验证失败');
          this.$message.error('请检查表单');
          return false;
        }
      });
    },
  }
};
</script>

<style scoped>
.add-article {
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