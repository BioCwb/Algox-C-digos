import React, { useState } from 'react';
import type { CodeQuizLevel, ResultState } from '../types';
import { playClickSound, playSuccessSound, playFailureSound } from '../services/audioService';

interface CodeQuizScreenProps {
  level: CodeQuizLevel;
  onBackToMap: () => void;
  onQuizComplete: (result: ResultState) => void;
}

const CodeQuizScreen: React.FC<CodeQuizScreenProps> = ({ level, onBackToMap, onQuizComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const question = level.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === level.questions.length - 1;

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;

        const isCorrect = index === question.correctOptionIndex;
        setSelectedOption(index);
        setIsAnswered(true);

        if (isCorrect) {
            playSuccessSound();
        } else {
            playFailureSound();
            setMistakes(prevMistakes => prevMistakes + 1);
        }
    };

    const handleNext = () => {
        playClickSound();
        if (isLastQuestion) {
            let stars = 0;
            if (mistakes === 0) {
                stars = 3;
            } else if (mistakes <= 1) {
                stars = 2;
            } else {
                stars = 1;
            }
            onQuizComplete({ levelId: level.id, success: true, stars });
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        }
    };

    const getOptionClasses = (index: number): string => {
        if (!isAnswered) {
            return "bg-white hover:bg-sky-100 border-gray-300";
        }
        if (index === question.correctOptionIndex) {
            return "bg-green-100 border-green-500 ring-2 ring-green-400 text-green-800";
        }
        if (index === selectedOption) {
            return "bg-red-100 border-red-500 text-red-800";
        }
        return "bg-gray-100 border-gray-300 opacity-60";
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 font-sans">
            <header className="flex items-center justify-between p-4 bg-white shadow-md z-10">
                <button onClick={onBackToMap} className="px-4 py-2 text-sky-600 font-bold rounded-lg hover:bg-sky-100 transition-colors">
                    &larr; Voltar ao Mapa
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">{level.name}</h1>
                    <p className="text-gray-600">{level.description}</p>
                </div>
                <div className="w-40"></div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-3xl">
                    <div className="text-center mb-6">
                        <p className="text-lg font-semibold text-sky-700">
                            Questão {currentQuestionIndex + 1} de {level.questions.length}
                        </p>
                    </div>

                    <div className="bg-gray-800 text-white p-6 rounded-xl font-mono text-lg shadow-2xl mb-8">
                        <pre className="whitespace-pre-wrap">
                            <code>
                                {question.codeSnippet[0]}
                                <span className={`inline-block text-center rounded-md px-4 py-1 mx-2 ${isAnswered ? 'bg-gray-700 text-yellow-300' : 'bg-gray-600'}`}>
                                    {isAnswered && selectedOption !== null ? question.options[selectedOption] : '...'}
                                </span>
                                {question.codeSnippet[1]}
                            </code>
                        </pre>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                disabled={isAnswered}
                                onClick={() => handleOptionSelect(index)}
                                className={`p-4 rounded-lg border-2 text-center font-semibold text-gray-700 transition-all duration-300 transform focus:outline-none ${getOptionClasses(index)} ${!isAnswered ? 'hover:scale-105' : ''}`}
                            >
                                <code className="text-lg">{option}</code>
                            </button>
                        ))}
                    </div>

                    {isAnswered && (
                        <div className="bg-sky-50 border-l-4 border-sky-500 p-6 rounded-r-lg shadow-md animate-in fade-in space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-sky-800">Explicação</h3>
                                <p className="text-sky-700 mt-1">{question.explanation}</p>
                            </div>
                            <button
                                onClick={handleNext}
                                className="w-full px-6 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                            >
                                {isLastQuestion ? 'Finalizar' : 'Próxima Questão'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CodeQuizScreen;
