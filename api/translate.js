export default async function handler(req, res) {
  // Only allow POST
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

  let systemPrompt = `You are a professional translator. Translate the following ${srcName} text to ${tgtName}. Return ONLY the translated text — no explanations, no quotes, no extra formatting.`;

  if (glossary && glossary.trim()) {
    systemPrompt += `\n\nFollow these glossary rules and translation instructions exactly:\n${glossary.trim()}`;
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
        temperature: 0.2,
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
