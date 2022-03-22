import React, { useEffect, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function ChartBarModal(props) {

    const miners = props.data

    const [datas, setDatas] = useState([]);

    useEffect(() => {
        if (miners) {
            setDatas([]);
            var count = 0;
            miners.forEach(miner => {
                if (count < 5) {
                    setDatas(datas => [...datas, { name: miner.pbid, point: miner.points }]);
                    count++;
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [miners])

    return (
        <div>
            <ResponsiveContainer width="100%" aspect={2.5}>
                <BarChart
                    width={500}
                    height={300}
                    data={datas}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                    }}
                    options={{
                        YAxis: [{
                            ticks: {
                                max: 20
                            }
                        }]
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="point" fill="#58BED9" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

