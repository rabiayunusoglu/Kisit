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
    <!-- warning Modal Component -->
    <CModal size="lg" :show.sync="warningModal" color="warning">
      <center>
        <h5>{{messageModal}}</h5>
      </center>
      <div slot="footer" class="w-100">
      </div>
    </CModal>
    <!-- warning For Above Line Modal Component -->
    <CModal size="lg" :show.sync="warningAboveLineModal" :closeOnBackdrop="false">
      <center>
        <h5>{{messageModal}}</h5>
      </center>
      <div slot="footer" class="w-100">
        <CRow>
          <div class="col"></div>
          <div style="padding-left: 40px;" align="left">
            <CButton @click="yesForAboveLine(forcedItem)" color="success">
              Evet
            </CButton>
          </div>
          <div style="padding-left: 20px;padding-right: 20px;">
            <CButton @click="noForAboveLine(forcedItem)" color="danger">
              Hayır
            </CButton>
          </div>

        </CRow>
      </div>
    </CModal>

    <CCard>
      <CCardHeader>
        <center>
          <h5>Ekiplerin Rapuru</h5>
        </center>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <div style="padding-left: 10px;">
            <CButton color="primary" horizontal @click="setButtonLocation()" v-c-tooltip.hover="{
                  content: `Öteleme sebeplerinin tümünü ${hideShow} `
                }">
              {{hideShow}}
            </CButton>
          </div>
          <div style="padding-left: 20px;">
            <CButton @click="fetchData()" color="info" horizontal v-c-tooltip.hover="{
                  content: `Tüm toplantıyı hesaplar.`
                }">
              Tümünü Hesapla
            </CButton>
          </div>
          <div class="col" style="padding-left: 20px;">

            <CButton @click="Export()" color="success" horizontal v-c-tooltip.hover="{
                  content: `Tüm toplantıyı excel'e aktarır.`
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
              <CButton @click="fetchDataFromDateReason()" color="dark" v-c-tooltip.hover="{
                  content: `Tarihler arasındaki toplantıyı hesaplar.`
                }">
                Hesapla
              </CButton>
            </template>
          </div>
          <div style="padding-left:10px;padding-right:20px;">
            <template>
              <CButton @click="ExportByDate()" color="success" horizontal v-c-tooltip="{
                  content: `Tarihler arasındaki toplantıyı excel'e aktarır.`
                }">
                Excel Aktar
              </CButton>
            </template>
          </div>

        </CRow>

        <CDataTable :items="items" column-filter :fields="fields" :noItemsView="{ noResults: 'Sonuç Yok', noItems: 'Tablo Boş' }" hover sorter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{label: 'Sayfalar'}" pagination>
          <template #hide="{item}">
            <td>
              <CSwitch color="primary" size="lg" :checked.sync="item.hide" />
            </td>
          </template>
          <template #details="{item}">
            <CCollapse :show="item.hide">
              <CCardBody color="light">
                <CDataTable :items="itemsReasons.filter(t => t.teamName === item.teamName)" :fields="fieldsReasons" :noItemsView='{ noResults: "Sonuç Yok", noItems: "Ötelemesi Yok" }' hover sorter pagination>

                </CDataTable>
              </CCardBody>
            </CCollapse>
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
      date: "",
      fields: [
        { key: "hide", label: "Seç" },
        { key: "teamName", label: "Ekip" },
        { key: "sumAmount", label: "Toplam Miktar" },
      ],
      fieldsReasons: [
        { key: "delayReason", label: "Öteleme Sebepleri", _style: "width:1cm" },
        { key: "sumAmount", label: "Ötelenen Miktar", _style: "width:1cm" },
      ],
      items: [],
      itemsReasons: [],
      updateModal: false,
      updateDelay: {},
      constraint: {},
      dangerModal: false,
      successModal: false,
      warningModal: false,
      warningAboveLineModal: false,
      messageModal: "",
      hideShow: "Gizle",
      uploading: false,
      elementCover: false,
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
      isUsingDateFilter: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.items = [];
      this.itemsReasons = [];
      this.uploading = true;
      axios
        .get(`meetingTeam?action=${"Reason"}`)
        .then((response) => {
          this.uploading = false;
          this.itemsReasons = response.data;
          this.fetchTeamName();
        })
        .catch((e) => {
          this.uploading = false;
        });
    },
    fetchTeamName() {
      axios
        .get(`meetingTeam?action=${"Team"}`)
        .then((response) => {
          this.items = response.data.map((x) => {
            return { ...x, hide: true };
          });
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
    /**
     * Iki tarih arasindaki veriyi veritabanindan cagiran methottur.
     */
    fetchDataFromDateTeam() {
      axios
        .get(
          `meetingTeam?action=${"Team"}&startDate=${this.startDate}&endDate=${
            this.endDate
          }`
        )
        .then((response) => {
          this.uploading = false;
          var i = 0;
          this.items = response.data.map((x) => {
            return { ...x, hide: true };
          });
          this.isUsingDateFilter === true;
        })
        .catch((e) => {
          this.uploading = false;
        });
    },
    fetchDataFromDateReason() {
      this.uploading = true;
      axios
        .get(
          `meetingTeam?action=${"Reason"}&startDate=${this.startDate}&endDate=${
            this.endDate
          }`
        )
        .then((response) => {
          this.itemsReasons = response.data;
          this.fetchDataFromDateTeam();
        })
        .catch((e) => {
          this.uploading = false;
        });
    },
    setButtonLocation() {
      if (this.items.length !== 0) {
        if (this.hideShow === "Göster") {
          this.items = this.items.map((x) => {
            return { ...x, hide: true };
          });
          this.hideShow = "Gizle";
        } else if (this.hideShow === "Gizle") {
          this.items = this.items.map((x) => {
            return { ...x, hide: false };
          });
          this.hideShow = "Göster";
        }
      }
    },
    Export() {
      if (this.items.length !== 0 || this.isUsingDateFilter === true) {
        axios
          .get(`excelMeeting?name=${"Team"}`, {
            responseType: "blob",
          })
          .then((result) => {
            var date = new Date().toISOString().substr(0, 10);
            //var myBlob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
            const url = window.URL.createObjectURL(result.data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `TAKIMLAR{${date}}.xlsx`); //or any other extension
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
    ExportByDate() {
      if (this.items.length !== 0) {
        axios
          .get(
            `excelMeeting?name=${"Team"}&startDate=${this.startDate}&endDate=${
              this.endDate
            }`,
            {
              responseType: "blob",
            }
          )
          .then((result) => {
            const url = window.URL.createObjectURL(result.data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
              "download",
              `TAKIMLAR{${this.startDate}-${this.endDate}}.xlsx`
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
