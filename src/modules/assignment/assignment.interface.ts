
export type TAssignment = {
    title: string;
    description: string;
    marks: number;
    content: string;
    thumbnailUrl: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    dueDate: Date;
    createdBy: {
        email: string;
        name: string;
    };
};
