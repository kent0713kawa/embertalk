import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  try {
    const { mood, themes, customContext } = await request.json();

    const themeList =
      themes?.length > 0 ? (themes as string[]).join('、') : 'らしさ、強み、挑戦、関係性、未来';

    const contextParts = [
      mood ? `今日の気分：${mood}` : '',
      customContext ? `気になっていること：${customContext}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const userContent = `テーマ：${themeList}
${contextParts}

上記のテーマと文脈に合わせて、自己探求のための問いを${themes?.length > 0 ? '6〜8' : '5〜8'}問生成してください。
各問いは、その場でじっくり考えられる深さを持ち、温かく好奇心をかきたてる表現にしてください。

以下のJSON形式のみで出力してください（余分なテキスト・コードブロック不要）:
{"questions":[{"question":"日本語の問い","questionEn":"English translation","category":"テーマ名"}]}`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: userContent }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Generate questions API error:', error);
    return new Response(JSON.stringify({ questions: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
