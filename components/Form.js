export default Vue.component("Form", {
    data: function () {
        return {

        };
    },
    created: function () {
    },
    methods: {
    },
    template: `
    <div class="p-3 mb-3 card rounded-3">
                <div class="container-fluid">
                    <div class="mb-3">
                        <input ref="fileInput" class="form-control" id="file" @change="loadFile" type="file"
                            accept=".svg" />
                        <p class="text-end fst-italic text-danger"><small>Required</small> </p>
                    </div>

                    <fieldset :disabled="!hasIconFile">

                        <div class="row mb-3">
                            <div class="col-12 col-md-3">

                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="useGradiente"
                                        v-model="gradiente" value="false" />
                                    <label class="form-check-label" for="useGradiente">
                                        Use gradiente
                                    </label>
                                </div>
                            </div>
                            <div class="col-12 col-md-3">
                                <div class="input-group input-group-sm mb-3">
                                    <span class="input-group-text" id="primary-color">Cor</span>
                                    <input type="color" class="form-control" placeholder="Primary Color"
                                        aria-label="Primary Color" aria-describedby="primary-color" v-model="cor">
                                </div>
                            </div>
                            <div class="col-12 col-md-3">
                                <div class="input-group input-group-sm mb-3" v-if="gradiente">
                                    <span class="input-group-text" id="secondary-color">Cor 2</span>
                                    <input type="color" class="form-control" placeholder="Secondary Color"
                                        aria-label="Secondary Color" aria-describedby="secondary-color" v-model="cor2"
                                        :disabled="!gradiente">
                                </div>
                            </div>
                            <div class="col-12 col-md-3">
                                <div class="input-group input-group-sm mb-3" v-if="gradiente">
                                    <span class="input-group-text" id="secondary-color">Direction</span>
                                    <input type="number" id="gradienteDirection"
                                        class="form-control form-control-alternative" v-model="gradienteDirection"
                                        placeholder="Default" :disabled="!hasIconFile">
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div class="d-flex flex-row-reverse">
                        <button class="btn d-flex btn-primary" @click="previewImage()"
                            :disabled="!hasIconFile">Preview</button>

                    </div>
                </div>
            </div>
  `
});