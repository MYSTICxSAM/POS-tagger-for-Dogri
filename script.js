document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dogriInput = document.getElementById('dogri-input');
    const tagBtn = document.getElementById('tag-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const clearBtn = document.getElementById('clear-btn');
    const searchInput = document.getElementById('search-input');
    const exportBtn = document.getElementById('export-btn');
    const resultsBody = document.getElementById('results-body');
    const resultsTableContainer = document.getElementById('results-table-container');
    const loadingElement = document.getElementById('loading');
    const noResultsElement = document.getElementById('no-results');

    // Sample Dogri text
    const sampleText = `अंश, सलोनी ते समर्थ इक परियोजना पर कम्म करा दे न।`;

    // POS tags with explanations (you'll need to customize this for Dogri)
    const posTags = {
        'NN': {name: 'Noun', description: 'A word that represents a person, place, thing, or idea'},
        'VB': {name: 'Verb', description: 'A word that describes an action or state of being'},
        'JJ': {name: 'Adjective', description: 'A word that describes or modifies a noun'},
        'RB': {name: 'Adverb', description: 'A word that modifies a verb, adjective, or other adverb'},
        'PR': {name: 'Pronoun', description: 'A word that takes the place of a noun'},
        'PP': {name: 'Postposition', description: 'A word that indicates spatial or logical relations'}, // Common in Dogri
        'CC': {name: 'Conjunction', description: 'A word that connects words, phrases, or clauses'},
        'IN': {name: 'Interjection', description: 'A word or phrase that expresses strong emotion'},
        'CD': {name: 'Numeral', description: 'A word that represents a number'},
        'DM': {name: 'Demonstrative', description: 'A word that points to something specific'}, // Common in Dogri
        'QT': {name: 'Quantifier', description: 'A word that indicates quantity'},
        'AB': {name: 'Auxiliary Verb', description: 'A verb that adds functional meaning to another verb'},
        // Add more Dogri-specific tags as needed
    };

    // Event Listeners
    sampleBtn.addEventListener('click', loadSampleText);
    clearBtn.addEventListener('click', clearInput);
    tagBtn.addEventListener('click', processText);
    searchInput.addEventListener('input', filterResults);
    exportBtn.addEventListener('click', exportResults);

    // Functions
    function loadSampleText() {
        dogriInput.value = sampleText;
    }

    function clearInput() {
        dogriInput.value = '';
        hideResults();
    }

    function hideResults() {
        resultsTableContainer.classList.add('hidden');
        noResultsElement.classList.remove('hidden');
    }

    function showLoading() {
        loadingElement.style.display = 'flex';
        resultsTableContainer.classList.add('hidden');
        noResultsElement.classList.add('hidden');
    }

    function hideLoading() {
        loadingElement.style.display = 'none';
    }

    function processText() {
        const text = dogriInput.value.trim();
        
        if (!text) {
            alert('Please enter some Dogri text to process.');
            return;
        }

        showLoading();
        
        // Simulate API call with timeout
        setTimeout(() => {
            const taggedWords = posTagDogri(text);
            displayResults(taggedWords);
            hideLoading();
        }, 1500);
    }

    // This is a mock POS tagging function - you'll need to replace it with actual Dogri POS tagging logic
    function posTagDogri(text) {
        // Simple tokenization (you'll need a better tokenizer for Dogri)
        const words = text.split(/[\s,.।?!]+/).filter(word => word.length > 0);
        
        // Mock tagging - in a real app, this would come from your POS tagging algorithm/API
        return words.map(word => {
            // Very simple mock tagging - replace with actual Dogri POS tagging logic
            let tag = 'NN'; // Default to noun
            
            if (word.endsWith('ने') || word.endsWith('या') || word.endsWith('ी')) {
                tag = 'VB'; // Very rough guess for verbs
            } else if (word.endsWith('ी') || word.endsWith('ा') || word.endsWith('े')) {
                tag = 'JJ'; // Rough guess for adjectives
            } else if (word === 'और' || word === 'या' || word === 'पर') {
                tag = 'CC'; // Conjunctions
            } else if (word === 'मैंने' || word === 'उनकी' || word === 'वह') {
                tag = 'PR'; // Pronouns
            } else if (word === 'बहुत' || word === 'कल') {
                tag = 'RB'; // Adverbs
            }
            
            return {
                word: word,
                tag: tag,
                definition: getDefinition(word) // Mock definition
            };
        });
    }

    // Mock dictionary lookup - replace with actual Dogri dictionary
    function getDefinition(word) {
        const mockDictionary = {
            'मैंने': 'I (ergative case)',
            'कल': 'yesterday or tomorrow (depending on context)',
            'एक': 'one, a, an',
            'सुंदर': 'beautiful',
            'बगीचे': 'garden (locative case)',
            'लाल': 'red',
            'फूल': 'flower(s)',
            'देखे': 'saw (past tense)',
            'उनकी': 'their',
            'खुशबू': 'fragrance',
            'बहुत': 'very',
            'अच्छी': 'good (feminine)',
            'थी': 'was (feminine)',
            'और': 'and',
            'पक्षी': 'birds',
            'गा': 'sing',
            'रहे': 'were (continuous aspect)',
            'थे': 'were (masculine plural)'
        };
        
        return mockDictionary[word] || 'No definition available';
    }

    function displayResults(taggedWords) {
        resultsBody.innerHTML = '';
        
        if (taggedWords.length === 0) {
            noResultsElement.classList.remove('hidden');
            resultsTableContainer.classList.add('hidden');
            return;
        }
        
        taggedWords.forEach(item => {
            const row = document.createElement('tr');
            
            const wordCell = document.createElement('td');
            wordCell.textContent = item.word;
            
            const tagCell = document.createElement('td');
            const tagInfo = posTags[item.tag] || {name: item.tag, description: 'Unknown tag'};
            const tagSpan = document.createElement('span');
            tagSpan.className = `tooltip tag-${tagInfo.name.toLowerCase()}`;
            tagSpan.textContent = tagInfo.name;
            
            const tooltipSpan = document.createElement('span');
            tooltipSpan.className = 'tooltiptext';
            tooltipSpan.textContent = tagInfo.description;
            
            tagSpan.appendChild(tooltipSpan);
            tagCell.appendChild(tagSpan);
            
            const definitionCell = document.createElement('td');
            definitionCell.textContent = item.definition;
            
            row.appendChild(wordCell);
            row.appendChild(tagCell);
            row.appendChild(definitionCell);
            
            resultsBody.appendChild(row);
        });
        
        resultsTableContainer.classList.remove('hidden');
        noResultsElement.classList.add('hidden');
    }

    function filterResults() {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = resultsBody.getElementsByTagName('tr');
        
        let visibleCount = 0;
        
        for (const row of rows) {
            const word = row.cells[0].textContent.toLowerCase();
            const tag = row.cells[1].textContent.toLowerCase();
            const definition = row.cells[2].textContent.toLowerCase();
            
            if (word.includes(searchTerm) || tag.includes(searchTerm) || definition.includes(searchTerm)) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        }
        
        if (visibleCount === 0 && searchTerm) {
            noResultsElement.classList.remove('hidden');
            noResultsElement.innerHTML = '<p>No matching results found for your search.</p>';
        } else {
            noResultsElement.classList.add('hidden');
        }
    }

    function exportResults() {
        const rows = resultsBody.getElementsByTagName('tr');
        if (rows.length === 0) {
            alert('No results to export.');
            return;
        }
        
        let csvContent = "Word,POS Tag,Definition\n";
        
        for (const row of rows) {
            if (row.style.display === 'none') continue;
            
            const word = row.cells[0].textContent;
            const tag = row.cells[1].textContent;
            const definition = row.cells[2].textContent.replace(/"/g, '""');
            
            csvContent += `"${word}","${tag}","${definition}"\n`;
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'dogri_pos_tags.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});