<template>
  <div>
    <CCard>
      <!-- Header Component -->
      <CCardHeader>
        <h4>Ürün Ağacını Yükleyiniz...</h4>
      </CCardHeader>
      <CCardBody>
        <!-- Success Modal Component -->
        <CModal color="success" :show.sync="successModal">
          Yükleme Başarılı
        </CModal>
        <!-- Danger Modal Component -->
        <CModal color="danger" :show.sync="dangerModal">
          Yükleme Başarısız .Doğru dosyayı yüklediğinizden ve uzantının .xlsx
          olduğundan emin olunuz. TEKRAR DENEYİNİZ...
        </CModal>
        <!-- File Form Component -->
        <form enctype="multipart/form-data">
          <div class="field">
            <input
              style="width: 5cm; height: 1cm"
              type="file"
              ref="file"
              @change="selectFile"
            />
          </div>
        </form>
      </CCardBody>
      <!-- Footer Component -->
      <CCardFooter>
        <center>
          <CButton
            v-if="!uploading"
            type="submit"
            size="sm"
            color="primary"
            @click="sendFile"
            ><center><CIcon name="cil-check-circle" /> Gönder</center></CButton
          >
        </center>
      </CCardFooter>
    </CCard>

    <!-- Looading Component -->
    <CElementCover
      v-if="uploading"
      :show.sync="elementCover"
      :boundaries="[{ sides: ['top', 'left'], query: '.media-body' }]"
      :opacity="0.8"
    >
      <h1 class="d-inline">Yükleniyor...</h1>
      <CSpinner size="5xl" color="success" />
    </CElementCover>
  </div>
</template>

<script>
import CONFIG from "@/config.json";
import axios from "axios";
import ServiceToken from '../../service/TokenService';
export default {
  name: "ExcelMontage",
  data() {
    return {
     file:"",
     uploading:false,
     successModal:false,
     dangerModal:false,
     elementCover:false
    };
  },
  methods: {
   selectFile(){
     this.file=this.$refs.file.files[0];
   },
   sendFile(){
     this.uploading=true;
     this.elementCover=true;
     const formData=new FormData();
     formData.append('file',this.file);
     axios
        .post(`excelTree`, formData)
        .then((response) => {
          this.successModal=true;
          this.elementCover=false;
          this.uploading=false;
           this.$router.push({ path: '/tree' })
        })
        .catch((e) => {
          this.dangerModal=true;
          this.elementCover=false;
          this.uploading=false;
        });
   }
  },
};
</script>
