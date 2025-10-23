export class Main {
    constructor() {
        const ctx = document.getElementById('myChart');
        const ctx2 = document.getElementById('myChart2');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [{
                    label: '# of Votes',
                    data: [25, 25, 10, 10, 5],
                    borderWidth: 1,
                    backgroundColor: [
                        'rgb(220, 53, 69)',
                        'rgb(253, 126, 20)',
                        'rgb(255, 193, 7 )',
                        'rgb(32, 201, 151 )',
                        'rgb(13, 110, 253 )',
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
        });
        new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [{
                    label: '# of Votes',
                    data: [25, 25, 10, 10, 5],
                    borderWidth: 1,
                    backgroundColor: [
                        'rgb(220, 53, 69)',
                        'rgb(253, 126, 20)',
                        'rgb(255, 193, 7 )',
                        'rgb(32, 201, 151 )',
                        'rgb(13, 110, 253 )',
                    ],
                    hoverOffset: 4,
                }],
            },
            options: {
                layout: {
                    padding: {
                        left: -10,
                    }
                },

            }
        });
        Chart.defaults.color = '#052C65';
        Chart.defaults.font.weight = '500';
    }

}