const createSvg = ({ gradienteDirection, cor, cor2 }) => {
    const xmlns = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(xmlns, "defs");
    const grad = document.createElementNS(xmlns, "linearGradient");
    grad.setAttributeNS(null, "id", "gradient");
    const stopTop = document.createElementNS(xmlns, "stop");
    const stopBottom = document.createElementNS(xmlns, "stop");
    stopTop.setAttributeNS(null, "offset", "0%");
    stopTop.setAttributeNS(null, "stop-color", cor);
    if (gradienteDirection) {
        grad.setAttributeNS(
            null,
            "gradientTransform",
            `rotate(${gradienteDirection})`
        );
    }
    grad.appendChild(stopTop);
    stopBottom.setAttributeNS(null, "offset", "100%");
    stopBottom.setAttributeNS(null, "stop-color", cor2);
    grad.appendChild(stopBottom);
    defs.appendChild(grad);

    return { xmlns, defs, grad}
}

export default createSvg