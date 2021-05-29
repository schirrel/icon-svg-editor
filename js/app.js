import createSvg from "./createSvg.js";
import svgToPng from "./svgtopng.js";
import download from "./save.js";

new Vue({
  el: "#app",
  data: {
    cor: "#5e72e4",
    cor2: "#525f7f",
    gradiente: false,
    imageSrc: "",
    generatedSvg: false,
    iconFile: null,
    loading: false,
    loadingText: 'loading',
    gradienteDirection: 45,
    currentFile: null
  },
  computed: {
    hasIconFile() {
      return !!this.iconFile
    }
  },
  watch: {
    cor() {
      this.attributeColor();
    },

    cor2() {
      if (this.gradiente) {
        this.attributeColor();
      }
    },
    gradiente() {
      this.attributeColor();
    },
    gradienteDirection() {
      this.attributeColor();
    }
  },
  methods: {
    loadFile() {
      this.loading = true;
      this.loadingText = 'Loading your nice svg file';

      setTimeout(() => {
        const file = this.$refs.fileInput.files[0];
        this.currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {

          this.iconFile = e.target.result;
          if (file.type.indexOf("svg") > 0) {
            document.querySelector("#svgImage").innerHTML = this.iconFile;
            this.attributeColor();
          }
          this.loading = false;
          this.loadingText = 'Loading';
        };
        reader.readAsText(file);
      }, 600)
    },
    applySvgProperties(elements, props) {
      Array.from(elements).forEach((item) => {
        props.forEach((prop) => {
          item.style.setProperty(prop[0], prop[1], "important");
        })
      });
    },
    attributeColorSvg() {
      let currentDefs = document.querySelector("defs");
      currentDefs?.parentNode.removeChild(currentDefs);
      this.gradienteDirection = Number(this.gradienteDirection)
      const createdSvg = createSvg({ gradienteDirection: this.gradienteDirection, cor: this.cor, cor2: this.cor2 })
      const defs = createdSvg.defs

      document
        .querySelector("#svgImage")
        .querySelector("svg")
        .appendChild(defs);

      setTimeout(() => {
        this.applySvgProperties(document.querySelectorAll("path"), [
          ["fill", "rgba(0,0,0,0)"],
          ["stroke", "url(#gradient) " + this.cor2]
        ])
        this.applySvgProperties(document.querySelectorAll("rect"), [
          ["fill", "rgba(0,0,0,0)"],
          ["stroke", "url(#gradient) " + this.cor2]
        ])
        this.applySvgProperties(document.querySelectorAll("path"), [
          ["fill", "url(#gradient) " + this.cor,],
          ["stroke", "rgba(0,0,0,0)"]
        ])
        this.applySvgProperties(document.querySelectorAll("rect"), [
          ["fill", "url(#gradient) " + this.cor,],
          ["stroke", "rgba(0,0,0,0)"]
        ])

      }, 500);
    },
    attributeColor() {
      if (this.gradiente) {
        this.attributeColorSvg();

      } else {
        let list = document.querySelectorAll("svg *");
        for (let i = 0; i < list.length; i++) {
          list[i].style.stroke = this.cor;
          list[i].style.fill = this.cor;
        }
      }
    },
    generateImage() {
      let styledSvg = document.querySelector("#svgImage")?.querySelector("svg");
      svgToPng(styledSvg.outerHTML)
        .then((data) => {
          this.imageSrc = data;
        })
    },
    previewImage() {
      this.generateImage();
    },
    downloadImage() {
      const originalName = this.currentFile.name.split('.')
      originalName.pop()
      const originalNameWithoutExtension = originalName.join(".")
      const filename = originalNameWithoutExtension || 'sourceFile'
      download(this.imageSrc, `svgConvertedToPng-${filename}.png`, 'png')
    }
  },
});
