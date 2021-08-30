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
    <!-- warrning Modal Component -->
    <CModal size="sm" :show.sync="warningModal" :closeOnBackdrop="false">
      <center>
        <h5>{{messageModal}}</h5>
      </center>
      <div slot="footer" class="w-100">
        <CRow>
          <div class="col"></div>
          <div style="padding-left: 40px;" align="left">
            <CButton @click="deleteArchiveConstraint(deletedValue)" color="success">
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
          <h4>Arşivlenmiş Kısıtlar</h4>
        </center>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <div v-if="controlUser()" style="padding-left: 10px;">
            <CButton color="primary" horizontal @click="sendToMarked()">
              Seçilenleri Arşivden Çıkar
            </CButton>
          </div>
          <div style="padding-left: 20px;">
            <CButton @click="fetchData()" color="info" horizontal v-c-tooltip.hover="{
                  content: `Tüm arşivlenmiş kısıtları getirir.`
                }">
              Tümünü Getir
            </CButton>
          </div>
          <div class="col" style="padding-left: 20px;">

            <CButton color="success" horizontal @click="Export()" v-c-tooltip.hover="{
                  content: `Tüm arşivi excel'e aktarır.`
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
                  content: `Tarihler arasındaki arşivlenmiş kısıtları getirir.`
                }">
                Getir
              </CButton>
            </template>
          </div>
          <div style="padding-left:10px;padding-right:20px;">
            <template>
              <CButton @click="ExportByDate()" color="success" horizontal v-c-tooltip="{
                  content: `Tarihler arasındaki arşivlenmiş kısıtları excel'e aktarır.`
                }">
                Excel Aktar
              </CButton>
            </template>
          </div>

        </CRow>
        <CDataTable :items="items" :fields="fields" column-filter :noItemsView="{ noResults: 'Sonuç Yok', noItems: 'Tablo Boş' }" hover sorter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{ label: 'Sayfalar' }" pagination>
          <template #marked="{item}">
            <td>
              <CSwitch v-if="controlUser()" color="primary" size="lg" :checked.sync="item.isMarked" />
            </td>

          </template>

          <template #delete="{item}">
            <td>
              <CButton v-if="controlUser()" size="sm" horizontal color="danger" @click="deleteMethod(item)">
                <CIcon name="cil-trash"> </CIcon>
              </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
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
  name: "ArchiveConstraint",
  data() {
    return {
      fields: [
         { key: "id", label: "#", _style: "width:1cm;", sorter: false,
          filter: false,},
        {
          key: "marked",
          label: "Seç",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        { key: "aboveLine", label: "Hat Bilgisi", _style: "width:1cm" },
        { key: "materialCode", label: "Öteleme Kodu", _style: "width:1cm" },
        { key: "materialText", label: "Malzeme Tanımı", _style: "width:1cm" },
        { key: "productCode", label: "Ürün Kodu", _style: "width:1cm" },
        { key: "plannedDate", label: "Plan Tarihi", _style: "width:1cm" },
        { key: "amount", label: "Plandaki Miktar", _style: "width:1cm" },
        { key: "customer", label: "Müşteri", _style: "width:1cm" },
        { key: "version", label: "Hat Bilgisi", _style: "width:1cm" },
        { key: "delayAmount", label: "Öteleme Miktarı", _style: "width:1cm" },
        { key: "delayDate", label: "Ötelenecek Tarih", _style: "width:1cm" },
        { key: "delayReason", label: "Öteleme Sebebi", _style: "width:1cm" },
        { key: "delayDetail", label: "Öteleme Açıklama", _style: "width:1cm" },
        { key: "companyTeam", label: "Firma-Takım", _style: "width:1cm" },
        { key: "chargePerson", label: "Sorumlu Birey", _style: "width:1cm" },
        { key: "dateCurrent", label: "Girildiği Tarih", _style: "width:1cm" },
        { key: "delete", label: "Sil", _style: "width:1cm", sorter: false,
          filter: false, },
      ],
      items: [],
      markedList: [],
      dangerModal: false,
      successModal: false,
      warningModal: false,
      messageModal: "",
      uploading: false,
      elementCover: false,
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
      isUsingDateFilter: false,
      deletedValue: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    /*Veritabanindaki tum arsiv tablosunu getirir.Items parametresine atar.
    Ilk basta isMarked degeri false olarak belirlenir sec butonunu buna bagli yaptigim icin, 
    zaten arsivden cikarirken otomatik isaretlenmise gidecegi icin isMarked true olmalidir.*/
    fetchData() {
      this.items = [];
      this.uploading = true;
      axios
        .get(`${CONFIG.api.invokeUrl}archiveConstraint`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          this.uploading = false;
          var i=0;
          this.items = response.data.map((x) => {
            return { ...x, isMarked: false, id:++i };
          });
        })
        .catch((e) => {
          this.uploading = false;
        });
    },
    /**
     *Items listesindeki isMarked===true olduğu kisimlari markedListesine atıyorum.
     *Listedeki her bir elemani Kisit Tablosuna geri ekliyorum.
     *markedListesini sifirliyorum.
     */
    sendToMarked() {
      this.markedList = this.items.filter((t) => t.isMarked === true);
      if (this.markedList.length !== 0) {
        this.markedList.map((x) => this.postConstraintForMarked(x));
        if (this.isUsingDateFilter) this.fetchDataFromDate();
        else this.fetchData();
        this.messageModal = "Arşivden Çıkarıldı";
        this.successModal = true;
        this.markedList = [];
      }
    },
    /**
     * Postlama islemi sirasinda kisitin bagli oldugu oteleme gecmisi arsivden put'lama islemi ile cikarilir.
     * Kisit arsiv talosundan silinir.
     */
    postConstraintForMarked(item) {
      axios
        .post(
          `${CONFIG.api.invokeUrl}constraint`,
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
            aboveLine:item.aboveLine,
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {
          this.updateDelayhistory(item);
          this.deleteArchiveConstraint(item);
          if (this.isUsingDateFilter) this.fetchDataFromDate();
          else this.fetchData();
        })
        .catch((e) => {});
    },
    deleteArchiveConstraint(item) {
      axios
        .delete(
          `${CONFIG.api.invokeUrl}archiveConstraint/${item.constraintID}`,
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {
          this.warningModal=false;
          //this.messageModal=("Başarıyla Silindi!");
          if (this.isUsingDateFilter) this.fetchDataFromDate();
          else this.fetchData();
        })
        .catch((e) => {
          this.messageModal = "Tekrar Deneyiniz!";
          this.dangerModal = true;
        });
    },
    updateDelayhistory(delay) {
      axios
        .put(
          `${CONFIG.api.invokeUrl}delayHistory/${delay.delayID}`,
          {
            isMarked: delay.isMarked,
            isArchive: false,
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
          if (this.isUsingDateFilter) this.fetchDataFromDate();
          else this.fetchData();
          //s this.messageModal=("Arşivlendi");
        })
        .catch((e) => {
          this.messageModal = "Tekrar Deneyiniz!";
          this.dangerModal = true;
        });
    },
    /**
     * Arsiv tablosundan silerken emin misiniz diye sordurttugum method
     */
    deleteMethod(item) {
      this.messageModal = "Emin misiniz?";
      this.warningModal = true;
      this.deletedValue = item;
    },
    /**
     * Tum arsiv tablosunu exportlar
     */
    Export() {
      if (this.items.length !== 0 || this.isUsingDateFilter===true) {
        this.uploading = true;
        axios
          .get(`${CONFIG.api.invokeUrl}excelTree`, {
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
            link.setAttribute("download", `ArsivlenmisKisitlar{${date}}.xlsx`); //or any other extension
            document.body.appendChild(link);
            link.click();
            this.messageModal = "Excel Dosyasına Aktarıldı";
            this.successModal = true;
          })
          .catch((e) => {
            this.uploading = false;
            this.messageModal = "Excele aktarılamadı";
            this.dangerModal = true;
          });
      } else {
        this.messageModal = "Tablo Boş";
        this.dangerModal = true;
      }
    },
    /**
     * Kullanici turune gore yetki kontrol methodur.
     * Eger Admin ise editleme silme islemleri serbest,
     * User ise arsiv sadece goruntulenebilir ve exportlanabilir
     */
    controlUser() {
      const userType = ServiceToken.getUserType();
      if (userType === "U") return false;
      else if (userType === "A") return true;
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
      this.uploading = true;
      axios
        .get(
          `${CONFIG.api.invokeUrl}archiveConstraint?startDate=${this.startDate}&endDate=${this.endDate}`,
          {
            headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
          }
        )
        .then((response) => {
          this.uploading = false;
          var i=0;
          this.items = response.data.map((x) => {
            return { ...x, isMarked: false, id:++i }});
          this.isUsingDateFilter = true;
        })
        .catch((e) => {
          this.uploading = false;
        });
    },
    /**
     * Iki tarih arasındaki exportlama methodur.
     */
    ExportByDate() {
      if (this.items.length !== 0) {
        this.uploading = true;
        axios
          .get(
            `${CONFIG.api.invokeUrl}excelTree?startDate=${this.startDate}&endDate=${this.endDate}`,
            {
              headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
              responseType: "blob",
            }
          )
          .then((result) => {
            this.uploading = false;
            const url = window.URL.createObjectURL(result.data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
              "download",
              `ArsivlenmisKisitlar{${this.startDate}-${this.endDate}}.xlsx`
            );
            document.body.appendChild(link);
            link.click();
            this.messageModal = "Excel Dosyasına Aktarıldı";
            this.successModal = true;
          })
          .catch((e) => {
            this.uploading = false;
            this.messageModal = "Tablo Boş";
            this.dangerModal = true;
          });
      } else {
        this.messageModal = "Tablo Boş";
        this.dangerModal = true;
        this.uploading = false;
      }
    },
  },
};
</script>
