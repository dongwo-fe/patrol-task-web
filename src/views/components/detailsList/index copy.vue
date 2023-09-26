<template>
    <div class="recordBox" v-if="list.length">
      <div :class="item.browser === 1 ? 'recordItem pcWidth' : 'recordItem'" v-for="item in list" :key="item.id">
        <el-image
          class="img"
          :src="item.imgList[0]"
          fit="cover"
          :lazy="true">
        </el-image>
        <div :class="item.isError ? 'imgInfo error': 'imgInfo'">
          <p>{{ item.name }}</p>
          <p>{{ item.createdAt | dateFormat() }}</p>
        </div>
        <div class="popBox" @click="handlePreview(item)">
          <div class="info">
            <p><span class="label">任务名称：</span><span class="word">{{ item.name }}</span></p>
            <p><span class="label">任务id：</span><span class="word">{{ item.taskId }}</span></p>
            <p><span class="label">巡检时间：</span><span class="word">{{ item.createdAt | dateFormat() }}</span></p>
            <p><span class="label">巡检地址：</span><span class="word">{{ item.url }}</span></p>
            <p><span class="label">浏览器类型：</span><span class="word">{{ item.browser === 1 ? 'PC端' : '移动端' }}</span></p>
            <p v-if="item.isError"><span class="label">错误类型：</span><span class="word">{{ item.type }}</span></p>
            <p v-if="item.isError"><span class="label">错误信息：</span><span class="word">{{ item.errorInfo }}</span></p>
          </div>
        </div>
      </div>
      <el-dialog :visible.sync="previewVisible" width="60%" custom-class="preDialog">
        <img class="preImg" :src="previewSrc" :style="'width:'+imgWidth+'; height: auto;'">
      </el-dialog>
    </div>
    <div v-else class="recordBox">
      <span class="emptyText">暂无数据</span>
    </div>
</template>

<script>
export default {
    name: 'DetailsList',
    props: {
        list: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    data() {
      return {
        previewVisible: false,
        previewSrc: '',
        imgWidth: '100%',
      };
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
    },
};
</script>

<style lang="scss" scoped>
.recordBox{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border: 1px solid #EBEEF5;
  padding: 20px;
}
.recordItem{
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px 8px rgba(0,0,0,.05);
  margin-bottom: 20px;
  margin-left: 20px;
  position: relative;
  transition: all .2s ease-in-out;
  width: 250px;
  height: 445px;
  position:relative;
  .img{
    width: 255px;
    height: 445px;
    border-radius: 8px;
  }
  .imgInfo{
    position:absolute;
    bottom: 0;
    left:0;
    width: 255px;
    height: 85px;
    background: rgba(225, 243, 216, 0.5);
    color: #3d3d3d;
    font-size: 14px;
    padding: 0 10px;
    box-sizing: border-box;
    z-index:5;
  }
  .popBox{
    cursor: pointer;
    position:absolute;
    bottom: 0;
    left:0;
    z-index:10;
    width: 255px;
    overflow: hidden;
    height: 445px;
    background: linear-gradient(180deg,rgba(0,0,0,.5),transparent);
    opacity: 0;
    border-radius: 8px;
    .info{
      width: 100%;
      position: absolute;
      border-radius: 8px;
      bottom: 0;
      z-index:15;
      background: #fff;
      font-size: 14px;
      color: #909399;
      box-sizing: border-box;
      padding: 10px;
      transition: all 0.4s ease-in-out;
      height: 0;
      p{
        margin-bottom: 10px;
        line-height: 24px;
        display: flex;
        .label{
          flex: 0 0 90px;
        }
        .word{
          flex: 1;
          word-break: break-all;
          white-space: pre-wrap;
        }
      }
    }
  }
  .error{
    background: rgba(253, 226, 226, 0.5);
  }
}
.pcWidth{
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
}
.recordItem:hover{
  transform: scale(1.05);
  .popBox{
    opacity: 1;
    box-shadow: 0px 4px 16px 4px rgba(24, 144, 255, 0.3);
    .info{
      height: 330px;
    }
  }
}
.emptyText{
  color: #909399;
  line-height: 60px;
  font-size: 14px;
}
.el-dialog{
  background: none !important;
  text-align: center !important;
}
.preImg{
  margin: 0 auto;
}
</style>
