import { OpenAI } from 'openai';

// Initialize the OpenAI API with your API key
const openai = new OpenAI({ apiKey: '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' });

const generateAction = async (req, res) => {
   // Run first prompt
   console.log(`API: ${req.body.prompt}`);

   try {
      const baseCompletion = await openai.completions.create({
         model: 'gpt-3.5-turbo-instruct',
         prompt: `${req.body.prompt}`,
         temperature: 0.8,
         max_tokens: 1500,
      });

      const basePromptOutput = baseCompletion.choices[0].text;

      res.status(200).json({ output: basePromptOutput });
   } catch (error) {
      console.error('Error generating completion:', error);
      res.status(500).json({ error: 'Error generating completion' });
   }
};

export default generateAction;
