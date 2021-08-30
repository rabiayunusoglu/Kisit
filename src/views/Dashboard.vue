<template>
  <div>

    <CCardHeader border-color="light" color="light">
      <center>
        <h3>Anasayfa</h3>
      </center>
      <template>
        <CRow>
          <h5>Kısıt Giriş:</h5>
          <div v-if="!blockSwitch" style="padding-left: 10px;">
            <CButton @click="Block()" color="success">
              {{blockText}}
            </CButton>
          </div>
          <div v-if="blockSwitch" style="padding-left: 10px;">
            <CButton @click="Block()" color="danger">
              {{blockText}}
            </CButton>
          </div>
        </CRow>
      </template>
    </CCardHeader>
    <div>
      <CRow>
        <div style="padding-left: 20px;">
          <CCard border-color="light" color="light">
            <CCardHeader>
              <center>
                <h5>Kısıt</h5>
              </center>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="info" aria-pressed="true" to="/kisit" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-pencil" />
                      <center>Kısıt Giriş</center>
                    </CButton>
                  </CCardBody>
                </CCard>

                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="success" aria-pressed="true" to="/markedConstraint" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-thumb-up" />
                      <center>İşaretlenmiş Kısıtlar</center>
                    </CButton>
                  </CCardBody>
                </CCard>

                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="danger" aria-pressed="true" to="/noMarkedConstraint" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-thumb-down" />
                      <center>İşaretlenmemiş Kısıtlar</center>
                    </CButton>
                  </CCardBody>
                </CCard>

                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="dark" aria-pressed="true" to="/archiveConstraint" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-task" />
                      <center>Arşivlenmiş Kısıtlar</center>
                    </CButton>
                  </CCardBody>
                </CCard>
              </CRow>
            </CCardBody>
          </CCard>
        </div>
        <div style="padding-left: 20px;">
          <CCard border-color="light" color="light">
            <CCardHeader>
              <center>
                <h5>Yükleme</h5>
              </center>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="primary" aria-pressed="true" to="/ExcelMontage" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-cloud-upload" />
                      <center>Excel-Montaj Üretim Planı</center>
                    </CButton>
                  </CCardBody>
                </CCard>

                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="primary" aria-pressed="true" to="/ExcelTree" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-cloud-upload" />
                      <center>Excel-Ürün Ağacı</center>
                    </CButton>
                  </CCardBody>
                </CCard>
              </CRow>
            </CCardBody>
          </CCard>
        </div>
        <div style="padding-left: 20px;">
          <CCard border-color="light" color="light">
            <CCardHeader>
              <center>
                <h5>Listeleme</h5>
              </center>
            </CCardHeader>
            <CCardBody>
              <CRow>

                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="info" aria-pressed="true" to="/montage" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-list" />
                      <center>Montaj-Üretim Planı</center>
                    </CButton>
                  </CCardBody>
                </CCard>

                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="info" aria-pressed="true" to="/tree" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-list" />
                      <center>Ürün Ağacı</center>
                    </CButton>
                  </CCardBody>
                </CCard>

              </CRow>
            </CCardBody>
          </CCard>
        </div>
        <div style="padding-left: 20px;">
          <CCard border-color="light" color="light">
            <CCardHeader>
              <center>
                <h5>Öteleme Geçmişleri</h5>
              </center>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="dark" aria-pressed="true" to="/delayHistory" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-file" />
                      <center>Ürünlerin Öteleme Geçmişleri</center>
                    </CButton>
                  </CCardBody>
                </CCard>
                <!--<CCard border-color="light" color="light">
                <CCardBody>
                  <CButton pressed block color="dark" aria-pressed="true" to="/archiveDelayHistory" style="width: 110px; height: 110px">
                    <CIcon size="xl" name="cil-task" />
                    <center>Arşivlenmiş-Öteleme Geçmişleri</center>
                  </CButton>
                </CCardBody>
              </CCard>--->
              </CRow>
            </CCardBody>
          </CCard>
        </div>
      </CRow>
      <CRow>
        <div style="padding-left: 20px;">
          <CCard border-color="light" color="light">
            <CCardHeader>
              <center>
                <h5>Bilgiler</h5>
              </center>
            </CCardHeader>
            <CCardBody>
              <CRow>

                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="primary" aria-pressed="true" to="/chargePerson" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-people" />
                      <center>Sorumlu Bireyler</center>
                    </CButton>
                  </CCardBody>
                </CCard>

                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="primary" aria-pressed="true" to="/company" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-bank" />
                      <center>Firmalar-Ekipler</center>
                    </CButton>
                  </CCardBody>
                </CCard>

                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="dark" aria-pressed="true" to="/reason" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-library" />
                      <center>Öteleme Sebepleri</center>
                    </CButton>
                  </CCardBody>
                </CCard>

                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="dark" aria-pressed="true" to="/version" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-chart-line" />
                      <center>Hat Bilgisi</center>
                    </CButton>
                  </CCardBody>
                </CCard>

              </CRow>
            </CCardBody>
          </CCard>
        </div>

        <div style="padding-left: 20px;">
          <CCard border-color="light" color="light">
            <CCardHeader>
              <center>
                <h5>Toplantı</h5>
              </center>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="info" aria-pressed="true" to="/zkp" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-task" />
                      <center>ZKP3 Değişiklik-Firma
                      </center>
                    </CButton>
                  </CCardBody>
                </CCard>
                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="info" aria-pressed="true" to="/meeting" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-library" />
                      <center>Toplantı-Firma</center>
                    </CButton>
                  </CCardBody>
                </CCard>
                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="primary" aria-pressed="true" to="/reportTeam" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-task" />
                      <center>Rapor-Ekip
                      </center>
                    </CButton>
                  </CCardBody>
                </CCard>
                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="primary" aria-pressed="true" to="/meetingTeam" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-library" />
                      <center>Toplantı- Ekip</center>
                    </CButton>
                  </CCardBody>
                </CCard>
              </CRow>
            </CCardBody>
          </CCard>
        </div>
        <div style="padding-left: 20px;">
          <CCard border-color="light" color="light">
            <CCardHeader>
              <center>
                <h5>Hesap İşlemleri</h5>
              </center>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="success" aria-pressed="true" to="/register" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-user" />
                      <center>Hesap Ekle
                      </center>
                    </CButton>
                  </CCardBody>
                </CCard>
                <CCard border-color="light" color="light">
                  <CCardBody>
                    <CButton pressed block color="success" aria-pressed="true" to="/users" style="width: 110px; height: 110px">
                      <CIcon size="xl" name="cil-people" />
                      <center>Kullanıcılar</center>
                    </CButton>
                  </CCardBody>
                </CCard>
              </CRow>
            </CCardBody>
          </CCard>
        </div>
      </CRow>

    </div>
    <!-- Looading Component -->
    <CElementCover v-if="uploading" :show.sync="elementCover" :boundaries="[{ sides: ['top', 'left'], query: '.media-body' }]" :opacity="0.8">
      <h1 class="d-inline"></h1>
      <CSpinner size="5xl" color="success" />
    </CElementCover>
  </div>

</template>

<script>
import ServiceToken from "../service/TokenService";
import CONFIG from "@/config.json";
import axios from "axios";
import TokenService from "../service/TokenService";
export default {
  name: "Dashboard",
  components: {},
  data() {
    return {
      show: true,
      isCollapsed: true,
      blockText: Boolean(TokenService.getBlockType) ? "Kapalı" : "Açık",
      isUserOrAdmin: false,
      elementCover: false,
      uploading: false,
      blockSwitch: Boolean(TokenService.getBlockType),
      itemsUsers: [],
    };
  },

  mounted() {
    //block_type===false bloklu degil yani blockText=acik blokswitch=false
    //this.blockSwitch = Boolean(TokenService.getBlockType);
    //(this.blockText = Boolean(TokenService.getBlockType) ? "Kapalı" : "Açık"),
    this.fetchUsers();
  },
  methods: {
    Block() {
      this.uploading = true;
      if (this.blockText === "Açık") {
        this.itemsUsers.map((item) => this.updateMethod("Block", item, false));
        this.blockText = "Kapalı";
        this.blockSwitch = true;
      } else {
        this.itemsUsers.map((item) => this.updateMethod("UnBlock", item, true));
        this.blockText = "Açık";
        this.blockSwitch = false;
      }
      this.fetch();
    },
    updateMethod(typeBlock, item, isBlock) {
      axios
        .put(
          `${CONFIG.api.invokeUrl}user/${item.userID}`,
          {
            userID: item.userID,
            userType: item.userType,
            password: item.password,
            email: item.email,
            isActive: item.isActive,
            permissionForConstraint: isBlock,
            createdTime: item.createdTime,
          },
          {
            headers: { Authorization: `Basic ${TokenService.getToken()}` },
          }
        )
        .then((response) => {})
        .catch((e) => {});
    },
    fetchUsers() {
      axios
        .get(`${CONFIG.api.invokeUrl}user`, {
          headers: { Authorization: `Basic ${TokenService.getToken()}` },
        })
        .then((response) => {
          this.itemsUsers = response.data;
          this.controlIsBlock();
        })
        .catch((e) => {});
    },
    controlIsBlock() {
      var temp = this.itemsUsers.filter(
        (item) => item.permissionForConstraint == false
      );

      if (temp.length == 0) {
        TokenService.removeBlock();
        TokenService.saveBlockType(false);
        this.blockSwitch = false;
        this.blockText = "Açık";
      } else {
        TokenService.removeBlock();
        TokenService.saveBlockType(true);
        this.blockText = "Kapalı";
        this.blockSwitch = true;
      }
    },
    fetch() {
      axios
        .get(`${CONFIG.api.invokeUrl}user`, {
          headers: { Authorization: `Basic ${TokenService.getToken()}` },
        })
        .then((response) => {
          this.itemsUsers = response.data;
          this.controlBlock();
        })
        .catch((e) => {});
    },
    controlBlock() {
      //bloklu demektir eger liste bos degilse
      var temp = this.itemsUsers.filter(
        (item) => item.permissionForConstraint == false
      );

      if (temp.length == 0) {
        TokenService.removeBlock();
        TokenService.saveBlockType(true);
      } else {
        TokenService.removeBlock();
        TokenService.saveBlockType(false);
      }
      this.uploading = false;
    },
  },
};
</script>
