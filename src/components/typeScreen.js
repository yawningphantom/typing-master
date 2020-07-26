
import React, { useState, useEffect } from 'react'
import words from '../words';
import { shuffleArray } from '../util';
import '../App.css';

export default () => {
	let wordList = shuffleArray(words);
	const visibleWordLength = 10;
	const [start, setStart] = useState(0);
	const [currentWords, setCurrentWords] = useState(wordList.slice(start, visibleWordLength));
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [typedWord, setTypedWord] = useState('');

	let [pressedKey, setPressedKey] = usePressedKey();

	const handleInputWord = (event) => {
		setTypedWord(event.target.value);
	}

	useEffect(() => {
		console.log(pressedKey)
		if (!pressedKey)
			return
		if (pressedKey === ' ' || pressedKey === 'Enter') {
			setTypedWord('')
			if (typedWord === currentWords[start]) {


				// console.log((start + 1) % visibleWordLength)
				if ((start + 1) % visibleWordLength === 0) {
					setCurrentWords(wordList.slice(start + 1, start + 1 + visibleWordLength))
					setStart(0)
				}
				else
					setStart(start + 1)
			}
			setCurrentWordIndex(0)

		}
		else if (pressedKey === 'Backspace') {
			console.log((currentWordIndex - 1) > 0 ? (currentWordIndex - 1) : 0)
			console.log(typedWord.slice(0, typedWord.length - 1))
			setCurrentWordIndex((currentWordIndex - 1) > 0 ? (currentWordIndex - 1) : 0)
			setTypedWord(typedWord.slice(0, typedWord.length - 1))
			setPressedKey('')
		}
		else {
			// console.log(currentWords[start][currentWordIndex])
			// console.log(typedWord)
			if (currentWords[start][currentWordIndex] === typedWord[typedWord.length - 1])
				setCurrentWordIndex(currentWordIndex + 1)
		}
	}, [pressedKey, currentWordIndex, typedWord, currentWords, start, wordList, setPressedKey])


	return (
		<div>
			<p>
				<ReadSentence
					currentWords={currentWords}
					currentWord={currentWords[start]}
					currentWordIndex={currentWordIndex}
				/>
			</p>
			<input
				className='Read-word-area'
				type="text"
				value={typedWord}
				onChange={handleInputWord} />
		</div>
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
							{/* {console.log(cIndex, currentWordIndex)} */}
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

		// const onKeyUp = ({ key }) => {
		// 	if (Consts.ALLOWED_KEYS.includes(key)) {
		// 		setPressedKeys(previousPressedKeys => previousPressedKeys.filter(k => k !== key));
		// 	}
		// }

		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('keydown', onKeyDown);
		}

	});

	return [pressedKey, setPressedKey];
}