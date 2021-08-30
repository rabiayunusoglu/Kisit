<template>
  <div>
    <CCard>
      <CCardBody>
        <center>
          <h5>Arşivlenmiş Öteleme Geçmişleri</h5>
        </center>
        <CDataTable table-filter column-filter :tableFilter="{label: 'Filtre', placeholder:'Ara'}" :items="itemsDelay" :fields="fields" :noItemsView="{ noResults: 'Sonuç Yok', noItems: message }" hover sorter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{label: 'Sayfalar'}" pagination>
          <template #update="{item}">
            <CButton style="margin:3px" size="sm" @click="archiveDelayHistory(item)" color="dark">
              Çıkar
            </CButton>
            <CButton style="margin:3px" color="danger" size="sm" horizontal @click=" deleteDelayHistory(item)">
              <CIcon name="cil-trash"> </CIcon>
            </CButton>
          </template>

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
  name: "ArchiveDelayHistory",
  data() {
    return {
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
        { key: "update", label: "", _style: "width:1cm" },
      ],

      itemsDelay: [],
      message: "Tablo Boş",
    };
  },
  mounted() {
    this.fetchDataDelay();
  },
  methods: {
    fetchDataDelay() {
      if (this.searchProduct !== "") {
        axios
          .get(`${CONFIG.api.invokeUrl}delayHistory`, {
            headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
          })
          .then((response) => {
            this.itemsDelay = response.data.filter((t) => t.isArchive === true);
          })
          .catch((e) => {});
      }
    },
    archiveDelayHistory(delay) {
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
          this.fetchDataDelay();
          alert("Arşivden Çıkarıldı");
        })
        .catch((e) => {
          alert("Tekrar Deneyiniz! archiveDelayFromModal");
        });
    },
    deleteDelayHistory(item) {
      axios
        .delete(`${CONFIG.api.invokeUrl}delayHistory/${item.delayID}`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          alert("Silindi");
          this.fetchDataDelay();
        })
        .catch((e) => {
          alert("Tekrar deneyiniz.deleteDelayFromModal");
        });
    },
  },
};
</script>
