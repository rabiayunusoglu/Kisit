<template>
  <div>
    <!-- Danger Modal Component -->
    <CModal size="lg" :show.sync="dangerModal" color="danger">
      <center>
        <h5>{{messageModal}}</h5>
      </center>
      <div slot="footer" class="w-100">
      </div>
    </CModal>
    <!-- success Modal Component -->
    <CModal size="lg" :show.sync="successModal" color="success">
      <center>
        <h5>{{messageModal}}</h5>
      </center>
      <div slot="footer" class="w-100">
      </div>
    </CModal>
    <CCard>
      <CCardHeader>
        <center>
          <h4>İşaretlenmemiş Kısıtlar</h4>
        </center>
      </CCardHeader>
      <CCardBody>

        <CRow>

          <div style="padding-left: 20px;">
            <CButton color="primary" horizontal @click="sendToMarked()">
              Seçilenleri İşaretle
            </CButton>
          </div>

          <div style="padding-left: 20px;">
            <p>{{chosenMessage}}:</p>
          </div>

          <div class="col">
            <CButton color="info" horizontal @click="chosenAll()">
              {{chosenMessage}}
            </CButton>
          </div>
          <div style="padding-left: 20px;padding-right: 20px;">
            <CButton color="success" horizontal @click="Export()">
              Excel Aktar
            </CButton>
          </div>
        </CRow>

        <CDataTable :items="items" :fields="fields" :noItemsView="{ noResults: 'Sonuç Yok', noItems: 'Tablo Boş' }" hover sorter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{ label: 'Sayfalar' }" pagination>
          <template #marked="{item}">
            <td>
              <CSwitch color="primary" size="lg" :checked.sync="item.isMarked" />
            </td>

          </template>
          <template #update="{item}">
            <td>
              <CButton size="sm" horizontal color="info" @click="toogleConstraint(item)">
                <CIcon name="cil-pencil"> </CIcon>
              </CButton>
            </td>
          </template>
          <template #delete="{item}">
            <td>
              <CButton size="sm" horizontal color="danger" @click="deleteConstraint(item)">
                <CIcon name="cil-trash"> </CIcon>
              </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
    <CModal title="İşaretlenmemiş Kısıtı Düzenle" size="lg" :show.sync="updateModal">
      <CCardBody>
        <div>
          <td>
            <div>
              <CInput horizontal label="Malzeme K.:" style="width: 350px" :readonly="true" :value="updateDelay.materialCode" v-model="updateDelay.materialCode" />
            </div>
          </td>

          <td>
            <div class="col">
              <CInput horizontal label="Malzeme:" style="width: 380px" :readonly="true" :value="updateDelay.materialText" v-model="updateDelay.materialText" />
            </div>
          </td>
        </div>
        <div>
          <td>
            <div>
              <CInput horizontal label="Ürün Kodu:" :readonly="true" style="width: 350px" :value="updateDelay.productCode" v-model="updateDelay.productCode" />
            </div>
          <td>
            <div class="col">
              <CInput horizontal label="Müşteri:" :readonly="true" style="width: 380px" :value="updateDelay.customer" v-model="updateDelay.customer" />
            </div>
          </td>
        </div>
        <div>

          <td>
            <div>
              <CInput horizontal label="Plan Tarihi:" :readonly="true" style="width: 350px" :value="updateDelay.plannedDate" v-model="updateDelay.plannedDate" />
            </div>
          </td>
          <td>
            <div class="col">
              <CInput horizontal label="Mikar:" :readonly="true" style="width: 380px" :value="updateDelay.amount" v-model="updateDelay.amount" />
            </div>
          </td>
        </div>
        <CInput horizontal size="sm" label="Öteleme Kodu:" :readonly="true" placeholder="Öteleme Kodunu Giriniz" :value="updateDelay.materialCode" v-model="updateDelay.materialCode" />
        <CInput horizontal size="sm" type="number" label="Öteleme Miktarı:" placeholder="Öteleme Miktarını Giriniz" :value="updateDelay.delayAmount" v-model="updateDelay.delayAmount" />
        <CInput size="sm" horizontal label="Öteleme Tarihi:" type="date" placeholder="Öteleme Tarihini Giriniz" v-model="updateDelay.delayDate" />
        <CSelect label="Öteleme Sebebi:" horizontal v-model="updateDelay.delayReason" :options="reasons" placeholder="Seçiniz" :value.sync="updateDelay.delayReason" />
        <CSelect horizontal label="Firma-Takım:" :options="teams" placeholder="Seçiniz" :value.sync="updateDelay.companyTeam" v-model="updateDelay.companyTeam" />
        <CSelect horizontal label="Sorumlu Birey:" :options="persons" placeholder="Seçiniz" :value.sync="updateDelay.chargePerson" v-model="updateDelay.chargePerson" />
        <CInput size="sm" horizontal label="Öteleme Açıklama:" placeholder="Öteleme Açıklama:" :value="updateDelay.delayDetail" v-model="updateDelay.delayDetail" />
        <CInput size="sm" type="date" horizontal label="Girildiği Tarih:" v-model="updateDelay.dateCurrent" />
      </CCardBody>
      <div slot="footer" class="w-100">
        <CButton style="border-radius: 0.2rem; color: white" color="info" class="ml-1 mr-1 float-right" @click="updateMethod(updateDelay)">
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
  name: "Kisit",
  data() {
    return {
      fields: [
        { key: "id", label: "#", _style: "width:1cm;" },
        {
          key: "marked",
          label: "Seç",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        { key: "aboveLine", label: "Hat Bilgisi", _style: "width:1cm" },
        { key: "dateCurrent", label: "Girildiği Tarih", _style: "width:1cm" },
        { key: "chargePerson", label: "Sorumlu Birey", _style: "width:1cm" },
        { key: "companyTeam", label: "Firma-Takım", _style: "width:1cm" },
        { key: "materialText", label: "Malzeme Tanımı", _style: "width:1cm" },
        { key: "materialCode", label: "Malzeme Kodu", _style: "width:1cm" },
        { key: "productCode", label: "Ürün Kodu", _style: "width:1cm" },
        { key: "amount", label: "Plandaki Miktar", _style: "width:1cm" },
        { key: "plannedDate", label: "Plan Tarihi", _style: "width:1cm" },
        /*{ key: "customer", label: "Müşteri", _style: "width:1cm" },*/
        { key: "delayAmount", label: "Öteleme Miktarı", _style: "width:1cm" },
        { key: "delayDate", label: "Ötelenecek Tarih", _style: "width:1cm" },
        { key: "delayReason", label: "Öteleme Sebebi", _style: "width:1cm" },
        { key: "delayDetail", label: "Öteleme Açıklama", _style: "width:1cm" },
        { key: "version", label: "Hat Bilgisi", _style: "width:1cm" },
        { key: "update", label: "Düzenle", _style: "width:1cm" },
        { key: "delete", label: "Sil", _style: "width:1cm" },
      ],
      items: [],
      markedList: [],
      updateModal: false,
      updateDelay: {},
      persons: [],
      teams: [],
      reasons: [],
      chosenMessage: "Tümünü Seç",
      dangerModal: false,
      successModal: false,
      messageModal: "",
      uploading: false,
      elementCover: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    toogleConstraint(item) {
      this.updateModal = true;
      this.updateDelay = item;
      this.fetchPersons();
      this.fetchReasons();
      this.fetchTeams();
    },
    getCurrentDate(item) {
      var today = new Date();
      item.dateCurrent = new Date().toISOString().substr(0, 10);
    },
    fetchData() {
      this.items = [];
      this.updateModal = false;
      this.uploading = true;
      axios
        .get(`${CONFIG.api.invokeUrl}constraint`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          this.uploading = false;
          var i = 0;
          this.items = response.data.filter(
            (t) => t.isMarked === false && t.isDelayEntered === true
          );
          this.items = this.items.map((item) => {
            return { ...item, id: ++i };
          });
        })
        .catch((e) => {
          this.uploading = true;
        });
    },
    fetchReasons() {
      axios
        .get(`${CONFIG.api.invokeUrl}postponementReason`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          this.reasons = response.data.map((x) => x.delayName);
        })
        .catch((e) => {});
    },
    fetchPersons() {
      axios
        .get(`${CONFIG.api.invokeUrl}chargePersons`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          this.persons = response.data.map((x) => x.personName);
        })
        .catch((e) => {});
    },
    fetchTeams() {
      axios
        .get(`${CONFIG.api.invokeUrl}companyTeam`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          this.teams = response.data.map((x) => x.companyName);
        })
        .catch((e) => {});
    },
    sendToMarked() {
      this.markedList = this.items.filter(
        (t) => t.isMarked === true && t.isDelayEntered === true
      );

      if (this.markedList.length !== 0) {
        this.markedList.map((x) => this.updateConstraintForMarked(x));
        this.fetchData();
        this.markedList = [];
      }
    },
    updateConstraintForMarked(item) {
      axios
        .put(
          `${CONFIG.api.invokeUrl}constraint/${item.constraintID}`,
          {
            isMarked: true,
            isDelayEntered: true,
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
            aboveLine: item.aboveLine,
            treeAmount:item.treeAmount,
            mip:item.mip,
            tob:item.tob
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {})
        .catch((e) => {});
    },
    updateConstraint(item) {
      axios
        .put(
          `${CONFIG.api.invokeUrl}constraint/${item.constraintID}`,
          {
            isMarked: false,
            isDelayEntered: true,
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
            aboveLine: item.aboveLine,
            treeAmount:item.treeAmount,
            mip:item.mip,
            tob:item.tob
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {})
        .catch((e) => {});
    },
    updateMethod(item) {
      if (parseInt(item.delayAmount) > parseInt(item.amount)) {
        this.messageModal = "Öteleme miktarı planlanan miktardan fazla olamaz!";
        this.updateModal = false;
        this.dangerModal = true;
        return;
      }

      if (parseInt(item.delayAmount) <= 0) {
        this.messageModal = "Öteleme miktarı sıfır yada sıfırdan küçük olamaz!";
        this.updateModal = false;
        this.dangerModal = true;
        return;
      }
      this.updateConstraint(item);
      this.updateDelayHistory(item);
    },
    updateDelayHistory(delay) {
      axios
        .put(
          `${CONFIG.api.invokeUrl}delayHistory/${delay.delayID}`,
          {
            isMarked: false,
            isArchive: delay.isArchive,
            delayID: delay.delayID,
            productCode: delay.productCode,
            delayCode: delay.delayCode,
            delayAmount: delay.amount,
            delayDate: delay.delayDate,
            delayReason: delay.delayReason,
            delayDetail: delay.delayDetail,
            companyTeam: delay.companyTeam,
            chargePerson: delay.chargePerson,
            madeDate: delay.dateCurrent,
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {
          this.updateModal = false;

          this.fetchData();
        })
        .catch((e) => {
          this.messageModal = "Tekrar Deneyiniz!";
          this.dangerModal = true;
        });
    },
    deleteConstraint(item) {
      axios
        .put(
          `${CONFIG.api.invokeUrl}constraint/${item.constraintID}`,
          {
            isMarked: false,
            isDelayEntered: false,
            constraintID: item.constraintID,
            materialCode: item.materialCode,
            materialText: item.materialText,
            productCode: item.productCode,
            plannedDate: item.plannedDate,
            amount: item.amount,
            customer: item.customer,
            version: item.version,
            delayID: "",
            delayCode: "",
            delayAmount: "",
            delayDate: "",
            delayReason: "",
            delayDetail: "",
            companyTeam: "",
            chargePerson: "",
            dateCurrent: "",
            aboveLine: item.aboveLine,
            treeAmount:item.treeAmount,
            mip:item.mip,
            tob:item.tob
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {
          this.deleteDelay(item);
          this.messageModal = "Başarıyla Silindi!";
          this.successModal = true;
        })
        .catch((e) => {
          this.messageModal = "Tekrar Deneyiniz!";
          this.dangerModal = true;
        });
    },
    deleteDelay(item) {
      axios
        .delete(`${CONFIG.api.invokeUrl}delayHistory/${item.delayID}`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          this.fetchData();
        })
        .catch((e) => {});
    },
    chosenAll() {
      if (this.items.length !== 0) {
        if (this.chosenMessage === "Tümünü Seç") {
          this.items.map((x) => {
            x.isMarked = true;
          });
          this.chosenMessage = "Tümünü Kapat";
        } else if (this.chosenMessage === "Tümünü Kapat") {
          this.items.map((x) => {
            x.isMarked = false;
          });
          this.chosenMessage = "Tümünü Seç";
        }
      }
    },
    Export() {
      if (this.items.length !== 0) {
        this.uploading = true;
        axios
          .get(`${CONFIG.api.invokeUrl}excelPlan?isMark=${false}`, {
            headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
            responseType: "blob",
          })
          .then((result) => {
            this.uploading = false;

            var date = new Date().toISOString().substr(0, 10);
            //var myBlob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
            const url = window.URL.createObjectURL(result.data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `IsaretlenmisKisitlar{${date}}.xlsx`); //or any other extension
            document.body.appendChild(link);
            link.click();
            this.messageModal = "Excel Dosyasına Aktarıldı.";
            this.successModal = true;
          });
      } else {
        this.messageModal = "Tablo Boş";
        this.dangerModal = true;
      }
    },
  },
};
</script>
