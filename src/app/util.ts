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
            return 1;
        } else if (valorA > valorB) {
            return -1;
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

export function runTests(){
    const prs = [
      { id: 1, author: "João", status: "open", amountComments: 10 },
      { id: 2, author: "Maria", status: "closed", amountComments: 5 },
      { id: 3, author: "João", status: "merged", amountComments: 12 },
      { id: 4, author: "Ana", status: "open", amountComments: 7 },
    ]

    console.log("Lista original dos pull requests para testes:")
    console.log(prs)

    const distinctPullRequests = distinct(prs, "author");
    console.log("Resultado da aplicação da função distinct por autor:")
    console.log(distinctPullRequests)

    const pullRequestsByStatus = groupBy(prs, (pr) => pr.status);
    console.log("Resultado da aplicação da função groupBy por status")
    console.log(pullRequestsByStatus)

    const sumComments = fold(
      (acc, pr) => acc + pr.amountComments,
      0,
      prs
    );

    console.log("Resultado da aplicação da função fold somando a quantidade total de comentários:")
    console.log(sumComments)

    const totalComments = (pulls: { amountComments: number }[]) =>
    fold((acc, pr) => acc + pr.amountComments, 0, pulls);

    const meanComments = (total: number, qtdPRs: number) => total / qtdPRs;

    const calculateMeanComments = compose(
      (total: number) => meanComments(total, prs.length),
      totalComments
    );

    const mediaComentariosPR = calculateMeanComments(prs);

    console.log("Resultado da aplicação da função compose para calcular a média de comentários por pull request")
    console.log(mediaComentariosPR);

}

