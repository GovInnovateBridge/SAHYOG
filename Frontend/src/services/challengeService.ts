import api from './api';

export const fetchChallenges = async () => {
  const response = await api.get('/challenges/public');
  return response.data.challenges || response.data; // Fallback in case backend just returns array
};

export const fetchChallengeById = async (id: string) => {
  const response = await api.get(`/challenges/${id}`);
  return response.data;
};

export const publishChallenge = async (id: string) => {
  const { data } = await api.patch(`/challenges/${id}/publish`);
  return data;
};

export const startEvaluation = async (challengeId: string) => {
  const { data } = await api.post(`/challenges/${challengeId}/start-evaluation`);
  return data;
};