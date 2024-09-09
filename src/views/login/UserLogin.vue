
<template>
  <div>
    <el-card class="box-card">
      <h2>登录</h2>
      <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-position="left"
          label-width="70px"
          class="login-from"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button type="primary" @click="submitForm('ruleForm')" v-loading="loading">登录</el-button>

        <router-link to="/register">
          <el-button style="margin-left:10px">注册</el-button>
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      ruleForm: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          {required: true, message: "邮箱不能为空！", trigger: "blur"},
        ],
        password: [
          {required: true, message: "密码不能为空！", trigger: "blur"},
        ],
      },
      loading: false,//是否显示加载动画
    };
  },
  methods: {
    submitForm(formName) {
      //验证输入邮箱以及密码是否有效
      this.$refs[formName].validate((valid) => {
        //点击登陆后，展示加载动画
        this.loading = true;
        //如果校验通过，则发送请求给后端登录接口
        if (valid) {
          let _this = this;
          //使用axios将登陆信息发送到后端
          this.axios({
            url: "/api/users/login",                  //请求地址
            method: "post",                           //请求方法
            headers: {
              "Content-Type": "application/json",     //请求头
            },
            data: {
              email: _this.ruleForm.email,
              password: _this.ruleForm.password,
            },
          }).then((res) => {        //当收到后端响应时执行括号内代码，其中res为相应信息
            if (res.data.code === 20000) { //当相应的编码为20000时，说明登陆成功
              //将相应的accessToken和refreshToken存储到sessionStorage中
              sessionStorage.setItem("token", JSON.stringify(res.data.data));
              console.log(sessionStorage.getItem("token"))
              //跳转页面到首页
              this.$router.push('/home');
              //显示后端相应的成功信息
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              //显示响应失败的信息
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
            //后端响应信息后，关闭登录按钮加载动画
            _this.loading = false;
            console.log(res);
          });
        } else {  //如果邮箱和密码有一个没填，则提示，并不用向后端发送请求
          console.log("error submit!!");
          this.loading = false;
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
/* 设置登陆面板居中  宽度为400px */
.box-card {
  margin: auto auto;
  width: 400px;
}

.login-from {
  margin: auto auto;
}
</style>