export type DataType = {
    type: string,
    data: {
        labels: string[],
        datasets: [{
            label: string,
            data: number[],
            borderWidth: 1,
            backgroundColor: [
                'rgb(220, 53, 69)',
                'rgb(253, 126, 20)',
                'rgb(255, 193, 7 )',
                'rgb(32, 201, 151 )',
                'rgb(13, 110, 253 )',
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
            ],
            hoverOffset: 4,
        }],
    },
    options: {
        layout: {
            padding: {
                left: -10,
                bottom: 0,
            }
        },
    }
}
