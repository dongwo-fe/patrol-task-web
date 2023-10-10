<template>
  <el-dialog title="新增变量" :visible.sync="showDialog">
    <el-form :model="formdata" :rules="rules" label-width="180px" req ref="ruleForm">
      <el-form-item label="变量名称" prop="name">
        <el-input class="textInput" v-model="formdata.name" :disabled="isUpdate" />
      </el-form-item>
      <el-form-item label="变量类型" prop="type">
        <el-select v-model="formdata.type" placeholder="类型" clearable style="width: 200px" class="filter-item">
          <el-option label="localstorage " :value="1" />
          <el-option label="sessionstorage" :value="2" />
          <el-option label="cookie" :value="3" />
          <el-option label="head头" :value="4" />
        </el-select>
        <el-checkbox class="form-item-lcheck" v-model="formdata.isScript">是否脚本</el-checkbox>
      </el-form-item>
      <el-form-item label="key" prop="key">
        <el-input class="textInput" v-model="formdata.key" />
      </el-form-item>
      <el-form-item v-show="!formdata.isScript" label="value" prop="value">
        <el-input class="textInput" v-model="formdata.value" />
      </el-form-item>
      <el-form-item v-show="formdata.isScript" label="脚本" prop="scripts">
        <el-input class="textInput" v-model="formdata.scripts" type="textarea" :rows="7" placeholder="请输入内容,结果使用最后一行的返回值" />
      </el-form-item>
      <template v-if="formdata.type === 3">
        <el-form-item label="cookieDomain">
          <el-input class="textInput" v-model="formdata.cookieDomain" />
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="clsoe">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { modifyVariable } from '@/api/variable';

export default {
  data() {
    return {
      showDialog: false,
      isUpdate: false,
      formdata: {
        id: 0,
        name: '',
        type: '',
        key: '',
        value: '',
        scripts: '',
        cookieDomain: '',
        isScript: false,
      },
      rules: {
        name: [{ required: true, message: '变量名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '变量类型不能为空', trigger: 'change' }],
        key: [{ required: true, message: 'key不能为空', trigger: 'blur' }],
      },
    };
  },
  methods: {
    show(data) {
      if (data) {
        this.formdata = {
          id: data.id,
          name: data.name,
          type: data.type,
          key: data.key,
          value: data.value,
          isScript: data.isScript,
          scripts: data.scripts,
          cookieDomain: data.cookieDomain,
        };
        this.isUpdate = true;
      } else {
        this.formdata = {
          id: 0,
          name: '',
          type: '',
          key: '',
          value: '',
          cookieDomain: '',
          scripts: '',
          isScript: false,
        };
      }
      this.showDialog = true;
    },
    clsoe() {
      this.showDialog = false;
    },
    async submit() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          try {
            const data = await modifyVariable(this.formdata);
            console.log(data);
            this.showDialog = false;
            this.$emit('onSuccess');
          } catch (error) {
            this.$message.error(error.message);
            console.log(error.message);
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
.form-item-lcheck {
  margin-left: 30px;
}
</style>
