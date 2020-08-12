
import React, { useState, useEffect } from 'react'
import words from '../words';
import { shuffleArray } from '../util';
import '../App.css';
import Refresh from '../refresh';
import Clock from '../clock';
const countDownTime = 60;

export default () => {
	const [wordList, setWordList] = useState(shuffleArray(words));
	const visibleWordLength = 10;
	const [start, setStart] = useState(0);
	const [showWPS, setShowWPS] = useState(false);
	const [WPS, setWPS] = useState(0);

	const [currentWords, setCurrentWords] = useState(wordList.slice(start, visibleWordLength));
	const [nextWords, setNextWords] = useState(wordList.slice(visibleWordLength, 2 * visibleWordLength));
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [typedWord, setTypedWord] = useState('');

	const [pressedKey, setPressedKey] = usePressedKey();

	const [remainingTime, startCountDown, resetCountDown] = useCountDown(countDownTime);

	const handleInputWord = (event) => {
		startCountDown(true);
		setTypedWord(event.target.value);
	}

	let refresh = () => {
		let wordList = shuffleArray(words);
		setWordList(wordList);
		setStart(0);
		setCurrentWordIndex(0);
		setCurrentWords(wordList.slice(0, visibleWordLength));
		setNextWords(wordList.slice(visibleWordLength, 2 * visibleWordLength));
		setTypedWord('');
		resetCountDown();
		setShowWPS(false);
		setWPS(0);
	}

	useEffect(() => {
		if (remainingTime === 0) {

			setShowWPS(true);
		}
	}, [remainingTime])

	useEffect(() => {

		// if no key pressed
		if (!pressedKey || showWPS)
			return

		// if it is enter or space
		if (pressedKey === ' ' || pressedKey === 'Enter') {
			// clear the input field
			setTypedWord('')

			// if both are same
			if (typedWord === currentWords[start]) {

				if ((start + 1) % visibleWordLength === 0) {

					setCurrentWords(nextWords);

					setNextWords(wordList.slice(start + 1 + visibleWordLength, start + 1 + 2 * visibleWordLength))
					setStart(0)
				}
				else
					setStart(start + 1)

				setWPS(WPS + typedWord.length + 1)
			}
			setCurrentWordIndex(0)

		}
		else if (pressedKey === 'Backspace') {
			setTypedWord(typedWord.slice(0, typedWord.length - 1))
			setPressedKey('')
		}
		else {

			if (currentWords[start][currentWordIndex] === typedWord[typedWord.length - 1] && currentWords[start].substr(0, typedWord.length) === typedWord)
				setCurrentWordIndex(currentWordIndex + 1)
			else {
				// count incorrect words
			}

		}
	}, [pressedKey, currentWordIndex, typedWord, currentWords, start, wordList, setPressedKey, showWPS])


	return (
		<>
			<div>
				<ReadSentence
					currentWords={currentWords}
					currentWord={currentWords[start]}
					currentWordIndex={currentWordIndex}
				/>
			</div>
			<div>
				<ReadSentence
					currentWords={nextWords}
				/>
			</div>
			<div>
				<input
					className='Read-word-area'
					type="text"
					value={typedWord}
					onChange={handleInputWord}
					autofocus
					disabled={showWPS}
				/>
				{/* <button>
					Refresh
				</button> */}
				<button className="refresh-button" onClick={refresh}>
					<Refresh />
				</button>

				<button className="refresh-button">
					<Clock />
					<span style={{ fontSize: "3vh" }}>  {remainingTime}</span>
				</button>
			</div>
			{
				showWPS &&
				(
					`Your speed is ${WPS / 5} WPM \n click refresh to start again`
				)
			}

		</>
	)
}

const ReadSentence = ({ currentWords, currentWord, currentWordIndex }) => {

	return currentWords.map((word, wIndex) =>
		(
			< span key={`${wIndex}${word}`} className={(currentWord === word) ? 'Selected-current-word' : 'Current-word'}>
				{

					word?.split('')?.map((character, cIndex) =>

						(<span
							key={`${wIndex}${word}${cIndex}${character}`}
							className={
								(currentWord === word) &&
									(cIndex === currentWordIndex)
									? 'Selected-character' : 'Current-character'
							}>

							{character}
						</span>)
					)
				}
			</span >
		)
	)
}


const usePressedKey = () => {

	const [pressedKey, setPressedKey] = useState([]);

	useEffect(() => {
		const onKeyDown = ({ key }) => setPressedKey(key)

		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('keydown', onKeyDown);
		}

	});

	return [pressedKey, setPressedKey];
}

const useCountDown = () => {

	const [remainingTime, setRemainingTime] = useState(countDownTime);
	const [countDownStarted, setCountDownStarted] = useState(false);

	const resetCountDown = () => {
		setRemainingTime(countDownTime);
		setCountDownStarted(false)
	};

	useEffect(() => {
		if (!countDownStarted)
			return;

		if (remainingTime === 0)
			setCountDownStarted(false);

		let timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
		return () => {
			clearInterval(timer);
		}
	}, [remainingTime, countDownStarted]);

	return [
		remainingTime,
		setCountDownStarted,
		resetCountDown,
	];
}