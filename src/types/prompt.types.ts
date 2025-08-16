export type Prompt = {
    role: PromptRole;
    content: string;
}

export enum PromptRole {
    USER = 'user',
    ASSISTANT = 'assistant',
    SYSTEM = 'system',
    DEVELOPER = 'developer'
}

export type PromptMessage = {
    role: PromptRole;
    content: string;
}