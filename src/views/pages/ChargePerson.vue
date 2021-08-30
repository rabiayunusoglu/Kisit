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
          <h5>Sorumlu Bireyler</h5>
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
            <CModal title="Sorumlu Birey Ekle" size="lg" :show.sync="largeModal">
              <CCardBody>
                <CInput label="İsim Soyisim:" horizontal placeholder="Giriniz..." v-model="addNew" />
              </CCardBody>
              <div slot="footer" class="w-100">
                <CButton style="border-radius: 0.2rem; color: white" color="success" class="ml-1 mr-1 float-right" @click="addMethod(addNew)">
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
        <CModal title="Sorumlu Birey Düzenle" size="lg" :show.sync="updateModal">
          <CCardBody>
            <CInput label="İsim Soyisim:" horizontal placeholder="Giriniz..." v-model="update.personName" />
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
  name: "ChargePerson",
  data() {
    return {
      items: [],
      addNew: "",
      largeModal: false,
      fields: [
        { key: "id", label: "#", _style: "width:1cm;" },
        {
          key: "personName",
          label: "İsim Soyisim",
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
    addMethod(name) {
      if (name !== "") {
        axios
          .post(
            `${CONFIG.api.invokeUrl}chargePersons`,
            { personName: name },
            { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
          )
          .then((response) => {
            this.largeModal = false;
            this.fetchData();
            this.addNew = "";
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
        .get(`${CONFIG.api.invokeUrl}chargePersons`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          var i=0;
          this.items = response.data.map(item=>{return{...item,id:++i}});
        })
        .catch((e) => {});
    },
    updateMethod(item) {
      axios
        .put(
          `${CONFIG.api.invokeUrl}chargePersons/${item.personID}`,
          { personID: item.personID, personName: item.personName },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
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
        .delete(`${CONFIG.api.invokeUrl}chargePersons/${item.personID}`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
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
