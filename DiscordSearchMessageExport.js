async function saveLinksToCSV() {
    // Function to get all links from the current page
    function getLinks() {
        const links = [];
        document.querySelectorAll('div[class^="searchResult__"] a[href]').forEach(anchor => {
            links.push(anchor.href);
        });
        return links;
    }

    // Function to download CSV file
    function downloadCSV(data, filename = 'messages.csv') {
        const csvContent = 'data:text/csv;charset=utf-8,' + data.map(e => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Function to click the "Next" button
    function clickNextButton() {
        const nextButton = document.querySelector('button[rel="next"]');
        if (nextButton && !nextButton.disabled) {
            nextButton.click();
            return true;
        }
        return false;
    }

    const allLinks = [];
    let pageCount = 0;

    // Iterate through the pages until the "Next" button is disabled
    while (true) {
        console.log(`Processing page ${pageCount + 1}...`);
        // Get links from the current page and add to allLinks array
        const links = getLinks();
        allLinks.push(...links);

        // Click the next button and wait for 2 seconds
        const clicked = clickNextButton();
        if (!clicked) {
            console.log('Next button is disabled or not found, ending process.');
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        pageCount++;
    }

    // Save all links to a CSV file
    const csvData = allLinks.map(link => [link]);
    downloadCSV(csvData);
    console.log('Export Complete.');
}

saveLinksToCSV();
