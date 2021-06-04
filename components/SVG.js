export default Vue.component("SVGSource", {
    data: function () {
        return {

        };
    },
    created: function () {
    },
    methods: {
    },
    template: `
    <div class="row align-items-md-stretch">
        <div class="col-md-6">
            <div class="h-100 p-3 border rounded-3 card">
                <h2>SVG</h2>
                <div class="render-container" ref="sourceSvg" id="svgImage"></div>
            </div>
        </div>
    </div>
  `
});