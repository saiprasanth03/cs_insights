import api from './axios';

export const getDashboardStats = async () => {
  try {
    const [articlesRes, commentsRes, newsletterRes] = await Promise.all([
      api.get('/admin/articles'),
      api.get('/admin/comments'),
      api.get('/admin/subscribers')
    ]);

    const totalArticles = articlesRes.data?.data?.length || 0;
    const pendingComments = commentsRes.data?.data?.filter(c => c.status === 'pending')?.length || 0;
    const newsletterSubs = newsletterRes.data?.data?.length || 0;

    return {
      success: true,
      data: {
        totalArticles,
        activeUsers: 0, 
        pendingComments,
        newsletterSubs,
      }
    };
  } catch (error) {
    return { success: false, error: 'Failed to fetch dashboard stats' };
  }
};

export const promoteToAdmin = async (email) => {
  try {
    const response = await api.post('/admin/promote', { email });
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Promotion failed' };
  }
};

// Articles CRUD
export const getAdminArticles = async () => {
  const response = await api.get('/admin/articles');
  return response.data;
};
export const getAdminArticle = async (id) => {
  const response = await api.get(`/admin/articles/${id}`);
  return response.data;
};
export const createAdminArticle = async (data) => {
  const response = await api.post('/admin/articles', data);
  return response.data;
};
export const updateAdminArticle = async (id, data) => {
  const response = await api.put(`/admin/articles/${id}`, data);
  return response.data;
};
export const deleteAdminArticle = async (id) => {
  const response = await api.delete(`/admin/articles/${id}`);
  return response.data;
};

// Categories (Topics) CRUD
export const getAdminCategories = async () => {
  const response = await api.get('/admin/categories');
  return response.data;
};
export const getAdminCategory = async (id) => {
  const response = await api.get(`/admin/categories/${id}`);
  return response.data;
};
export const createAdminCategory = async (data) => {
  const response = await api.post('/admin/categories', data);
  return response.data;
};
export const updateAdminCategory = async (id, data) => {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data;
};
export const deleteAdminCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};

// Authors
export const getAdminAuthors = async () => {
  const response = await api.get('/admin/authors');
  return response.data;
};
export const getAdminAuthor = async (id) => {
  const response = await api.get(`/admin/authors/${id}`);
  return response.data;
};
export const createAdminAuthor = async (data) => {
  const response = await api.post('/admin/authors', data);
  return response.data;
};
export const updateAdminAuthor = async (id, data) => {
  const response = await api.put(`/admin/authors/${id}`, data);
  return response.data;
};
export const deleteAdminAuthor = async (id) => {
  const response = await api.delete(`/admin/authors/${id}`);
  return response.data;
};
