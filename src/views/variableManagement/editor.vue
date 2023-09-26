<template>
  <el-dialog title="新增变量" :visible.sync="showDialog">
    <el-form :model="formdata" :rules="rules" label-width="180px" req ref="ruleForm">
      <el-form-item
				label="变量名称"
        prop="name"
			>
        <el-input class="textInput" v-model="formdata.name" :disabled="isUpdate" />
      </el-form-item>
      <el-form-item
        label="变量类型"
        prop="type"
      >
        <el-select v-model="formdata.type" placeholder="类型" clearable style="width: 200px" class="filter-item">
          <el-option label="localstorage " :value="1" />
          <el-option label="sessionstorage" :value="2" />
          <el-option label="cookie" :value="3" />
          <el-option label="head头" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="key"
        prop="key"
      >
        <el-input class="textInput" v-model="formdata.key" />
      </el-form-item>
      <el-form-item
        label="value"
        prop="value"
      >
        <el-input class="textInput" v-model="formdata.value" />
      </el-form-item>
      <template v-if="formdata.type === 3">
        <el-form-item
          label="cookieDomain"
        >
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
        cookieDomain: '',
      },
      rules: {
        name: [
          { required: true, message: '变量名称不能为空', trigger: 'blur',}
        ],
        type: [
          { required: true, message: '变量类型不能为空', trigger: 'change' }
        ],
        key: [
          { required: true, message: 'key不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: 'value不能为空', trigger: 'blur' }
        ],
      }
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

</style>
