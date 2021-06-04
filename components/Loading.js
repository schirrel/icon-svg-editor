export default Vue.component("Loading", {
    props: ['loadingText'],
    template: `
    <div v-if="loading" class="loading modal-backdrop fade show" tabbindex="-1">
        <div class="spinner-border text-light" role="status"></div>
        <span>{{loadingText}}...</span>
    </div>
  `
});