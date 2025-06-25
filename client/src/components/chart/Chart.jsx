import "./chart.css"
import { BarChart, Bar,Rectangle, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function Chart() {


    const data = [
        {
            name: 'Jan',
            "Active User": 4000,
        },
        {
            name: 'Feb',
            "Active User": 3000
        },
        {
            name: 'March',
            "Active User": 2000
        },
        {
            name: 'April',
            "Active User": 2780
        },
        {
            name: 'May',
            "Active User": 1890
        },
        {
            name: 'June',
            "Active User": 2390
        },
        {
            name: 'July',
            "Active User": 3490
        },
    ];
    return (
        <div className="chart">
            <h3 className="chartTitle">User Analytics</h3>
            <ResponsiveContainer width="100%" aspect={4 / 1.2}>
                <BarChart data={data}>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Bar dataKey="Active User" fill="orange" activeBar={<Rectangle fill="orangered"/>}/>
                    <Tooltip/>
                    <Legend/>
                </BarChart>
            </ResponsiveContainer>
        </div>


    )
}

export default Chart