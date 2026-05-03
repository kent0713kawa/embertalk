import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたは、人の言葉から「その人らしさ」「やりたいこと」「次の一歩」を温かく言語化する存在です。
提供されたデータをもとに、以下の3パートを順番に出力してください。

【パート1】
「あなたのらしさは」で始める。150〜200文字。
詩的に、具体的なエピソードや言葉を自然に織り込んで言語化する。

【パート2】
「見えてきたあなたのやりたいことは」で始める。80〜120文字。
回答・内省・今日の気分を総合して、やりたいことを言語化する。

【パート3】
「次のBBQまでに一つだけやること：」で始める。30〜60文字。
温かく背中を押す、具体的なアクションを一つ提示する。

条件：
- 3パートを改行で区切る（空行なし）
- 温かく、詩的で、背中を押すような文体
- 本文のみ出力（説明・前置き・見出し・番号不要）`;

export async function POST(request: Request) {
  try {
    const { glowAnswers, reflections, mood } = await request.json();

    const moodSection = mood
      ? `【今日の気分】\n${mood}`
      : '';

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
                  r.moment      ? `自分らしい瞬間: ${r.moment}`      : '',
                  r.improvement ? `伸ばしたいこと: ${r.improvement}` : '',
                  r.action      ? `明日やること: ${r.action}`         : '',
                ]
                  .filter(Boolean)
                  .join('\n')
            )
            .join('\n\n')}`
        : '';

    const userContent = [moodSection, glowSection, reflectionSection]
      .filter(Boolean)
      .join('\n\n');

    if (!userContent.trim()) {
      return new Response(
        'まだ記録がありません。Glowカードで問いに答えるか、Reflectで内省を記録してから試してみてください。',
        { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    }

    const stream = client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 600,
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
          content: `以下の記録から、その人のらしさ・やりたいこと・次のアクションを言語化してください。\n\n${userContent}`,
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
