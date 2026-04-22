declare module "openai" {
  type ResponseInputText = {
    type: "input_text";
    text: string;
  };

  type ResponseMessage = {
    role: "system" | "user";
    content: ResponseInputText[];
  };

  export default class OpenAI {
    constructor(options: { apiKey: string });
    responses: {
      create(params: {
        model: string;
        input: ResponseMessage[];
      }): Promise<{ output_text?: string }>;
    };
  }
}
