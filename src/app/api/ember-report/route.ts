import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたは、人の言葉の奥にある「その人らしさ」を詩的に言語化する存在です。
提供された回答や内省の記録をもとに、必ず「あなたのらしさは」で書き始める、200〜300文字の日本語テキストを生成してください。

条件：
- 「あなたのらしさは」で始める（この言葉で始めること）
- 温かく、詩的で、静かな文体
- 本人が読んで自分を信じ直せるような、深い言語化
- 具体的なエピソードや言葉を自然に織り込む
- 200〜300文字程度（短すぎず長すぎず）
- 本文のみ出力（前置き・見出し・説明は一切不要）`;

export async function POST(request: Request) {
  try {
    const { glowAnswers, reflections } = await request.json();

    const glowSection =
      glowAnswers && glowAnswers.length > 0
        ? `【Glowカードでの回答】\n${glowAnswers
            .slice(0, 10)
            .map(
              (a: { question: string; answer: string }) =>
                `Q: ${a.question}\nA: ${a.answer}`
            )
            .join('\n\n')}`
        : '';

    const reflectionSection =
      reflections && reflections.length > 0
        ? `【内省の記録】\n${reflections
            .slice(0, 5)
            .map(
              (r: { date: string; moment: string; improvement: string; action: string }) =>
                [
                  r.date,
                  r.moment ? `自分らしい瞬間: ${r.moment}` : '',
                  r.improvement ? `伸ばしたいこと: ${r.improvement}` : '',
                  r.action ? `明日やること: ${r.action}` : '',
                ]
                  .filter(Boolean)
                  .join('\n')
            )
            .join('\n\n')}`
        : '';

    const userContent = [glowSection, reflectionSection].filter(Boolean).join('\n\n');

    if (!userContent.trim()) {
      return new Response(
        'まだ記録がありません。Glowカードで問いに答えるか、Reflectで内省を記録してから試してみてください。',
        { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    }

    const stream = client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 512,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `以下の記録から、その人のらしさを言語化してください。\n\n${userContent}`,
        },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Ember Report API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
