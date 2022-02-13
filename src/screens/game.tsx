import { useRef } from "react";
import { View } from "react-native";
import GameBoard from "../components/gameBoard";
import {
  answers,
  HEIGHT,
  initialGuesses,
  SIZE,
  words,
} from "../utils/constants";
import { guess } from "../types";

import { useAppSelector, useAppDispatch } from "../hooks/storeHooks";
import {
  setCurrentGuessIndex,
  setGameWon,
  setSolution,
  updateGuesses,
} from "../store/slices/gameStateSlice";
import AnimatedLottieView from "lottie-react-native";

export default function Game() {
  const { guesses, currentGuessIndex, gameWon, solution } = useAppSelector(
    (state) => state.gameState
  );
  const lottieRef = useRef<AnimatedLottieView>(null);
  const dispatch = useAppDispatch();

  const updateGuess = (keyPressed: string, currentGuess: guess) => {
    let currentGuessLetters = [...currentGuess.letters];
    let nextEmptyIndex = currentGuessLetters.findIndex(
      (letter) => letter === ""
    );
    if (nextEmptyIndex === -1) nextEmptyIndex = 5;
    let lastNonEmptyIndex = nextEmptyIndex - 1;
    if (keyPressed !== "<" && keyPressed !== "Enter" && nextEmptyIndex < 5) {
      currentGuessLetters[nextEmptyIndex] = keyPressed;
      let updatedGuess = { ...currentGuess, letters: currentGuessLetters };
      let updatedGuesses = guesses.map((guess, idx) => {
        if (idx === currentGuessIndex) return updatedGuess;
        else return guess;
      });
      dispatch(updateGuesses([...updatedGuesses]));
    } else if (keyPressed === "<") {
      currentGuessLetters[lastNonEmptyIndex] = "";
      let updatedGuess = { ...currentGuess, letters: currentGuessLetters };
      let updatedGuesses = guesses.map((guess, idx) => {
        if (idx === currentGuessIndex) return updatedGuess;
        else return guess;
      });
      dispatch(updateGuesses([...updatedGuesses]));
    }
  };

  const checkGuess = (currentGuess: guess) => {
    let currentGuessedWord = currentGuess.letters.join("");
    if (currentGuessedWord.length === 5) {
      if (currentGuessedWord === solution) {
        let matches = currentGuess.letters.map((letter, idx) => {
          if (letter === solution[idx]) return "correct";
          else if (solution.includes(letter)) return "present";
          else return "absent";
        });

        let updatedGuess = {
          ...currentGuess,
          matches,
          isComplete: true,
          isCorrect: true,
        };
        let updatedGuesses = guesses.map((guess, idx) => {
          if (idx === currentGuessIndex) return updatedGuess;
          else return guess;
        });
        dispatch(updateGuesses(updatedGuesses));
        dispatch(setGameWon(true));
        setTimeout(() => {
          lottieRef.current?.play();
        }, 250 * 6);
      } else if (words.concat(answers).includes(currentGuessedWord)) {
        let matches = currentGuess.letters.map((letter, idx) => {
          if (letter === solution[idx]) return "correct";
          else if (solution.includes(letter)) return "present";
          else return "absent";
        });
        let updatedGuess = {
          ...currentGuess,
          matches,
          isComplete: true,
          isCorrect: false,
        };
        let updatedGuesses = guesses.map((guess, idx) => {
          if (idx === currentGuessIndex) return updatedGuess;
          else return guess;
        });
        dispatch(updateGuesses(updatedGuesses));
        dispatch(setCurrentGuessIndex(currentGuessIndex + 1));
      } else {
        alert("Not in word list");
      }
    }
  };

  const handleGuess = (keyPressed: string) => {
    let currentGuess = guesses[currentGuessIndex];
    if (keyPressed !== "Enter" && !currentGuess.isComplete) {
      updateGuess(keyPressed, currentGuess);
    } else if (keyPressed === "Enter" && !gameWon) {
      checkGuess(currentGuess);
    }
  };

  const resetGameState = () => {
    dispatch(updateGuesses([...initialGuesses]));
  };

  const resetGame = () => {
    lottieRef.current?.reset();
    resetGameState();
    dispatch(setCurrentGuessIndex(0));
    dispatch(setGameWon(false));
    dispatch(setSolution(answers[Math.floor(Math.random() * answers.length)]));
  };

  return (
    <View style={{ position: "relative" }}>
      <GameBoard
        answer={solution}
        handleGuess={handleGuess}
        resetGame={resetGame}
      />
      <AnimatedLottieView
        ref={lottieRef}
        style={{
          width: SIZE,
          height: HEIGHT * 0.5,
          backgroundColor: "transparent",
          position: "absolute",
          zIndex: 10,
          top: 20,
        }}
        source={require("../lottie/confetti.json")}
      />
    </View>
  );
}
