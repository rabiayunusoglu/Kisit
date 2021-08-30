<template>
  <CCard>
    <CCardHeader>
      <center>
        <h5>Ürün Ağacı</h5>
      </center>
    </CCardHeader>

    <CCardBody>
      <CDataTable :items="items" :fields="fields" table-filter column-filter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{ label: 'Sayfalar' }" :tableFilter="{ label: 'Filtre', placeholder: 'Ara' }" :noItemsView="{ noResults: 'Sonuç Yok', noItems: 'Tablo Boş' }" hover sorter pagination />
    </CCardBody>
    <CCardFooter> </CCardFooter>
    <!-- Looading Component -->
    <CElementCover v-if="uploading" :show.sync="elementCover" :boundaries="[{ sides: ['top', 'left'], query: '.media-body' }]" :opacity="0.8">
      <h1 class="d-inline"></h1>
      <CSpinner size="5xl" color="success" />
    </CElementCover>
  </CCard>

</template>
<script>
import CONFIG from "@/config.json";
import axios from "axios";
import ServiceToken from "../../../service/TokenService";
const fields = [
   { key: "id", label: "#", _style: "width:1cm;" },
  { key: "productCode", label: "Ürün Kodu", _style: "min-width:50px" },
  { key: 'productText',label:"Ürün Metni", _style: "min-width:50px" },
  { key: 'UA_klnm', _style:'width:1cm' },
  { key: 'alt_UA', _style:'width:1cm' },
  { key: 'higherCode',label:"Üst Kodu", _style:'width:1cm' },
  { key: 'higherCodeText',label:"Üst Kod Metni", _style:'min-width:50px' },
  { key: 'sparePart',label:"Yedek Parça", _style:'width:1cm' },
  { key: "materialCode", label: "Malzeme Kodu", _style: "width:1cm" },
  { key: "materialText", label: "Malzeme Metni", _style: "min-width:50px" },
  { key: 'amount',label:"Miktar", _style:'width:1cm' },
  { key: 'mip', _style:'width:1cm' },
  { key: 'tob', _style:'width:1cm' },
  { key: 'mtu', _style:'width:1cm' },
  { key: 'goodGroup',label:"Mal Grubu", _style:'width:1cm' },
  { key: 'validityDate', label:"Geçerlilik Tarihi",_style:'width:1cm' },
  { key: 'finishDate', label:"Bitiş Tarihi",_style:'width:1cm' },
  { key: 'tdrType', label:"Tedarik Türü",_style:'min-width:50px' },
];

export default {
  name: "AdvancedTables",
  data() {
    return {
      items: [],
      fields,
      details: [],
      collapseDuration: 0,
      uploading: false,
      elementCover: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
       this.uploading = true;
      axios
        .get(`${CONFIG.api.invokeUrl}productTree`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
           this.uploading = false;
           var i=0;
          this.items = response.data.map(item=>{return{...item,id:++i}});
        })
        .catch((e) => {
          this.uploading = false;
        });
    },
  },
};
</script>