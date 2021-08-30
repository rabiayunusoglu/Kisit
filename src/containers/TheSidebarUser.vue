<template>
  <CSidebar fixed :minimize="minimize" :show="show" @update:show="(value) => $store.commit('set', ['sidebarShow', value])">
    <CSidebarBrand>
      <template>
        <h3></h3>
      </template>
    </CSidebarBrand>

   
    <CRenderFunction flat :content-to-render="$options.navUser" />
    <CSidebarMinimizer class="d-md-down-none" @click.native="$store.commit('set', ['sidebarMinimize', !minimize])" />
  </CSidebar>
</template>

<script>
import navUser from "./_navForUser";

export default {
  name: "TheSidebarUser",
  navUser,
  data() {
    return {
     
    };
  },
  computed: {
    show() {
      return this.$store.state.sidebarShow;
    },
    minimize() {
      return this.$store.state.sidebarMinimize;
    },
  },
  
};
</script>
