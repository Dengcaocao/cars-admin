<template>
  <div class="login">
    <div class="login_warp flex">
      <!-- 左边图片 -->
      <div class="img">
        <img src="../../assets/img/timer.png" alt="" />
      </div>
      <!-- 右边表单 -->
      <div class="form flex f_center">
        <div class="form_warp">
          <!-- 标题 -->
          <div class="title flex f_around f_align">
            <div class="line"></div>
            <h4>租车管理后台</h4>
            <div class="line"></div>
          </div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm"
          >
            <el-form-item prop="username">
              <el-input
                type="text"
                placeholder="邮箱"
                v-model="ruleForm.username"
              >
                <i slot="prefix" class="iconfont icon-icon-mail"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                placeholder="密码"
                v-model="ruleForm.password"
              >
                <i slot="prefix" class="iconfont icon-mima"></i>
              </el-input>
            </el-form-item>
            <!-- 注册显示 -->
            <el-form-item
              prop="checkPassword"
              v-if="typeList[currentIndex] == '注册'"
            >
              <el-input
                type="password"
                placeholder="确认密码"
                v-model="ruleForm.checkPassword"
              >
                <i slot="prefix" class="iconfont icon-mima"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" class="code">
              <el-col :span="14">
                <el-input
                  placeholder="验证码"
                  v-model.number="ruleForm.code"
                ></el-input>
              </el-col>
              <el-col :span="8">
                <el-button type="success" class="btn" @click="getCode"
                  >获取验证码</el-button
                >
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="btn"
                @click="submit('ruleForm')"
                >{{ typeList[currentIndex] }}</el-button
              >
            </el-form-item>
          </el-form>
          <!-- 类型切换 -->
          <ul class="checkType flex">
            <li
              :class="{ active: currentIndex == index }"
              v-for="(item, index) in typeList"
              :key="index"
              @click="checkType(index)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Login, GetCode, Register } from "@/api/login.js";
import sha1 from "js-sha1";
export default {
  data() {
    // 邮箱
    const validateUsername = (rule, value, callback) => {
      const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (!reg.test(value)) {
        callback(new Error("邮箱格式错误!"));
      } else {
        callback();
      }
    };
    // 密码
    const validatePassword = (rule, value, callback) => {
      const patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (patrn.test(value)) {
        callback(new Error("不能包含特殊字符"));
      } else {
        callback();
      }
    };
    // 确认密码
    const validateCheckPassword = (rule, value, callback) => {
      if(this.typeList[this.currentIndex] == '登录') {
        return callback()
      }
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 验证码
    const checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空"));
      } else {
        callback();
      }
    };
    return {
      typeList: ["登录", "注册"],
      currentIndex: 0,
      ruleForm: {
        username: "1536698087@qq.com",
        password: "DW15826499212",
        checkPassword: "DW15826499212",
        code: "",
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        checkPassword: [{ validator: validateCheckPassword, trigger: "blur" }],
        code: [{ validator: checkCode, trigger: "blur" }],
      },
    };
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.typeList[this.currentIndex] == '登录' ? this.login() : this.register()
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    checkType(index) {
      this.resetForm("ruleForm");
      this.currentIndex = index;
    },
    // 获取验证码
    getCode() {
      GetCode({ username: this.ruleForm.username }).then((res) => {
        const { resCode, message } = res.data;
        if (resCode === 0) {
          const title = message.split("，")[0];
          const code = message.split("：")[1];
          this.$notify({
            title,
            message: code,
            type: "success",
          });
        } else {
          this.$notify({
            title: "提示",
            message,
            type: "success",
          });
        }
      });
    },
    // 登录
    login() {
      // 对密码进行加密
      let form = {
        username: this.ruleForm.username,
        password: sha1(this.ruleForm.password),
        code: this.ruleForm.code,
      };
      Login(form).then((res) => {
        const {data,message,resCode} = res.data
        if(resCode === 0) {
          this.resetForm("ruleForm");
        }
        this.$notify({
          title: message,
          message: '',
          type: resCode == 0 ? "success" : "error"
        });
      });
    },
    // 注册
    register() {
      let form = {
        username: this.ruleForm.username,
        password: this.ruleForm.password,
        code: this.ruleForm.code,
      }
      Register(form).then(res => {
        const {resCode,data,message} = res.data
        if(resCode == 0) {
          this.resetForm("ruleForm");
          this.currentIndex = 0
        }
        this.$notify({
          title: message,
          message: '',
          type: resCode == 200 ? "error" : "success",
        });
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.login {
  height: 100vh;
  background-color: rgba(0, 0, 255, 0.1);
}
.login_warp {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 800px;
  height: 400px;
  border-radius: 8px;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  // 标题
  .title {
    padding: 20px 0;
    .line {
      width: 60px;
      height: 2px;
    }
    .line:nth-of-type(1) {
      background-image: linear-gradient(to right, #fff, #666);
    }
    .line:nth-of-type(2) {
      background-image: linear-gradient(to left, #fff, #666);
    }
    h4 {
      font-size: 22px;
      color: #666;
      font-weight: 500;
    }
  }
  .img {
    img {
      width: 371px;
    }
  }
  // 表单
  .form {
    position: relative;
    flex: 1;
    box-sizing: border-box;
    padding: 0 60px;
  }
}
.code /deep/ .el-form-item__content .el-col:nth-of-type(2) {
  float: right;
}
// 按钮样式
.btn {
  width: 100%;
}
// 类型
.checkType {
  position: absolute;
  right: 60px;
  bottom: 6px;
}
.checkType li {
  cursor: pointer;
  padding: 6px 10px;
  color: $themeColor-text;
  border-bottom: 1px solid transparent;
}
.checkType .active {
  transition: 0.2s;
  border-bottom: 1px solid #409eff;
}
</style>