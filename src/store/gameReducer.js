//Много времени занял баг, из-за которого в момент проверки или любых других действий можно было открыть еще одну или несколько плиток
//Баг исправлен добавлением проверок и состоянием isLocked 

import React, { useReducer, useEffect } from 'react';


// Начальное состояние игры
const initialState = {
  tiles: [],           // Массив плиток (каждая плитка имеет цвет и статус)
  flippedTiles: [],     // Индексы плиток, которые в данный момент открыты
  matchedTiles: [],     // Индексы совпавших плиток
  isLocked: false,      // Флаг блокировки действий, чтобы игрок не мог кликать, когда проверяются плитки
};

// Функция генерации массива плиток
const generateTiles = () => {
  // Контрастные и уникальные цвета для плиток
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#33FFF6', '#FFDD33', '#9933FF', '#33FFAD'];

  // Дублируем каждый цвет и перемешиваем
  return [...colors, ...colors] // Создаем пары для каждой плитки
    .sort(() => Math.random() - 0.5) // Перемешиваем
    .map(color => ({ color, isFlipped: false, isMatched: false })); // Каждая плитка содержит цвет и статусы
};


// Reducer для обработки различных действий и управления состоянием игры
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_GAME':
      // Инициализация игры, возвращаем плитки в начальное состояние
      return { ...initialState, tiles: generateTiles() }; 

    case 'FLIP_TILE':
      const { index } = action;
      const { tiles, flippedTiles, isLocked } = state;

      // Проверка: если плитка уже перевернута или совпала, мы ее не трогаем
      if (tiles[index]?.isFlipped || tiles[index]?.isMatched || isLocked || flippedTiles.length === 2) {
        return state; // Никаких изменений, если условия не выполнены
      }

      // Переворачиваем плитку
      const updatedTiles = tiles.map((tile, idx) =>
        idx === index ? { ...tile, isFlipped: true } : tile // Переворачиваем выбранную плитку
      );

      const newFlippedTiles = [...flippedTiles, index];

      // Если открыто две плитки, блокируем игру для проверки
      if (newFlippedTiles.length === 2) {
        return { ...state, tiles: updatedTiles, flippedTiles: newFlippedTiles, isLocked: true };
      }

      // Если это только первая плитка, просто обновляем состояние
      return { ...state, tiles: updatedTiles, flippedTiles: newFlippedTiles };

    case 'CHECK_MATCH':
      // Получаем индексы двух открытых плиток
      const [firstIdx, secondIdx] = state.flippedTiles;

      // Проверка, что обе плитки существуют
      if (!state.tiles[firstIdx] || !state.tiles[secondIdx]) {
        return { ...state, isLocked: false, flippedTiles: [] }; // Если плитки не существуют, снимаем блокировку
      }

      // Проверка совпадения цветов у плиток
      const isMatch = state.tiles[firstIdx].color === state.tiles[secondIdx].color;

      // Обновляем состояние плиток после проверки
      const tilesAfterCheck = state.tiles.map((tile, idx) => {
        if (idx === firstIdx || idx === secondIdx) {
          return { ...tile, isFlipped: isMatch, isMatched: isMatch }; // Если плитки совпали, оставляем их открытыми
        }
        return tile; // Остальные плитки не изменяются
      });

      return {
        ...state,
        tiles: tilesAfterCheck,  // Обновляем плитки в состоянии
        flippedTiles: [],        // Сбрасываем перевернутые плитки
        isLocked: false,         // Снимаем блокировку, так как проверка завершена
      };

    default:
      return state; // Возвращаем текущее состояние, если действие не определено
  }
};

// Основная логика игры
export const useGameLogic = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'INIT_GAME' }); // При загрузке компонента инициализируем игру
  }, []);

  // Функция переворота плитки
  const flipTile = (index) => {
    // Проверяем, не заблокированы ли действия или плитка уже открыта
    if (state.isLocked || state.flippedTiles.length >= 2 || state.tiles[index]?.isFlipped || state.tiles[index]?.isMatched) {
      return; // Ничего не делаем, если игра заблокирована или плитка уже активна
    }

    // Запускаем действие переворота плитки
    dispatch({ type: 'FLIP_TILE', index });

    // Если уже открыта одна плитка, запускаем таймер для проверки совпадений
    if (state.flippedTiles.length === 1) {
      setTimeout(() => {
        dispatch({ type: 'CHECK_MATCH' }); // Проверка совпадений через секунду
      }, 1000); // Даем игроку 1 секунду на запоминание цветов
    }
  };

  return {
    tiles: state.tiles, // Возвращаем плитки для отображения в интерфейсе
    flipTile,           // Возвращаем функцию переворота плитки для использования в интерфейсе
  };
};
