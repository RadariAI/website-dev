// server.js

// Function to fetch articles from the API
export async function getArticles(cursor = null, sourceFilters = []) {
    const apiUrl = 'https://backend-production-db8e.up.railway.app/article/get-articles';

    const data = {
        k: 20,
    };

    // Add cursor to the request data if provided
    if (cursor) {
        data.cursor = cursor; // Use the article_id of the last article as the cursor
    }

    // Add source_filters to the request data if provided
    if (sourceFilters.length > 0) {
        data.source_filters = sourceFilters;
    }

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
