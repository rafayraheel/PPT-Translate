export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, sourceLang, targetLang, glossary } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'No text provided' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const srcName = sourceLang === 'en' ? 'English' : 'Arabic';
  const tgtName = targetLang === 'ar' ? 'Arabic' : 'English';

  // Strong default instructions that prevent common issues
  let systemPrompt = `You are a professional translator specializing in business presentations.
Translate the following ${srcName} text to ${tgtName}.

STRICT RULES — follow these exactly:
- Return ONLY the translated text. No explanations, no quotes, no extra formatting.
- Keep all numbers in Western/Latin numerals (1, 2, 3 — NOT ١, ٢, ٣).
- Keep all currency symbols ($, €, £, %) exactly as-is. Do not translate or remove them.
- Keep all abbreviations like $3B, $2B, $1B, USD, GDP exactly as-is.
- Keep proper nouns, brand names, and product names unchanged unless instructed.
- Preserve all line breaks exactly as they appear in the original.`;

  if (glossary && glossary.trim()) {
    systemPrompt += `\n\nADDITIONAL INSTRUCTIONS FROM USER (override defaults if conflicting):\n${glossary.trim()}`;
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ]
      })
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.json().catch(() => ({}));
      return res.status(openaiRes.status).json({
        error: err?.error?.message || `OpenAI error: ${openaiRes.status}`
      });
    }

    const data = await openaiRes.json();
    const translated = data.choices[0].message.content.trim();
    return res.status(200).json({ translated });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
