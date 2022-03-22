import React from 'react';
import { PieChart, Pie, Tooltip } from 'recharts';



export default function PieChat(props) {
    var { data } = props

    return (
        <div>

            <PieChart width={90} height={90} >
                <Pie
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={true}
                    data={data}
                    cx="70%"
                    cy="50%"
                    outerRadius={30}
                    fill="#8884d8"
                />
                {/* <Pie dataKey="value" data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" /> */}
                <Tooltip />
            </PieChart>
            ({data[0].value + "/" + (data[1].value + data[0].value)})
        </div>
    );
}

