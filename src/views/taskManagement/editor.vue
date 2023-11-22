<template>
  <el-dialog title="创建任务" :visible.sync="showDialog">
    <el-form :model="formdata" :rules="rules" label-width="180px" req ref="ruleForm">
      <el-form-item label="任务名称" prop="name">
        <el-input :disabled="isEdit" class="textInput" v-model="formdata.name" />
      </el-form-item>
      <el-form-item label="检测地址" prop="url">
        <el-input :disabled="isEdit" class="textInput" type="textarea" v-model="formdata.url" />
        <template>多个地址用英文,隔开</template>
      </el-form-item>
      <el-form-item prop="time">
        <template slot="label">
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              0 10 * * * * 每小时的第10分钟<br />
              0 */12 0-2 * * * 零点到两点每12分钟<br />
              0 30 11 * * 1-5 周一至周五的 11:30
            </div>
            <span>执行时间<i class="el-icon-question"></i></span>
          </el-tooltip>
        </template>
        <el-input class="textInput" v-model="formdata.time" placeholder="请输入Cron表达式" />
      </el-form-item>
      <el-form-item label="浏览器类型" prop="browser">
        <el-select v-model="formdata.browser" placeholder="请选择">
          <el-option label="pc" :value="1"></el-option>
          <el-option label="移动端浏览器" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="变量">
        <el-select multiple v-model="formdata.variable" placeholder="请选择">
          <el-option v-for="item in options" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="clsoe">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { modifyTask } from '@/api/task';
import { getAllVar } from '@/api/variable';
import { isValidCron } from 'cron-validator';

export default {
  data() {
    var validateCron = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入执行时间'));
      }
      if (isValidCron(value) || isValidCron(value, { seconds: true })) {
        callback();
      } else {
        callback(new Error('请输入正确的Cron格式的执行时间'));
      }
    };
    return {
      showDialog: false,
      isEdit: false,
      formdata: {
        id: 0,
        url: '',
        token: '',
        time: '',
        name: '',
        browser: 1,
      },
      options: [],
      rules: {
        name: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
        url: [{ required: true, message: 'url不能为空', trigger: 'blur' }],
        time: [{ required: true, trigger: 'blur', validator: validateCron }],
        browser: [{ required: true, message: '请选择浏览器类型', trigger: 'change' }],
      },
    };
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    show(data) {
      console.log(data);
      if (data) {
        this.isEdit = true;
        this.formdata = {
          id: data.id,
          url: data.url,
          token: data.token,
          time: data.time,
          name: data.name,
          browser: data.browser,
          variable: data.variable,
        };
      } else {
        this.isEdit = false;
        this.formdata = {
          id: 0,
          url: '',
          token: '',
          time: '',
          name: '',
          browser: '',
          variable: '',
        };
      }
      this.showDialog = true;
    },
    clsoe() {
      this.showDialog = false;
    },
    async getOptions() {
      const res = await getAllVar();
      this.options = res;
    },
    async submit() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          try {
            const data = await modifyTask(this.formdata);
            console.log(data);
            this.showDialog = false;
            this.$emit('onSuccess');
          } catch (error) {
            this.$message.error(error.message);
            console.log('ss:', error.message);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>
<style scoped>
.uploadimg {
  max-height: 200px;
}
.img-uploader {
  width: 200px;
  height: 200px;
  border: solid 1px #ccc;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.img-uploader-icon {
  font-size: 20px;
}
.tag_item {
  margin-bottom: 10px;
}
.tag_text {
  width: 500px;
}
.tag_btn {
  margin-left: 20px;
}
</style>
