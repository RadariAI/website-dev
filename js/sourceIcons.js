// /js/sourceIcons.js

// Define a mapping between source domains and their respective icon paths and names
const sourceMapping = {
    'yahoo': {
        icon: 'images/yahoo_finance_Logo_Transparent.png',
        name: 'Yahoo Finance'
    },
    'www.am730.com.hk': {
        icon: 'images/am730_Logo_Transparent.png',
        name: 'am730'
    },
    'finnhub.io': {
        icon: 'images/finnhub_Logo_Transparent.png',
        name: 'Finnhub'
    },
    'www.hk01.com': {
        icon: 'images/HK01_Logo_Transparent.png',
        name: 'HK01'
    },
    'inews.hket.com': {
        icon: 'images/HKET_Logo_Transparent.png',
        name: 'HKET'
    },
    'hkej.com': {
        icon: 'images/HKEJ_Logo_Transparent.png',
        name: 'HKEJ'
    },
    'finance.mingpao.com': {
        icon: 'images/Mingpao_Logo_Transparent.png',
        name: 'Mingpao'
    }
};

// Export the function to get the source icon as a DOM element
export function getSourceIcon(source) {
    if (!source) return null;

    // Find the first matching source in the mapping
    for (const key in sourceMapping) {
        if (source.includes(key)) {
            const imageUrl = sourceMapping[key].icon;

            // Create the container div
            const container = document.createElement('div');
            container.style.height = '40px';
            container.style.width = '40px';
            container.style.borderRadius = '50%';
            container.style.backgroundColor = '#fff';
            container.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.25)';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';

            // Create the image element
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.width = '30px';
            img.style.objectFit = 'contain';

            // Append the image to the container
            container.appendChild(img);

            return container; // Return the container with the image
        }
    }

    return null; // Return null if no source matches
}

// Export the function to get the source name
export function getSourceName(source) {
    if (!source) return '';

    // Find the first matching source in the mapping
    for (const key in sourceMapping) {
        if (source.includes(key)) {
            return sourceMapping[key].name;
        }
    }

    return ''; // Return empty string if no source matches
}
