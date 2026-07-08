import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Download, ChevronDown, ChevronUp, Package, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SalesAdminTab() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSale, setExpandedSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (err) {
      console.error('Error fetching sales:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (saleId, newStatus) => {
    try {
      const { error } = await supabase
        .from('sales')
        .update({ status: newStatus })
        .eq('id', saleId);

      if (error) throw error;
      
      setSales(sales.map(s => s.id === saleId ? { ...s, status: newStatus } : s));
    } catch (err) {
      alert('Error actualizando el estado: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    // Basic CSV export
    const headers = ['ID Pedido', 'Fecha', 'Cliente', 'Teléfono', 'Envío', 'Total ($)', 'Costo ($)', 'Ganancia ($)', 'Estado'];
    const rows = sales.map(s => [
      s.order_number,
      new Date(s.created_at).toLocaleDateString(),
      s.client_name || 'Anónimo',
      s.client_phone || 'N/A',
      s.shipping_type || 'N/A',
      s.total_amount,
      s.total_cost,
      s.profit,
      s.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(c => `"${c}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ventas_aura_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearData = async () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar TODOS los datos de ventas y ganancias? Esta acción es irreversible.');
    if (!confirmed) return;
    
    setLoading(true);
    try {
      for (const s of sales) {
        await supabase.from('sale_items').delete().eq('sale_id', s.id);
        await supabase.from('sales').delete().eq('id', s.id);
      }
      setSales([]);
    } catch (err) {
      alert('Error al limpiar los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculations for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthSales = sales.filter(s => {
    const d = new Date(s.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && s.status !== 'Cancelada';
  });

  const totalRevenue = currentMonthSales.reduce((acc, s) => acc + Number(s.total_amount), 0);
  const totalProfit = currentMonthSales.reduce((acc, s) => acc + Number(s.profit), 0);

  const StatusIcon = ({ status }) => {
    if (status === 'Completada') return <CheckCircle size={16} className="text-emerald-500" />;
    if (status === 'Cancelada') return <XCircle size={16} className="text-rose-500" />;
    return <Clock size={16} className="text-amber-500" />;
  };

  if (loading) {
    return <div className="p-8 text-center text-sm font-medium uppercase tracking-widest text-zinc-400">Cargando ventas...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Registro de Ventas</h2>
          <p className="text-xs text-zinc-400 mt-1 font-light">Visualiza tus pedidos, ganancias y exporta los datos.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleClearData}
            className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer rounded-sm"
          >
            <Trash2 size={16} />
            Limpiar Datos
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer rounded-sm"
          >
            <Download size={16} />
            Exportar Excel (CSV)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex items-center gap-4">
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full">
            <Package size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pedidos del Mes</p>
            <p className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">{currentMonthSales.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex items-center gap-4">
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Ingresos del Mes</p>
            <p className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/50 p-6 flex items-center gap-4 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">Ganancia Neta (Mes)</p>
            <p className="text-2xl font-black mt-1 text-emerald-700 dark:text-emerald-400">${totalProfit.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-semibold">Pedido</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Ganancia</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-zinc-400 font-light">
                    No hay ventas registradas aún.
                  </td>
                </tr>
              ) : (
                sales.map(sale => (
                  <React.Fragment key={sale.id}>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">#{sale.order_number}</td>
                      <td className="px-6 py-4 text-zinc-500">{new Date(sale.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-zinc-900 dark:text-white">{sale.client_name || 'Anónimo'}</td>
                      <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">${Number(sale.total_amount).toFixed(2)}</td>
                      <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-medium">+${Number(sale.profit).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <select
                          value={sale.status}
                          onChange={(e) => handleStatusChange(sale.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 outline-none cursor-pointer border rounded-none ${
                            sale.status === 'Completada' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                            sale.status === 'Cancelada' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800' :
                            'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Completada">Completada</option>
                          <option value="Cancelada">Cancelada</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setExpandedSale(expandedSale === sale.id ? null : sale.id)}
                          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                        >
                          {expandedSale === sale.id ? 'Ocultar' : 'Ver Detalles'}
                          {expandedSale === sale.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded details */}
                    <AnimatePresence>
                      {expandedSale === sale.id && (
                        <tr>
                          <td colSpan="7" className="p-0 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/30">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-6 py-6 overflow-hidden"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-2">Información del Cliente</h4>
                                  <div className="space-y-2 text-xs">
                                    <p><span className="font-medium text-zinc-500 w-24 inline-block">Nombre:</span> {sale.client_name || 'No proporcionado'}</p>
                                    <p><span className="font-medium text-zinc-500 w-24 inline-block">Teléfono:</span> {sale.client_phone || 'No proporcionado'}</p>
                                    <p><span className="font-medium text-zinc-500 w-24 inline-block">Método Envío:</span> {sale.shipping_type || 'Estándar'} (+${sale.shipping_cost || 0})</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-2">Artículos del Pedido</h4>
                                  <ul className="space-y-3">
                                    {sale.sale_items?.map(item => (
                                      <li key={item.id} className="flex justify-between items-start text-xs border-b border-zinc-200 dark:border-zinc-800/50 pb-3 last:border-0">
                                        <div>
                                          <p className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{item.product_name}</p>
                                          <p className="text-zinc-500 mt-0.5">Color: <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.selected_color_name}</span> | Talla: <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.selected_size}</span></p>
                                          <p className="text-[10px] text-zinc-400 mt-1">Costo al proveedor: ${Number(item.cost_price).toFixed(2)} c/u</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-medium text-zinc-500">{item.quantity}x ${Number(item.sale_price).toFixed(2)}</p>
                                          <p className="font-bold text-zinc-900 dark:text-white mt-1">${(item.quantity * item.sale_price).toFixed(2)}</p>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
