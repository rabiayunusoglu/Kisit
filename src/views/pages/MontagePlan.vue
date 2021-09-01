<template>
  <div>
    <CCard>
      <CCardHeader>
        <center>
          <h5>Montaj Üretim Planı</h5>
        </center>
      </CCardHeader>

      <CCardBody>
        <CDataTable :items="items" :fields="fields" table-filter column-filter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{ label: 'Sayfalar' }" :tableFilter="{ label: 'Filtre', placeholder: 'Ara' }" :noItemsView="{ noResults: 'Sonuç Yok', noItems: 'Tablo Boş' }" hover sorter pagination />
      </CCardBody>
      <CCardFooter> </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      fields: [
        { key: "id", label: "#", _style: "width:1cm;" },
        { key: "aboveLine", label: "Hat Bilgisi", _style: "width:1cm;" },
        { key: "productCode", label: "Ürün Kodu", _style: "width:1cm" },
        { key: "version", label: "Hat Bilgisi", _style: "width:1cm" },
        { key: "plannedDate", label: "Plan Tarihi", _style: "width:1cm" },
        { key: "amount", label: "Miktar", _style: "width:1cm" },
        { key: "customerType", label: "Müşteri", _style: "width:1cm" },
        { key: "frame", label: "Frame", _style: "width:1cm" },
        { key: "relevant_month", label: "İlgili Ay", _style: "width:1cm" },
      ],
      items: [],
      details: [],
      collapseDuration: 0,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios
        .get("montageProductPlan")
        .then((response) => {
          var i = 0;
          this.items = response.data.map((item) => {
            return { ...item, id: ++i };
          });
        })
        .catch((e) => {});
    },
  },
};
</script>
