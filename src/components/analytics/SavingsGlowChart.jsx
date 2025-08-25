// src/components/analytics/SavingsGlowChart.jsx (Final Upgraded Aura Version)
import React from 'react';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { db, appId } from '../../firebase/firebase';
import { grades } from '../../constants/data';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import Icon from '../../icons/Icon';

const SavingsGlowChart = () => {
    const [chartData, setChartData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchSavingsData = async () => {
            if (!db) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);

            try {
                const gradeDataPromises = grades.map(async (grade) => {
                    const transactionsQuery = collectionGroup(db, 'transactions');
                    const querySnapshot = await getDocs(transactionsQuery);

                    let totalDeposits = 0;
                    let totalWithdrawals = 0;

                    querySnapshot.forEach(doc => {
                        if (doc.ref.path.startsWith(`artifacts/${appId}/public/data/savings/${grade}`)) {
                            const transaction = doc.data();
                            if (transaction.type === 'deposit') {
                                totalDeposits += transaction.amount;
                            } else if (transaction.type === 'withdraw') {
                                totalWithdrawals += transaction.amount;
                            }
                        }
                    });
                    
                    return {
                        name: `ป.${grade.replace('p', '')}`,
                        ฝาก: totalDeposits,
                        ถอน: totalWithdrawals,
                    };
                });

                const data = await Promise.all(gradeDataPromises);
                setChartData(data);
            } catch (error) {
                console.error("Error fetching savings data: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSavingsData();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900/80 backdrop-blur-sm border border-white/20 p-3 rounded-lg shadow-lg">
                    <p className="font-bold text-white">{label}</p>
                    <p className="text-emerald-300">{`ยอดฝาก: ${payload[0]?.value?.toLocaleString() || 0} บาท`}</p>
                    <p className="text-rose-400">{`ยอดถอน: ${payload[1]?.value?.toLocaleString() || 0} บาท`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6 rounded-2xl backdrop-blur-lg bg-gray-800/30 border border-gray-700/50 h-[400px]">
            <h3 className="text-lg font-bold text-white mb-4">ภาพรวมกิจกรรมการออม</h3>
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Icon name="Loader2" className="animate-spin text-emerald-400" size={40} />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorDeposit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorWithdraw" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                            </linearGradient>
                            
                            {/* --- UPGRADE: Increased stdDeviation for a stronger glow --- */}
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="5" result="coloredBlur" in="SourceGraphic" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '14px' }} />
                        <Area type="monotone" dataKey="ฝาก" stroke="#34d399" strokeWidth={3} fillOpacity={0.8} fill="url(#colorDeposit)" filter="url(#glow)" />
                        <Area type="monotone" dataKey="ถอน" stroke="#f43f5e" strokeWidth={3} fillOpacity={0.8} fill="url(#colorWithdraw)" filter="url(#glow)" />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default SavingsGlowChart;