const CJDSB = 'sk-bylmjfktsthtawvftgdsjuxsdffoavwtikcutynegwsbxzhu';
const BASE_CJDSB = 'https://api.siliconflow.cn/v1';
const MODEL_CJDSB = 'Qwen/Qwen2.5-7B-Instruct';

/**
 * Generate contextual and cultural notes for a word using LLM
 * @param word - The word to analyze
 * @param context - The sentence containing the word
 * @returns Generated notes in Chinese
 */
async function generateWordNotes(
  word: string,
  context: string
): Promise<string> {
  try {
    // Construct the system prompt
    const systemPrompt = `你是一位专业的英语学习助手。当给你一个英语单词和它的上下文句子时，请提供：
1. 这个词在此语境中的具体含义
2. 相关的文化背景或习语意义（如果有）

请用中文回答，保持简洁但信息丰富（约150-250字）。`;

    // Construct the user prompt
    const userPrompt = context
      ? `单词: ${word}\n上下文: ${context}\n\n请为这个单词生成学习笔记。`
      : `单词: ${word}\n\n请为这个单词生成学习笔记（没有提供上下文）。`;

    // Make API request
    const response = await fetch(`${BASE_CJDSB}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CJDSB}`,
      },
      body: JSON.stringify({
        model: MODEL_CJDSB,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7, // Control creativity (0-2, higher = more creative)
        max_tokens: 600, // Maximum length of response
        top_p: 0.9, // Nucleus sampling parameter
      }),
    });

    // Check if request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    // Parse response
    const data = await response.json();

    // Extract generated text
    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      throw new Error('No content in API response');
    }

    return generatedText.trim();
  } catch (error) {
    console.error('Error generating notes:', error);

    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('网络连接失败，请检查网络设置');
      } else if (error.message.includes('401')) {
        throw new Error('API密钥无效');
      } else if (error.message.includes('429')) {
        throw new Error('请求过于频繁，请稍后再试');
      } else if (error.message.includes('500')) {
        throw new Error('服务器错误，请稍后再试');
      }
    }

    throw error;
  }
}

export { generateWordNotes };
