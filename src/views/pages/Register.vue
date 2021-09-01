<template>

  <div class="d-flex align-items-center min-vh-50">
    <!-- Danger Modal Component -->
    <CModal size="lg" :show.sync="dangerModal" color="danger">
      <center>
        <h5>{{message}}</h5>
      </center>
      <div slot="footer" class="w-100">
      </div>
    </CModal>
    <!-- success Modal Component -->
    <CModal size="lg" :show.sync="successModal" color="success">
      <center>
        <h5>{{message}}</h5>
      </center>
      <div slot="footer" class="w-100">
      </div>
    </CModal>
    <!-- warning Modal Component -->
    <CModal size="lg" :show.sync="warningModal" color="warning">
      <center>
        <h5>{{message}}</h5>
      </center>
      <div slot="footer" class="w-100">
      </div>
    </CModal>
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-20 mb-0">
            <CCardHeader class="p-4">
              <center>
                <h4>Hesap Ekle</h4>
              </center>
            </CCardHeader>
            <CCardBody class="p-4">
              <CForm>
                <CSelect label="Hesap Türü:" horizontal :options="[ 'Kullanıcı', 'Yönetici' ]" :value.sync="type" placeholder="Seçiniz" />

                <CInput v-model="username" placeholder="Mail" autocomplete="email" prepend="@" />
                <CInput v-model="password" placeholder="Şifre" type="password" autocomplete="new-password">
                  <template #prepend-content>
                    <CIcon name="cil-lock-locked" />
                  </template>
                </CInput>
                <br>
                <CButton @click="add()" color="success" block>Ekle</CButton>
              </CForm>
            </CCardBody>
            <CCardFooter class="p-4">
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import CONFIG from "@/config.json";
import axios from "axios";
import ServiceToken from "../../service/TokenService";

export default {
  name: "Register",
  data() {
    return {
      username: "",
      password: "",
      type: "",
      dangerModal: false,
      successModal: false,
      warningModal: false,
      message: "",
      blockControl: false,
      fields: [
        {
          key: "userType",
          label: "Hesap Türü",
          _style: "min-width:100px;",
        },
        {
          key: "email",
          label: "Mail",
          _style: "min-width:100px;",
        },
        {
          key: "password",
          label: "Şifre",
          _style: "min-width:100px;",
        },
        {
          key: "createdTime",
          label: "Kayıt Tarihi",
          _style: "min-width:100px;",
        },
        { key: "delete", label: "Sil", _style: "width:2cm;" },
      ],
      items: [],
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    add() {
      this.controlIsBlock();
      if (this.type.length === 0) {
        this.message = "Hesap Türü Seçiniz.";
        this.warningModal = true;
      } else if (this.username.length === 0) {
        this.message = "Mail Girmelisiniz.";
        this.warningModal = true;
      } else if (this.password.length > 10 || this.password.length < 3) {
        this.message = "Şifre En Küçük 3 En Büyük 10 Karakter Olmalıdır.";
        this.warningModal = true;
      } else if (
        this.items.filter((t) => t.email === this.username).length !== 0
      ) {
        this.message = this.username + " kullanıcı zaten kayıtlı.";
        this.dangerModal = true;
      } else {
        const today = new Date();
        if (this.type === "Kullanıcı") this.type = "U";
        else if (this.type === "Yönetici") this.type = "A";

        axios
          .post(`user`, {
            userType: this.type,
            password: this.password,
            email: this.username,
            isActive: true,
            permissionForConstraint: this.blockControl,
            createdTime: "2021-08-20",
          })
          .then((response) => {
            this.message = "Eklendi";
            this.successModal = true;
            this.type = "";
            this.password = "";
            this.username = "";
          })
          .catch((e) => {
            this.message = "Eklenemedi Tekrar Deneyiniz...";
            this.dangerModal = true;
          });
      }
    },
    fetch() {
      axios
        .get(`user`)
        .then((response) => {
          this.items = response.data;
          this.type = "";
          this.password = "";
          this.username = "";
          this.controlIsBlock();
        })
        .catch((e) => {
          this.message = "Veri Getirilemedi";
          this.dangerModal = true;
        });
    },
    controlIsBlock() {
      axios
        .get(`user?hasPermissionConstraint=${false}`)
        .then((response) => {
          if (response.data) {
            this.blockControl = false;
          } else {
            this.blockControl = true;
          }
        })
        .catch((e) => {});
    },
  },
};
</script>