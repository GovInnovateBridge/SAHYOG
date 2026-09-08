import api from './api';

export const sendToAssistant = async (message: string): Promise<string> => {
  try {
    const { data } = await api.post('/assistant/chat', { message });
    return data.response;
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "Sorry, I am having trouble connecting to the server right now.";
  }
};
