<template>
  <el-form-item :label="config.label" v-bind:class="[baseClass,'fp-image-upload']">
    <el-upload
      ref="upload"
      action
      :accept="config.accept"
      list-type="picture-card"
      :file-list="fileList"
      :on-change="fileChange"
      :http-request="upload"
      :before-upload="validateFile"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }" v-loading="uploading">
        <img class="el-upload-list__item-thumbnail" :src="file.url" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </el-form-item>
</template>

<script>
import FlexPage from "../../../flex_page";
import FormFiled from "./../form_field";
import Util from "./../../../utils/util";
export default {
  name: "fp-image",
  extends: FormFiled,
  provide() {
    return {
      uploader: this.uploader
    };
  },
  data() {
    return {
      uploading: false,
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: []
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
          uploader: "mock"
        };
      }
    }
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
      this.fileList = [{ url: this.model }];
    }

    if (this.config.maxSize && this.config.maxSize.length > 0) {
      this.maxSizeInBytes = Util.parseSize(this.config.maxSize);
    }

    this.watch("model", () => {
      if (this.model && this.model.length > 0) {
        if (this.fileList.length > 0) {
          this.fileList[0].url = this.model;
          if (this.fileList.length > 1) {
            this.fileList.splice(1, this.fileList.length - 1);
          }
        } else {
          this.fileList = [{ url: this.model }];
        }
      } else {
        this.fileList = [];
      }
    });
  },
  mounted() {},
  beforeDestroy() {
    if (this.uploader) {
      this.uploader.destroy();
    }
  },
  methods: {
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      this.fileList = [];
      this.model = undefined;
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
      if (fileList.length > 1) {
        fileList.splice(0, fileList.length - 1);
      }
      this.fileList = fileList;
    },
    upload(obj) {
      this.$refs.upload.clearFiles();

      if (this.fileList.length === 0) {
        return;
      }

      let file = this.fileList[0];
      this.uploading = true;
      this.uploader
        .upload(file, FlexPage.Upload.getUploadData(this.fpContext))
        .then(res => {
          this.model = res.res.url;
          obj.onSuccess();
        })
        .catch(err => {
          this.$message.warning("上传失败");
        })
        .finally(() => {
          this.uploading = false;
        });
    }
  }
};
</script>

<style lang="scss">
@import "./image.scss";
</style>
