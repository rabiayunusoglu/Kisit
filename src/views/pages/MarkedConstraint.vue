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
          <h4>İşaretlenmiş Kısıtlar</h4>
        </center>
      </CCardHeader>
      <CCardBody>

        <CRow>

          <div style="padding-left: 20px;">
            <CButton color="primary" horizontal @click="sendToArchive()">
              Seçilenleri Arşivle
            </CButton>
          </div>

          <div style="padding-left: 20px;">
            <template>
              {{chosenMessage}}:
            </template>

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
        <CDataTable column-filter :items="items" :fields="fields" :noItemsView="{ noResults: 'Sonuç Yok', noItems: 'Tablo Boş' }" hover sorter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{ label: 'Sayfalar' }" pagination>
          <template #marked="{item}">
            <td>
              <CSwitch color="primary" size="lg" :checked.sync="item.isMarked" />
            </td>

          </template>
          <template #archive="{item}">
            <td>
              <CButton size="sm" horizontal color="dark" @click="updateConstraintForNoMarked(item)">
                Çıkar
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
        {
          key: "id",
          label: "#",
          _style: "width:1cm;",
          sorter: false,
          filter: false,
        },
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
        {
          key: "archive",
          label: "İşaretten Çıkar",
          _style: "width:1cm",
          sorter: false,
          filter: false,
        },
        {
          key: "delete",
          label: "Sil",
          _style: "width:1cm",
          sorter: false,
          filter: false,
        },
      ],
      items: [],
      archiveList: [],
      chosenMessage: "Tümünü Seç",
      itemsSameData: [],
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
    //Oteleme girilmis ve isaretlenmis olan kisitlar getirlir,'items' objesinin iceresine atilir.
    fetchData() {
      this.items = [];
      this.archiveList=[];
      this.uploading = true;
      axios
        .get(`${CONFIG.api.invokeUrl}constraint`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          this.uploading = false;
          var i = 0;
          this.items = response.data.filter(
            (t) => t.isMarked === true && t.isDelayEntered === true
          );
          this.items = this.items.map((item) => {
            return { ...item, id: ++i };
          });
          //ilk basta, "Seç" blogu altinda, hepsi secili gelmesin diye false degerini atiyorum. Cunku switch butonlari bu degere gore sekronize calısıyor.
          // Secilenleri isaretten cikarirken ve arsivlerken dogru degerleri veriyorum.
          this.items.map((x) => (x.isMarked = false));
         
        })
        .catch((e) => {
          this.uploading = false;
        });
    },
    //
    sendToArchive() {
      this.archiveList = this.items.filter(
        (t) => t.isMarked === true && t.isDelayEntered === true
      );
      if (this.archiveList.length !== 0) {
        this.archiveList.map((x) => this.archiveConstraint(x));
        this.archiveList = [];
        this.fetchData();
      }
    },
    updateConstraintForNoMarked(item) {
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
             aboveLine:item.aboveLine,
             treeAmount:item.treeAmount,
            mip:item.mip,
            tob:item.tob
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {
          this.fetchData();
        })
        .catch((e) => {});
    },
    // Sil Butonuna Tiklandiginda:
    // 1) Girilen kisitin daha once oteleme girilmemis haline cevrilir.(Put request ile)
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
             aboveLine:item.aboveLine,
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
    //Sil Butonuna Tiklandiginda:
    //2) Cevrildikten sonra, oteleme gecmisine girilmis oteleme silinir. (Delete request ile)
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
    archiveConstraint(item) {
      //toplanti sayfasina aktariliyor
      this.transferToMeeting(item);
      this.transferToMeetingTeam(item);
      this.updateDelayHistory(item);
    },
    //delay arsivleniyor
    updateDelayHistory(delay) {
      axios
        .put(
          `${CONFIG.api.invokeUrl}delayHistory/${delay.delayID}`,
          {
            isMarked: true,
            isArchive: true,
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
          this.addArchiveConstraint(delay);
        })
        .catch((e) => {
          this.messageModal = "Tekrar Deneyiniz!";
          this.dangerModal = true;
        });
    },
    //arsiv kisitina ekleniyor.
    addArchiveConstraint(item) {
      axios
        .post(
          `${CONFIG.api.invokeUrl}archiveConstraint`,
          {
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
          this.deleteConstraintArchive(item);
        })
        .catch((e) => {});
    },
    //kisit tablosundan eklenen satır silinir.
    deleteConstraintArchive(item) {
      axios
        .delete(`${CONFIG.api.invokeUrl}constraint/${item.constraintID}`, {
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
          .get(`${CONFIG.api.invokeUrl}excelPlan?isMark=${true}`, {
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
    transferToMeeting(item) {
      axios
        .post(
          `${CONFIG.api.invokeUrl}meeting`,
          {
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
            changedAmount: 1,
            companyTeamCode: item.companyTeamCode,
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {
          this.messageModal =
            "Yan sanayi firmalar ve ekipler toplantı sayfalarına aktarıldı.";
          this.successModal = true;
        })
        .catch((e) => {
          this.messageModal =
            "Yan sanayi firmalar ve ekipler toplantı sayfalarına aktarılamadı.Tekrar Deneyiniz!";
          this.dangerModal = true;
        });
    },
    transferToMeetingTeam(item) {
      axios
        .post(
          `${CONFIG.api.invokeUrl}meetingTeam`,
          {
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
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {
          this.messageModal =
            "Yan sanayiye ait olanlar toplantı sayfasına aktarıldı.";
          this.successModal = true;
        })
        .catch((e) => {
          this.messageModal =
            "Yan sanayiye ait olanlar toplantı sayfasına aktarılamadı.Tekrar Deneyiniz!";
          this.dangerModal = true;
        });
    },
  },
};
</script>
