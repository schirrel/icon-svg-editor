/*
  * converts an svg string to base64 png using the domUrl
  * @param {string} svgText the svgtext
  * @return {Promise} a promise to the bas64 png image
  */
const svgToPng = function (svgText) {
    // convert an svg text to png using the browser
    return new Promise(function (resolve, reject) {
        try {
            // can use the domUrl function from the browser
            var domUrl = window.URL || window.webkitURL || window;
            if (!domUrl) {
                throw new Error("(browser doesnt support this)")
            }

            // figure out the height and width from svg text
            var match = svgText.match(/height=\"(\d+)/m);
            var height = match && match[1] ? parseInt(match[1], 10) : 300;
            var match = svgText.match(/width=\"(\d+)/m);
            var width = match && match[1] ? parseInt(match[1], 10) : 300;

            // it needs a namespace
            if (!svgText.match(/xmlns=\"/mi)) {
                svgText = svgText.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
            }

            // create a canvas element to pass through
            const canvas = document.createElement("canvas");
            canvas.width = height * 1.35; // * value is different from original with uses margin
            canvas.height = width * 1.35;  // * value is different from original with uses margin
            const ctx = canvas.getContext("2d");


            // make a blob from the svg
            var svg = new Blob([svgText], {
                type: "image/svg+xml;charset=utf-8"
            });

            // create a dom object for that image
            var url = domUrl.createObjectURL(svg);

            // create a new image to hold it the converted type
            var img = new Image;

            // when the image is loaded we can get it as base64 url
            img.onload = function () {
                // draw it to the canvas
                ctx.drawImage(this, 0, 0);
                // we don't need the original any more
                domUrl.revokeObjectURL(url);
                // now we can resolve the promise, passing the base64 url
                resolve(canvas.toDataURL());
            };

            // load the image
            img.src = url;

        } catch (err) {
            reject('failed to convert svg to png ' + err);
        }
    });
};

export default svgToPng 