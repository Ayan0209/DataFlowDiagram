// Load CSV and draw the main diagram
    var data = [
        { Groups: "IVR", Module: "Module_20", API_Name: "API_1", SOR: "SOR_12", SOR_E3_URL: "https://example.com/SOR_12/api/API_1", Description: "This is a description for API_1 in Module_20.", is_Structured: "Structured", SOR_List: ["SOR_12", "SOR_6", "SOR_19"] },
        { Groups: "IVR", Module: "Module_5", API_Name: "API_2", SOR: "SOR_199999999999999", SOR_E3_URL: "https://example.com/SOR_19/api/API_2", Description: "This is a description for API_2 in Module_5.", is_Structured: "Structured", SOR_List: ["SOR_19", "SOR_7"] },
        { Groups: "IVR", Module: "Module_14", API_Name: "API_3", SOR: "SOR_4", SOR_E3_URL: "https://example.com/SOR_4/api/API_3", Description: "This is a description for API_3 in Module_14.", is_Structured: "Structured", SOR_List: ["SOR_4", "SOR_18"] },
        { Groups: "CHAT", Module: "Module_20", API_Name: "API_18", SOR: "SOR_2", SOR_E3_URL: "https://example.com/SOR_19/api/API_18", Description: "This is a description for API_18 in Module_20.", is_Structured: "Unstructured", SOR_List: ["SOR_2", "SOR_19"] },
        { Groups: "CHAT", Module: "Module_3", API_Name: "API_19", SOR: "SOR_8", SOR_E3_URL: "https://example.com/SOR_8/api/API_19", Description: "This is a description for API_19 in Module_3.", is_Structured: "Unstructured", SOR_List: ["SOR_8", "SOR_3"] },
        { Groups: "IVR", Module: "Module_14", API_Name: "API_3", SOR: "SOR_4", SOR_E3_URL: "https://example.com/SOR_4/api/API_3", Description: "This is a description for API_3 in Module_14.", is_Structured: "Unstructured",  SOR_List: ["SOR_4", "SOR_18"] },
        { Groups: "IVR", Module: "Module_5", API_Name: "API_2", SOR: "SOR_2", SOR_E3_URL: "https://example.com/SOR_19/api/API_2", Description: "This is a description for API_2 in Module_5.", is_Structured: "Unstructured", SOR_List: ["SOR_19", "SOR_7"] },
        { Groups: "IVR", Module: "Module_5", API_Name: "API_5", SOR: "SOR_2", SOR_E3_URL: "https://example.com/SOR_19/api/API_2", Description: "This is a description for API_2 in Module_5.", is_Structured: "Unstructured", SOR_List: ["SOR_19", "SOR_7"] },
        { Groups: "CHAT", Module: "Module_20", API_Name: "API_18", SOR: "SOR_19", SOR_E3_URL: "https://example.com/SOR_19/api/API_18", Description: "This is a description for API_18 in Module_20.", is_Structured: "Unstructured", SOR_List: ["SOR_2", "SOR_19"] },
        { Groups: "CHAT", Module: "Module_3", API_Name: "API_19", SOR: "SOR_8", SOR_E3_URL: "https://example.com/SOR_8/api/API_19", Description: "This is a description for API_19 in Module_3.", is_Structured: "Semi-structured", SOR_List: ["SOR_8", "SOR_3"] },
        { Groups: "CHAT", Module: "Module_4", API_Name: "API_20", SOR: "SOR_23", SOR_E3_URL: "https://example.com/SOR_23/api/API_20", Description: "This is a description for API_20 in Module_4.", is_Structured: "Semi-structured", SOR_List: ["SOR_23", "SOR_24"] },
        { Groups: "CHAT", Module: "Module_5", API_Name: "API_21", SOR: "SOR_14", SOR_E3_URL: "https://example.com/SOR_15/api/API_21", Description: "This is a description for API_21 in Module_5.", is_Structured: "Semi-structured", SOR_List: ["SOR_14", "SOR_15"] },
        { Groups: "CHAT", Module: "Module_16", API_Name: "API_21", SOR: "SOR_15", SOR_E3_URL: "https://example.com/SOR_15/api/API_21", Description: "This is a description for API_21 in Module_16.", is_Structured: "Semi-structured", SOR_List: ["SOR_15", "SOR_16"] }
    ];
    
    // Access the SVG container
const container = d3.select("#main-diagram");

// Set CSS for the container to enable scrolling
container.style("overflow", "auto");

// Retrieve the width and height for the SVG
const width = Math.max(window.innerWidth, 4500);  // Ensuring a minimum width
const height = Math.max(window.innerHeight, 2500); // Ensuring a minimum height

// Append SVG to the container with updated dimensions
const svg = container.append("svg")
    .attr("width", width)
    .attr("height", height);

// Define arrowhead marker
svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#000000");

// Layout parameters
const centralX = width - 100;
const centralY = height / 2;
const originalOffset = 150; // Original offset
const additionalOffset = 250; // Additional offset to shift groups further apart


// Draw IVR and CHAT groups
drawGroupDiagram(svg, data, centralX - originalOffset - additionalOffset, centralY, "IVR", "left");

//scrollToElement('#central');


function determineArrowStyle(isStructured) {
    switch (isStructured) {
        case "Structured":
            return { color: "black", dasharray: "0" };  // Solid black arrow
        case "Unstructured":
            return { color: "black", dasharray: "5,5" };  // Dotted black arrow
        case "Semi-structured":
            return { color: "red", dasharray: "0" };  // Solid red arrow
        default:
            return { color: "black", dasharray: "0" };  // Default solid black
    }
}

function drawGroupDiagram(svg, fullData, centerX, centerY, groupLabel, direction) {

    //const numSors = groupData.length;  // Use the length directly if filtering for unique values before passing to function
    const uniqueGroups = Array.from(new Set(fullData.map(d => d.Groups)));
    //const uniqueModules = Array.from(new Set(groupData.map(d => d.Module)));
    // Draw IVR or CHAT box

    uniqueGroups.forEach((group, i) => {

        const groupData = fullData.filter(d => d.Groups === group);
        const uniqueSors = Array.from(new Set(groupData.map(d => d.SOR)));
        const sorX = direction === "left" ? centerX - 500 : centerX + 500;
        const totalGroups = uniqueGroups.length;
        const offsetPerGroup = 100;
        const totalHeight = offsetPerGroup*totalGroups;
        const startY = centerY - totalHeight/2;
        const groupY = startY + i*offsetPerGroup;
        const groupID = `group-${group}`;

        svg.append("rect")
        .attr("x", centerX - 50)
        .attr("y", groupY)
        .attr("width", 100)
        .attr("height", 60)
        .attr("class", groupLabel.toLowerCase())
        .attr("id", groupID)
        .on("click", function() {
            svg.transition()
                        .duration(500)  // Transition over 500 milliseconds
                        .style("opacity", 0)  // Fade to transparent
                        .on("end", function() {  // Once the transition is complete
                            // Call the showIVROverlay function to render the overlay details
                            showSORs(uniqueSors, centerX, groupY, direction, groupData, fullData, group);
                            // Optionally, fade in the new overlay if it is drawn in the same svg
                            svg.style("opacity", 0)
                                .transition()
                                .duration(500)
                                .style("opacity", 1);
                        });

        });

        svg.append("text")
        .attr("x", centerX)
        .attr("y", groupY + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text(group);
        
        console.log("groupID", groupID)
    });

    scrollToElement("#group-IVR")

}

function showSORs(uniqueSors, centerX, centerY, direction, groupData, fullData, activeGroup) {

    const svg = d3.select("#main-diagram svg");
    centerY = centerY + 30;

    svg.select("#sor-group").remove();
    svg.select("#detail-group").remove();

    const sorGroup = svg.append("g")
                            .attr("id", "sor-group");

    uniqueSors.forEach((sor, i) => {

        const sorData = groupData.find(d => d.SOR === sor);
        const sorX = direction === "left" ? centerX - 500 : centerX + 500;
        const totalSor = uniqueSors.length;
        const offsetPerSor = 60;
        const totalHeight = offsetPerSor*totalSor;
        const startY = centerY - totalHeight/2 + 30;
        const sorY = startY + i*offsetPerSor;
        const sorID = generateSORId(sorData.SOR, sorData.Module, i);

        const text = sorGroup.append("text")
                        .attr("x", sorX)
                        .attr("y", sorY + 5)
                        .attr("text-anchor", "middle")
                        .style("font-size", "12px")
                        .text(sor);

        const textWidth = text.node().getBBox().width;
        const padding = 20
        const rectWidth = textWidth + 2 * padding;

        const sorXRect = direction === "left" ? sorX - rectWidth + padding : sorX - padding;

        const staggerAmount = 7; // Pixels to stagger each subsequent arrow
        const elbowX = direction === "left" ? (centerX - 100 - i * staggerAmount) - 200 : (centerX + 100 + i * staggerAmount);
        const newCenterX = direction === "left" ? centerX - 50 : centerX + 50;

            sorGroup.append("path")
                .attr("d", `M${newCenterX},${centerY} L${elbowX},${centerY} L${elbowX},${sorY}`)
                .attr("stroke", "black")
                .attr("stroke-width", 3)
                .attr("fill", "none");

            // Determine the arrow style based on "is_Structured"

            const arrowStyle = determineArrowStyle("Structured");
            const sorNewX = direction === "left" ? sorX + 40 : sorX - 40;
            // Draw arrows to SOR boxes



        sorGroup.append("rect")
            .attr("x",  sorXRect)
            .attr("y", sorY - 20)
            .attr("width", rectWidth)
            .attr("height", 40)
            .attr("class", "sor")
            .attr("id", sorID)
            .on("click", function() {
                    svg.transition()
                        .duration(500)  // Transition over 500 milliseconds
                        .style("opacity", 0)  // Fade to transparent
                        .on("end", function() {  // Once the transition is complete
                            // Call the showIVROverlay function to render the overlay details
                            showOverlay(sor, groupData, sorID, sorXRect, sorY, direction, rectWidth);
                            // Optionally, fade in the new overlay if it is drawn in the same svg
                            svg.style("opacity", 0)
                                .transition()
                                .duration(500)
                                .style("opacity", 1);
                        });
                });

        text.remove();

        sorGroup.append("text")
            .attr("x", sorXRect + rectWidth/2)
            .attr("y", sorY + 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "white")
            .text(sor);

        sorGroup.append("path")
            .attr("d", `M${elbowX},${sorY} L${sorNewX},${sorY}`)
            .attr("stroke", arrowStyle.color)
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", arrowStyle.dasharray)
            .attr("marker-end", "url(#arrow)");
        
            
    });

    drawGroupConnections(activeGroup, fullData, centerX, centerY, direction);

}

function showOverlay(sor, groupData, sorID, centerX, centerY, direction, sorWidth) {

    const svg = d3.select("#main-diagram svg");

    svg.select("#detail-group").remove();

    const detailGroup = svg.append("g")
                            .attr("id", "detail-group");

    // Filter data for the selected SOR
    const sorData = groupData.filter(d => d.SOR === sor);
    //console.log(sorData);

    const apiYStart = centerY - 50 * sorData.length / 2;
    sorData.forEach((api, index) => {
        console.log(api.API_Name);
        const apiX = direction === "left" ? centerX - 300 : centerX + 300;
        const apiY = apiYStart + index * 50;

        const text = detailGroup.append("text")
                        .attr("x", apiX)
                        .attr("y", apiY + 5)
                        .attr("text-anchor", "middle")
                        .style("font-size", "12px")
                        .text(api.API_Name);

        const textWidth = text.node().getBBox().width;
        const padding = 20
        const rectWidth = textWidth + 2 * padding;

        const apiXRect = direction === "left" ?  apiX - rectWidth + padding : apiX;

        const polygon = detailGroup.append("rect")
            .attr("x", apiXRect)
            .attr("y", apiY)
            .attr("width", rectWidth)
            .attr("height", 40)
            .attr("class", "sor");

        polygon.append("title").text(api.Description);

        text.remove();

        detailGroup.append("text")
            .attr("x", apiXRect + rectWidth/2)
            .attr("y", apiY + 25)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "white")
            .text(api.API_Name);

        const staggerAmount = 7; // Pixels to stagger each subsequent arrow
        const elbowX = direction === "left" ? centerX - 100 - index * staggerAmount : centerX + 100 + index * staggerAmount;
        const newCenterX = direction === "left" ? centerX:  centerX + sorWidth;

            detailGroup.append("path")
                .attr("d", `M${newCenterX},${centerY} L${elbowX},${centerY} L${elbowX},${apiY+20}`)
                .attr("stroke", "black")
                .attr("stroke-width", 3)
                .attr("fill", "none");

        const arrowStyle = determineArrowStyle(api.is_Structured);

        const apiNewX = direction === "left" ? apiXRect + rectWidth +10 : apiXRect - 10;

        detailGroup.append("path")
                .attr("d", `M${elbowX},${apiY+20} L${apiNewX},${apiY+20}`)
                .attr("stroke", arrowStyle.color)
                .attr("stroke-width", 3)
                .attr("stroke-dasharray", arrowStyle.dasharray)
                .attr("marker-end", "url(#arrow)");

        const sorList = api.SOR_List;
        console.log("SOR List: ", sorList.length);
        const colors = generateColorShades("#2671B9", sorList.length);
        const circleRadius = 10;
        const startX = direction === "left" ? apiX - rectWidth - 20 : apiX + rectWidth + 20;

        sorList.forEach((sorName, i) => {
            const circleX = startX + (direction === "left" ? -1 : 1) * i * (circleRadius * 2 + 5);
            detailGroup.append("circle")
                        .attr("cx", circleX)
                        .attr("cy", apiY + 20)
                        .attr("r", circleRadius)
                        .attr("fill", colors[i])
                        .append("title").text(sorName);
        });
    });

    scrollToElement('#'+sorID);
}

function showIVROverlay(modules) {
    // Blur the main diagram
    d3.select("svg").classed("blurred", true);

    // Show the overlay
    d3.select("#overlay").style("display", "block");

    // Clear any existing content in the overlay SVG
    const overlaySvg = d3.select("#focused-diagram");
    overlaySvg.selectAll("*").remove();

    // Layout parameters for the overlay
    const panelWidth = 1500;
    const panelHeight = 1000;
    const centerX = panelWidth / 2;
    const moduleHeight = panelHeight / modules.length;

    // Draw the IVR rectangle at the center with partitions for each module
    overlaySvg.append("rect")
        .attr("x", centerX - 75)
        .attr("y", 0)
        .attr("width", 150)
        .attr("height", panelHeight)
        .attr("class", "ivr");

    // Draw partitions and module labels
    modules.forEach((module, i) => {
        const partitionY = i * moduleHeight;

        overlaySvg.append("line")
            .attr("x1", centerX - 75)
            .attr("y1", partitionY)
            .attr("x2", centerX + 75)
            .attr("y2", partitionY)
            .attr("stroke", "#FF6600")
            .attr("stroke-width", 1);

        overlaySvg.append("text")
            .attr("x", centerX)
            .attr("y", partitionY + moduleHeight / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text(module);
    });
}

// Function to close the overlay and unblur the main diagram
function closeOverlay() {
    d3.select("#overlay").style("display", "none");
    d3.select("svg").classed("blurred", false);
}

function scrollToElement(selector) {
    const container = document.querySelector('#main-diagram');
    const element = document.querySelector(selector);
    if (!element) {
        console.log("Element not found:", selector);
        return;
    }

    // Get container and element bounding rectangles
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Calculate the position to scroll within the container
    const scrollToX = elementRect.left - containerRect.left + container.scrollLeft - (container.clientWidth / 2) + (elementRect.width / 2);
    const scrollToY = elementRect.top - containerRect.top + container.scrollTop - (container.clientHeight / 2) + (elementRect.height / 2);

    // Use scrollTo method of the container
    container.scrollTo(scrollToX, scrollToY);

    console.log("Scrolling to element:", selector, "at X:", scrollToX, "Y:", scrollToY);
}


function generateColorShades(baseColor, count) {
    const shades = [];
    const base = d3.color(baseColor);
    for (let i = 0; i<count; i++){
        const shade = base.brighter(i*0.5);
        shades.push(shade.toString());
    }
    return shades;
}

function generateSORId(sor, module, index) {
    return `sor-${sor.replace(/[\W_]+/g, "-")}-${module.replace(/[\W_]+/g, "-")}-${index}`;
}

function drawGroupConnections(activeGroup, fullData, centerX, centerY, direction) {
    const svg = d3.select("#main-diagram svg");
    svg.select("#groupLines").remove();
    const groupLines = svg.append("g").attr("id", "groupLines");

    const activeGroupData = fullData.filter(d => d.Groups === activeGroup);
    const activeGroupSORs = new Set(activeGroupData.map(d => d.SOR));
    const uniqueGroups = new Set(fullData.map(d => d.Groups));

    uniqueGroups.forEach(group => {
        const groupData = fullData.filter(d => d.Groups === group);
        const targetGroupSORs = new Set(groupData.map(d => d.SOR));
        var hasCommonSORs = false;
        for (let element of activeGroupSORs) {
            if (group !== activeGroup && targetGroupSORs.has(element)) {
                hasCommonSORs = true;
            }
        }
        console.log("Group:", group, "hasCommonSORs:", hasCommonSORs);

        if (hasCommonSORs) {
            
            const groupCenter = calculateGroupCenter(group); 
            groupLines.append("path")
                        .attr("d", `M${centerX - 50},${groupCenter} H${centerX - 150} V${centerY}`)
                        .attr("stroke", "black")
                        .attr("stroke-width", 3)
                        .attr("fill", "none");

        }
        
    });
}

function calculateGroupCenter(group) {
    const selector = '#group-' + group;
    const groupElement = d3.select(selector);
    const bbox = groupElement.node().getBBox();
    const centerY = bbox.y + bbox.height / 2;
    return centerY;
}


