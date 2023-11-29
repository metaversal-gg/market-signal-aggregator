import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `Pretend that you are a skilled technical investment analyst for a blockchain investment firm. Please summarize the following block of newsletter updates and present it in a presentable format.`;

const generateAction = async (req, res) => {
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}`,
        temperature: 0.8,
        max_tokens: 1000,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    // Prompt #2.
    const secondPrompt =
        `Categorize this summary by relevant project discussed. Separate individual projects and give them their own heading. Then add your own analysis on what you make of these market updates and make recommendations on what the blockchain investment firm should do: ${basePromptOutput.text}
        
        Analysis: `

    // Calling the OpenAI API a second time with Prompt #2
    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        temperature: 0.8,
        max_tokens: 500,
    });

    // Get the output
    const secondPromptOutput = secondPromptCompletion.data.choices.pop();

    // Send over the Prompt #2's output to our UI instead of Prompt #1's.
    res.status(200).json({ output: secondPromptOutput });
};


export default generateAction;