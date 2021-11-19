'use strict';

const { getRandomInt, shuffle } = require('../../utils');
const { ExitCode, MOCK_FILE_NAME } = require('../../constants');
const fs = require('fs');

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const ANNOUNCE_MIN_LENGTH = 1;
const ANNOUNCE_MAX_LENGTH = 5;

const TITLES = [
  'Ёлки. История деревьев',
  'Как перестать беспокоиться и начать жить',
  'Как достигнуть успеха не вставая с кресла',
  'Обзор новейшего смартфона',
  'Лучшие рок-музыканты 20-века',
  'Как начать программировать',
  'Учим HTML и CSS',
  'Что такое золотое сечение',
  'Как собрать камни бесконечности',
  'Борьба с прокрастинацией',
  'Рок — это протест',
  'Самый лучший музыкальный альбом этого года',
];

const TEXT_PARTS = [
  'Ёлки — это не просто красивое дерево. Это прочная древесина.',
  'Первая большая ёлка была установлена только в 1938 году.',
  'Вы можете достичь всего. Стоит только немного постараться и запастись книгами.',
  'Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.',
  'Золотое сечение — соотношение двух величин, гармоническая пропорция.',
  'Собрать камни бесконечности легко, если вы прирожденный герой.',
  'Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.',
  'Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.',
  'Программировать не настолько сложно, как об этом говорят.',
  'Простые ежедневные упражнения помогут достичь успеха.',
  'Это один из лучших рок-музыкантов.',
  'Он написал больше 30 хитов.',
  'Из под его пера вышло 8 платиновых альбомов.',
  'Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.',
  'Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?',
  'Достичь успеха помогут ежедневные повторения.',
  'Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.',
  'Как начать действовать? Для начала просто соберитесь.',
  'Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.',
  'Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.',
];

const CATEGORIES = ['Деревья', 'За жизнь', 'Без рамки', 'Разное', 'IT', 'Музыка', 'Кино', 'Программирование', 'Железо'];

const getAvailableDates = () => {
  const now = new Date();
  now.setMonth(now.getMonth() - 3);

  return {
    now,
    threeMonthsBefore: now.getTime(),
  };
};

const formatDate = (date) => {
  const dateObj = new Date(date);

  return (
    [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()].join('-') +
    ' ' +
    [dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds()].join(':')
  );
};

const generatePublications = (count) =>
  Array(count)
    .fill({})
    .map(() => {
      const announceLength = getRandomInt(ANNOUNCE_MIN_LENGTH, ANNOUNCE_MAX_LENGTH);
      const { now, threeMonthsBefore } = getAvailableDates();

      return {
        title: TITLES[getRandomInt(0, TITLES.length - 1)],
        category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
        announce: shuffle(TEXT_PARTS).slice(0, announceLength).join(` `),
        fullText: shuffle(TEXT_PARTS).slice(0, getRandomInt(announceLength, TEXT_PARTS.length)).join(` `),
        createdDate: formatDate(getRandomInt(threeMonthsBefore, now)),
      };
    });

module.exports = {
  name: '--generate',
  run(args) {
    const [count] = args;
    const publicationsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (publicationsCount > MAX_COUNT) {
      console.error(`Не больше ${MAX_COUNT} публикаций`);
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(generatePublications(publicationsCount));

    fs.writeFile(MOCK_FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.info(`Operation success. File created.`);
    });
  },
};
