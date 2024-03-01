/*
     * Added by Anuj: 12-02-2024
     * code refactor is pending remove settimeout and work with async
     */
navigateToPointId(strElementId, nZoomLevel, strSection, nXAxis, nYAxis) {
    let self = this;

    try {

        let arrElemntBBoxSize = [];
        let objElementData = {};
        let objPanZoomInstance = {};

        if (!isValidString(strElementId) || !isValidNumber(nZoomLevel) ||
            !isValidString(strSection) || !isValidNumber(nXAxis) ||
            !isValidNumber(nYAxis)) {
            return;
        }

        let objHONodeList = myApp._svg_operation._objSectionNodeList[strSection][0];
        let objLONodeList = myApp._svg_operation._objSectionNodeList[strSection][1];

        // If objHONodeList is not valid or doesn't have the element id, return
        if (!isValidObject(objHONodeList) || !objHONodeList.hasOwnProperty(strElementId)) {

            // If objLONodeList is not valid or doesn't have the element id, return
            if (!isValidObject(objLONodeList) || !objLONodeList.hasOwnProperty(strElementId)) {
                return;
            } else {
                // objElementData will be taken from objLONodeList
                objElementData = objLONodeList[strElementId];
            }
        }
        else {
            objElementData = objHONodeList[strElementId];
        }

        if (!isValidObject(objElementData)) {
            return;
        }

        objPanZoomInstance = myApp._svg_detail._section[strSection]['pan_zoom_instance'].reset();

        setTimeout(() => {
            objPanZoomInstance = myApp._svg_detail._section[strSection]['pan_zoom_instance'];

            let strbboxRegex = /bbox="([^"]+)"/;
            let arrMatchOfBbox = objElementData.html.match(strbboxRegex);

            if (!Array.isArray(arrMatchOfBbox)) {
                return;
            }

            arrElemntBBoxSize = arrMatchOfBbox[1].split(',');;

            let nXAxisCoordinates = parseInt(arrElemntBBoxSize[0]);
            let nYAxisCoordinates = parseInt(arrElemntBBoxSize[1]);

            let fDefaultZoom = 1.00;
            let objSizes = objPanZoomInstance.getSizes();
            let fRealZoom = parseFloat(objSizes.realZoom.toFixed(2))
            if (fRealZoom !== fDefaultZoom) {
                // Adjust the pan and zoom calculations for non-default zoom level
                nXAxisCoordinates = nXAxisCoordinates * objSizes.realZoom;
                nYAxisCoordinates = nYAxisCoordinates * objSizes.realZoom;
                nZoomLevel = nZoomLevel * (fDefaultZoom + (fDefaultZoom - fRealZoom));
            }

            // Adjust the zoom level
            objPanZoomInstance.zoom(nZoomLevel);

            let nPanX = -nXAxisCoordinates * nZoomLevel + nXAxis * nZoomLevel;
            let nPanY = -nYAxisCoordinates * nZoomLevel + nYAxis * nZoomLevel;

            objPanZoomInstance.pan({
                x: nPanX,
                y: nPanY
            });
        }, 50)
    } catch (error) {
        console.error("Error in navigatePointId:", error);
    }
}