import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SentenceBuilder = () => {
  const [sentence, setSentence] = useState('');
  const [wordOptions, setWordOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    fetchWordOptions();
  }, []);

  const fetchWordOptions = async () => {
    try {
      const response = await fetch('/wordOptions.txt');
      const text = await response.text();
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      const options = [];
      let currentCategory = null;

      lines.forEach(line => {
        if (line.startsWith('*')) {
          currentCategory = { name: line.substring(1), words: [] };
          options.push(currentCategory);
        } else if (currentCategory) {
          currentCategory.words.push(line);
        }
      });

      setWordOptions(options);
      // Initialize selected categories with the first five categories
      setSelectedCategories(options.slice(0, 5));
    } catch (error) {
      console.error('Error fetching word options:', error);
    }
  };

  const handleAddWord = (word) => {
    setSentence(prevSentence => prevSentence + ' ' + word);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(sentence.trim());
    alert('Sentence copied to clipboard!');
  };

  const handleCategoryChange = (index, category) => {
    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories[index] = category;
    setSelectedCategories(newSelectedCategories);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <textarea className="form-control" rows="4" readOnly value={sentence.trim()} />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <button className="btn btn-primary me-2" onClick={handleCopyToClipboard}>Copy to Clipboard</button>
        </div>
      </div>
      <div className="row mt-3">
        {selectedCategories.map((category, index) => (
          <div key={index} className="col mb-3">
            <select className="form-select mb-2" value={category.name} onChange={(e) => handleCategoryChange(index, wordOptions.find(option => option.name === e.target.value))}>
              {wordOptions.map((option, optionIndex) => (
                <option key={optionIndex} value={option.name}>{option.name}</option>
              ))}
            </select>
            <div>
              {category.words && category.words.length > 0 ? (
                category.words.map((word, wordIndex) => (
                  <button key={wordIndex} className="btn btn-outline-secondary d-block mb-2 me-2" onClick={() => handleAddWord(word)}>{word}</button>
                ))
              ) : (
                <p>No words available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentenceBuilder;
