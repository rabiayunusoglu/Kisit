<template>
  <div>
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
    <CCard>
      <CCardHeader>
        <center>
          <h5>Hat Bilgisi</h5>
        </center>
      </CCardHeader>

      <CCardBody>
        <template>
          <div class="wrapper">
            <!-- Add Button Component -->
            <div>
              <CRow>
                <CCol col="12">
                  <CButton color="success" @click="largeModal = true" class="mr-1">
                    Ekle
                  </CButton>
                </CCol>
              </CRow>
            </div>
            <!-- Add Modal Component -->
            <CModal title="Hat Bilgisi Ekle" size="lg" :show.sync="largeModal">
              <CCardBody>
                <CInput label="Hat Bilgisi İsmi:" horizontal placeholder="Giriniz..." v-model="addNew" />
                <CInput label="Hat Bilgisi Değeri:" horizontal placeholder="Giriniz..." v-model="addValue" />
              </CCardBody>
              <div slot="footer" class="w-100">
                <CButton style="border-radius: 0.2rem; color: white" color="success" class="ml-1 mr-1 float-right" @click="addMethod(addNew,addValue)">
                  Ekle
                </CButton>
              </div>
            </CModal>
          </div>
        </template>
        <!-- Table Component -->

        <CDataTable :items="items" :fields="fields" table-filter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{label: 'Sayfalar'}" :tableFilter="{label: 'Filtre', placeholder:'Ara'}" :noItemsView='{ noResults: "Sonuç Yok", noItems: "Tablo Boş" }' hover sorter pagination>
          <template #editable="{item}">
            <td>
              <CButton style="margin-left: auto" class="m-2" size="sm" color="info" @click="toggleUpdateModal(item)">
                <CIcon name="cil-pencil"> </CIcon>
              </CButton>
            </td>

          </template>
          <template #delete="{item}">
            <td>
              <CButton style="margin-left: auto" class="m-2" size="sm" color="danger" @click="deleteMethod(item)">
                <CIcon name="cil-trash"> </CIcon>
              </CButton>
            </td>
          </template>
        </CDataTable>
        <!-- Update Modal Component -->
        <CModal title="Hat Bilgisi Düzenle" size="lg" :show.sync="updateModal">
          <CCardBody>
            <CInput label="Hat Bilgisi İsmi:" horizontal placeholder="Giriniz..." v-model="update.versionName" />
            <CInput label="Hat Bilgisi Değeri:" horizontal placeholder="Giriniz..." v-model="update.versionValue" />
          </CCardBody>
          <div slot="footer" class="w-100">
            <CButton style="border-radius: 0.2rem; color: white" color="info" class="ml-1 mr-1 float-right" @click="updateMethod(update)">
              Düzenle
            </CButton>
          </div>
        </CModal>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import CONFIG from "@/config.json";
import axios from "axios";
import ServiceToken from "../../service/TokenService";

export default {
  name: "DelayReason",
  data() {
    return {
      items: [],
      addNew: "",
      addValue: "",
      largeModal: false,
      fields: [
        { key: "id", label: "#", _style: "width:1cm;" },
        {
          key: "versionName",
          label: "Hat Bilgisi",
          _style: "min-width:100px;",
        },
        {
          key: "versionValue",
          label: "Hat Bilgisi Değeri",
          _style: "min-width:100px;",
        },
        { key: "editable", label: "Düzenle", _style: "width:2cm;" },
        { key: "delete", label: "Sil", _style: "width:2cm;" },
      ],
      updateModal: false,
      update: {},
      message: "",
      dangerModal: false,
      successModal: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    addMethod(name, val) {
      if (name !== "" && val !== "") {
        axios
          .post(`version`, {
            versionName: name,
            versionValue: val,
          })
          .then((response) => {
            this.largeModal = false;
            this.fetchData();
            this.addNew = "";
            this.addValue = "";
            this.message = "Eklendi";
            this.successModal = true;
          })
          .catch((e) => {
            this.message = "Eklenemedi!";
            this.dangerModal = true;
          });
      }
    },
    fetchData() {
      axios
        .get(`version`)
        .then((response) => {
          var i = 0;
          this.items = response.data.map((item) => {
            return { ...item, id: ++i };
          });
        })
        .catch((e) => {});
    },
    updateMethod(item) {
      axios
        .put(`version/${item.versionID}`, {
          versionID: item.versionID,
          versionName: item.versionName,
          versionValue: item.versionValue,
        })
        .then((response) => {
          this.toggleUpdateModal();
          this.update = [];
          this.fetchData();
          this.message = "Güncellendi";
          this.successModal = true;
        })
        .catch((e) => {
          this.message = "Güncellenemedi!";
          this.dangerModal = true;
        });
    },
    toggleUpdateModal(item) {
      this.updateModal = !this.updateModal;
      this.update = item;
    },
    deleteMethod(item) {
      axios
        .delete(`version/${item.versionID}`)
        .then((response) => {
          this.fetchData();
          this.message = "Silindi";
          this.successModal = true;
        })
        .catch((e) => {
          this.message = "Silinemedi!";
          this.dangerModal = true;
        });
    },
  },
};
</script>
