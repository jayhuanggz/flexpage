<template>
  <el-form-item
    :label="config.label"
    v-bind:class="[baseClass, 'fp-image-upload']"
  >
    <el-upload
      ref="upload"
      action
      :accept="config.accept"
      list-type="picture-card"
      :file-list="fileList"
      :on-change="fileChange"
      :http-request="upload"
      :before-upload="validateFile"
      :limit="config.limit"
      :multiple="true"
      :on-exceed="handleExceed"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }" v-loading="file.uploading">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>

          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" />
    </el-dialog>
  </el-form-item>
</template>

<script>
import FlexPage from "../../../flex_page";
import FormFiled from "./../form_field";
import Util from "./../../../utils/util";
import BaseState from "./../state";
import extend from "../../store/extend";

let State = extend(
  {
    state() {
      return {
        model: [],
      };
    },
  },
  BaseState
);

export default {
  name: "fp-image-list",
  extends: FormFiled,

  provide() {
    return {
      uploader: this.uploader,
    };
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [],
    };
  },
  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          label: "Image",
          maxSize: "100M",
          accept: "image/jpeg,image/png,image/gif,image/tif,image/bmp",
          uploader: "mock",
          limit: 5,
        };
      },
    },
  },
  created() {
    let uploader;
    if (this.config.uploader && this.config.uploader.length > 0) {
      uploader = this.config.uploader;
    } else {
      uploader = FlexPage.Upload.configuration.uploader;
    }
    this.uploader = FlexPage.Upload.createUploader(uploader);
    FlexPage.Upload.initUploader(this.fpContext, this.uploader);
    if (this.model && this.model.length > 0) {
      this.model.forEach((image) => {
        this.fileList.push({ url: image, value: image });
      });
    }

    if (this.config.maxSize && this.config.maxSize.length > 0) {
      this.maxSizeInBytes = Util.parseSize(this.config.maxSize);
    }
  },
  mounted() {},
  beforeDestroy() {
    if (this.uploader) {
      this.uploader.destroy();
    }
  },
  methods: {
    syncFileList() {
      let fileList = this.fileList,
        newList = [],
        values = [];

      fileList.forEach((image) => {
        values.push(image.value);
      });
      if (this.model && this.model.length > 0) {
        this.model.forEach((url) => {
          let index = values.indexOf(url);
          if (index === -1) {
            newList.push({ url: url, value: url });
          } else {
            let target = fileList[index];
            values.splice(index, 1);
            fileList.splice(index, 1);
            newList.push(target);
          }
        });
      }

      this.fileList = newList;
    },
    modelUpdated() {
      this.syncFileList();
    },
    onClear() {
      this.syncFileList();
    },
    onReset() {
      this.syncFileList();
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file) {
      let index = this.fileList.indexOf(file);
      if (index !== -1) {
        this.model.splice(index, 1);
        this.fileList.splice(index, 1);
      }
    },

    validateFile(file) {
      if (this.config.accept.indexOf(file.type) === -1) {
        this.$message.warning("请上传合法的图片文件!");
        return false;
      }

      if (this.maxSizeInBytes > 0 && this.maxSizeInBytes < file.size) {
        this.$message.warning("不能上传超过" + this.config.maxSize + "的图片!");
        return false;
      }

      return true;
    },
    fileChange(file, fileList) {
      this.fileList = fileList;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多允许上传 ${this.config.limit} 张图片`);
    },
    defaultModel() {
      return [];
    },
    upload(obj) {
      if (this.fileList.length === 0) {
        return;
      }

      let file = this.fileList[this.fileList.length - 1];
      file.uploading = true;
      this.uploader
        .upload(file, FlexPage.Upload.getUploadData(this.fpContext))
        .then((res) => {
          file.uploading = false;
          file.value = res.res.url;
          this.model.push(res.res.url);

          obj.onSuccess();
        })
        .catch((err) => {
          file.uploading = false;
          this.$message.warning("上传失败");
        });
    },
    getStateClass: () => State,
  },
};
</script>

<style lang="scss">
@import "./image.scss";
</style>