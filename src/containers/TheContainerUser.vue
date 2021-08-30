<template>
  <div class="c-app">
    <TheSidebarUser/>
    <CWrapper>
      <TheHeaderUser/>
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade">
              <router-view></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <TheFooter/>
    </CWrapper>
  </div>
</template>

<script>
import TheSidebarUser from './TheSidebarUser'
import TheHeaderUser from './TheHeaderUser'
import TheFooter from './TheFooter'

export default {
  name: 'TheContainer',
  components: {
    TheSidebarUser,
    TheHeaderUser,
    TheFooter
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
