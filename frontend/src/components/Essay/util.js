import { parseSearchParams } from '../../util/helpers';
import * as ROUTES from '../../constants/routes';

export const normalizeWordCloud = (wordCloud, multiplier = 1000) => {
  if (!wordCloud) {
    return [];
  } else {
    return wordCloud.map(({ word, freq }) => {
      return {
        text: word,
        value: freq * multiplier,
      };
    });
  }
};

export const getKeywordsFromWordCloud = (wordCloud) => {
  const normalized = normalizeWordCloud(wordCloud);
  normalized.sort((a, b) => a.value - b.value);
  return normalized.map(({ text }) => text);
};

export const getClusterWordCloud = (clusters) => {
  const wordCloudList = [];
  clusters = [clusters[0]];
  clusters.forEach(({ center_essay_id, id, wordcloud }) => {
    const normalized = normalizeWordCloud(wordcloud);
    normalized.forEach((val) => {
      wordCloudList.push({
        ...val,
        center_essay_id,
        cluster_id: id,
      });
    });
  });

  return wordCloudList;
};

export const getSearchKeyFromURL = (searchQuery) => {
  const parsed = parseSearchParams(searchQuery);
  return parsed?.query || '';
};

export const getUniqueArticleName = (articles, prefix = 'Untitled') => {
  const set = new Set();
  articles.forEach(({ title }) => set.add(title));
  for (let i = 1; i < 100; i++) {
    let name = `${prefix} ${i}`;
    if (!set.has(name)) {
      return name;
    }
  }
  const randName = Math.floor(Math.random() * 1000) + 1;
  return `${prefix} ${randName}`;
};

export const getPublicEssayURL = (id) => `${ROUTES.ESSAY_PUBLIC}/${id}`;
