var app = new Vue({
  el: "#app",
  data: {
    cor: "#5e72e4",
    cor2: "#525f7f",
    flaticon: true,
    gradiente: false,
    icone: "",
    svg: "",
    imageSrc: "",
    generatedSvg: false,
    somenteBorda: false,
    somentePreenchimento: false,
    svgAltura: null,
    svgLargura: null,
    gradienteDirecao: null,
    temIcone: null,
  },
  watch: {
    icone: function (val) {
      if (val && !this.flaticon) {
        this.attributeColor();
      }
      this.temIcone = val;
    },
    flaticon: function (val) {
      this.icone = null;
    },
    cor: function (val) {
      this.attributeColor();
    },

    cor2: function (val) {
      if (this.gradiente) {
        this.attributeColor();
      }
    },
    gradiente: function (val) {
      this.attributeColor();
    },
    somenteBorda: function (val) {
      if (val) this.somentePreenchimento = false;
      this.attributeColor();
    },
    somentePreenchimento: function (val) {
      if (val) this.somenteBorda = false;
      this.attributeColor();
    },
    gradienteDirecao: function (val) {
      this.attributeColor();
    },
  },
  methods: {
    loadFile: function ($event) {
      let vueInstance = this;
      vueInstance.temIcone = null;
      var file = $event.target.files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        var contents = e.target.result;

        if (file.type.indexOf("svg") > 0) {
          vueInstance.temIcone = true;
          document.querySelector("#svgImage").innerHTML = contents;
          vueInstance.attributeColor();
        } else {
        }
      };
      reader.readAsText(file);
    },
    attributeColorIcon: function () {
      let vueInstance = this;
      Array.from(document.querySelector("#downloadicone")).forEach(function (
        myI
      ) {
        myI.style.setProperty(
          "background",
          "-webkit-gradient(linear, left top, left bottom, from( " +
            vueInstance.cor +
            "), to(" +
            vueInstance.cor2 +
            "))",
          "important"
        );
        myI.style.setProperty(
          "-webkit-text-fill-color",
          "transparent",
          "important"
        );

        myI.style.setProperty("background-clip", "text", "important");
      });
    },

    resetStrokeValues: function (elements) {
      let vueInstance = this;
      Array.from(elements).forEach(function (item) {
        item.style.setProperty("fill", "rgba(0,0,0,0)", "important");
        item.style.setProperty(
          "stroke",
          "url(#gradient) " + vueInstance.cor2,
          "important"
        );
      });
    },

    attributeColorSvg: function () {
      let vueInstance = this;
      let currentDefs = document.querySelector("defs");
      currentDefs?.parentNode.removeChild(currentDefs);

      var xmlns = "http://www.w3.org/2000/svg";
      var defs = document.createElementNS(xmlns, "defs");
      var grad = document.createElementNS(xmlns, "linearGradient");
      grad.setAttributeNS(null, "id", "gradient");
      var stopTop = document.createElementNS(xmlns, "stop");
      var stopBottom = document.createElementNS(xmlns, "stop");
      stopTop.setAttributeNS(null, "offset", "0%");
      stopTop.setAttributeNS(null, "stop-color", vueInstance.cor);
      if (vueInstance.gradienteDirecao) {
        grad.setAttributeNS(
          null,
          "gradientTransform",
          `rotate(${vueInstance.gradienteDirecao})`
        );
      }
      grad.appendChild(stopTop);
      stopBottom.setAttributeNS(null, "offset", "100%");
      stopBottom.setAttributeNS(null, "stop-color", vueInstance.cor2);
      grad.appendChild(stopBottom);
      defs.appendChild(grad);
      document
        .querySelector("#svgImage")
        .querySelector("svg")
        .appendChild(defs);

      setTimeout(function () {
        if (!vueInstance.somentePreenchimento) {
          this.resetStrokeValues(document.querySelectorAll("path"));
          Array.from(document.querySelectorAll("path")).forEach(function (
            myPath
          ) {
            myPath.style.setProperty("fill", "rgba(0,0,0,0)", "important");
            myPath.style.setProperty(
              "stroke",
              "url(#gradient) " + vueInstance.cor2,
              "important"
            );
          });
          document.querySelectorAll("rect").forEach(function (myRect) {
            myRect.style.setProperty("fill", "rgba(0,0,0,0)", "important");
            myRect.style.setProperty(
              "stroke",
              "url(#gradient) " + vueInstance.cor2,
              "important"
            );
          });
        }
        if (!vueInstance.somenteBorda) {
          document.querySelectorAll("path").forEach(function (myPath) {
            myPath.style.setProperty(
              "fill",
              "url(#gradient) " + vueInstance.cor,
              "important"
            );
            myPath.style.setProperty("stroke", "rgba(0,0,0,0)", "important");
          });
          document.querySelectorAll("rect").forEach(function (myRect) {
            myRect.style.setProperty(
              "fill",
              "url(#gradient) " + vueInstance.cor,
              "important"
            );
            myRect.style.setProperty("stroke", "rgba(0,0,0,0)", "important");
          });
        }
      }, 500);
    },
    attributeColor: function () {
      if (this.gradiente) {
        if (this.flaticon) {
          this.attributeColorSvg();
        } else {
          this.attributeColorIcon();
        }
      } else {
        let list = document.querySelectorAll("svg *");
        for (let i = 0; i < list.length; i++) {
          list[i].style.stroke = this.cor;
          list[i].style.fill = this.cor;
        }
      }
    },
    svgToPng: function (svgText, margin, fill) {
      let vueInstance = this;
      /* credits to http://ramblings.mcpher.com/Home/excelquirks/gassnips/svgtopng */
      // convert an svg text to png using the browser
      return new Promise(function (resolve, reject) {
        try {
          // can use the domUrl function from the browser
          var domUrl = window.URL || window.webkitURL || window;
          if (!domUrl) {
            throw new Error("(browser doesnt support this)");
          }

          // figure out the height and width from svg text
          var match = svgText.match(/height=\"(\d+)/m);
          var height = vueInstance.svgAltura
            ? vueInstance.svgAltura
            : match && match[1]
            ? parseInt(match[1], 10)
            : 200;
          // var height =150;
          var match = svgText.match(/width=\"(\d+)/m);
          var width = vueInstance.svgLargura
            ? vueInstance.svgLargura
            : match && match[1]
            ? parseInt(match[1], 10)
            : 200;
          // var width = 150;
          margin = margin || 0;

          // it needs a namespace
          if (!svgText.match(/xmlns=\"/im)) {
            svgText = svgText.replace(
              "<svg ",
              '<svg xmlns="http://www.w3.org/2000/svg" '
            );
          }

          // create a canvas element to pass through
          var canvas = document.createElement("canvas");
          canvas.width = height * 1.5;
          canvas.height = width * 1.5;
          var ctx = canvas.getContext("2d");

          // make a blob from the svg
          var svg = new Blob([svgText], {
            type: "image/svg+xml;charset=utf-8",
          });

          // create a dom object for that image
          var url = domUrl.createObjectURL(svg);

          // create a new image to hold it the converted type
          var img = new Image();

          // when the image is loaded we can get it as base64 url
          img.onload = function () {
            // draw it to the canvas
            ctx.drawImage(this, margin, margin);

            // if it needs some styling, we need a new canvas
            if (fill) {
              var styled = document.createElement("canvas");
              styled.width = canvas.width;
              styled.height = canvas.height;
              var styledCtx = styled.getContext("2d");
              styledCtx.save();
              styledCtx.fillStyle = fill;
              styledCtx.fillRect(0, 0, canvas.width, canvas.height);
              styledCtx.strokeRect(0, 0, canvas.width, canvas.height);
              styledCtx.restore();
              styledCtx.drawImage(canvas, 0, 0);
              canvas = styled;
            }
            // we don't need the original any more
            domUrl.revokeObjectURL(url);
            // now we can resolve the promise, passing the base64 url
            resolve(canvas.toDataURL());
          };

          // load the image
          img.src = url;
        } catch (err) {
          reject("failed to convert svg to png " + err);
        }
      });
    },
    downloadSvgToCanvas: function () {
      let vueInstance = this;
      let styledSvg = document.querySelector("#svgImage").querySelector("svg");
      this.svgToPng(styledSvg.outerHTML, 0)
        .then(function (data) {
          vueInstance.imageSrc = data;
        })
        .catch(function (err) {
          // do something with the error
        });
    },
    download: function () {
      let vueInstance = this;

      if (vueInstance.flaticon) {
        this.downloadSvgToCanvas();
        return;
      }

      document.querySelector("#img-out").empty();

      html2canvas(document.querySelector("#downloadicone"), {
        onrendered: function (canvas) {
          theCanvas = canvas;
          document.body.appendChild(canvas);
          document.querySelector("#img-out").append(canvas);
        },
      });
    },
    devSettings: function () {},
  },
});
