async function translate(text, from, to, options) {
    const { config, utils } = options;
    const { tauriFetch: fetch } = utils;
    
    let { apiKey, model = "deepseek-chat" } = config;
    
    // 设置默认请求路径
    const requestPath = "https://api.deepseek.com/chat/completions";
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }
    
    const body = {
        model: model,  // 使用用户选择的模型
        messages: [
            {
                "role": "system",
                "content": "You are a professional translation engine for architectural parametric design. Translate Grasshopper component names and descriptions into fluent, professional Chinese following these strict guidelines: Only translate without interpretation ("translation only, no explanation"), use established Rhino Chinese community terminology consistently, maintain active voice with sentences under 25 characters, include original English terms in brackets for first-time technical terms (e.g., Curvature[曲率]), and adhere to standard Chinese technical documentation conventions. Ensure translations accurately reflect component functionality while following Rhino's official Chinese documentation standards for parametric design terminology."
            },
            {
                "role": "user",
                "content": `Translate into ${to}:\n${text}`
            }
        ],
        temperature: 0.1,
        top_p: 0.99,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 2000
    }
    
    let res = await fetch(requestPath, {
        method: 'POST',
        url: requestPath,
        headers: headers,
        body: {
            type: "Json",
            payload: body
        }
    });
    
    if (res.ok) {
        let result = res.data;
        return result.choices[0].message.content.trim().replace(/^"|"$/g, '');
    } else {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }
}
