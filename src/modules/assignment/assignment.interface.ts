
export type TAssignment = {
    title: string;
    description: string;
    marks: number;
    thumbnailUrl: string;
    difficulty: 'easy' | 'medium' | 'hard';
    dueDate: Date;
    createdBy: {
        email: string;
        name: string;
    };
    // Add other fields if necessary
};
