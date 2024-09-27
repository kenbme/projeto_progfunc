export function distinct<T>(colecao: T[], atributo: keyof T): T[] {
    const seen = new Set<T[keyof T]>();
    return colecao.filter((item) => {
        const valor = item[atributo];
        if (seen.has(valor)) {
            return false;
        } else {
            seen.add(valor);
            return true;
        }
    });
}


export function groupBy<T>(pulls: T[], getAttribute: (obj: T) => string): Record<string, T[]> {
    return pulls.reduce((acc, obj) => {
        const key = getAttribute(obj)
        if (!acc[key]) {
            acc[key] = []
        }

        acc[key].push(obj)
        return acc

    }, {} as Record<string, T[]>)
}


export function orderBy<T>(colecao: T[], atributo: keyof T): T[] {
    return [...colecao].sort((a, b) => {
        const valorA = a[atributo];
        const valorB = b[atributo];

        if (valorA < valorB) {
            return -1;
        } else if (valorA > valorB) {
            return 1;
        } else {
            return 0;
        }
    });
}


export function fold<T, U>(reducer: (acc: U, value: T) => U, init: U, array: T[]): U {
    let accumulator = init;

    for (let i = 0; i < array.length; i++) {
        accumulator = reducer(accumulator, array[i]);
    }

    return accumulator;
}


export function compose<A, B, C>(f1: (arg: B) => C, f2: (arg: A) => B): (arg: A) => C {
    return (arg: A) => f1(f2(arg));
}

