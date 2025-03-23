export function calculateColumnWidths(data, fixedWidth, fontsize) {
        let totalContentWidths = [];
        let totalContentwordWidths = [];
        let totalWidth =[];
        let cellWidth;
        let wordWidth;

    // Step 1: Measure content width for each column
    // console.log(data, fixedWidth,keys,fontsize)


    data.forEach((row, index) => {
        row.forEach((cell, columnIndex) => {
            if (index===0) {
                cellWidth = countUtf8Bytes(cell) * fontsize ;
                wordWidth = cellWidth;
            }else {
                cellWidth = cell.length * fontsize; // Estimate width based on character count
                wordWidth = wordwidth(cell) * fontsize;
            }
            if (!totalContentWidths[columnIndex] || cellWidth > totalContentWidths[columnIndex]) {
                totalContentWidths[columnIndex] = cellWidth;
            }
            if (!totalContentwordWidths[columnIndex] || wordWidth > totalContentwordWidths[columnIndex]) {
                totalContentwordWidths[columnIndex] = wordWidth;
            }
        });
    });

    // Step 2: Calculate total width of all columns
    // console.log(totalContentWidths)
    totalWidth = totalContentWidths.reduce((acc, width) => acc + width, 0);
    // Step 3: Adjust widths based on the total width compared to fixedWidth
    let adjustedWidths;
    if (totalWidth <= fixedWidth) {
        // If total content width fits, distribute remaining space evenly
        const remainingSpace = fixedWidth - totalWidth;
        const additionalSpacePerColumn = Math.floor(remainingSpace / totalContentWidths.length);
        adjustedWidths = totalContentWidths.map(width => Math.floor(width) + additionalSpacePerColumn);
    } else {
        // If total width exceeds fixed width, scale down proportionally
        const scaleFactor = fixedWidth / totalWidth;
        if (scaleFactor>0.85)
           adjustedWidths = totalContentWidths.map(width => Math.floor(width * scaleFactor));
        //check overlap
        else {
            totalContentWidths = [];
            // totalWidth = totalContentwordWidths.reduce((acc, width) => acc + width, 0);
            adjustedWidths = totalContentwordWidths.map(width => Math.floor(width));
        }
    }
    // Ensure that the final adjusted widths do not exceed fixedWidth
    const adjustedTotalWidth = adjustedWidths.reduce((acc, width) => acc + width, 0);
    // console.log("1 adjuxt",adjustedTotalWidth)
    if (adjustedTotalWidth > fixedWidth) {
        const excessWidth = adjustedTotalWidth - fixedWidth;
        const adjustmentPerColumn = Math.floor(excessWidth / adjustedWidths.length);
        adjustedWidths = adjustedWidths.map(width => Math.max(0, width - adjustmentPerColumn));
    }
    return adjustedWidths.map(width => Math.floor(width)); // Ensure widths are integers
    // return adjustedWidths.map(width => Math.floor(width) % 2 ? Math.floor(width)-1: Math.floor(width)); // Ensure widths are integers
}

function countUtf8Bytes(s){
    // var b = 0, i = 0, c
    // for(;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);

    let b=new Blob([s]).size;
    if (s.length!==b)
        // parseFloat((s).toFixed(2));

        b=Math.round(s.length * 1.5);
        if (s.length<=2)
            b +=1;

    return b
}

function wordwidth(cell) {
    // Implement the logic to calculate the width of the longest word in the cell
     if (cell ===null)
         return 4;
    return Math.max(...cell.split(" ").map(word => word.length)); // Placeholder implementation
}


