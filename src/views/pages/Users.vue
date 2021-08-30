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
        <CCol md="12">
          <CCard class="mx-60 mb-0">
            <CCardHeader class="p-4">
              <center>
                <h4>Kullanıcılar</h4>
              </center>
            </CCardHeader>
            <CCardBody class="p-4">
              <CDataTable :items="items" :fields="fields" table-filter column-filter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{label: 'Sayfalar'}" :tableFilter="{label: 'Filtre', placeholder:'Ara'}" :noItemsView='{ noResults: "Sonuç Yok", noItems: "Tablo Boş" }' hover sorter pagination>
                <template #delete="{item}">
                  <td>
                    <CButton v-if="!controlUserToken(item)" style="margin-left: auto" class="m-2" size="sm" color="danger" @click="deleteMethod(item)">
                      <CIcon name="cil-trash"> </CIcon>
                    </CButton>
                  </td>
                </template>
                <template #update="{item}" style="margin-right: auto">
                  <td>
                    <CButton v-if="!controlUserToken(item)" class="m-1" size="sm" color="success" @click="updateMethod(item)">
                      {{changeTypeButton(item)}} Yap
                    </CButton>
                  </td>
                </template>
              </CDataTable>
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
  name: "Users",
  data() {
    return {
      dangerModal: false,
      successModal: false,
      warningModal: false,
      message: "",
      fields: [
        {
          key: "id",
          label: "#",
          _style: "width:1px;",
          sorter: false,
          filter: false,
        },
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
          key: "update",
          label: "Türü Değiştir",
          _style: "width:5cm;",
          sorter: false,
          filter: false,
        },
        {
          key: "delete",
          label: "Sil",
          _style: "width:3px;",
          sorter: false,
          filter: false,
        },
      ],
      items: [],
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch() {
      axios
        .get(`${CONFIG.api.invokeUrl}user`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          this.items = response.data.map((t) => this.changeType(t));
          var i = 0;
          this.items = this.items.map((item) => {
            return { ...item, id: ++i };
          });
        })
        .catch((e) => {
          this.message = "Veri Getirilemedi";
          this.dangerModal = true;
        });
    },
    changeType(item) {
      if (item.userType === "A") item.userType = "Yönetici";
      else if (item.userType === "U") item.userType = "Kullanıcı";
      return item;
    },
    changeTypeButton(item) {
      if (item.userType === "Yönetici") return "Kullanıcı";
      else if (item.userType === "Kullanıcı") return "Yönetici";
      return "";
    },
    controlUserToken(item) {
      item.email = item.email.trim();
      item.password = item.password.trim();
      const token = Buffer.from(
        `${item.email}:${item.password}`,
        "utf8"
      ).toString("base64");
      if (token === ServiceToken.getToken()) {
        return true;
      }
      return false;
    },
    deleteMethod(item) {
      axios
        .delete(`${CONFIG.api.invokeUrl}user/${item.userID}`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          this.message = "Silindi";
          this.successModal = true;
          this.fetch();
        })
        .catch((e) => {
          this.message = "Silinemedi";
          this.dangerModal = true;
        });
    },
    updateMethod(item) {
      if (item.userType === "Yönetici") item.userType = "U";
      else if ("Kullanıcı") item.userType = "A";
      axios
        .put(
          `${CONFIG.api.invokeUrl}user/${item.userID}`,
          {
            userID: item.userID,
            userType: item.userType,
            password: item.password,
            email: item.email,
            isActive: item.isActive,
            createdTime: item.createdTime,
          },
          {
            headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
          }
        )
        .then((response) => {
          this.message = "Hesap Türü Değiştirildi";
          this.successModal = true;
          this.fetch();
        })
        .catch((e) => {
          this.message = "Başarısız";
          this.dangerModal = true;
        });
    },
  },
};
</script>