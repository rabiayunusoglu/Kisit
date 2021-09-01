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

    <CInput v-if="!blockControl" size="lg" placeholder="Malzeme Kodunu Giriniz..." v-model="searchMaterial">
    </CInput>

    <center>
      <CButton v-if="!blockControl" @click="fetch()" color="primary" size="sm" horizontal>
        Ara
      </CButton>
    </center>
    <br />

    <CCard v-if="displayConstraintTable">
      <CCardHeader>
        <center>
          <h5>Kısıt Girişi</h5>
        </center>
      </CCardHeader>
      <CCardHeader>

        <CRow>
          <div style="padding-left: 10px;">
            <template>
              <CButton color="light" v-c-tooltip.hover="{
                  content: `Girilebilecek toplam öteleme miktarlarını gösterir.`
                }">
                Girilebilecek: {{totalDelayAmount}}
              </CButton>
            </template>
          </div>
          <div style="padding-left: 10px;">
            <template>
              <CButton color="light" v-c-tooltip.hover="{
                  content: `Girilen toplam öteleme miktarlarını gösterir.`
                }">
                Girilen: {{enteredDelayAmount}}
              </CButton>
            </template>
          </div>
          <div class="col" style="padding-left:10px;padding-right:10px;">
            <template>
              <CButton color="light">
                Kalan: {{totalDelayAmount-enteredDelayAmount}}
              </CButton>
            </template>
          </div>

          <div style="padding-left: 20px;">
            <CInput size="sm" style="min-width: 10px" class="m-2" placeholder="Öteleme Miktarını Giriniz" type="number" v-model="inputBoxDelayAmount" />

          </div>
          <div style="padding-left: 10px;">

            <CButton @click="divideForFaraway()" color="info" horizontal v-c-tooltip.hover="{
                content: `Girilen öteleme miktarını en uzak tarihlerden başlayarak dağıtır.`
                }">
              Dağıt-Uzak
            </CButton>
          </div>

          <div style="padding-left: 10px;">

            <CButton @click="divideForNear()" color="info" horizontal v-c-tooltip.hover="{
                  content: `Girilen öteleme miktarını en yakın tarihlerden başlayarak dağıtır.`
                }">
              Dağıt-Yakın
            </CButton>
          </div>
          <div style="padding-left:10px;padding-right:200px;">
            <template>
              <CButton @click="seperatePlanDate()" color="dark" v-c-tooltip.hover="{
                  content: `Her bir kısıtın öteleme miktarını plandakilere eşitler.`
                }">
                Plandakileri Dağıt
              </CButton>
            </template>
          </div>
          <div style="padding-left:200px;padding-right:20px;">
            <template>
              <CButton @click="copy()" color="primary" horizontal v-c-tooltip="{
                  content: `İlk satırda girilen bilgileri diğer kısıtlara aynen kopyalar.`
                }">
                Kopyala
              </CButton>
            </template>

          </div>
          <div style="padding-left:10px;padding-right:20px;">
            <template>
              <CButton @click="saveAll()" color="success" horizontal v-c-tooltip="{
                  content: `İlk satırda girilen bilgileri diğer kısıtlara aynen kopyalar.`
                }">
                Toplu Kaydet
              </CButton>
            </template>

          </div>
        </CRow>

      </CCardHeader>
      <CCardBody>

        <CDataTable :items="checkedConstraint" :fields="fieldsConstraint" :noItemsView="{ noResults: 'Sonuç Yok', noItems: 'Tablo Boş' }" hover sorter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{label: 'Sayfalar'}" pagination>
          <template #DelayCode="{item}">
            <td>
              <div>
                <CInput size="sm" style="min-width: 100px" class="m-2" :readonly="true" placeholder="Öteleme Kodunu Giriniz" :value="item.delayCode" v-model="item.delayCode" />
              </div>
            </td>
          </template>
          <template #DelayAmount="{item}">
            <td>
              <div>
                <CInput size="sm" type="number" style="min-width: 100px" class="m-2" :max='parseInt(item.amount)' :min='0' placeholder="Öteleme Miktarını Giriniz" v-model="item.delayAmount" @input="changeEnteredDelayAmount(item)" />
              </div>
            </td>
          </template>
          <template #DelayDate="{item}">
            <td>
              <div>
                <CInput size="sm" style="min-width: 100px" class="m-2" type="date" placeholder="Öteleme Tarihini Giriniz" :value.sync="item.delayDate" />
              </div>
            </td>
          </template>
          <template #DelayReason="{item}">
            <td>
              <div>
                <CSelect style="min-width: 200px" horizontal :options="reasons" placeholder="Seçiniz" :value.sync="item.delayReason" />
              </div>
            </td>
          </template>
          <template #DelayDetail="{item}">
            <td>
              <div>
                <CInput size="sm" style="min-width: 150px" class="m-2" placeholder="Açıklama giriniz" :value.sync="item.delayDetail" />
              </div>
            </td>
          </template>
          <template #CompanyTeam="{item}">
            <td>
              <div>
                <CSelect style="min-width: 200px" horizontal :options="teams" placeholder="Seçiniz" :value.sync="item.companyTeam" />
              </div>
            </td>
          </template>
          <template #ChargePerson="{item}">
            <td>
              <div>
                <CSelect style="min-width: 200px" horizontal :options="persons" placeholder="Seçiniz" :value.sync="item.chargePerson" />
              </div>
            </td>
          </template>
          <template #DateCurrent="{item}">
            <td>
              <div>
                <CInput size="sm" type="date" style="min-width: 100px" class="m-2" :value.sync="item.dateCurrent" />
              </div>
            </td>
          </template>
          <template #Save="{item}">
            <td>
              <CButton size="sm" horizontal @click="save(item)" color="success">
                <CIcon name="cil-save"> </CIcon>
              </CButton>
            </td>
            <td>
              <CButton size="sm" horizontal @click="cancel(item)" color="danger">
                <CIcon name="cil-trash"> </CIcon>
              </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <CCard v-if="!blockControl">
      <CCardBody>
        <center>
          <h5>{{searchMaterial}} Malzeme Koduna Bağlı Ürünler</h5>
        </center>
        <div>
          <CButton color="primary" horizontal @click="setButtonLocation()" v-c-tooltip.hover="{
                  content: `Öteleme geçmişlerinin tümünü ${hideShow} `
                }">
            {{hideShow}}
          </CButton>
        </div>
        <CDataTable :items="items" column-filter :fields="fields" :noItemsView="{ noResults: 'Sonuç Yok', noItems: 'Tablo Boş' }" hover sorter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{label: 'Sayfalar'}" pagination>
          <template #hide="{item}">
            <td>
              <CSwitch color="primary" size="lg" :checked.sync="item._hide" />
            </td>
          </template>
          <template #details="{item}">
            <CCollapse :show="item._hide">
              <CCardBody color="light">
                <CDataTable :items="itemsDelay.map(x=>{return { ...x, constraintID:item.constraintID,materialCode:item.materialCode,materialText:item.materialText,plannedDate:item.plannedDate,amount:item.amount,customer:item.customer, constraintDelayID:item.delayID, version:item.version}}).filter(t => t.productCode === item.productCode && t.isArchive === false)" :fields="fieldsDelay" :noItemsView='{ noResults: "Sonuç Yok", noItems: "Ötelemesi Yok" }' hover sorter items-per-page-select :items-per-page="5" :itemsPerPageSelect="{label: 'Öteleme Geçmişi'}" pagination>
                  <template #update="{item}">
                    <center>
                      <CButton size="sm" horizontal @click="toogleDelay(item)">
                        <CIcon name="cil-pencil"> </CIcon>
                      </CButton>
                      <CButton size="sm" horizontal @click="deleteDelayHistory(item)">
                        <CIcon name="cil-trash"> </CIcon>
                      </CButton>
                    </center>
                  </template>
                </CDataTable>
              </CCardBody>
            </CCollapse>
          </template>
          <template #buttonMarked="{item}">
            <center>
              <CInputCheckbox :custom="true" :checked="item._checked" :inline="true" @click="addTable(item)" />
            </center>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <CModal title="Öteleme Geçmişini Düzenle" size="lg" :show.sync="updateModal">
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
        <CInput size="sm" type="date" horizontal label="Girildiği Tarih:" v-model="updateDelay.madeDate" />
      </CCardBody>
      <div slot="footer" class="w-100">
        <CButton style="border-radius: 0.2rem; color: white" color="info" class="ml-1 mr-1 float-right" @click="updateDelayHistory(updateDelay)">
          Düzenle
        </CButton>
      </div>
    </CModal>
    <!-- Looading Component -->
    <CElementCover v-if="uploading || blockControl" :show.sync="elementCover" :boundaries="[{ sides: ['top', 'left'], query: '.media-body' }]" :opacity="0.8">
      <h1 class="d-inline">{{searchMaterial}}</h1>
      <CSpinner v-if="!blockControl" size="5xl" color="success" />
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
        {
          key: "buttonMarked",
          label: "Seç",
          _style: "width:5px;",
          sorter: false,
          filter: false,
        },
        { key: "hide", label: "Öteleme Geçmişini Göster", _style: "width:1cm" },
        { key: "aboveLine", label: "Hat Bilgisi", _style: "width:1cm" },
        { key: "productCode", label: "Ürün Kodu", _style: "width:1cm" },
        { key: "materialCode", label: "Malzeme Kodu", _style: "width:1cm" },
        { key: "materialText", label: "Malzeme", _style: "width:1cm" },
        { key: "plannedDate", label: "Plan Tarihi", _style: "width:1cm" },
        { key: "amount", label: "Plandaki Miktar", _style: "width:1cm" },
        { key: "customer", label: "Müşteri", _style: "width:1cm" },
        { key: "treeAmount", label: "Miktar", _style: "width:1cm" },

        { key: "tob", label: "Töb", _style: "width:1cm" },
      ],
      fieldsAdd: [
        { key: "materialCode", label: "Malzeme Kodu", _style: "width:1cm" },
        { key: "materialText", label: "Malzeme", _style: "width:1cm" },
        { key: "productCode", label: "Ürün Kodu", _style: "width:1cm" },
        { key: "plannedDate", label: "Plan Tarihi", _style: "width:1cm" },
        { key: "amount", label: "Miktar", _style: "width:1cm" },
        { key: "customer", label: "Müşteri", _style: "width:1cm" },
      ],
      fieldsDelay: [
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
      fieldsConstraint: [
        { key: "aboveLine", label: "Hat Bilgisi", _style: "width:1cm" },
        { key: "productCode", label: "Ürün Kodu", _style: "width:1cm" },
        { key: "plannedDate", label: "Plan Tarihi", _style: "width:1cm" },
        { key: "amount", label: "Miktar", _style: "width:1cm" },
        { key: "DelayCode", label: "Öteleme Kodu", _style: "width:1cm" },
        { key: "DelayAmount", label: "Öteleme Miktarı", _style: "width:1cm" },
        { key: "DelayReason", label: "Öteleme Sebebi", _style: "width:1cm" },
        { key: "CompanyTeam", label: "Firma-Takım", _style: "width:1cm" },
        { key: "ChargePerson", label: "Sorumlu Birey", _style: "width:1cm" },
        { key: "DelayDate", label: "Öteleme Tarihi", _style: "width:1cm" },
        { key: "DateCurrent", label: "Girildiği Tarih", _style: "width:1cm" },
        { key: "DelayDetail", label: "Öteleme Açıklama", _style: "width:1cm" },
        { key: "Save", label: "", _style: "width:3cm" },
      ],
      items: [],
      itemsDelay: [],
      searchMaterial: "",
      checkedConstraint: [],
      displayConstraintTable: false,
      persons: [],
      teams: [],
      reasons: [],
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
      blockControl: false,
      forcedItem: {},
      totalDelayAmount: 0,

      enteredDelayAmount: 0,
      inputBoxDelayAmount: 0,
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    toogleDelay(item) {
      this.updateModal = !this.updateModal;
      this.updateDelay = item;
    },
    getCurrentDate(item) {
      item.dateCurrent = new Date().toISOString().substr(0, 10);
    },
    findItemIndex(item) {
      return this.items.findIndex((i) => i.constraintID === item.constraintID);
    },
    setCheckBox(item) {
      const foundIndex = this.findItemIndex(item);
      this.$set(
        this.items[foundIndex],
        "_checked",
        !item._checked,
        "_hide",
        true
      );
    },
    controlIsBlock() {
      this.items = [];
      this.checkedConstraint = [];

      axios
        .get(`${CONFIG.api.invokeUrl}user?hasPermissionConstraint=${false}`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          if (response.data) {
            this.searchMaterial =
              "Yöneticiniz Tarafından Kitlenmiştir. Kısıt Giremezsiniz.";
            this.blockControl = true;
          } else {
            this.blockControl = false;
          }
        })
        .catch((e) => {});
    },
    fetchData() {
      if (this.searchMaterial !== "") {
        this.items = [];
        this.checkedConstraint = [];
        this.uploading = true;
        this.totalDelayAmount = 0;

        this.enteredDelayAmount = 0;
        this.inputBoxDelayAmount = 0;
        axios
          .get(
            `${CONFIG.api.invokeUrl}constraint?material=${this.searchMaterial}`,
            {
              headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
            }
          )
          .then((response) => {
            this.uploading = false;
            this.toogleConstraintTable();
            this.hideShow = "Gizle";
            this.items = response.data.map((x) => {
              return { ...x, _hide: true, _checked: false };
            });
            this.items.map(
              (x) => (
                (x.delayAmount = 0),
                (x.companyTeam = ""),
                (x.delayReason = ""),
                (x.chargePerson = ""),
                (x.delayDate = null),
                (x.delayDetail = "")
              )
            );
          })
          .catch((e) => {
            this.uploading = false;
          });
      }
    },
    fetchDataDelay() {
      if (this.searchMaterial !== "") {
        axios
          .get(`${CONFIG.api.invokeUrl}delayHistory`, {
            headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
          })
          .then((response) => {
            this.itemsDelay = response.data.map((x) => {
              return { ...x, constraintDelayID: "" };
            });
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
      this.forcedItem = {};
      this.controlIsBlock();
      this.fetchData();
      this.fetchDataDelay();
      this.fetchPersons();
      this.fetchTeams();
      this.fetchReasons();
    },
    yesForAboveLine(temp) {
      this.warningAboveLineModal = false;
      var index = this.checkedConstraint.indexOf(temp);

      if (index === -1) {
        this.checkedConstraint.push(temp);
        this.totalDelayAmount += parseInt(temp.amount);
      } else {
        this.totalDelayAmount -= parseInt(temp.amount);
        this.checkedConstraint.splice(index, 1);
      }
      this.toogleConstraintTable();
      this.sortConstraint();
    },
    noForAboveLine(temp) {
      this.warningAboveLineModal = false;
      temp._checked = false;
    },
    controlCheckedConstraintForAboveLine(temp) {
      if (temp.aboveLine === "-") {
        return true;
      } else {
        this.forcedItem = temp;
        this.messageModal =
          "Seçtiğiniz hat üstüdür. Kısıt girmek istediğinize emin misiniz?";
        this.warningAboveLineModal = true;
        return false;
      }
    },
    controlCheckedConstraint(temp) {
      var index = this.checkedConstraint.indexOf(temp);

      if (index === -1) {
        this.checkedConstraint.push(temp);

        this.totalDelayAmount += parseInt(temp.amount);
        //this.restOfDelayAmount=this.totalDelayAmount-this.enteredDelayAmount;
      } else {
        this.totalDelayAmount -= parseInt(temp.amount);
        this.checkedConstraint.splice(index, 1);
      }
      this.sortConstraint();
    },
    addTable(addedItem) {
      this.getCurrentDate(addedItem);
      this.setCheckBox(addedItem);
      addedItem.delayCode = addedItem.materialCode;
      if (this.controlCheckedConstraintForAboveLine(addedItem)) {
        this.controlCheckedConstraint(addedItem);
      }
      this.toogleConstraintTable();
      this.sortConstraint();
    },
    toogleConstraintTable() {
      if (this.checkedConstraint.length === 0) {
        this.displayConstraintTable = false;
      } else {
        this.displayConstraintTable = true;
      }
    },
    save(item) {
      if (item.delayAmount === undefined) {
        this.messageModal = "Öteleme Miktarını giriniz!";
        this.warningModal = true;
        return;
      }
      if (parseInt(item.delayAmount) > parseInt(item.amount)) {
        this.messageModal = "Öteleme miktarı planlanan miktardan fazla olamaz!";
        this.warningModal = true;
        return;
      }

      if (parseInt(item.delayAmount) <= 0) {
        this.messageModal = "Öteleme miktarı sıfır yada sıfırdan küçük olamaz!";
        this.warningModal = true;
        return;
      }
      if (item.delayReason === null || item.delayReason === "") {
        this.messageModal = "Sebep giriniz.";
        this.warningModal = true;
        return;
      }
      if (item.companyTeam === null || item.companyTeam === "") {
        this.messageModal = "Firma-Takım giriniz.";
        this.warningModal = true;
        return;
      }
      if (item.chargePerson === null || item.chargePerson === "") {
        this.messageModal = "Sorumlu birey giriniz.";
        this.warningModal = true;
        return;
      }
      if (item.delayDate === null || item.delayDate.length === 0) {
        this.messageModal = "Öteleme tarihini giriniz.";
        this.warningModal = true;
        return;
      }
      this.postDelay(item);
    },
    postDelay(item) {
      if (item.delayDetail === null || item.delayDetail.length === 0)
        item.delayDetail = "-";
      axios
        .post(
          `${CONFIG.api.invokeUrl}delayHistory`,
          {
            productCode: item.productCode,
            delayCode: item.delayCode,
            delayAmount: item.delayAmount,
            delayDate: item.delayDate,
            delayReason: item.delayReason,
            delayDetail: item.delayDetail,
            companyTeam: item.companyTeam,
            chargePerson: item.chargePerson,
            madeDate: item.dateCurrent,
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {
          this.updateConstraint(response.data.delayID, item);
        })
        .catch((e) => {
          this.messageModal = "Tekrar Deneyiniz!";
          this.dangerModal = true;
        });
    },
    updateConstraint(id, item) {
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
            delayID: id,
            delayCode: item.delayCode,
            delayAmount: item.delayAmount,
            delayDate: item.delayDate,
            delayReason: item.delayReason,
            delayDetail: item.delayDetail,
            companyTeam: item.companyTeam,
            chargePerson: item.chargePerson,
            dateCurrent: item.dateCurrent,
            aboveLine: item.aboveLine,
            treeAmount: item.treeAmount,
            mip: item.mip,
            tob: item.tob,
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {
          item._checked = false;
          this.enteredDelayAmount -= item.delayAmount;
          item.delayAmount = 0;
          item.chargePerson = "";
          item.delayDetail = "";
          item.delayDate = null;
          item.delayReason = "";
          item.companyTeam = "";
          this.getCurrentDate(item);
          this.fetchDataDelay();
          this.controlCheckedConstraint(item);
          this.toogleConstraintTable();
          this.messageModal = "Başarılı";
          this.successModal = true;
        })
        .catch((e) => {
          this.messageModal = "Tekrar Deneyiniz!";
          this.dangerModal = true;
        });
    },
    cancel(item) {
      this.controlCheckedConstraint(item);
      item._checked = false;
      this.toogleConstraintTable();
    },
    updateDelayHistory(item) {
      this.updateDelayFromModal(item);

      if (item.delayID === item.constraintDelayID) {
        this.updateConraintFromModal(item);
      }
    },
    updateDelayFromModal(delay) {
      if (delay.delayDetail === null || delay.delayDetail.length === 0)
        delay.delayDetail = "-";
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
          this.toogleConstraintTable();
          this.hideShow = "Göster";
          if (delay.delayID !== delay.constraintDelayID) {
            this.messageModal = "Başarılı";
            this.successModal = true;
          }
        })
        .catch((e) => {
          this.messageModal = "Tekrar Deneyiniz!";
          this.dangerModal = true;
        });
    },
    updateConraintFromModal(constraintData) {
      axios
        .put(
          `${CONFIG.api.invokeUrl}constraint/${constraintData.constraintID}`,
          {
            isMarked: false,
            isDelayEntered: true,
            constraintID: constraintData.constraintID,
            materialCode: constraintData.materialCode,
            materialText: constraintData.materialText,
            productCode: constraintData.productCode,
            plannedDate: constraintData.plannedDate,
            amount: constraintData.amount,
            customer: constraintData.customer,
            version: constraintData.version,
            delayID: constraintData.constraintDelayID,
            delayCode: constraintData.delayCode,
            delayAmount: constraintData.delayAmount,
            delayDate: constraintData.delayDate,
            delayReason: constraintData.delayReason,
            delayDetail: constraintData.delayDetail,
            companyTeam: constraintData.companyTeam,
            chargePerson: constraintData.chargePerson,
            dateCurrent: constraintData.madeDate,
            aboveLine: constraintData.aboveLine,
            treeAmount: constraintData.treeAmount,
            mip: constraintData.mip,
            tob: constraintData.tob,
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {
          this.toogleConstraintTable();
          this.messageModal = "Güncelleme Başarılı";
          this.successModal = true;

          this.fetch();
        })
        .catch((e) => {
          this.messageModal = "Tekrar Deneyiniz! updateConraintFromModal";
          this.dangerModal = true;
        });
    },
    deleteDelayHistory(item) {
      this.deleteDelayFromModal(item);
      if (item.delayID === item.constraintDelayID) {
        this.deleteConraintFromModal(item);
      }
    },
    deleteDelayFromModal(item) {
      axios
        .delete(`${CONFIG.api.invokeUrl}delayHistory/${item.delayID}`, {
          headers: { Authorization: `Basic ${ServiceToken.getToken()}` },
        })
        .then((response) => {
          if (item.delayID !== item.constraintDelayID) {
            this.messageModal = "Silindi";
            this.successModal = true;
          }
          this.toogleConstraintTable();
          this.hideShow = "Göster";
          this.fetch();
        })
        .catch((e) => {
          this.messageModal = "Tekrar deneyiniz!";
          this.dangerModal = true;
        });
    },
    deleteConraintFromModal(constraintData) {
      axios
        .put(
          `${CONFIG.api.invokeUrl}constraint/${constraintData.constraintID}`,
          {
            isMarked: false,
            isDelayEntered: false,
            constraintID: constraintData.constraintID,
            materialCode: constraintData.materialCode,
            materialText: constraintData.materialText,
            productCode: constraintData.productCode,
            plannedDate: constraintData.plannedDate,
            amount: constraintData.amount,
            customer: constraintData.customer,
            version: constraintData.version,
            delayID: "",
            delayCode: "",
            delayAmount: "",
            delayDate: "",
            delayReason: "",
            delayDetail: "",
            companyTeam: "",
            chargePerson: "",
            dateCurrent: "",
            aboveLine: constraintData.aboveLine,
            treeAmount: item.treeAmount,
            mip: item.mip,
            tob: item.tob,
          },
          { headers: { Authorization: `Basic ${ServiceToken.getToken()}` } }
        )
        .then((response) => {
          this.toogleConstraintTable();
          //this.messageModal=("Başarıyla Silindi! deleteConraintFromModal")
          this.fetch();
        })
        .catch((e) => {
          this.messageModal = "Tekrar Deneyiniz!";
          this.dangerModal = true;
        });
    },
    setButtonLocation() {
      if (this.items.length !== 0) {
        if (this.hideShow === "Göster") {
          this.items = this.items.map((x) => {
            return { ...x, _hide: true };
          });
          this.hideShow = "Gizle";
        } else if (this.hideShow === "Gizle") {
          this.items = this.items.map((x) => {
            return { ...x, _hide: false };
          });
          this.hideShow = "Göster";
        }
      }
    },
    sortConstraint() {
      this.checkedConstraint.sort((a, b) =>
        a.plannedDate > b.plannedDate
          ? 1
          : b.plannedDate > a.plannedDate
          ? -1
          : 0
      );
    },
    copy() {
      var temp = this.checkedConstraint[0];

      if (temp != null) {
        this.checkedConstraint.map((x) => {
          (x.delayReason = temp.delayReason),
            (x.delayDetail = temp.delayDetail),
            (x.delayDate = temp.delayDate),
            (x.companyTeam = temp.companyTeam),
            (x.chargePerson = temp.chargePerson);
        });
      }
    },
    seperatePlanDate() {
      if (this.checkedConstraint.length !== 0) {
        this.enteredDelayAmount = 0;
        this.checkedConstraint.map((x) => {
          (x.delayAmount = x.amount),
            (this.enteredDelayAmount += parseInt(x.delayAmount));
        });
      }
    },
    saveAll() {
      if (this.contolAllDelayAmountBeforeSave())
        this.checkedConstraint.map((x) => this.save(x));
      else {
        this.warningModal = true;
      }
    },
    contolAllDelayAmountBeforeSave() {
      for (var i = 0; i < this.checkedConstraint.length; i++) {
        var item = this.checkedConstraint[i];
        if (
          parseInt(item.delayAmount) > parseInt(item.amount) ||
          item.delayAmount < 1
        ) {
           this.messageModal = "Öteleme miktarlarını kontrol ediniz.";
          return false;
        }
        if (item.delayReason === null || item.delayReason === "") {
          this.messageModal = "Sebep giriniz.";

          return false;
        }
        if (item.companyTeam === null || item.companyTeam === "") {
          this.messageModal = "Firma-Takım giriniz.";

          return false;
        }
        if (item.chargePerson === null || item.chargePerson === "") {
          this.messageModal = "Sorumlu birey giriniz.";

          return false;
        }
        if (item.delayDetail === null || item.delayDetail.length === 0) {
          this.messageModal = "Öteleme tarihini giriniz.";

          return false;
        }
      }
      return true;
    },

    changeEnteredDelayAmount(item) {
      if (item.delayAmount === undefined) {
        item.delayAmount = 0;
        return;
      }
      if (
        parseInt(item.delayAmount) < parseInt(item.amount) &&
        parseInt(item.delayAmount) >= 0 &&
        this.enteredDelayAmount === this.totalDelayAmount
      ) {
        this.enteredDelayAmount +=
          parseInt(item.delayAmount) - parseInt(item.amount);
        return;
      } else if (parseInt(item.delayAmount) > parseInt(item.amount)) {
        this.messageModal =
          "Öteleme miktarını planlanandan daha az girmelisiniz.";
        this.dangerModal = true;
        item.delayAmount = 0;
      }
      this.calculateEntered();
    },
    calculateEntered() {
      if (this.checkedConstraint.length !== 0) {
        this.enteredDelayAmount = 0;
        this.checkedConstraint.map((x) => {
          x.delayAmount <= x.amount
            ? (this.enteredDelayAmount += parseInt(x.delayAmount))
            : (x.delayAmount = 0);
        });
      }
    },
    divideForFaraway() {
      this.enteredDelayAmount = 0;
      this.checkedConstraint.map((x) => (x.delayAmount = 0));
      for (var i = this.checkedConstraint.length - 1; i >= 0; i--) {
        var item = this.checkedConstraint[i];
        if (this.inputBoxDelayAmount > parseInt(item.amount)) {
          item.delayAmount = item.amount;
          this.inputBoxDelayAmount -= parseInt(item.amount);
          this.enteredDelayAmount += parseInt(item.amount);
        } else {
          item.delayAmount = this.inputBoxDelayAmount;
          this.enteredDelayAmount += parseInt(this.inputBoxDelayAmount);
          break;
        }
      }
      this.inputBoxDelayAmount = 0;
    },
    divideForNear() {
      this.enteredDelayAmount = 0;

      this.checkedConstraint.map((x) => (x.delayAmount = 0));
      for (var i = 0; i < this.checkedConstraint.length; i++) {
        var item = this.checkedConstraint[i];
        if (this.inputBoxDelayAmount > parseInt(item.amount)) {
          item.delayAmount = item.amount;
          this.inputBoxDelayAmount -= parseInt(item.amount);
          this.enteredDelayAmount += parseInt(item.amount);
        } else {
          item.delayAmount = this.inputBoxDelayAmount;
          //this.inputBoxDelayAmount -= parseInt(item.delayAmount);
          this.enteredDelayAmount += parseInt(this.inputBoxDelayAmount);
          break;
        }
      }
      this.inputBoxDelayAmount = 0;
    },
  },
};
</script>
