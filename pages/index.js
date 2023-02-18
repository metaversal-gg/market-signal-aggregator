import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';


const Home = () => {

  const [userInput, setUserInput] = useState('');
  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }


  return (
    <div className="root">
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>#Web3 Tweet Thread Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>what do you want to post about? (max output: 1000 characters)</h2>
            <h4>sometimes the app will time-out due to vercel run-time limiter!</h4>
            <h4>see inspiration from the <a href="https://twitter.com/weavechainweb3">weavechain twitter</a> 🙂</h4>
          </div>
        </div>
        <div className="prompt-container">
          <textarea
            className="prompt-box"
            placeholder="ex) confidential computing"
            value={userInput}
            onChange={onUserChangedText}
          />

          <div className="prompt-buttons">
            <a
              className={isGenerating ? 'generate-button loading' : 'generate-button'}
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
        </div>

        {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content">
              <p>#Web3Wednesday pt. [xX]</p>
              <p>{apiOutput}</p>
              <p></p>
              <p>Read more: [Insert Link]</p>
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
};

export default Home;
