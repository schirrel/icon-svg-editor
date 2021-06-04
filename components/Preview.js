export default Vue.component("Preview", {
    data: function () {
        return {

        };
    },
    created: function () {
    },
    methods: {
    },
    template: `
    <div class="col-md-6">
        <div class="h-300 p-3 border rounded-3 card">
            <h2>Preview</h2>
            <img class="render-container" v-bind:src="imageSrc" />

            <a @click="downloadFile" class="btn btn-primary btn-sm" v-if="imageSrc" :href="imageSrc"
                :download="downloadFileName">Download</a>
        </div>
    </div>
  `
});