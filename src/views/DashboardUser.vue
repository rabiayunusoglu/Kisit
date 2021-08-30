<template>
  <div>

    <center>
      <h3>Ana Sayfa</h3>
    </center>

    <div  >

      <center>

        <CCardBody>

          <CButton pressed block color="primary" aria-pressed="true" to="/user/kisit" style="width: 700px; height: 40px;">

            <center>
              <CIcon name="cil-pencil" />
              Kısıt Giriş
            </center>
          </CButton>
          <br>
          <CButton pressed block color="dark" aria-pressed="true" to="/user/archiveConstraint" style="width: 700px; height: 40px;">

            <center>
              <CIcon name="cil-task" />
              Arşivlenmiş Kısıtlar
            </center>
          </CButton>
          <br>
          <!--<CButton pressed block color="info" aria-pressed="true" href="../delayHistory" style="width: auto; height: 40px;">
                <CIcon size="xl" name="cil-file" />
                <center><h4>Ürünlerin Öteleme Geçmişleri</h4></center>
              </CButton>--->

        </CCardBody>

      </center>

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
export default {
  name: "Dashboard",
  components: {},
  data() {
    return {
      show: true,
      isCollapsed: true,
      blockText: " Kısıt Girişi Kilitle",
      isUserOrAdmin: false,
      elementCover: false,
      uploading: false,
    };
  },

  mounted() {
   
  },
  methods: {
    
    Block() {},
  },
};
</script>
