import { Resources } from "@/types";

export interface IPieceConstructorParams {
    value: string;
    row: number;
    col: number;
    resources: Resources;
}