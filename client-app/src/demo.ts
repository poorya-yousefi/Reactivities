let num = 332;

const multiply = (x: number, y: number) => {
    return x * y;
};

export interface ICar {
    model: string;
    color: string;
    topSpeed?: number;
}

const car1: ICar = {
    model: "bmw",
    color: "red",
};

const car2: ICar = {
    model: "pride",
    color: "white",
    topSpeed: 180,
};

export const carsList = [car1, car2];
