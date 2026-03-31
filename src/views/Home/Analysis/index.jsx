import { useState, useEffect, useMemo } from 'react'
import { Radio, Select } from 'antd'
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { random } from 'lodash'
import { useMoment } from '~/composables'
import { useBranchStore } from '~/stores/branch'
import Heading from '~/components/common/Heading'

Chart.register(...registerables, ChartDataLabels)

export default function Analysis() {
  const moment = useMoment()
  const branchStore = useBranchStore()

  const [branch, setBranch] = useState(-1)
  const [year, setYear] = useState(moment.moment().year())
  const [viewMode, setViewMode] = useState('month')
  const [chartLabels, setChartLabels] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  const [chartData, setChartData] = useState({
    debt: [30, 40, 60, 70, 5, 30, 40, 60, 70, 5, 36, 24],
    revenue: [30, 40, 60, 70, 5, 30, 40, 60, 70, 5, 36, 24],
    profit: [30, 40, 60, 70, 5, 30, 40, 60, 70, 5, 36, 24]
  })

  const yearOptions = useMemo(() => {
    const currentYear = moment.moment().year()
    return [...Array(10).keys()].map((i) => ({ label: currentYear - i, value: currentYear - i }))
  }, [])

  const testData = useMemo(
    () => ({
      labels: chartLabels,
      datasets: [
        { label: 'Công nợ', data: chartData.debt, backgroundColor: '#f7b37e' },
        { label: 'Doanh thu', data: chartData.revenue, backgroundColor: '#99c2f0' },
        { label: 'Lợi nhuận', data: chartData.profit, backgroundColor: '#4c9e42' }
      ]
    }),
    [chartLabels, chartData]
  )

  const changeViewMode = (mode) => {
    const m = mode || viewMode
    const totalItems = m === 'quarter' ? 4 : 12
    setChartLabels(
      [...Array(totalItems).keys()].map((i) => `${m === 'quarter' ? 'Quý' : 'Tháng'} ${i + 1}`)
    )
    setChartData({
      debt: [...Array(totalItems).keys()].map(() => random(0, 100)),
      revenue: [...Array(totalItems).keys()].map(() => random(0, 100)),
      profit: [...Array(totalItems).keys()].map(() => random(0, 100))
    })
  }

  useEffect(() => {
    branchStore.getAll()
    changeViewMode('month')
  }, [])

  return (
    <div>
      <Heading title="Thống kê">
        <div className="flex items-center">
          <Radio.Group
            value={viewMode}
            buttonStyle="solid"
            onChange={(e) => {
              setViewMode(e.target.value)
              changeViewMode(e.target.value)
            }}
          >
            <Radio.Button value="month">Theo tháng</Radio.Button>
            <Radio.Button value="quarter">Theo quý</Radio.Button>
          </Radio.Group>
          <Select options={yearOptions} value={year} onChange={setYear} className="ml-4" />
          <Select
            placeholder="Chọn chi nhánh"
            className="w-[240px] ml-4"
            options={branchStore.getAllBranchOptions()}
            value={branch}
            onChange={setBranch}
          />
        </div>
      </Heading>
      <Bar data={testData} />
    </div>
  )
}
