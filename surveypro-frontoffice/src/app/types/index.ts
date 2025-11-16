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
    questions?: QuestionData[];

}
export const EnqueteState = {
    enquetesData: [] as EnqueteData[]
};

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

