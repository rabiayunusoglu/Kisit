<template>
  <CFooter :fixed="false">
    <div>
      <a >Kısıt Takip</a>
      <span class="ml-1">&copy; {{new Date().getFullYear()}} </span>
    </div>
    <div class="ml-auto">
      
      <a href="https://www.wat.com.tr/" target="_blank">WAT - Elektrik Motorları</a>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
