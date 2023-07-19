import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';

function App() {	
  const [keyword, setKeyword] = useState('dog');
	const [imgCount, setImgCount] = useState(1);
  const [pngInfos, setPngInfos] = useState([]);
  const cancelTokenRef = useRef(null);

  const handleKeywordChange = event => {
    setKeyword(event.target.value);
  };
  const handleImgCountChange = event => {
    setImgCount(event.target.value);
  };

  const handleGetAiImage = () => {    
		if (cancelTokenRef.current) {
		cancelTokenRef.current.cancel('Component unmounted');
	}
    cancelTokenRef.current = axios.CancelToken.source();

    axios
      .get(`http://localhost:5000/getAiImage?keyword=${keyword}&imgCount=${imgCount}`, {
        cancelToken: cancelTokenRef.current.token,
      })
      .then(response => {
        setPngInfos(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

	  // 组件卸载时取消未完成的请求
		useEffect(() => {
			return () => {
				if (cancelTokenRef.current) {
					cancelTokenRef.current.cancel('Component unmounted');
				}
			};
		}, []);

  return (
    <div className="App">
      <h1>Get AI Image</h1>
      <div>
        <label>Keyword: </label>
        <input type="text" value={keyword} onChange={handleKeywordChange} />
        <label>Image Count: </label>
        <input type="number" value={imgCount} onChange={handleImgCountChange} />
      </div>
      <button onClick={handleGetAiImage}>Get AI Image</button>
      <div>
        {pngInfos.map((pngInfo, index) => (
          <div key={index}>
            <h2>Image {index + 1}</h2>
						<img src={pngInfo} alt="Image"/>
            <pre>{JSON.stringify(pngInfo, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
