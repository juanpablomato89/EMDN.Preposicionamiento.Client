import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RadialChartOptions } from '../../../../models/chart/radialchartoptions';
import { ChartOptions } from '../../../../models/chart/chartoptions';

@Component({
  selector: 'app-home-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './home-chart.html',
  styleUrl: './home-chart.scss',
})
export class HomeChart {
  public radialChartOptions: RadialChartOptions;
  constructor() { 
    this.radialChartOptions = {
      series: [67, 84, 97, 61],
      chart: {
        height: 280,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '14px',
              color: undefined
            },
            value: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: undefined
            },
            total: {
              show: true,
              label: 'TOTAL',
              formatter: function (w) {
                // Calcula el total de los valores
                const sum = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                // Calcula el promedio
                const avg = sum / w.globals.series.length;
                return Math.round(avg) + '%';
              }
            }
          },
          track: {
            background: '#f0f0f0',
            strokeWidth: '100%',
            margin: 5,
          },
          hollow: {
            size: '45%',
          }
        }
      },
      labels: ['TEAM A', 'TEAM B', 'TEAM C', 'TEAM D'],
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: 'Roboto, Helvetica Neue, sans-serif'
        }
      },
      responsive: [
        {
          breakpoint: 2560, // Pantallas grandes
          options: {
            chart: {
              height: 321
            },
            plotOptions: {
              radialBar: {
                dataLabels: {
                  name: {
                    fontSize: '16px'
                  },
                  value: {
                    fontSize: '24px'
                  }
                }
              }
            }
          }
        },
        {
          breakpoint: 768, // Tablets
          options: {
            chart: {
              height: 321
            },
            plotOptions: {
              radialBar: {
                dataLabels: {
                  name: {
                    fontSize: '14px'
                  },
                  value: {
                    fontSize: '20px'
                  },
                  total: {
                    fontSize: '14px'
                  }
                }
              }
            }
          }
        },
        {
          breakpoint: 480, // Móviles
          options: {
            chart: {
              height: 280
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '25%'
                },
                dataLabels: {
                  name: {
                    fontSize: '12px',
                    offsetY: 5
                  },
                  value: {
                    fontSize: '16px',
                    offsetY: -3
                  },
                  total: {
                    fontSize: '12px'
                  }
                }
              }
            }
          }
        }
      ]
    };
  }

  splineChartOptions: ChartOptions = {
    series: [
      {
        name: 'Income',
        data: [23, 42, 35, 27, 43, 22, 17, 31, 44],
      },
      {
        name: 'Losses',
        data: [12, 32, 44, 54, 42, 33, 45, 23, 34],
      },
    ],
    chart: {
      type: 'line',
      height: 344,
    },
    xaxis: {
      categories: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
      ],
    },
    stroke: {
      curve: 'smooth',
    },
    title: {
      text: 'Fulfillment Type',
    },
    dataLabels: {
      enabled: true,
    },
    markers: {
      size: 4,
    },
    tooltip: {
      enabled: true,
    },
    responsive: [
      {
        breakpoint: 2560, // Pantallas grandes
        options: {
          chart: {
            height: 309
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: {
                  fontSize: '16px'
                },
                value: {
                  fontSize: '24px'
                }
              }
            }
          }
        }
      },
      {
        breakpoint: 768, // Tablets
        options: {
          chart: {
            height: 300
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: {
                  fontSize: '14px'
                },
                value: {
                  fontSize: '20px'
                },
                total: {
                  fontSize: '14px'
                }
              }
            }
          }
        }
      },
      {
        breakpoint: 480, // Móviles
        options: {
          chart: {
            height: 300
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '25%'
              },
              dataLabels: {
                name: {
                  fontSize: '12px',
                  offsetY: 5
                },
                value: {
                  fontSize: '16px',
                  offsetY: -3
                },
                total: {
                  fontSize: '12px'
                }
              }
            }
          }
        }
      }
    ]
  };
}
