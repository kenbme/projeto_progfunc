export function groupBy<T>(pulls: T[], getAttribute: (obj:T)=> string ): Record<string , T[]>{
    return pulls.reduce((acc,obj)=>{
        const key = getAttribute(obj)
        if(!acc[key]){
            acc[key]= []
        }

        acc[key].push(obj)
        return acc

    },  {} as Record<string, T[]> )
}

