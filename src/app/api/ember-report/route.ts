import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたは、人の言葉から「その人らしさ」を温かく言語化し、自分を信じる力を取り戻させる存在です。
提供されたデータをもとに、以下の3セクションを順番に出力してください。

🔥 あなたのらしさとは？
その人のらしさを温かく詩的に言語化する。具体的なエピソードや言葉を自然に織り込み、読んだ人が「そうか、これが自分なんだ」と気づける2〜3文。

🌱 らしさを活かすヒント
そのらしさを日常や仕事で活かすための具体的なヒントを2〜3つ。箇条書きではなく、背中を押すような温かい文章で。各ヒントは改行で区切る。

▶ 次の一歩
明日からできる小さなアクションを一つだけ。具体的で、すぐに動き出せるもの。1〜2文で。

出力フォーマット：
- 各セクションを「🔥 あなたのらしさとは？」「🌱 らしさを活かすヒント」「▶ 次の一歩」というヘッダーで始める
- ヘッダーの後に改行し、本文を書く
- セクション間は空行で区切る
- 全体的に気づきを得られて、自分を信じ直せるような温かいトーンで
- 本文のみ出力（説明・前置き不要）`;

export async function POST(request: Request) {
  try {
    const { glowAnswers, reflections, mood, emberAIConversations } = await request.json();

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

    const emberAISection =
      emberAIConversations && emberAIConversations.length > 0
        ? `【EmberAIでの会話】\n${emberAIConversations
            .slice(0, 5)
            .map(
              (c: { userMessage: string; aiResponse: string }) =>
                `あなた: ${c.userMessage}\nEmberAI: ${c.aiResponse}`
            )
            .join('\n\n')}`
        : '';

    const userContent = [moodSection, glowSection, reflectionSection, emberAISection]
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
