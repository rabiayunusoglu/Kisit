<template>
  <div>
    <!-- Warning Modal Component -->
    <CModal size="lg" :show.sync="warningModal" color="warning">
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
    <CInput size="lg" placeholder="Motor Kodunu Giriniz..." v-model="searchProduct">
    </CInput>

    <center>
      <CButton @click="fetch()" color="primary" size="sm" horizontal>
        Ara
      </CButton>
    </center>
    <br />

    <CCard>
      <CCardBody>
        <center>
          <h5>{{searchProduct}} Motor Koduna Ait Girilmiş Ötelemeler</h5>
        </center>
        <CDataTable :items="itemsDelay" :fields="fields" :noItemsView="{ noResults: 'Sonuç Yok', noItems: messageTable }" hover sorter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{label: 'Sayfalar'}" pagination>
          <template #update="{item}">

            <CButton size="sm" horizontal @click="toogleDelay(item)">
              <CIcon name="cil-pencil"> </CIcon>
            </CButton>
            <CButton size="sm" horizontal @click="deleteDelayHistory(item)">
              <CIcon name="cil-trash"> </CIcon>
            </CButton>
            <CButton size="sm" horizontal @click="archiveDelayHistory(item)">
              <CIcon name="cil-task"> </CIcon>
            </CButton>

          </template>

        </CDataTable>
      </CCardBody>
    </CCard>

    <CModal title="Öteleme Geçmişini Düzenle" size="lg" :show.sync="updateModal">
      <CCardBody>

        <CInput horizontal label="Ürün Kodu:" :readonly="true" :value="updateDelay.productCode" v-model="updateDelay.productCode" />

        <CInput horizontal size="sm" label="Öteleme Kodu:" :readonly="true" placeholder="Öteleme Kodunu Giriniz" :value="updateDelay.delayCode" v-model="updateDelay.delayCode" />
        <CInput horizontal size="sm" type="number" label="Öteleme Miktarı:" placeholder="Öteleme Miktarını Giriniz" :value="updateDelay.delayAmount" v-model="updateDelay.delayAmount" />
        <CInput size="sm" horizontal label="Öteleme Tarihi:" type="date" placeholder="Öteleme Tarihini Giriniz" v-model="updateDelay.delayDate" />
        <CSelect label="Öteleme Sebebi:" horizontal v-model="updateDelay.delayReason" :options="reasons" placeholder="Seçiniz" :value.sync="updateDelay.delayReason" />
        <CSelect horizontal label="Firma-Takım:" :options="teams" placeholder="Seçiniz" :value.sync="updateDelay.companyTeam" v-model="updateDelay.companyTeam" />
        <CSelect horizontal label="Sorumlu Birey:" :options="persons" placeholder="Seçiniz" :value.sync="updateDelay.chargePerson" v-model="updateDelay.chargePerson" />
        <CInput size="sm" horizontal label="Öteleme Açıklama:" placeholder="Öteleme Açıklama:" :value="updateDelay.delayDetail" v-model="updateDelay.delayDetail" />
        <CInput size="sm" type="date" horizontal label="Girildiği Tarih:" v-model="updateDelay.madeDate" />
      </CCardBody>
      <div slot="footer" class="w-100">
        <CButton style="border-radius: 0.2rem; color: white" color="info" class="ml-1 mr-1 float-right" @click="updateDelayFromModal(updateDelay)">
          Düzenle
        </CButton>
      </div>
    </CModal>
  </div>
</template>
<script>
import CONFIG from "@/config.json";
import axios from "axios";
import ServiceToken from "../../service/TokenService";

export default {
  name: "DelayHistory",
  data() {
    return {
      date: "",
      fields: [
        { key: "productCode", label: "Ürün Kodu", _style: "width:1cm" },
        { key: "delayAmount", label: "Öteleme Miktarı", _style: "width:1cm" },
        { key: "delayCode", label: "Öteleme Kodu", _style: "width:1cm" },
        { key: "delayDate", label: "Ötelenecek Tarihi", _style: "width:1cm" },
        { key: "delayReason", label: "Öteleme Sebebi", _style: "width:1cm" },
        { key: "companyTeam", label: "Firma-Takım", _style: "width:1cm" },
        { key: "chargePerson", label: "Sorumlu Birey", _style: "width:1cm" },
        { key: "delayDetail", label: "Öteleme Açıklama", _style: "width:1cm" },
        { key: "madeDate", label: "Girildiği Tarih", _style: "width:1cm" },
        { key: "update", label: "Düzenle", _style: "width:1cm" },
      ],
      items: [],
      itemsDelay: [],
      searchProduct: "",
      updateModal: false,
      updateDelay: {},
      persons: [],
      teams: [],
      reasons: [],
      messageTable: "Tablo Boş",
      message: "",
      warningModal: false,
      successModal: false,
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    toogleDelay(item) {
      var temp = this.items.filter((x) => x.delayID === item.delayID);
      if (temp.length === 0) {
        this.updateModal = !this.updateModal;
        this.updateDelay = item;
      } else {
        this.message =
          "Bu ötelemeyi buradan güncelleyemezsiniz. Kısıt tarafında bu öteleme şuan kullanılıyor, oradan güncelleyebilirsiniz!";
          this.warningModal=true;
      }
    },
    getCurrentDate(item) {
      var today = new Date();
      item._newCurrentDate =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");
    },
    fetchData() {
      if (this.searchProduct !== "") {
        this.items = [];

        axios
          .get(`${CONFIG.api.invokeUrl}constraint`, {
            headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
          })
          .then((response) => {
            this.items = response.data;
          })
          .catch((e) => {});
      }
    },
    fetchDataDelay() {
      if (this.searchProduct !== "") {
        axios
          .get(`${CONFIG.api.invokeUrl}delayHistory`, {
            headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
          })
          .then((response) => {
            this.itemsDelay = response.data.filter(
              (t) =>
                t.productCode === this.searchProduct && t.isArchive === false
            );
            if (this.itemsDelay.length === 0)
              this.messageTable = "Ötelemesi Yok";
          })
          .catch((e) => {});
      }
    },
    fetchReasons() {
      if (this.searchMaterial !== "") {
        axios
          .get(`${CONFIG.api.invokeUrl}postponementReason`, {
            headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
          })
          .then((response) => {
            this.reasons = response.data.map((x) => x.delayName);
          })
          .catch((e) => {});
      }
    },
    fetchPersons() {
      if (this.searchMaterial !== "") {
        axios
          .get(`${CONFIG.api.invokeUrl}chargePersons`, {
            headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
          })
          .then((response) => {
            this.persons = response.data.map((x) => x.personName);
          })
          .catch((e) => {});
      }
    },
    fetchTeams() {
      if (this.searchMaterial !== "") {
        axios
          .get(`${CONFIG.api.invokeUrl}companyTeam`, {
            headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
          })
          .then((response) => {
            this.teams = response.data.map((x) => x.companyName);
          })
          .catch((e) => {});
      }
    },
    fetch() {
      this.fetchData();
      this.fetchDataDelay();
      this.fetchReasons();
      this.fetchPersons();
      this.fetchTeams();
    },
    updateDelayFromModal(delay) {
      axios
        .put(
          `${CONFIG.api.invokeUrl}delayHistory/${delay.delayID}`,
          {
            isMarked: delay.isMarked,
            isArchive: delay.isArchive,
            delayID: delay.delayID,
            productCode: delay.productCode,
            delayCode: delay.delayCode,
            delayAmount: delay.delayAmount,
            delayDate: delay.delayDate,
            delayReason: delay.delayReason,
            delayDetail: delay.delayDetail,
            companyTeam: delay.companyTeam,
            chargePerson: delay.chargePerson,
            madeDate: delay.madeDate,
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {
          this.updateModal = !this.updateModal;
          this.fetch();
          this.message = "Başarılı";
          this.successModal=true;
        })
        .catch((e) => {
          this.message = "Tekrar Deneyiniz! updateDelayFromModal";
          this.warningModal=true;
        });
    },
    deleteDelayHistory(item) {
      var temp = this.items.filter((x) => x.delayID === item.delayID);
      if (temp.length === 0) {
        this.deleteDelayFromModal(item);
      } else {
        this.message =
          "Bu ötelemeyi buradan silemezsiniz. Kısıt tarafında bu öteleme şuan kullanılıyor, oradan silebilirisiniz!";
          this.warningModal=true;
      }
    },
    deleteDelayFromModal(item) {
      axios
        .delete(`${CONFIG.api.invokeUrl}delayHistory/${item.delayID}`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          this.message = "Silindi";
          this.successModal=true;
          this.fetch();
        })
        .catch((e) => {
          this.message = "Tekrar deneyiniz.deleteDelayFromModal";
          this.warningModal=true;
        });
    },
    archiveDelayHistory(delay) {
      var temp = this.items.filter((x) => x.delayID === delay.delayID);
      if (temp.length === 0) {
        axios
          .put(
            `${CONFIG.api.invokeUrl}delayHistory/${delay.delayID}`,
            {
              isMarked: delay.isMarked,
              isArchive: true,
              delayID: delay.delayID,
              productCode: delay.productCode,
              delayCode: delay.delayCode,
              delayAmount: delay.delayAmount,
              delayDate: delay.delayDate,
              delayReason: delay.delayReason,
              delayDetail: delay.delayDetail,
              companyTeam: delay.companyTeam,
              chargePerson: delay.chargePerson,
              madeDate: delay.madeDate,
            },
            { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
          )
          .then((response) => {
            this.fetch();
            this.message = "Arşivlendi";
            this.successModal=true;
          })
          .catch((e) => {
            this.message = "Tekrar Deneyiniz! archiveDelayFromModal";
            this.warningModal=true;
          });
      } else {
        this.message =
          "Bu ötelemeyi arşivleyemezsiniz. Kısıt tarafında bu öteleme şuan kullanılıyor.";
          this.warningModal=true;
      }
    },
  },
};
</script>
