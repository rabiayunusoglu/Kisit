<template>
  <div>
    <TreeTable />
    
  </div>
</template>

<script>
import TreeTable from "../components/ProductTree/TreeTable.vue";

export default {
  components: {
    TreeTable,
  },
  data() {
    return {
      plans: [],
    };
  },
  mounted() {
   
  },
  methods: {
    
  },
};
</script>