<template>
  <el-dialog title="编辑CODE" :visible.sync="showDialog">
    <el-form :model="formdata" :rules="rules" label-width="180px" req ref="ruleForm">
      <el-form-item label="CODE码" prop="code">
        <el-input class="textInput" v-model="formdata.code" />
      </el-form-item>
      <el-form-item label="提示文案" prop="name">
        <el-input class="textInput" v-model="formdata.name" />
      </el-form-item>
      <el-form-item label="备注和策略" prop="remark">
        <el-input class="textInput" type="textarea" v-model="formdata.remark" />
      </el-form-item>
      <el-form-item label="紧急程度" prop="state">
        <el-select v-model="formdata.state" placeholder="请选择">
          <el-option label="普通" :value="0"></el-option>
          <el-option label="紧急" :value="1"></el-option>
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
import { updateCode } from '@/api/code';

export default {
  data() {
    return {
      showDialog: false,
      formdata: this.createForm(),
      rules: {
        code: [{ required: true, message: 'code不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '文案不能为空', trigger: 'blur' }],
      },
    };
  },
  methods: {
    createForm() {
      return {
        id: undefined,
        code: '',
        name: '',
        remark: '',
        state: 0,
      };
    },
    show(data) {
      console.log(data);
      if (data) {
        this.formdata = { id: data.id, code: data.code, name: data.name, remark: data.remark };
      }
      this.showDialog = true;
    },
    clsoe() {
      this.showDialog = false;
      this.formdata = this.createForm();
    },
    async submit() {
      try {
        await updateCode(this.formdata);
        this.$notify.success({
          message: '已提交',
        });
        this.$emit('onSuccess');
        this.clsoe();
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
  },
};
</script>
