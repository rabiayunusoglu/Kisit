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
      <CCardBody>
        <center>
          <h5>ZKP3 Değişiklik</h5>
        </center>
        <CRow>
          <div style="padding-left: 20px;">
            <CButton @click="fetch()" color="info" horizontal v-c-tooltip.hover="{
                  content: `Tüm ZKP3'ü getirir.`
                }">
              Tümünü Getir
            </CButton>
          </div>
          <div class="col" style="padding-left: 20px;">

            <CButton color="success" horizontal @click="Export()" v-c-tooltip.hover="{
                  content: `Tüm ZKP3'ü excel'e aktarır.`
                }">
              Excel Aktar
            </CButton>
          </div>

          <div style="padding-left: 40px;">

            <template>
              Başlangıç:
              <input type="date" :value="startDate" class="mr-2" @change="setDateFilter" />
              Bitiş:
              <input type="date" :value="endDate" @change="e => setDateFilter(e, 'end')" />

            </template>
          </div>
          <div style="padding-left: 10px;">
            <template>
              <CButton @click="fetchDataFromDate()" color="dark" v-c-tooltip.hover="{
                  content: `Tarihler arasındaki ZKP3'ü getirir.`
                }">
                Getir
              </CButton>
            </template>
          </div>
          <div style="padding-left:10px;padding-right:20px;">
            <template>
              <CButton @click="ExportByDate()" color="success" horizontal v-c-tooltip="{
                  content: `Tarihler arasındaki ZKP3'ü excel'e aktarır.`
                }">
                Excel Aktar
              </CButton>
            </template>
          </div>

        </CRow>

        <CDataTable column-filter :items="items" :fields="fields" :noItemsView="{ noResults: 'Sonuç Yok', noItems: message }" hover sorter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{label: 'Sayfalar'}" pagination>
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import CONFIG from "@/config.json";
import axios from "axios";
import ServiceToken from "../../service/TokenService";

export default {
  name: "ZKPChanged",
  data() {
    return {
      fields: [
        //{ key: "materialText", label: "Malzeme Tanımı", _style: "width:1cm" },
        { key: "materialCode", label: "Malzeme Kodu", _style: "width:1cm" },
        { key: "companyTeamCode", label: "Satıcı", _style: "width:1cm" },
        { key: "dateCurrent", label: "Kayıt Tarih", _style: "width:1cm" },
        {
          key: "changedAmount",
          label: "Ür. Plan değişiklik(ADET)",
          _style: "width:1cm",
        },
        { key: "delayReason", label: "Öteleme Sebebi", _style: "width:1cm" },
        { key: "companyTeam", label: "Satıcı Tanım", _style: "width:1cm" },
        { key: "chargePerson", label: "Sorumlu Birey", _style: "width:1cm" },
        //{ key: "productCode", label: "Ürün Kodu", _style: "width:1cm" },
        //{ key: "amount", label: "Plandaki Miktar", _style: "width:1cm" },
        // { key: "plannedDate", label: "Plan Tarihi", _style: "width:1cm" },
        //{ key: "customer", label: "Müşteri", _style: "width:1cm" },
        /*{ key: "delayAmount", label: "Öteleme Miktarı", _style: "width:1cm" },
        { key: "delayDate", label: "Ötelenecek Tarih", _style: "width:1cm" },
        { key: "delayReason", label: "Öteleme Sebebi", _style: "width:1cm" },
        { key: "delayDetail", label: "Öteleme Açıklama", _style: "width:1cm" },
        { key: "version", label: "Hat Bilgisi", _style: "width:1cm" },*/
      ],

      items: [],
      message: "Tablo Boş",
      dangerModal: false,
      successModal: false,
      messageModal: "",
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
      isUsingDateFilter: false,
      deletedValue: [],
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch() {
      axios
        .get(`${CONFIG.api.invokeUrl}meeting`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          this.items = response.data;
        })
        .catch((e) => {});
    },
    Export() {
      if (this.items.length !== 0 || this.isUsingDateFilter===true) {
        axios
          .get(`${CONFIG.api.invokeUrl}excelMeeting?name=${"Company"}`, {
            headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
            responseType: "blob",
          })
          .then((result) => {
            var date = new Date().toISOString().substr(0, 10);
            //var myBlob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
            const url = window.URL.createObjectURL(result.data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `ZKP3_DEGISIKLIK{${date}}.xlsx`); //or any other extension
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
    setDateFilter(e, end) {
      if (end) {
        this.endDate = new Date(e.target.value).toISOString().substr(0, 10);
      } else {
        this.startDate = new Date(e.target.value).toISOString().substr(0, 10);
      }
    },
    /**
     * Iki tarih arasindaki veriyi veritabanindan cagiran methottur.
     */
    fetchDataFromDate() {
      axios
        .get(
          `${CONFIG.api.invokeUrl}meeting?startDate=${this.startDate}&endDate=${this.endDate}`,
          {
            headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
          }
        )
        .then((response) => {
          this.items = response.data;
          this.isUsingDateFilter = true;
        })
        .catch((e) => {});
    },
    /**
     * Iki tarih arasındaki exportlama methodur.
     */
    ExportByDate() {
      if (this.items.length !== 0) {
        axios
          .get(
            `${CONFIG.api.invokeUrl}excelMeeting?name=${"Company"}&startDate=${this.startDate}&endDate=${this.endDate}`,
            {
              headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
              responseType: "blob",
            }
          )
          .then((result) => {
            const url = window.URL.createObjectURL(result.data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
              "download",
              `ZKP3_DEGISIKLIK{${this.startDate}-${this.endDate}}.xlsx`
            );
            document.body.appendChild(link);
            link.click();
            this.messageModal = "Excel Dosyasına Aktarıldı";
            this.successModal = true;
          })
          .catch((e) => {
            this.messageModal = "Tablo Boş";
            this.dangerModal = true;
          });
      } else {
        this.messageModal = "Tablo Boş";
        this.dangerModal = true;
      }
    },
  },
};
</script>
