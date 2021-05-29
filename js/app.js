import createSvg from "./createSvg.js";
import svgToPng from "./svgtopng.js";
import generateRandomColor from "./randomColor.js";

new Vue({
  el: "#app",
  data: {
    cor: "#5e72e4",
    cor2: "#525f7f",
    gradiente: false,
    imageSrc: "",
    generatedSvg: false,
    loading: false,
    loadingText: 'loading',
    gradienteDirection: 45,
    currentFile: null
  },
  computed: {
    downloadFileName() {
      const originalName = this.currentFile.name.split('.')
      originalName.pop()
      const originalNameWithoutExtension = originalName.join(".")
      const filename = originalNameWithoutExtension || 'sourceFile'
      return `svgConvertedToPng-${filename}.png`
    },
    hasIconFile() {
      return !!this.currentFile
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
  mounted() {
    this.randonizeVars()
  },
  methods: {
    randonizeVars() {
      this.cor = generateRandomColor()
      this.cor2 = generateRandomColor()
      this.gradienteDirection = Math.floor(Math.random() * 360)
    },
    isSvg() {
      const svgMimeType = "image/svg+xml"
      const regex = new RegExp(/\.(svg)$/gm);
      return this.currentFile.type === svgMimeType && regex.test(this.currentFile.name);
    },
    isValidFile() {
      if (this.isSvg()) {
        return true;
      }
      this.resetVariables()
      alert("File must be and SVG")
      return false
    },
    resetVariables() {
      this.loading = false;
      this.loadingText = 'Loading';
      this.currentFile = null
      this.$refs.sourceSvg.innerHTML = null
    },
    loadFile() {
      this.loading = true;
      this.loadingText = 'Loading your nice svg file';

      setTimeout(() => {
        this.currentFile = this.$refs.fileInput.files[0];
        if (!this.isValidFile()) {
          return
        }
        this.randonizeVars()
        const reader = new FileReader();
        reader.onload = (event) => {
          this.$refs.sourceSvg.innerHTML = event.target.result;
          this.attributeColor();
          this.loading = false;
          this.loadingText = 'Loading';
        };

        reader.readAsText(this.currentFile);
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

      this.$refs.sourceSvg.querySelector("svg")
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
        return
      }

      let list = document.querySelectorAll("svg *");
      for (let i = 0; i < list.length; i++) {
        list[i].style.stroke = this.cor;
        list[i].style.fill = this.cor;
      }
    },
    generateImage() {
      let styledSvg = this.$refs.sourceSvg?.querySelector("svg");
      svgToPng(styledSvg.outerHTML)
        .then((data) => {
          this.imageSrc = data;
        })
    },
    previewImage() {
      this.generateImage();
    },
  },
});
