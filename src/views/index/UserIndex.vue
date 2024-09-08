
<template>

  <div>
    <!-- 搜索区域 -->
    <div class="filter-container sousuo">
      <el-input v-model="listQuery.nickName" placeholder="根据昵称查询" style="width: 200px;"/>
      <el-button type="primary" icon="el-icon-search" @click="searchData">
        查询
      </el-button>
    </div>

    <!-- 用户列表 -->
    <el-table v-loading="listLoading" :data="userList" element-loading-text="Loading" border stripe fit highlight-current-row>
      <el-table-column label="用户ID">
        <template v-slot="scope">
          {{ scope.row.userId }}
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template v-slot="scope">
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网址" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.website }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
          background
          :current-page="pagination.currentPage"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        uname: "",
        uid: null,
      },
      pagination: {
        currentPage: 1, //初始页
        pageSize: 10, //每页的数据
        totalCount: 0 //总数据
      },
      userList: [],
      listLoading: false,
      addUserFormVisible: false, // 控制添加用户的表单是否可见
      // 搜索条件
      listQuery: {
        nickName: "",
        pageNum: 1,
        pageSize: 10
      },
      accessToken: "", // 存储accessToken
    };
  },
  methods: {
    // 改变分页的每页的页数
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.listQuery.pageSize = size;
      this.getUserList();
    },
    // 改变分页的当前页面
    handleCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.listQuery.pageNum = currentPage;
      this.getUserList();
    },
    // 查询
    searchData() {
      this.listQuery.pageNum = 1;
      this.pagination.currentPage = 1;
      this.getUserList();
    },
    // 获取用户列表
/*    getALLUserList() {
      this.listLoading = true;
      axios.get("/api/users/getUsers", {
        params: {
          pageNo: this.listQuery.pageNum,
          pageSize: this.listQuery.pageSize
        }
      }).then(response => {
        this.listLoading = false;
        if (response.data.code === 20000) {
          this.userList = response.data.data.list; // 更新数据列表
          console.log(response.data)
          this.pagination.totalCount = response.data.data.totalCount; // 更新总数据量
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch(error => {
        this.listLoading = false;
        console.error('请求错误', error);
      });
    },*/
    getUserList() {
      this.listLoading = true;
      const url = this.listQuery.nickName ? `/api/users/${this.listQuery.nickName}` : "/api/users/getUsers";
      // 从 sessionStorage 中获取 accessToken
      const token = sessionStorage.getItem('token');
      const accessToken = token ? JSON.parse(token).accessToken : null;

      // 构建请求头
      const headers = {
        'Authorization': accessToken ? `Bearer ${accessToken}` : ''
      };


      axios.get(url, {
        params: {
          pageNo: this.listQuery.pageNum,
          pageSize: this.listQuery.pageSize
        },
        headers: headers // 将请求头添加到请求中
      }).then(response => {
        this.listLoading = false;
        if (response.data.code === 20000) {
          this.userList = response.data.data.list; // 更新数据列表
          this.pagination.totalCount = response.data.data.totalCount; // 更新总数据量
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch(error => {
        this.listLoading = false;
        console.error('请求错误', error);
      });
    },
  },
  created() {
  },
  logout(){
    // 移除本地用户登录信息
    sessionStorage.removeItem('token');
    // 跳转页面到登录页
    this.$router.push('/login');
  },
  mounted() {
  },
};

</script>