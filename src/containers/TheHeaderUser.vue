<template>
  <CHeader fixed with-subheader light>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.commit('toggleSidebarDesktop')"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">
       <CHeaderNavItem class="d-md-down-none" to="/">
   
    </CHeaderNavItem>
     
      
    </CHeaderNav>
    <CHeaderNav class="mr-4">
      
    <CButton color="secondary" @click="logout()">
      <CIcon name="cil-lock-locked" /> Çıkış
    </CButton>
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader>
  </CHeader>
</template>

<script>
import ServiceToken from '../service/TokenService';
export default {
  name: 'TheHeaderUser',
  data () {
    return { 
      
    }
  },
  methods:{
  logout(){
      ServiceToken.removeToken();
      ServiceToken.removeBlock();
      this.$router.push({ path: '/pages/login' })
  }
  },
}
</script>
