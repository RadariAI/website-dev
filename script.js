// script.js

// Function to fetch articles from the API
async function getAllArticles() {
    const apiUrl = 'https://backend-production-db8e.up.railway.app/article/get-articles';

    const data = {
        k: 20,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Get successful.');
            return responseData.articles;
        } else {
            console.error('Get failed. Status:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

// Function to create repeater items
function createRepeaterItem(article) {
    const item = document.createElement('div');
    item.className = 'repeater-item';

    // Create a link element for the article title
    const link = document.createElement('a');
    link.textContent = article.news_english.title || 'No Title Available';
    link.href = article.news_english.source || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    // Append the link to the repeater item
    item.appendChild(link);

    // Create a scrollable row for analyses
    const scrollableRow = document.createElement('div');
    scrollableRow.className = 'scrollable-row';

    // Add analysis boxes to the scrollable row
    article.analyses.forEach((analysis, index) => {
        const analysisBox = createAnalysisBox(analysis);
        scrollableRow.appendChild(analysisBox);
    });

    // Append the scrollable row to the repeater item
    item.appendChild(scrollableRow);

    return item;
}

// Function to create an analysis box
function createAnalysisBox(analysis) {
    const box = document.createElement('div');
    box.className = 'analysis-box';

    // Create a header container for the first row
    const header = document.createElement('div');
    header.className = 'analysis-header';

    // Extract ticker (slicing after first 10 characters if exists)
    const ticker = analysis.analysis && analysis.stock_code
        ? analysis.stock_code.slice(10)
        : 'Unknown'; // Fallback if stock_code is missing

    // Create a span for the ticker
    const tickerSpan = document.createElement('span');
    tickerSpan.className = 'ticker';
    tickerSpan.textContent = ticker;

    // Extract score (if it exists)
    const score = analysis.analysis && analysis.score
        ? analysis.score
        : 'N/A'; // Fallback if score is missing

    // Create a span for the score
    const scoreSpan = document.createElement('span');
    scoreSpan.className = 'score';
    scoreSpan.textContent = score;

    // Append ticker and score to the header
    header.appendChild(tickerSpan);
    header.appendChild(scoreSpan);

    // Append the header to the analysis box
    box.appendChild(header);

    // Create a paragraph for the analysis text and replace '- ' with bullet points
    const analysisTextContent = analysis.analysis && analysis.analysis.en 
        ? analysis.analysis.en 
        : 'No analysis available'; // Fallback if analysis text is missing
    
    // Split the text by '- ' and create list items
    const bulletPoints = analysisTextContent.split('- ').filter(Boolean);
    
    // Create a list element
    const analysisList = document.createElement('ul');
    analysisList.className = 'analysis-list';

    // Add each point as a list item
    bulletPoints.forEach(point => {
        const listItem = document.createElement('li');
        listItem.textContent = point.trim(); // Trim to remove leading spaces
        analysisList.appendChild(listItem);
    });

    // Append the analysis list to the box
    box.appendChild(analysisList);

    return box;
}

// Function to load articles and build the repeater
async function loadArticles() {
    const articles = await getAllArticles();
    const repeaterContainer = document.getElementById('article-repeater');

    // Clear any existing content
    repeaterContainer.innerHTML = '';

    // Create and append each repeater item
    articles.forEach(article => {
        const repeaterItem = createRepeaterItem(article);
        repeaterContainer.appendChild(repeaterItem);
    });
}

// Load articles when the page loads
document.addEventListener('DOMContentLoaded', loadArticles);
