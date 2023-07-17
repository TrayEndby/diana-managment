const getItemsFromIds = (ids, videos) => {
  const idToVideoMap = new Map();
  videos.forEach((video) => idToVideoMap.set(video.id, video));
  return ids.map((id) => idToVideoMap.get(id));
};

const getOneItemById = (id, items) => {
  if (id == null) {
    return null;
  }
  for (const item of items) {
    if (item.id === id) {
      return {
        ...item,
      };
    }
  }
  return null;
};

const excludeExistingVideos = (ids, videos) => {
  const set = new Set();
  ids.forEach((id) => set.add(id));
  return videos.filter((video) => !set.has(video.id));
};

export { getItemsFromIds, getOneItemById, excludeExistingVideos };
