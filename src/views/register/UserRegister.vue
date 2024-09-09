<template xmlns:el-col="http://www.w3.org/1999/html">
  <div>
    <el-card class="box-card">
      <h2>注册</h2>
      <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-position="left"
          label-width="80px"
          class="demo-ruleForm">
        <el-form-item label="账号" prop="account">
          <el-input v-model="ruleForm.account"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="ruleForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
              type="password"
              v-model="ruleForm.password"
              auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
              type="password"
              v-model="ruleForm.checkPass"
              auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-row type="flex" align="middle">
            <el-input v-model="ruleForm.code">
            </el-input>
            <el-button ref="getCode" :disabled="count > 0" type="primary" @click="getCode">
              {{ count > 0 ? count + '秒后重新获取' : '获取验证码' }}
            </el-button>
          </el-row>

        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
      </el-form>

      <div class="btnGroup">
        <el-button type="primary" @click="submitForm('ruleForm')" v-loading="loading">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="goBack">返回登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        account: "",
        nickName: "",
        password: "",
        checkPass: "",
        email: "",
        code: "",
        phone: ""
      },
      rules: {
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}
        ],
        nickName: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
        ],
        password: [
          {required: true, validator: validatePass, trigger: 'blur'},
          {message: '长度在 6 到 18 个字符', trigger: 'blur'}
        ],
        checkPass: [
          {required: true, validator: validatePass2, trigger: 'blur'},
          {message: '长度在 6 到 18 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {min: 6, max: 6, message: '长度为6个字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {type: 'phone', message: '长度为11个字符', trigger: 'blur'}
        ]
      },
      count: 0,
      TIME_COUNT: 120,
      timer: null,
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        this.loading = true; //显示提交加载动画
        if (valid) {
          let _this = this;
          this.axios({
            url: "/api/users/register",
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              account: _this.ruleForm.account,
              nickName: _this.ruleForm.nickName,
              password: _this.ruleForm.password,
              checkPass: _this.ruleForm.checkPass,
              email: _this.ruleForm.email,
              code: _this.ruleForm.code,
              phone: _this.ruleForm.phone
            },
          }).then((res) => {
            if (res.data.code === "20000") {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
              this.$router.push('/login');
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
            _this.loading = false;
            console.log(res);
          })
        } else {
          console.log("error submit!!");
          this.loading = false;
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    goBack() {
      this.$router.go(-1);
    },
    getCode() {
      let _this = this;
      this.axios({
        url: "/api/users/getCode",
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          email: _this.ruleForm.email
        },
      }).then((res) => {
        if (res.data.code === 20000) {
          this.$message({
            message: res.data.msg,
            type: "success",
          });
          this.count = this.TIME_COUNT;
          this.timer = setInterval(() => {
            if (this.count > 0) {
              this.count--; // 倒计时递减
              this.$refs.getCode.$el.innerText = this.count + '秒后重新获取'; // 更新按钮文本
            } else {
              clearInterval(this.timer); // 倒计时结束，清除定时器
              this.timer = null;
              this.count = 0; // 重置倒计时秒数
              this.$refs.getCode.$el.innerText = '获取验证码'; // 重置按钮文本
              this.$refs.getCode.disabled = false; // 重新启用按钮
            }
          }, 1000);
          this.$refs.getCode.disabled = true; //禁用按钮，倒计时开始
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
        this.loading = false;
        console.log(res);
      }).catch(error => {
        console.error('请求错误', error);
        this.loading = false;
      })
    }
  },
}
</script>

<style scoped>
.box-card {
  margin: auto auto;
  width: 400px;
}

.login-from {
  margin: auto auto;
}
</style>