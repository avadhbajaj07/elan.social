export interface AIGenerateOptions {
  topic: string;
  tone: "viral" | "professional" | "casual" | "promotional" | "luxury" | "quote";
  language: "en" | "fr" | "de" | "it";
  includeHashtags?: boolean;
  platform?: string;
}

export async function generateAICaption(options: AIGenerateOptions): Promise<{
  caption: string;
  hashtags: string[];
  suggestedBestTime: string;
}> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const prompt = `You are a world-class social media strategist. Write a high-converting caption for social platform: ${options.platform || "Instagram/TikTok"}.
Topic: ${options.topic}
Tone: ${options.tone}
Language: ${options.language} (en=English, fr=French, de=German, it=Italian)
Return JSON with format: { "caption": "...", "hashtags": ["#tag1", "#tag2", "#tag3"] }`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            caption: parsed.caption,
            hashtags: parsed.hashtags || ["#SocialPulse", "#DigitalMarketing"],
            suggestedBestTime: "18:30 CET",
          };
        }
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to smart rules generator:", e);
    }
  }

  // Smart fallback generator tailored for European SMBs/agencies
  return generateFallbackAICaption(options);
}

function generateFallbackAICaption(options: AIGenerateOptions) {
  const { topic, tone, language } = options;

  const templates: Record<string, Record<string, string>> = {
    fr: {
      luxury: `✨ Élégance & Savoir-faire | ${topic}. Découvrez la perfection jusque dans les moindres détails. Une expérience exclusive réservée aux passionnés d'excellence. 🏔️💎`,
      viral: `🚨 Ne manquez pas ça! Tout le monde parle de ${topic} en ce moment. Dites-nous en commentaire ce que vous en pensez! 👇`,
      professional: `Innovations & Tendances : Comment ${topic} transforme les standards du secteur. Lisez notre analyse complète et partagez avec votre réseau.`,
      promotional: `🎉 Offre exclusive : Profitez dès aujourd'hui de nos nouveautés sur ${topic}. Quantités limitées, réservez vite via notre lien en bio! 🔗`,
      casual: `Pause café ☕ On vous emmène en coulisses pour découvrir ${topic}. Un projet passionnant préparé avec soin!`,
      quote: `"L'excellence n'est pas un acte, c'est une habitude." — Découvrez comment ${topic} incarne cette philosophie au quotidien.`
    },
    de: {
      luxury: `✨ Präzision & Perfektion | ${topic}. Erleben Sie Schweizer Handwerkskunst in vollendeter Form. Exklusiv für Liebhaber des besonderen Geschmacks. 🏔️⌚`,
      viral: `🚨 Das dürfen Sie nicht verpassen! Alle sprechen aktuell über ${topic}. Schreiben Sie uns Ihre Meinung in die Kommentare! 👇`,
      professional: `Trends & Innovationen: Wie ${topic} neue Maßstäbe in der Branche setzt. Erfahren Sie mehr in unserem aktuellen Bericht.`,
      promotional: `🎉 Exklusives Angebot: Entdecken Sie jetzt die neuesten Highlights zu ${topic}. Jetzt direkt über den Link in der Bio sichern! 🔗`,
      casual: `Kaffeepause ☕ Werfen Sie mit uns einen Blick hinter die Kulissen von ${topic}. Ein spannendes Projekt!`,
      quote: `"Qualität ist kein Zufall." — Wie ${topic} täglich höchsten Ansprüchen gerecht wird.`
    },
    en: {
      luxury: `✨ Timeless Elegance & Craftsmanship | ${topic}. Designed for those who demand uncompromised perfection. Experience true mastery in every detail. 💎`,
      viral: `🚨 Trending alert! Everyone is obsessing over ${topic} right now. Drop your thoughts in the comments below! 👇`,
      professional: `Industry Insights: How ${topic} is redefining modern standards. Read our complete breakdown and join the conversation.`,
      promotional: `🎉 Limited Time Launch: Discover our latest release featuring ${topic}. Secure yours today via the link in our bio! 🔗`,
      casual: `Behind the scenes snippet ☕ Here is what we have been crafting with ${topic}. Exciting updates coming very soon!`,
      quote: `"Details make perfection, and perfection is not a detail." — Embracing ${topic} at the highest level.`
    },
    it: {
      luxury: `✨ Eleganza Senza Tempo | ${topic}. Scopri la perfezione nei dettagli, realizzata per chi ama l'eccellenza autentica. 🇮🇹💎`,
      viral: `🚨 Da non perdere! Tutti stanno parlando di ${topic}. Scrivi nei commenti la tua opinione! 👇`,
      professional: `Innovazione e Stile: Come ${topic} sta trasformando il settore. Leggi l'analisi completa.`,
      promotional: `🎉 Offerta Esclusiva: Scopri le ultime novità su ${topic}. Disponibile ora tramite il link in bio! 🔗`,
      casual: `Pause caffè ☕ Vi portiamo dietro le quinte per scoprire ${topic}. Un progetto speciale per voi!`,
      quote: `"La bellezza salverà il mondo." — Come ${topic} esprime questa visione ogni giorno.`
    }
  };

  const selectedCaption =
    templates[language]?.[tone] ||
    templates.en[tone] ||
    `✨ Discover ${topic} - elevate your social media presence with SocialPulse!`;

  const tagMap: Record<string, string[]> = {
    fr: ["#SavoirFaire", "#LuxeParis", "#AgenceMarketing", "#SocialPulse", "#ContentCreator"],
    de: ["#SchweizerQualitaet", "#MarketingSchweiz", "#SocialMediaAgentur", "#DigitalMarketing", "#SocialPulse"],
    en: ["#SocialMediaStrategy", "#MarketingAgency", "#ContentCreation", "#BrandGrowth", "#SocialPulse"],
    it: ["#MadeInItaly", "#StrategiaDigitale", "#SocialMediaItalia", "#ContentCreator", "#SocialPulse"]
  };

  return {
    caption: selectedCaption,
    hashtags: tagMap[language] || tagMap.en,
    suggestedBestTime: "18:00 CET",
  };
}
