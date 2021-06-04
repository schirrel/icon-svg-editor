/*
  * converts an svg string to base64 png using the domUrl
  * @param {string} svgText the svgtext
  * @return {Promise} a promise to the bas64 png image
  */
const svgToPng = function (element) {
    const svgText = element.outerHTML;
    // convert an svg text to png using the browser
    return new Promise(function (resolve, reject) {
        try {
            // can use the domUrl function from the browser
            const domUrl = window.URL || window.webkitURL || window;
            if (!domUrl) {
                throw new Error("(browser doesnt support this)")
            }
            const sourceHeight =  element.viewBox.baseVal.height || element.getBBox().height || 300;
            const sourceWidth = element.viewBox.baseVal.width ||element.getBBox().width || 300;

            if (!svgText.match(/xmlns=\"/mi)) {
                svgText = svgText.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
            }
            const canvas = document.querySelector('.canvas-container');
            const xml = new XMLSerializer().serializeToString(element);
            const svg64 = btoa(xml);
            const image64 = 'data:image/svg+xml;base64,' + svg64;
            canvas.width = sourceWidth;
            canvas.height = sourceHeight;

            const image = new Image();
            image.onload = () => {
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, sourceWidth, sourceHeight);
                if (sourceHeight > 300) {
                    const RATIO = 300 / sourceHeight;
                    const adjustedWidth = sourceWidth * RATIO
                    canvas.style.setProperty('--mh', 300 + "px");
                    canvas.style.setProperty('--mw',adjustedWidth + "px");

                }
                resolve(canvas.toDataURL());
            };
            image.src = image64;
        } catch (err) {
            reject('failed to convert svg to png ' + err);
        }
    });
};

export default svgToPng