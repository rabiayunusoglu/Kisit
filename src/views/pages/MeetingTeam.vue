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
    <!-- warn Modal Component -->
    <CModal :show.sync="warningModal" :closeOnBackdrop="false">
      <center>
        <h5>{{message}}</h5>
      </center>
      <div slot="footer" class="w-100">
        <CRow>
          <div class="col"></div>
          <div style="padding-left: 40px;" align="left">
            <CButton @click="yesItem()" color="success">
              Evet
            </CButton>
          </div>
          <div style="padding-left: 20px;padding-right: 20px;">
            <CButton @click="warningModal=false" color="danger">
              Hayır
            </CButton>
          </div>

        </CRow>
      </div>
    </CModal>
    <CCard>
      <CCardHeader>
        <center>
          <h5>Toplantı-Ekip</h5>
        </center>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <div style="padding-left: 10px;">
            <CButton @click="fetch()" color="primary" horizontal v-c-tooltip.hover="{
                  content: `Tüm toplantı elemanlarını getirir.`
                }">
              Tümünü Getir
            </CButton>
          </div>
          <div class="col" style="padding-left: 20px;">
            <template>
              Başlangıç:
              <input type="date" :value="startDate" class="mr-2" @change="setDateFilter" />
              Bitiş:
              <input type="date" :value="endDate" @change="e => setDateFilter(e, 'end')" />
              <CButton @click="fetchDataFromDate()" class="" color="dark" horizontal v-c-tooltip.hover="{
                  content: `Tarihler arasındaki toplantı elemanlarını getirir.`
                }">
                Getir
              </CButton>

            </template>

          </div>

          <div class="col" style="padding-right: 10px;" align="right">
            <CButton color="danger" horizontal @click="deleteAllItem()" v-c-tooltip.hover="{
                  content: `Tümünü kalıcı olarak siler`
                }">
              Tümünü Sil
            </CButton>
          </div>

        </CRow>

        <CDataTable column-filter :items="items" :fields="fields" :noItemsView="{ noResults: 'Sonuç Yok', noItems: messageTable }" hover sorter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{label: 'Sayfalar'}" pagination>

          <template #delete="{item}">
            <td>
              <CButton style="margin:3px" color="danger" size="sm" horizontal @click=" deleteItem(item)">
                <CIcon name="cil-trash"> </CIcon>
              </CButton>
            </td>
          </template>
          <template #update="{item}">
            <td>
              <CButton style="margin:3px" size="sm" @click="toogleUpdeteButon(item)" color="info">
                <CIcon name="cil-pencil"> </CIcon>
              </CButton>
            </td>
          </template>

        </CDataTable>
      </CCardBody>
    </CCard>
    <CModal title="Toplantı Düzenle" size="lg" :show.sync="updateButton">
      <CCardBody>
        <div>
          <td>
            <div>
              <CInput horizontal label="Malzeme K.:" style="width: 350px" :readonly="true" :value="itemUpdated.materialCode" v-model="itemUpdated.materialCode" />
            </div>
          </td>

          <td>
            <div class="col">
              <CInput horizontal label="Malzeme:" style="width: 380px" :readonly="true" :value="itemUpdated.materialText" v-model="itemUpdated.materialText" />
            </div>
          </td>
        </div>
        <div>
          <td>
            <div>
              <CInput horizontal label="Ürün Kodu:" :readonly="true" style="width: 350px" :value="itemUpdated.productCode" v-model="itemUpdated.productCode" />
            </div>
          <td>
            <div class="col">
              <CInput horizontal label="Müşteri:" :readonly="true" style="width: 380px" :value="itemUpdated.customer" v-model="itemUpdated.customer" />
            </div>
          </td>
        </div>
        <div>

          <td>
            <div>
              <CInput horizontal label="Plan Tarihi:" :readonly="true" style="width: 350px" :value="itemUpdated.plannedDate" v-model="itemUpdated.plannedDate" />
            </div>
          </td>
          <td>
            <div class="col">
              <CInput horizontal label="Mikar:" :readonly="true" style="width: 380px" :value="itemUpdated.amount" v-model="itemUpdated.amount" />
            </div>
          </td>
        </div>
        <CInput horizontal size="sm" label="Öteleme Kodu:" :readonly="true" placeholder="Öteleme Kodunu Giriniz" :value="itemUpdated.materialCode" v-model="itemUpdated.materialCode" />
        <CInput horizontal size="sm" type="number" label="Öteleme Miktarı:" placeholder="Öteleme Miktarını Giriniz" :value="itemUpdated.delayAmount" v-model="itemUpdated.delayAmount" />
        <CInput size="sm" horizontal label="Öteleme Tarihi:" type="date" placeholder="Öteleme Tarihini Giriniz" v-model="itemUpdated.delayDate" />
        <CSelect label="Öteleme Sebebi:" horizontal v-model="itemUpdated.delayReason" :options="reasons" placeholder="Seçiniz" :value.sync="itemUpdated.delayReason" />
        <CSelect horizontal label="Firma-Takım:" :options="teams" placeholder="Seçiniz" :value.sync="itemUpdated.companyTeam" v-model="itemUpdated.companyTeam" />
        <CSelect horizontal label="Sorumlu Birey:" :options="persons" placeholder="Seçiniz" :value.sync="itemUpdated.chargePerson" v-model="itemUpdated.chargePerson" />
        <CInput size="sm" horizontal label="Öteleme Açıklama:" placeholder="Öteleme Açıklama:" :value="itemUpdated.delayDetail" v-model="itemUpdated.delayDetail" />
        <CInput size="sm" type="date" horizontal label="Girildiği Tarih:" v-model="itemUpdated.dateCurrent" />
      </CCardBody>
      <div slot="footer" class="w-100">
        <CButton style="border-radius: 0.2rem; color: white" color="info" class="ml-1 mr-1 float-right" @click="updateMethod(itemUpdated)" v-c-tooltip.hover="{
                  content: `düzenler`
                }">

          Düzenle
        </CButton>
      </div>
    </CModal>
    <!-- Looading Component -->
    <CElementCover v-if="uploading" :show.sync="elementCover" :boundaries="[{ sides: ['top', 'left'], query: '.media-body' }]" :opacity="0.8">
      <h1 class="d-inline"></h1>
      <CSpinner size="5xl" color="success" />
    </CElementCover>
  </div>
</template>
<script>
import CONFIG from "@/config.json";
import axios from "axios";
import ServiceToken from "../../service/TokenService";

export default {
  name: "Meeting",
  data() {
    return {
      fields: [
        { key: "id", label: "#No", _style: "width=5px" },
        {
          key: "dateCurrent",
          label: "Girildiği Tarih",
          _style: "min-width=50px",
        },
        {
          key: "materialCode",
          label: "Malzeme Kodu",
          _style: "min-width=100px",
        },
        { key: "productCode", label: "Ürün Kodu", _style: "min-width=50px" },

        { key: "amount", label: "Plandaki Miktar", _style: "min-width=100px" },
        { key: "plannedDate", label: "Plan Tarihi", _style: "min-width=100px" },
        { key: "companyTeam", label: "Ekip", _style: "min-width=100px" },
        {
          key: "delayAmount",
          label: "Öteleme Miktarı",
          _style: "min-width=100px",
        },

        {
          key: "delayReason",
          label: "Öteleme Sebebi",
          _style: "min-width=100px",
        },
        {
          key: "delayDetail",
          label: "Öteleme Açıklama",
          _style: "min-width=100px",
        },

        { key: "update", label: "Düzenle", _style: "width:10px" },
        { key: "delete", label: "Sil", _style: "min-width=100px" },
      ],

      items: [],
      persons: [],
      reasons: [],
      teams: [],
      messageTable: "Tablo Boş",
      updateButton: false,
      itemUpdated: [],
      message: "",
      dangerModal: false,
      successModal: false,
      warningModal: false,
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
      getDate: false,
      uploading: false,
      elementCover: false,
    };
  },
  mounted() {
    this.fetch();
    this.fetchReasons();
    this.fetchPersons();
    this.fetchTeams();
  },
  methods: {
    fetch() {
      this.items = [];
      this.uploading = true;
      axios
        .get(`meetingTeam`)
        .then((response) => {
          this.uploading = false;
          var i = 0;
          this.items = response.data.map((item) => {
            return { ...item, id: ++i };
          });

          this.getDate = false;
        })
        .catch((e) => {
          this.uploading = false;
        });
    },
    fetchDataFromDate() {
      this.uploading = true;
      axios
        .get(`meetingTeam?startDate=${this.startDate}&endDate=${this.endDate}`)
        .then((response) => {
          this.uploading = false;
          var i = 0;
          this.items = response.data.map((item) => {
            return { ...item, id: ++i };
          });
          this.getDate = true;
        })
        .catch((e) => {
          this.uploading = false;
        });
    },
    setDateFilter(e, end) {
      if (end) {
        this.endDate = new Date(e.target.value).toISOString().substr(0, 10);
      } else {
        this.startDate = new Date(e.target.value).toISOString().substr(0, 10);
      }
    },
    deleteItem(item) {
      axios
        .delete(`meetingTeam/${item.constraintID}`)
        .then((response) => {
          // this.message=("Silindi");
          //this.successModal=true;
          if (this.getDate) this.fetchDataFromDate();
          else this.fetch();
        })
        .catch((e) => {
          this.message = "Tekrar deneyiniz.";
          this.dangerModal = true;
        });
    },
    yesItem() {
      this.warningModal = false;
     
      if (this.items.length !== 0) this.items.map((x) => this.deleteItem(x));
    },
    deleteAllItem() {
      this.message = "Hepsi silinecek emin misiniz?";
      this.warningModal = true;
    },
    toogleUpdeteButon(item) {
      this.updateButton = !this.updateButton;
      this.itemUpdated = item;
    },
    updateMethod(item) {
      axios
        .put(`meetingTeam/${item.constraintID}`, {
          constraintID: item.constraintID,
          materialCode: item.materialCode,
          materialText: item.materialText,
          productCode: item.productCode,
          plannedDate: item.plannedDate,
          amount: item.amount,
          customer: item.customer,
          version: item.version,
          delayID: item.delayID,
          delayCode: item.delayCode,
          delayAmount: item.delayAmount,
          delayDate: item.delayDate,
          delayReason: item.delayReason,
          delayDetail: item.delayDetail,
          companyTeam: item.companyTeam,
          chargePerson: item.chargePerson,
          dateCurrent: item.dateCurrent,
        })
        .then((response) => {
          this.updateButton = false;
          this.message = "Güncelleme Başarılı";
          this.successModal = true;
          if (this.getDate) this.fetchDataFromDate();
          else this.fetch();
        })
        .catch((e) => {
          this.updateButton = false;
          this.message = "Tekrar Deneyiniz!";
          this.dangerModal = true;
        });
    },
    fetchReasons() {
      axios
        .get(`postponementReason`)
        .then((response) => {
          this.reasons = response.data.map((x) => x.delayName);
        })
        .catch((e) => {});
    },
    fetchPersons() {
      axios
        .get(`chargePersons`)
        .then((response) => {
          this.persons = response.data.map((x) => x.personName);
        })
        .catch((e) => {});
    },
    fetchTeams() {
      axios
        .get(`companyTeam`)
        .then((response) => {
          this.teams = response.data.map((x) => x.companyName);
        })
        .catch((e) => {});
    },
  },
};
</script>
