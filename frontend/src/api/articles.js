import api from './axios';

export const getArticles = async (params = {}) => {
  const response = await api.get('/articles', { params });
  return response.data;
};

export const getArticleBySlug = async (slug) => {
  const response = await api.get(`/articles/${slug}`);
  return response.data;
};

export const getFeaturedArticles = async () => {
  const response = await api.get('/articles', { params: { limit: 4 } });
  return response.data;
};
