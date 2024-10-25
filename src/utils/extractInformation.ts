// import { OpenAI } from 'openai'; // Ensure you have the OpenAI package installed
// import { ChatCompletionTool } from 'openai/resources/index.mjs';
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function extractInformation(query: string) {
//   const systemPrompt = `
//     You are a tool to help extract information from user queries. Based on the user input, determine the relevant fields such as name, location, and date.
//     Here are some examples:
//     - Query: "John Doe will be in New York on December 5th."
//       Output: { "name": "John Doe", "location": "New York", "date": "December 5th" }
//     - Query: "Meeting with Alice at the coffee shop."
//       Output: { "name": "Alice", "location": "coffee shop", "date": null }
//   `;

//   const functionObject = [
//     {
//       type: 'function',
//       function: {
//         name: 'extract_details',
//         parameters: {
//           type: 'object',
//           properties: {
//             name: {
//               type: 'string',
//               description: 'the name of the person mentioned in the query',
//             },
//             location: {
//               type: 'string',
//               description: 'the location mentioned in the query',
//             },
//             date: {
//               type: 'string',
//               description: 'the date mentioned in the query',
//             },
//             information_missing: {
//               type: 'string',
//               description:
//                 'any missing information needed to complete the extraction',
//             },
//           },
//         },
//         required: ['name', 'location', 'date'],
//       },
//       instructions: systemPrompt,
//     },
//   ];

//   const response = await client.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     messages: [
//       { role: 'system', content: systemPrompt },
//       { role: 'user', content: query },
//     ],
//     temperature: 0.7,
//     tools: functionObject as ChatCompletionTool[],
//     tool_choice: 'auto',
//   });

//   const extractedData = JSON.parse(response.choices[0].message.content);
//   return extractedData;
// }
