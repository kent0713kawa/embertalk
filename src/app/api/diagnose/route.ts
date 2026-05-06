import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたはキャリアコーチです。3つの質問（各1〜5段階）の回答を基に、その人の今のキャリア状態を温かく診断します。

以下の形式でJSONのみ出力してください（他のテキストは一切不要）：

{
  "type": "〇〇タイプ",
  "message": "今のあなたへのメッセージ（2〜3文、具体的で背中を押す内容）",
  "action": "明日できる具体的なアクション（1つだけ、35文字以内）"
}

typeの判断基準（合計スコア）：
- 3〜6点: くすぶり期・転換期系（変化のきっかけを優しく示す）
- 7〜10点: 模索期・過渡期系（今の強みを活かす方向を示す）
- 11〜15点: 充実期・成長期系（さらなる深化・展開を促す）

typeのルール：
- 「〇〇タイプ」という形式（例：くすぶり期タイプ、転換点タイプ、充実期タイプ、模索中タイプ）
- 10文字以内
- 前向きで共感できる言葉を使う

messageのルール：
- Q1低・Q3高 → 動きたいけど楽しめていない状況に共感
- Q1高・Q3低 → 今は充実しているが先が見えない状況に共感
- Q2低 → 自分らしさが発揮できていないことに共感
- 背中を押す、温かいトーン
- 改行なし、2〜3文で`;

export async function POST(request: Request) {
  try {
    const { q1, q2, q3 } = await request.json();

    const userContent = `Q1（今の仕事、楽しめてる？）: ${q1}/5\nQ2（自分らしく働けてる？）: ${q2}/5\nQ3（3年後のイメージ、ある？）: ${q3}/5`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userContent }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    const result = JSON.parse(jsonMatch[0]);

    return Response.json(result);
  } catch (error) {
    console.error('Diagnose API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
