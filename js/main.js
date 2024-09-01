import { getArticles } from './server.js'
import { getSourceIcon, getSourceName } from './sourceIcons.js';

let articlesList = [];

// Function to create repeater items
function createRepeaterItem(article) {
    const item = document.createElement('div');
    item.className = 'repeater-item';

    // Create a container for the source info row
    const sourceInfoContainer = document.createElement('div');
    sourceInfoContainer.className = 'source-info-row'; // Class for styling the source info row
    sourceInfoContainer.style.display = 'flex';
    sourceInfoContainer.style.alignItems = 'center'; // Center align items vertically

    // Get the source icon element
    const sourceIconElement = getSourceIcon(article.news_english.source);

    // Append the source icon element if it exists
    if (sourceIconElement) {
        sourceInfoContainer.appendChild(sourceIconElement);
    }

    // Get the source name text
    const sourceNameText = getSourceName(article.news_english.source);

    // Create a span element for the source name
    const sourceNameSpan = document.createElement('span');
    sourceNameSpan.textContent = sourceNameText;
    sourceNameSpan.style.marginLeft = '10px'; // Add some spacing between the icon and name
    sourceNameSpan.style.fontSize = '14px'; // Font size for source name
    sourceNameSpan.style.color = '#333'; // Set color for better visibility

    // Append the source name span to the source info container
    sourceInfoContainer.appendChild(sourceNameSpan);

    // Append the source info container to the repeater item
    item.appendChild(sourceInfoContainer);

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
    article.analyses.forEach((analysis) => {
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

// Function to initialize the repeater and load articles
async function initializeRepeater() {
    // Load initial articles without a cursor
    const initialArticles = await getArticles();

    // Update the local list and populate the repeater
    if (initialArticles.length > 0) {
        articlesList = initialArticles; // Initialize the local list with fetched articles
        updateRepeater(); // Populate the repeater with articles
    }
}

// Function to update the repeater with the current articles in the local list
function updateRepeater() {
    const repeaterContainer = document.getElementById('article-repeater');
    repeaterContainer.innerHTML = ''; // Clear existing content

    articlesList.forEach((article) => {
        const repeaterItem = createRepeaterItem(article);
        repeaterContainer.appendChild(repeaterItem); // Add each item to the repeater
    });
}

// Function to load more articles when "Load More" button is clicked
async function loadMoreArticles() {
    if (articlesList.length === 0) return; // Return if the list is empty

    // Get the last article in the list to use its article_id as the cursor
    const lastArticle = articlesList[articlesList.length - 1];
    const cursor = lastArticle.article_id;

    // Fetch more articles with the cursor and current filters
    const sourceFilters = getSelectedSourceFilters();
    const newArticles = await getArticles(cursor, sourceFilters);

    if (newArticles.length > 0) {
        // Append new articles to the local list
        articlesList = [...articlesList, ...newArticles];
        updateRepeater(); // Update the repeater with new articles
    }
}

// Function to get selected source filters from checkboxes
function getSelectedSourceFilters() {
    const checkboxes = document.querySelectorAll('input[name="source"]:checked');
    const selectedSources = Array.from(checkboxes).map(checkbox => checkbox.value);

    // If "Read All" is selected, ignore other checkboxes
    if (selectedSources.includes('all')) {
        return [];
    }

    return selectedSources;
}

// Event listener for source filter changes
document.querySelectorAll('input[name="source"]').forEach(checkbox => {
    checkbox.addEventListener('change', async () => {
        // If "Read All" is checked, uncheck all other checkboxes
        if (checkbox.value === 'all' && checkbox.checked) {
            document.querySelectorAll('input[name="source"]').forEach(cb => {
                if (cb.value !== 'all') {
                    cb.checked = false;
                }
            });
        } else {
            // If any other checkbox is checked, uncheck "Read All"
            document.getElementById('read-all').checked = false;
        }

        // Fetch articles based on updated filters
        const sourceFilters = getSelectedSourceFilters();
        const filteredArticles = await getArticles(null, sourceFilters); // Fetch articles with the new filters
        articlesList = filteredArticles; // Replace the local article list with the new data
        updateRepeater(); // Update the repeater with new articles
    });
});


// Event listener for "Load More" button
document.getElementById('load-more-btn').addEventListener('click', loadMoreArticles);

// Load articles when the page loads
document.addEventListener('DOMContentLoaded', initializeRepeater);