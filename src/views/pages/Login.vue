<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CAlert color="danger"  v-if="dangerModal">
                  Tekrar deneyiniz.
                </CAlert>
                <CForm>
                  <h1>Kısıt Takip</h1>
                  <p class="text-muted">Hesabınıza Giriş Yapınız</p>
                  <CInput placeholder="Username" v-model="username" autocomplete="username email">
                    <template #prepend-content>
                      <CIcon name="cil-user" />
                    </template>
                  </CInput>
                  <CInput placeholder="Password" type="password" v-model="password" autocomplete="curent-password">
                    <template #prepend-content>
                      <CIcon name="cil-lock-locked" />
                    </template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="primary" class="px-4" @click="login()">Giriş</CButton>
                    </CCol>

                  </CRow>
                </CForm>
              </CCardBody>
              <!-- Looading Component -->
              <CElementCover v-if="uploading" :show.sync="elementCover" :boundaries="[{ sides: ['top', 'left'], query: '.media-body' }]" :opacity="0.8">
                <h1 class="d-inline"></h1>
                <CSpinner size="5xl" color="success" />
              </CElementCover>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>

    </CContainer>
  </div>
</template>

<script>
import CONFIG from "@/config.json";
import axios from "axios";
import TokenService from "../../service/TokenService";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      typeUser: "",
      uploading: false,
      elementCover: false,
      dangerModal:false,
    };
  },
  mounted() {
    
  },
  methods: {
    login() {
      this.uploading = true;
      const token = Buffer.from(
        `${this.username}:${this.password}`,
        "utf8"
      ).toString("base64");
      axios
        .get(`${CONFIG.api.invokeUrl}user?email=${this.username}`, {
          headers: { Authorization: `Basic ${token}` },
        })
        .then((response) => {
          
          if (response.data !== null) {
            this.typeUser = response.data;
            TokenService.saveToken(token, this.typeUser);
            this.controlIsBlock();
          }else{
            this.dangerModal=true;
          }
        })
        .catch((e) => {
           this.uploading=false;
          this.dangerModal=true;
         
        });
    },
    controlIsBlock() {
      axios
        .get(`${CONFIG.api.invokeUrl}user?hasPermissionConstraint=${false}`, {
          headers: { Authorization: `Basic ${TokenService.getToken()}` },
        })
        .then((response) => {
          this.uploading = false;
          if (response.data) {
            TokenService.saveBlockType(true);
          } else {
            TokenService.saveBlockType(false);
          }
          if (this.typeUser === "A") {
            this.$router.push({ path: "/" });
          } else if (this.typeUser === "U") {
            this.$router.push({ path: "/user" });
          }
        })
        .catch((e) => { this.uploading=false;this.dangerModal=true;});
    },
  },
};
</script>
