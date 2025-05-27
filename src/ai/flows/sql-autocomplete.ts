// src/ai/flows/sql-autocomplete.ts
'use server';
/**
 * @fileOverview SQL Autocompletion AI agent.
 *
 * - sqlAutocomplete - A function that provides SQL autocompletion suggestions.
 * - SqlAutocompleteInput - The input type for the sqlAutocomplete function.
 * - SqlAutocompleteOutput - The return type for the sqlAutocomplete function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SqlAutocompleteInputSchema = z.object({
  sqlQuery: z.string().describe('The SQL query the user is currently typing.'),
  schemaDefinition: z.string().describe('The database schema definition.'),
});
export type SqlAutocompleteInput = z.infer<typeof SqlAutocompleteInputSchema>;

const SqlAutocompleteOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of SQL autocompletion suggestions.'),
});
export type SqlAutocompleteOutput = z.infer<typeof SqlAutocompleteOutputSchema>;

export async function sqlAutocomplete(input: SqlAutocompleteInput): Promise<SqlAutocompleteOutput> {
  return sqlAutocompleteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sqlAutocompletePrompt',
  input: {schema: SqlAutocompleteInputSchema},
  output: {schema: SqlAutocompleteOutputSchema},
  prompt: `You are an expert SQL autocompletion engine.

  Given the following SQL query and database schema, provide a list of SQL autocompletion suggestions.

  SQL Query: {{{sqlQuery}}}
  Schema Definition: {{{schemaDefinition}}}

  Return only the array of suggestions.
  Do not include any other text or explanation.
  `, 
});

const sqlAutocompleteFlow = ai.defineFlow(
  {
    name: 'sqlAutocompleteFlow',
    inputSchema: SqlAutocompleteInputSchema,
    outputSchema: SqlAutocompleteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
