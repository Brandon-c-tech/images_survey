import React, { useState, useEffect } from 'react';

function App() {
  const BACKEND_URL = "http://34.68.127.14:8000";
  const [question, setQuestion] = useState(null);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [hasSetUsername, setHasSetUsername] = useState(() => !!localStorage.getItem('username'));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [validation, setValidation] = useState('');

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/questions`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      });
  }, []);

  const toggleImage = (imageId) => {
    setSelectedImages(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(imageId)) {
        newSelection.delete(imageId);
      } else {
        newSelection.add(imageId);
      }
      return newSelection;
    });
  };

  const handleSubmit = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      questionType: currentQuestion.type,
      dishName: currentQuestion.dishName,
      validation: validation,
      selectedImages: Array.from(selectedImages),
      selectedImagesDetails: currentQuestion.images
        .filter(img => selectedImages.has(img.id))
        .map(img => ({
          id: img.id,
          url: img.url
        })),
      allImages: currentQuestion.images,
      username: username,
      timestamp: new Date().toISOString(),
    };

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));

    await fetch(`${BACKEND_URL}/api/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answer),
    });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedImages(new Set());
    } else {
      alert('所有问题已完成！');
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('username', username);
      setHasSetUsername(true);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">加载中...</div>;
  }

  if (!hasSetUsername) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-2xl font-bold mb-4">请输入您的名字</h1>
        <form onSubmit={handleUsernameSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="请输入名字"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            开始答题
          </button>
        </form>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  console.log('Current question:', currentQuestion);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 text-sm text-gray-600">
        欢迎，{username}
      </div>
      <div className="mb-4 text-sm text-gray-600">
        问题 {currentQuestionIndex + 1} / {questions.length}
      </div>
      <h1 className="text-2xl font-bold mb-4">{currentQuestion?.text}</h1>
      <div className="mb-6">
        <p className="text-lg mb-2">菜名翻译质量：{currentQuestion?.dishName || '未设置'}</p>
        <div className="flex gap-4">
          {['正确', '错误', '不知道'].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="validation"
                value={option}
                checked={validation === option}
                onChange={(e) => setValidation(e.target.value)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {currentQuestion?.images.map(image => (
          <div
            key={image.id}
            onClick={() => toggleImage(image.id)}
            className={`cursor-pointer border-2 p-2 rounded ${
              selectedImages.has(image.id) ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <img
              src={`${BACKEND_URL}/assets/menu_benchmark_images/${image.url.replace('/assets/', '')}`}
              alt={`选项 ${image.id}`}
              className="w-full h-auto object-cover aspect-square"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(prev => prev - 1);
              const prevAnswer = answers[questions[currentQuestionIndex - 1].id];
              if (prevAnswer) {
                setSelectedImages(new Set(prevAnswer.selectedImages));
              }
            }
          }}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          上一题
        </button>
        <button
          onClick={handleSubmit}
          disabled={!validation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {currentQuestionIndex === questions.length - 1 ? '完成' : '下一题'}
        </button>
      </div>
    </div>
  );
}

export default App;