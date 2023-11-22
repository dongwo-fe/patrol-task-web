<template>
    <div class="recordBox" v-if="list.length" :style="gridStyle">
      <div :class="item.browser === 1 ? 'recordItem pcWidth' : 'recordItem'" v-for="item in list" :key="item.id">
        <el-tooltip class="item" effect="dark" content="点击复制" placement="top">
          <div class="taskName" :data-clipboard-text="item.url" @click="onCopy">{{ item.url }}</div>
        </el-tooltip>
        <el-image
          class="img"
          :src="item.imgList[0]"
          fit="cover"
          :preview-src-list="item.imgList"
          fullscreen
          >
        </el-image>
        <div class="imgInfo">
          <p>{{ item.name }}</p>
          <p class="flexbox">
            {{ item.createdAt | dateFormat() }}
            <el-tag size="mini">{{ item.browser === 1 ? 'PC端' : '移动端' }}</el-tag>
          </p>
          <div class="flexbox h20">
            <p :class="item.isError ? 'tag error': 'tag success'">{{ item.isError ? '出错' : '成功' }}</p>
            <el-popover
              placement="top-start"
              width="650"
              trigger="hover">
              <div class="info">
                <p><span class="label">任务id：</span><span class="word">{{ item.taskId }}</span></p>
                <p><span class="label">巡检地址：</span><span class="word">{{ item.url }}</span></p>
                <div v-if="item.isError">
                  <div v-for="(errItem, index) in item.errorInfo" :key="index" class="erroritem">
                    <p>错误类型：{{ errItem.type }}</p>
                    <p>错误信息：{{ errItem.errorInfo }}</p>
                  </div>
                </div>
              </div>
              <img class="pointer" slot="reference" src="https://ossprod.jrdaimao.com/ac/1695644372019_60x48.png" width="30" height="24" alt="">
            </el-popover>
            </div>
        </div>
      </div>
    </div>
    <div v-else class="recordBox">
      <span class="emptyText">暂无数据</span>
    </div>
</template>

<script>
import ClipboardJS from 'clipboard';
export default {
    name: 'DetailsList',
    props: {
        list: {
            type: Array,
            default() {
                return [];
            },
        },
        browser: {
            type: Number,
            default: 1,
        },
    },
    data() {
      return {
        previewVisible: false,
        previewSrc: '',
        imgWidth: '100%',
      };
    },
    computed: {
      gridStyle() {
        const columnCount = this.browser === 1 ? 4 : 6; // 列数
        const gap = 20; // 间距
        return `grid-template-columns: repeat(${columnCount}, 1fr); grid-gap: ${gap}px;`;
      },
    },
    created() {
      new ClipboardJS('.taskName');
    },
    methods: {
      handlePreview(data) {
        if (data.browser !== 1) {
          this.imgWidth = '375px';
        } else {
          this.imgWidth = '100%';
        }
        this.previewVisible = true;
        this.previewSrc = data.imgList[0];
      },
      onCopy() {
        this.$message.success('已复制');
      },
    },
};
</script>

<style lang="scss" scoped>
.recordBox{
  display: grid;
  border: 1px solid #EBEEF5;
  padding: 20px;
}
.recordItem{
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px 8px rgba(0,0,0,.05);
  position: relative;
  transition: all .2s ease-in-out;
  height: 445px;
  position:relative;
  box-sizing: border-box;
  overflow: hidden;
  .img{
    width:100%;
    height: 445px;
    border-radius: 10px;
    position: relative;
  }
  .imgInfo{
    position:absolute;
    bottom: 0;
    left:0;
    width: 100%;
    background: #fff;
    color: #3d3d3d;
    font-size: 14px;
    padding: 0 10px;
    box-sizing: border-box;
    z-index:5;
    border-radius: 6px;
    border-top: 1px solid #dadfe6;
    p{
      height: 20px;
      margin: 10px 0;
    }
    .flexbox{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .h20{
      height: 20px;
      margin: 10px 0;
    }
    .tag{
      border-radius: 6px;
      color: #fff8f8;
      font-size: 12px;
      padding: 3px 11px;
      width: 170px;
    }
    .error{
      background: linear-gradient(90deg,#F56C6C,hsla(47,97%,88%,0));
    }
    .success{
      background: linear-gradient(90deg,#67C23A,hsla(47,97%,88%,0));
    }
  }
  .taskName{
    cursor: pointer;
    border-radius: 8px 8px 0 0;
    background: #d1e0ff;
    color: #202d40;
    font-size: 14px;
    overflow: hidden;
    padding: 0 10px;
    position: absolute;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    z-index: 20;
    height: 34px;
    line-height: 34px;
  }
}
.recordItem:hover{
  box-shadow: 0px 4px 16px 4px rgba(40, 140, 255, 0.5);
  // transform: scale(1.02);
}
.pointer{
  cursor: pointer;
}
/* .pcWidth{
  width: 500px;
  .img{
    width: 500px;
    height: 445px;
  }
  .imgInfo{
    width: 500px;
  }
  .popBox{
    width: 500px;
  }
} */
.emptyText{
  color: #909399;
  line-height: 60px;
  font-size: 14px;
}
.info{
  width: 100%;
  height: 600px;
  overflow: auto;
  font-size: 14px;
  color: #909399;
  box-sizing: border-box;
  padding: 10px;
  p{
    margin-bottom: 10px;
    line-height: 24px;
    display: flex;
    .label{
      flex: 0 0 70px;
    }
    .word{
      flex: 1;
      word-break: break-all;
      white-space: pre-wrap;
    }
  }
  .erroritem{
    border-top: 1px solid #dadfe6;
  }
}
</style>
