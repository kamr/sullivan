import mongoose, { Document } from 'mongoose';
export interface IDrawing extends Document {
    paths: Array<{
        brush: string;
        color: number;
        points: number[];
    }>;
    mode: string;
    votes: number;
}
declare const _default: mongoose.Model<IDrawing, {}>;
export default _default;
