import createSvg from "./createSvg.js";
import svgToPng from "./svgtopng.js";
import generateRandomColor from "./randomColor.js";
import register from './analytics.js'

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
      this.setDefinedColor();
    },

    cor2() {
      if (this.gradiente) {
        this.setDefinedColor();
      }
    },
    gradiente() {
      this.setDefinedColor();
    },
    gradienteDirection() {
      this.setDefinedColor();
    }
  },
  mounted() {
    this.randonizeVars();
  },
  methods: {
    randonizeVars() {
      this.cor = generateRandomColor();
      this.cor2 = generateRandomColor();
      this.gradienteDirection = Math.floor(Math.random() * 360);
    },
    isSvg() {
      const svgMimeType = "image/svg+xml"
      const regex = new RegExp(/\.(svg)$/gm);
      return this.currentFile && this.currentFile.type === svgMimeType && regex.test(this.currentFile.name);
    },
    isValidFile() {
      if (this.isSvg()) {
        return true;
      }
      this.resetVariables();
      alert("File must be and SVG");
      return false;
    },
    resetVariables() {
      this.loading = false;
      this.loadingText = 'Loading';
      this.currentFile = null;
      this.$refs.sourceSvg.innerHTML = null;
    },
    loadFile() {
      this.loading = true;
      this.loadingText = 'Loading your nice svg file';

      setTimeout(() => {
        this.currentFile = this.$refs.fileInput.files[0];
        if (!this.isValidFile()) {
          register('File', 'Load', 'Error');
          return
        }
        register('File', 'Load', 'Success');

        this.randonizeVars();
        const reader = new FileReader();
        reader.onload = (event) => {
          this.$refs.sourceSvg.innerHTML = event.target.result;
          this.setDefinedColor();
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
      this.gradienteDirection = Number(this.gradienteDirection);
      const createdSvg = createSvg({ gradienteDirection: this.gradienteDirection, cor: this.cor, cor2: this.cor2 });
      const defs = createdSvg.defs;

      this.$refs.sourceSvg.children[0]
        .appendChild(defs);

      setTimeout(() => {
        this.applySvgProperties(this.$refs.sourceSvg.children[0].children, [
          ["fill", "url(#gradient) " + this.cor,],
          ["stroke", "url(#gradient) " + this.cor2]
        ]);
      })
    },
    setDefinedColor() {
      if(!this.hasIconFile) return; 
      
      if (this.gradiente) {
        this.attributeColorSvg();
        return
      }
      const svgEl = this.$refs.sourceSvg.children[0]
      let list = Array.from(svgEl.children)
      for (let i = 0; i < list.length; i++) {
        list[i].style.stroke = this.cor;
        list[i].style.fill = this.cor;
      }
    },
    previewImage() {
      register('Preview', 'Click', 'Generate Preview');
      let styledSvg = this.$refs.sourceSvg?.children[0];
      svgToPng(styledSvg)
        .then((data) => {
          this.imageSrc = data;
        });
    },
    downloadFile() {
      register('Preview', 'Click', 'Download Preview');

    }
  },
});


