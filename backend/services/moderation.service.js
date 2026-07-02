const crypto = require("crypto");
const Groq = require("groq-sdk");

const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

const PROFANITY_TERMS = [
    "asshole",
    "bastard",
    "bitch",
    "bollocks",
    "bugger",
    "bullshit",
    "crap",
    "cunt",
    "dick",
    "douche",
    "fuck",
    "fucker",
    "motherfucker",
    "piss",
    "pussy",
    "shit",
    "slut",
    "whore",
];

const normalizeText = (value) => {
    if (value === undefined || value === null) return "";
    if (Array.isArray(value)) {
        return value
            .map((item) => normalizeText(item))
            .filter(Boolean)
            .join("\n");
    }

    if (typeof value === "object") {
        return Object.entries(value)
            .map(([key, item]) => `${key}: ${normalizeText(item)}`)
            .filter((line) => line.trim() !== "")
            .join("\n");
    }

    return String(value).trim();
};

const normalizeForBlocklist = (value) => {
    const raw = normalizeText(value).toLowerCase();

    const leetNormalized = raw
        .replace(/[0]/g, "o")
        .replace(/[1!իլ|]/g, "i")
        .replace(/[3]/g, "e")
        .replace(/[4@աե]/g, "a")
        .replace(/[5$]/g, "s")
        .replace(/[7+]/g, "t")
        .replace(/[8]/g, "b")
        .replace(/[9]/g, "g");

    return leetNormalized.replace(/[^a-z0-9]+/g, "").replace(/(.)\1+/g, "$1");
};

const detectProhibitedLanguage = (payload) => {
    const text = normalizeText(payload);
    if (!text) {
        return {
            blocked: false,
            reason: null,
            matchedTerm: null,
            source: "blocklist",
        };
    }

    const rawText = text.toLowerCase();
    const normalizedText = normalizeForBlocklist(text);

    for (const term of PROFANITY_TERMS) {
        const normalizedTerm = normalizeForBlocklist(term);
        const rawPattern = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");

        if (rawPattern.test(rawText) || normalizedText.includes(normalizedTerm)) {
            return {
                blocked: true,
                reason: `Content includes prohibited language: ${term}`,
                matchedTerm: term,
                source: "blocklist",
            };
        }
    }

    return {
        blocked: false,
        reason: null,
        matchedTerm: null,
        source: "blocklist",
    };
};

const buildCacheKey = (type, payload) => {
    const hash = crypto
        .createHash("sha256")
        .update(`${type}::${normalizeText(payload)}`)
        .digest("hex");
    return `${type}:${hash}`;
};

const readCache = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;

    if (entry.expiresAt <= Date.now()) {
        cache.delete(key);
        return null;
    }

    return entry.value;
};

const writeCache = (key, value) => {
    cache.set(key, {
        value,
        expiresAt: Date.now() + CACHE_TTL_MS,
    });
};

const buildPrompt = (type, payload) => {
    const content = normalizeText(payload);

    return `
You are a strict but fair moderation assistant for an educational quiz and community platform.
Review the content below and decide whether it should be allowed publicly.

Rules:
- Flag harassment, hate, sexual content, explicit violence, scams, spam, or malicious content.
- Do not flag normal educational or technical terms just because they mention sensitive topics.
- Be tolerant of academic and classroom language.
- If the content is borderline or uncertain, prefer "flagged": true so a human admin can review it.

Content type: ${type}
Content:
${content}

Return ONLY valid JSON in this shape:
{
  "flagged": boolean,
  "reason": "short explanation",
  "severity": "low" | "medium" | "high"
}
`;
};

const fallbackResult = (reason = "Moderation service unavailable") => ({
    flagged: true,
    reason,
    severity: "medium",
    source: "fallback",
});

const moderateContent = async (type, payload) => {
    const cacheKey = buildCacheKey(type, payload);
    const cached = readCache(cacheKey);
    if (cached) return cached;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        const result = fallbackResult("Moderation is not configured on this server");
        writeCache(cacheKey, result);
        return result;
    }

    try {
        const groq = new Groq({ apiKey });

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            temperature: 0,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: buildPrompt(type, payload),
                },
            ],
        });

        const raw = completion.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(raw);

        const result = {
            flagged: Boolean(parsed.flagged),
            reason: typeof parsed.reason === "string" && parsed.reason.trim() ? parsed.reason.trim() : "No reason returned",
            severity: ["low", "medium", "high"].includes(String(parsed.severity).toLowerCase())
                ? String(parsed.severity).toLowerCase()
                : "low",
            source: "ai",
        };

        writeCache(cacheKey, result);
        return result;
    } catch (error) {
        console.error("Moderation service error:", error);
        const result = fallbackResult("Moderation could not be completed right now");
        writeCache(cacheKey, result);
        return result;
    }
};

module.exports = {
    detectProhibitedLanguage,
    moderateContent,
};
