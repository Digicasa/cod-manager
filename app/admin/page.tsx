'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [subs, setSubs] = useState<any[]>([])
  useEffect(()=>{
    supabase.from('subscriptions').select('*, profiles(business_name)').order('created_at',{ascending:false})
      .then(({data})=>setSubs(data||[]))
  },[])
  async function activate(id: string) {
    await supabase.from('subscriptions').update({ status:'active', activated_at: new Date().toISOString() }).eq('id', id)
    setSubs(subs.map(s=>s.id===id?{...s,status:'active'}:s))
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin — Subscriptions</h1>
      <table className="w-full bg-white rounded-xl overflow-hidden text-sm">
        <thead className="bg-gray-100"><tr>
          <th className="p-3 text-left">Vendor</th><th>Plan</th><th>Amount</th><th>Ref</th><th>Status</th><th></th>
        </tr></thead>
        <tbody>
          {subs.map(s=>(
            <tr key={s.id} className="border-t">
              <td className="p-3">{s.profiles?.business_name || s.vendor_id.slice(0,8)}</td>
              <td>{s.plan}</td><td>{s.amount}</td><td>{s.payment_reference}</td>
              <td><span className={s.status==='active'?'text-emerald-600':'text-amber-600'}>{s.status}</span></td>
              <td>{s.status!=='active' && <button onClick={()=>activate(s.id)} className="btn-brand text-xs">Activate</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
