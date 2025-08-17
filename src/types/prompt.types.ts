export type Prompt = {
    role: PromptRole;
    content: string;
}

export enum PromptRole {
    USER = 'user',
    ASSISTANT = 'assistant',
    SYSTEM = 'system',
    TOOL = 'tool'
}

export type PromptMessage = {
    role: PromptRole;
    content: string;
}