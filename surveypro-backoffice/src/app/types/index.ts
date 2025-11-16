export type EnqueteStatus = "draft" | "active" | "closed";
export type QyestionType = "radio" | "select" | "checkbox" | "text" | "rating" | "yes_no";

export interface EnqueteData {
    id_enquete: string;   
    enquete_name: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    status: EnqueteStatus;   
    category:string;
    isPublish: boolean;
}
export const EnqueteState = {
    enquetesData: [] as EnqueteData[]
};
export interface Admin {
    id_admin: string;
    name?: string;
    email: string;
    password:string;
}
export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

export interface OptionData {
    id_option: string;   
    text_option: string;
    id_question: string;
}
export interface QuestionData {
    id_question: string;   
    text_question: string;
    id_enquete: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    type: QyestionType;   
    required:boolean;
    options: OptionData[];
}

export interface SendEmailData{
    emails:string[]; 
    id_enquete : string
}

export interface EmailData {
    id_email:string;
    email:string;
    createdAt: Date | null;
}    
